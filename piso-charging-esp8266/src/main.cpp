#include <Arduino.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <LittleFS.h>

static const char* BOARD_NAME = "ESP8266_NODEMCU";
static const char* DEFAULT_AP_SSID = "PISO_CHARGE_PRO";
static const char* DEFAULT_AP_PASS = "12345678";
static const char* DEFAULT_ADMIN_PASS = "admin";
static const char* CONFIG_PATH = "/config.json";
static const byte DNS_PORT = 53;
static const unsigned long COIN_DEBOUNCE_MS = 60;
static const unsigned long RELAY_TEST_MS = 900;

IPAddress AP_IP(10, 20, 30, 1);
IPAddress AP_GATEWAY(10, 20, 30, 1);
IPAddress AP_SUBNET(255, 255, 255, 0);

ESP8266WebServer server(80);
DNSServer dnsServer;

struct PinOption {
  const char* name;
  uint8_t gpio;
};

static const PinOption SAFE_PIN_OPTIONS[] = {
  {"D1", D1},
  {"D2", D2},
  {"D5", D5},
  {"D6", D6},
  {"D7", D7}
};

struct Settings {
  String apSsid;
  String apPassword;
  String adminPassword;
  String relayPins[3];
  String coinPin;
  bool relayActiveLow;
  uint32_t secondsPerCoin;
  bool portEnabled[3];
};

struct PortState {
  uint32_t remaining;
  bool relayOn;
};

Settings settings;
PortState ports[3];

uint32_t creditSeconds = 0;
uint32_t coinPulses = 0;
unsigned long lastTimerMs = 0;
bool coinRawActive = false;
bool coinStableActive = false;
unsigned long coinRawChangedMs = 0;
bool rebootPending = false;
unsigned long rebootAtMs = 0;
bool relayTestActive[3] = {false, false, false};
unsigned long relayTestUntilMs[3] = {0, 0, 0};
String sessionToken = "";

String jsonEscape(const String& value) {
  String out;
  out.reserve(value.length() + 8);
  for (size_t i = 0; i < value.length(); i++) {
    char c = value.charAt(i);
    if (c == '"' || c == '\\') {
      out += '\\';
      out += c;
    } else if (c == '\n') {
      out += "\\n";
    } else if (c == '\r') {
      out += "\\r";
    } else {
      out += c;
    }
  }
  return out;
}

String readJsonString(const String& json, const String& key) {
  String needle = "\"" + key + "\"";
  int keyPos = json.indexOf(needle);
  if (keyPos < 0) return "";
  int colon = json.indexOf(':', keyPos + needle.length());
  if (colon < 0) return "";
  int start = colon + 1;
  while (start < (int)json.length() && isspace(json.charAt(start))) start++;
  if (start >= (int)json.length() || json.charAt(start) != '"') return "";
  start++;

  String out;
  bool escaped = false;
  for (int i = start; i < (int)json.length(); i++) {
    char c = json.charAt(i);
    if (escaped) {
      if (c == 'n') out += '\n';
      else if (c == 'r') out += '\r';
      else out += c;
      escaped = false;
    } else if (c == '\\') {
      escaped = true;
    } else if (c == '"') {
      break;
    } else {
      out += c;
    }
  }
  return out;
}

int readJsonInt(const String& json, const String& key, int fallback) {
  String needle = "\"" + key + "\"";
  int keyPos = json.indexOf(needle);
  if (keyPos < 0) return fallback;
  int colon = json.indexOf(':', keyPos + needle.length());
  if (colon < 0) return fallback;
  int start = colon + 1;
  while (start < (int)json.length() && isspace(json.charAt(start))) start++;
  int end = start;
  while (end < (int)json.length()) {
    char c = json.charAt(end);
    if (!isdigit(c) && c != '-') break;
    end++;
  }
  if (end <= start) {
    String asString = readJsonString(json, key);
    if (asString.length() == 0) return fallback;
    return asString.toInt();
  }
  return json.substring(start, end).toInt();
}

bool readJsonBool(const String& json, const String& key, bool fallback) {
  String needle = "\"" + key + "\"";
  int keyPos = json.indexOf(needle);
  if (keyPos < 0) return fallback;
  int colon = json.indexOf(':', keyPos + needle.length());
  if (colon < 0) return fallback;
  int start = colon + 1;
  while (start < (int)json.length() && isspace(json.charAt(start))) start++;
  if (json.startsWith("true", start)) return true;
  if (json.startsWith("false", start)) return false;
  if (json.charAt(start) == '1') return true;
  if (json.charAt(start) == '0') return false;

  String asString = readJsonString(json, key);
  asString.toLowerCase();
  return asString == "true" || asString == "1" || asString == "on" || asString == "yes";
}

void setDefaultSettings() {
  settings.apSsid = DEFAULT_AP_SSID;
  settings.apPassword = DEFAULT_AP_PASS;
  settings.adminPassword = DEFAULT_ADMIN_PASS;
  settings.relayPins[0] = "D1";
  settings.relayPins[1] = "D2";
  settings.relayPins[2] = "D5";
  settings.coinPin = "D6";
  settings.relayActiveLow = true;
  settings.secondsPerCoin = 300;
  settings.portEnabled[0] = true;
  settings.portEnabled[1] = true;
  settings.portEnabled[2] = true;
}

String normalizePinName(String value, const String& fallback) {
  value.trim();
  value.toUpperCase();
  for (size_t i = 0; i < sizeof(SAFE_PIN_OPTIONS) / sizeof(SAFE_PIN_OPTIONS[0]); i++) {
    if (value == SAFE_PIN_OPTIONS[i].name) return value;
  }
  return fallback;
}

uint8_t gpioForPinName(const String& pinName, uint8_t fallback) {
  for (size_t i = 0; i < sizeof(SAFE_PIN_OPTIONS) / sizeof(SAFE_PIN_OPTIONS[0]); i++) {
    if (pinName == SAFE_PIN_OPTIONS[i].name) return SAFE_PIN_OPTIONS[i].gpio;
  }
  return fallback;
}

bool pinsAreUnique() {
  String names[4] = {
    settings.relayPins[0],
    settings.relayPins[1],
    settings.relayPins[2],
    settings.coinPin
  };
  for (int i = 0; i < 4; i++) {
    for (int j = i + 1; j < 4; j++) {
      if (names[i] == names[j]) return false;
    }
  }
  return true;
}

bool pinNamesAreUnique(const String& first, const String& second, const String& third, const String& fourth) {
  String names[4] = {first, second, third, fourth};
  for (int i = 0; i < 4; i++) {
    for (int j = i + 1; j < 4; j++) {
      if (names[i] == names[j]) return false;
    }
  }
  return true;
}

void sanitizeSettings() {
  settings.apSsid.trim();
  settings.apPassword.trim();
  settings.adminPassword.trim();
  if (settings.apSsid.length() == 0) settings.apSsid = DEFAULT_AP_SSID;
  if (settings.apPassword.length() < 8) settings.apPassword = DEFAULT_AP_PASS;
  if (settings.adminPassword.length() == 0) settings.adminPassword = DEFAULT_ADMIN_PASS;
  settings.relayPins[0] = normalizePinName(settings.relayPins[0], "D1");
  settings.relayPins[1] = normalizePinName(settings.relayPins[1], "D2");
  settings.relayPins[2] = normalizePinName(settings.relayPins[2], "D5");
  settings.coinPin = normalizePinName(settings.coinPin, "D6");
  if (!pinsAreUnique()) {
    settings.relayPins[0] = "D1";
    settings.relayPins[1] = "D2";
    settings.relayPins[2] = "D5";
    settings.coinPin = "D6";
  }
  if (settings.secondsPerCoin < 10 || settings.secondsPerCoin > 86400UL) {
    settings.secondsPerCoin = 300;
  }
}

uint8_t relayGpio(int index) {
  static const uint8_t fallbackPins[] = {D1, D2, D5};
  return gpioForPinName(settings.relayPins[index], fallbackPins[index]);
}

uint8_t coinGpio() {
  return gpioForPinName(settings.coinPin, D6);
}

int relayOnLevel() {
  return settings.relayActiveLow ? LOW : HIGH;
}

int relayOffLevel() {
  return settings.relayActiveLow ? HIGH : LOW;
}

String contentTypeFor(const String& path) {
  if (path.endsWith(".html")) return "text/html";
  if (path.endsWith(".css")) return "text/css";
  if (path.endsWith(".js")) return "application/javascript";
  if (path.endsWith(".json")) return "application/json";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".ico")) return "image/x-icon";
  return "text/plain";
}

bool serveFile(String path) {
  if (path.endsWith("/")) path += "index.html";
  if (!LittleFS.exists(path)) return false;
  File file = LittleFS.open(path, "r");
  if (!file) return false;
  server.sendHeader("Cache-Control", "no-store");
  server.streamFile(file, contentTypeFor(path));
  file.close();
  return true;
}

void sendJson(int status, const String& body) {
  server.sendHeader("Cache-Control", "no-store");
  server.send(status, "application/json", body);
}

String requestValue(const String& key) {
  if (server.hasArg(key)) return server.arg(key);
  if (!server.hasArg("plain")) return "";
  return readJsonString(server.arg("plain"), key);
}

int requestInt(const String& key, int fallback) {
  if (server.hasArg(key)) return server.arg(key).toInt();
  if (server.hasArg("plain")) return readJsonInt(server.arg("plain"), key, fallback);
  return fallback;
}

bool requestBool(const String& key, bool fallback) {
  if (server.hasArg(key)) {
    String value = server.arg(key);
    value.toLowerCase();
    return value == "1" || value == "true" || value == "on" || value == "yes";
  }
  if (server.hasArg("plain")) return readJsonBool(server.arg("plain"), key, fallback);
  return fallback;
}

bool loadSettings() {
  setDefaultSettings();
  if (!LittleFS.exists(CONFIG_PATH)) {
    sanitizeSettings();
    return false;
  }
  File file = LittleFS.open(CONFIG_PATH, "r");
  if (!file) {
    sanitizeSettings();
    return false;
  }
  String json = file.readString();
  file.close();

  settings.apSsid = readJsonString(json, "apSsid");
  settings.apPassword = readJsonString(json, "apPassword");
  settings.adminPassword = readJsonString(json, "adminPassword");
  settings.relayPins[0] = readJsonString(json, "relay1Pin");
  settings.relayPins[1] = readJsonString(json, "relay2Pin");
  settings.relayPins[2] = readJsonString(json, "relay3Pin");
  settings.coinPin = readJsonString(json, "coinPin");
  settings.relayActiveLow = readJsonBool(json, "relayActiveLow", true);
  settings.secondsPerCoin = (uint32_t)readJsonInt(json, "secondsPerCoin", 300);
  settings.portEnabled[0] = readJsonBool(json, "port1Enabled", true);
  settings.portEnabled[1] = readJsonBool(json, "port2Enabled", true);
  settings.portEnabled[2] = readJsonBool(json, "port3Enabled", true);
  sanitizeSettings();
  return true;
}

bool saveSettings() {
  sanitizeSettings();
  File file = LittleFS.open(CONFIG_PATH, "w");
  if (!file) return false;
  file.print("{\n");
  file.print("  \"apSsid\":\""); file.print(jsonEscape(settings.apSsid)); file.print("\",\n");
  file.print("  \"apPassword\":\""); file.print(jsonEscape(settings.apPassword)); file.print("\",\n");
  file.print("  \"adminPassword\":\""); file.print(jsonEscape(settings.adminPassword)); file.print("\",\n");
  file.print("  \"relay1Pin\":\""); file.print(jsonEscape(settings.relayPins[0])); file.print("\",\n");
  file.print("  \"relay2Pin\":\""); file.print(jsonEscape(settings.relayPins[1])); file.print("\",\n");
  file.print("  \"relay3Pin\":\""); file.print(jsonEscape(settings.relayPins[2])); file.print("\",\n");
  file.print("  \"coinPin\":\""); file.print(jsonEscape(settings.coinPin)); file.print("\",\n");
  file.print("  \"relayActiveLow\":"); file.print(settings.relayActiveLow ? "true" : "false"); file.print(",\n");
  file.print("  \"secondsPerCoin\":"); file.print(settings.secondsPerCoin); file.print(",\n");
  file.print("  \"port1Enabled\":"); file.print(settings.portEnabled[0] ? "true" : "false"); file.print(",\n");
  file.print("  \"port2Enabled\":"); file.print(settings.portEnabled[1] ? "true" : "false"); file.print(",\n");
  file.print("  \"port3Enabled\":"); file.print(settings.portEnabled[2] ? "true" : "false"); file.print("\n");
  file.print("}\n");
  file.close();
  return true;
}

void scheduleReboot(unsigned long delayMs) {
  rebootPending = true;
  rebootAtMs = millis() + delayMs;
}

void setRelay(int index, bool on) {
  if (index < 0 || index > 2) return;
  if (ports[index].relayOn == on) return;
  ports[index].relayOn = on;
  digitalWrite(relayGpio(index), on ? relayOnLevel() : relayOffLevel());
  Serial.print("RELAY_");
  Serial.print(index + 1);
  Serial.println(on ? "_ON" : "_OFF");
}

void syncRelayState(int index) {
  bool shouldBeOn = settings.portEnabled[index] && ports[index].remaining > 0;
  if (relayTestActive[index]) shouldBeOn = true;
  setRelay(index, shouldBeOn);
}

void syncAllRelays() {
  for (int i = 0; i < 3; i++) syncRelayState(i);
}

void configureIoPins() {
  sanitizeSettings();
  for (int i = 0; i < 3; i++) {
    ports[i].remaining = 0;
    ports[i].relayOn = false;
    pinMode(relayGpio(i), OUTPUT);
    digitalWrite(relayGpio(i), relayOffLevel());
  }
  pinMode(coinGpio(), INPUT_PULLUP);
  coinRawActive = digitalRead(coinGpio()) == LOW;
  coinStableActive = coinRawActive;
  coinRawChangedMs = millis();

  Serial.print("RELAY_1_PIN:");
  Serial.println(settings.relayPins[0]);
  Serial.print("RELAY_2_PIN:");
  Serial.println(settings.relayPins[1]);
  Serial.print("RELAY_3_PIN:");
  Serial.println(settings.relayPins[2]);
  Serial.print("COIN_PIN:");
  Serial.println(settings.coinPin);
}

void addCoinCredit() {
  coinPulses++;
  creditSeconds += settings.secondsPerCoin;
  Serial.print("COIN_PULSE_DETECTED:");
  Serial.println(coinPulses);
  Serial.print("CREDIT_SECONDS:");
  Serial.println(creditSeconds);
}

void updateCoinInput() {
  bool rawActive = digitalRead(coinGpio()) == LOW;
  unsigned long now = millis();
  if (rawActive != coinRawActive) {
    coinRawActive = rawActive;
    coinRawChangedMs = now;
  }
  if (rawActive != coinStableActive && now - coinRawChangedMs >= COIN_DEBOUNCE_MS) {
    coinStableActive = rawActive;
    if (coinStableActive) addCoinCredit();
  }
}

void updateTimers() {
  unsigned long now = millis();
  while (now - lastTimerMs >= 1000UL) {
    lastTimerMs += 1000UL;
    for (int i = 0; i < 3; i++) {
      if (ports[i].remaining > 0) {
        ports[i].remaining--;
        if (ports[i].remaining == 0) {
          Serial.print("PORT_");
          Serial.print(i + 1);
          Serial.println("_TIME_EXPIRED");
        }
      }
      syncRelayState(i);
    }
  }
}

void updateRelayTests() {
  unsigned long now = millis();
  for (int i = 0; i < 3; i++) {
    if (relayTestActive[i] && (long)(now - relayTestUntilMs[i]) >= 0) {
      relayTestActive[i] = false;
      syncRelayState(i);
    }
  }
}

String uptimeText() {
  unsigned long seconds = millis() / 1000UL;
  unsigned long days = seconds / 86400UL;
  seconds %= 86400UL;
  unsigned int hours = seconds / 3600UL;
  seconds %= 3600UL;
  unsigned int minutes = seconds / 60UL;
  unsigned int secs = seconds % 60UL;

  char buffer[28];
  if (days > 0) {
    snprintf(buffer, sizeof(buffer), "%lud %02u:%02u:%02u", days, hours, minutes, secs);
  } else {
    snprintf(buffer, sizeof(buffer), "%02u:%02u:%02u", hours, minutes, secs);
  }
  return String(buffer);
}

String statusJson() {
  String body = "{";
  body += "\"creditSeconds\":"; body += String(creditSeconds); body += ",";
  body += "\"coinPulses\":"; body += String(coinPulses); body += ",";
  body += "\"ports\":[";
  for (int i = 0; i < 3; i++) {
    if (i > 0) body += ",";
    body += "{";
    body += "\"id\":"; body += String(i + 1); body += ",";
    body += "\"enabled\":"; body += (settings.portEnabled[i] ? "true" : "false"); body += ",";
    body += "\"active\":"; body += (ports[i].relayOn ? "true" : "false"); body += ",";
    body += "\"remaining\":"; body += String(ports[i].remaining);
    body += "}";
  }
  body += "],";
  body += "\"uptime\":"; body += String(millis() / 1000UL); body += ",";
  body += "\"uptimeText\":\""; body += uptimeText(); body += "\",";
  body += "\"freeHeap\":"; body += String(ESP.getFreeHeap()); body += ",";
  body += "\"ip\":\""; body += WiFi.softAPIP().toString(); body += "\",";
  body += "\"apSsid\":\""; body += jsonEscape(settings.apSsid); body += "\",";
  body += "\"relayActiveMode\":\""; body += (settings.relayActiveLow ? "LOW" : "HIGH"); body += "\",";
  body += "\"secondsPerCoin\":"; body += String(settings.secondsPerCoin); body += ",";
  body += "\"coinPin\":\""; body += jsonEscape(settings.coinPin); body += "\"";
  body += "}";
  return body;
}

String settingsJson() {
  String body = "{";
  body += "\"apSsid\":\""; body += jsonEscape(settings.apSsid); body += "\",";
  body += "\"apPasswordSet\":"; body += (settings.apPassword.length() >= 8 ? "true" : "false"); body += ",";
  body += "\"relay1Pin\":\""; body += jsonEscape(settings.relayPins[0]); body += "\",";
  body += "\"relay2Pin\":\""; body += jsonEscape(settings.relayPins[1]); body += "\",";
  body += "\"relay3Pin\":\""; body += jsonEscape(settings.relayPins[2]); body += "\",";
  body += "\"coinPin\":\""; body += jsonEscape(settings.coinPin); body += "\",";
  body += "\"relayActiveMode\":\""; body += (settings.relayActiveLow ? "LOW" : "HIGH"); body += "\",";
  body += "\"secondsPerCoin\":"; body += String(settings.secondsPerCoin); body += ",";
  body += "\"port1Enabled\":"; body += (settings.portEnabled[0] ? "true" : "false"); body += ",";
  body += "\"port2Enabled\":"; body += (settings.portEnabled[1] ? "true" : "false"); body += ",";
  body += "\"port3Enabled\":"; body += (settings.portEnabled[2] ? "true" : "false");
  body += "}";
  return body;
}

bool transferCreditToPort(int index) {
  if (index < 0 || index > 2) return false;
  if (!settings.portEnabled[index]) return false;
  if (creditSeconds == 0) return false;
  ports[index].remaining += creditSeconds;
  creditSeconds = 0;
  syncRelayState(index);
  Serial.print("PORT_");
  Serial.print(index + 1);
  Serial.print("_STARTED_REMAINING:");
  Serial.println(ports[index].remaining);
  return true;
}

String generateSessionToken() {
  String token = String(ESP.getChipId(), HEX);
  token += "-";
  token += String(millis(), HEX);
  token += "-";
  token += String(random(0x7fffffff), HEX);
  return token;
}

bool hasValidSession() {
  if (sessionToken.length() == 0) return false;
  if (!server.hasHeader("Cookie")) return false;
  String cookie = server.header("Cookie");
  return cookie.indexOf("PISOSESSION=" + sessionToken) >= 0;
}

bool requireAdmin() {
  if (hasValidSession()) return true;
  sendJson(401, "{\"ok\":false,\"message\":\"Admin login required\"}");
  return false;
}

void redirectTo(const String& target) {
  server.sendHeader("Location", target, true);
  server.send(302, "text/plain", "");
}

void redirectToPortalRoot() {
  redirectTo("http://10.20.30.1/");
}

void handleRoot() {
  serveFile("/index.html");
}

void handleAdminPage() {
  if (!hasValidSession()) {
    redirectTo("/admin/login");
    return;
  }
  serveFile("/index.html");
}

void handleAdminLoginPage() {
  serveFile("/index.html");
}

void handleApiStatus() {
  sendJson(200, statusJson());
}

void handleApiStart() {
  int port = requestInt("port", 0);
  int index = port - 1;
  if (index < 0 || index > 2) {
    sendJson(400, "{\"ok\":false,\"message\":\"Choose Port 1, 2, or 3\"}");
    return;
  }
  if (!settings.portEnabled[index]) {
    sendJson(403, "{\"ok\":false,\"message\":\"Selected port is disabled\"}");
    return;
  }
  if (creditSeconds == 0) {
    sendJson(409, "{\"ok\":false,\"message\":\"Insert coin first\"}");
    return;
  }
  transferCreditToPort(index);
  sendJson(200, statusJson());
}

void handleApiAddCreditToPort() {
  handleApiStart();
}

void handleAdminLogin() {
  String username = requestValue("username");
  String password = requestValue("password");
  if (username == "admin" && password == settings.adminPassword) {
    sessionToken = generateSessionToken();
    server.sendHeader("Set-Cookie", "PISOSESSION=" + sessionToken + "; Path=/; Max-Age=86400; SameSite=Lax");
    Serial.println("ADMIN_LOGIN_SUCCESS");
    sendJson(200, "{\"ok\":true}");
  } else {
    Serial.println("ADMIN_LOGIN_FAILED");
    sendJson(401, "{\"ok\":false,\"message\":\"Invalid username or password\"}");
  }
}

void handleAdminLogout() {
  sessionToken = "";
  server.sendHeader("Set-Cookie", "PISOSESSION=; Path=/; Max-Age=0; SameSite=Lax");
  sendJson(200, "{\"ok\":true}");
}

void handleAdminGetSettings() {
  if (!requireAdmin()) return;
  sendJson(200, settingsJson());
}

void handleAdminSaveSettings() {
  if (!requireAdmin()) return;

  Settings next = settings;
  String apSsid = requestValue("apSsid");
  String apPassword = requestValue("apPassword");
  String relayActiveMode = requestValue("relayActiveMode");
  relayActiveMode.trim();
  relayActiveMode.toUpperCase();

  apSsid.trim();
  if (apSsid.length() == 0) {
    sendJson(400, "{\"ok\":false,\"message\":\"AP SSID is required\"}");
    return;
  }
  if (apPassword.length() > 0 && apPassword.length() < 8) {
    sendJson(400, "{\"ok\":false,\"message\":\"AP password must be at least 8 characters\"}");
    return;
  }

  next.apSsid = apSsid;
  if (apPassword.length() > 0) next.apPassword = apPassword;
  next.relayPins[0] = normalizePinName(requestValue("relay1Pin"), "");
  next.relayPins[1] = normalizePinName(requestValue("relay2Pin"), "");
  next.relayPins[2] = normalizePinName(requestValue("relay3Pin"), "");
  next.coinPin = normalizePinName(requestValue("coinPin"), "");
  next.relayActiveLow = relayActiveMode != "HIGH";
  next.secondsPerCoin = (uint32_t)requestInt("secondsPerCoin", settings.secondsPerCoin);
  next.portEnabled[0] = requestBool("port1Enabled", true);
  next.portEnabled[1] = requestBool("port2Enabled", true);
  next.portEnabled[2] = requestBool("port3Enabled", true);

  if (next.relayPins[0].length() == 0 || next.relayPins[1].length() == 0 ||
      next.relayPins[2].length() == 0 || next.coinPin.length() == 0) {
    sendJson(400, "{\"ok\":false,\"message\":\"Choose safe pins only: D1, D2, D5, D6, D7\"}");
    return;
  }
  if (!pinNamesAreUnique(next.relayPins[0], next.relayPins[1], next.relayPins[2], next.coinPin)) {
    sendJson(400, "{\"ok\":false,\"message\":\"Relay and coin pins must be unique\"}");
    return;
  }
  if (next.secondsPerCoin < 10 || next.secondsPerCoin > 86400UL) {
    sendJson(400, "{\"ok\":false,\"message\":\"Seconds per coin must be 10 to 86400\"}");
    return;
  }

  Settings previous = settings;
  settings = next;
  sanitizeSettings();
  if (!saveSettings()) {
    settings = previous;
    sendJson(500, "{\"ok\":false,\"message\":\"Failed to save settings\"}");
    return;
  }
  Serial.println("SETTINGS_SAVED");
  sendJson(200, "{\"ok\":true,\"message\":\"Settings saved. Rebooting\"}");
  scheduleReboot(1200);
}

void handleAdminResetSettings() {
  if (!requireAdmin()) return;
  LittleFS.remove(CONFIG_PATH);
  setDefaultSettings();
  Serial.println("SETTINGS_RESET_TO_DEFAULTS");
  sendJson(200, "{\"ok\":true,\"message\":\"Defaults restored. Rebooting\"}");
  scheduleReboot(1000);
}

void handleAdminTestRelay() {
  if (!requireAdmin()) return;
  int relay = requestInt("relay", 0);
  int index = relay - 1;
  if (index < 0 || index > 2) {
    sendJson(400, "{\"ok\":false,\"message\":\"Choose relay 1, 2, or 3\"}");
    return;
  }
  relayTestActive[index] = true;
  relayTestUntilMs[index] = millis() + RELAY_TEST_MS;
  syncRelayState(index);
  Serial.print("RELAY_");
  Serial.print(index + 1);
  Serial.println("_TEST");
  sendJson(200, statusJson());
}

void handleNotFound() {
  if (server.method() == HTTP_GET && serveFile(server.uri())) return;
  if (server.method() == HTTP_GET) {
    redirectToPortalRoot();
    return;
  }
  sendJson(404, "{\"ok\":false,\"message\":\"Not found\"}");
}

void setupRoutes() {
  server.collectHeaders("Cookie");

  server.on("/", HTTP_GET, handleRoot);
  server.on("/admin", HTTP_GET, handleAdminPage);
  server.on("/admin/login", HTTP_GET, handleAdminLoginPage);
  server.on("/api/status", HTTP_GET, handleApiStatus);
  server.on("/api/start", HTTP_POST, handleApiStart);
  server.on("/api/add-credit-to-port", HTTP_POST, handleApiAddCreditToPort);
  server.on("/admin/api/login", HTTP_POST, handleAdminLogin);
  server.on("/admin/api/logout", HTTP_POST, handleAdminLogout);
  server.on("/admin/api/settings", HTTP_GET, handleAdminGetSettings);
  server.on("/admin/api/save-settings", HTTP_POST, handleAdminSaveSettings);
  server.on("/admin/api/reset-settings", HTTP_POST, handleAdminResetSettings);
  server.on("/admin/api/test-relay", HTTP_POST, handleAdminTestRelay);
  server.onNotFound(handleNotFound);
}

void startAccessPoint() {
  WiFi.persistent(false);
  WiFi.mode(WIFI_OFF);
  delay(100);
  WiFi.mode(WIFI_AP_STA);
  WiFi.setSleepMode(WIFI_NONE_SLEEP);
  WiFi.setOutputPower(17.0f);
  WiFi.softAPConfig(AP_IP, AP_GATEWAY, AP_SUBNET);
  bool ok = WiFi.softAP(settings.apSsid.c_str(), settings.apPassword.c_str(), 6, false, 4);
  dnsServer.start(DNS_PORT, "*", AP_IP);

  Serial.println(ok ? "AP_STARTED" : "AP_START_FAILED");
  Serial.print("AP_SSID:");
  Serial.println(settings.apSsid);
  Serial.print("AP_IP:");
  Serial.println(WiFi.softAPIP());
}

void setup() {
  Serial.begin(115200);
  delay(200);
  randomSeed(ESP.getCycleCount());
  Serial.print("RESET_REASON:");
  Serial.println(ESP.getResetReason());

  if (!LittleFS.begin()) {
    Serial.println("LITTLEFS_MOUNT_FAILED_FORMATTING");
    LittleFS.format();
    LittleFS.begin();
  }

  loadSettings();
  configureIoPins();
  lastTimerMs = millis();
  startAccessPoint();
  setupRoutes();
  server.begin();
  Serial.println("PISO_CHARGE_PRO_PORTAL_STARTED");
}

void loop() {
  dnsServer.processNextRequest();
  server.handleClient();
  updateCoinInput();
  updateTimers();
  updateRelayTests();

  if (rebootPending && (long)(millis() - rebootAtMs) >= 0) {
    for (int i = 0; i < 3; i++) {
      digitalWrite(relayGpio(i), relayOffLevel());
    }
    delay(100);
    ESP.restart();
  }
  delay(1);
}
