#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <LittleFS.h>

static const char* BOARD_NAME = "ESP8266_NODEMCU_ESP12E";
static const char* AP_SSID = "BYG-PISOTAB-SETUP";
static const char* AP_PASS = "12345678";
static const char* CONFIG_PATH = "/config.json";
static const unsigned long STA_TIMEOUT_MS = 20000;
static const unsigned long ALLAN_TRIGGER_DEBOUNCE_MS = 80;
static const char* DEFAULT_RELAY_PIN_NAME = "D1";
static const char* DEFAULT_TRIGGER_PIN_NAME = "D2";

IPAddress AP_IP(10, 20, 30, 1);
IPAddress AP_GATEWAY(10, 20, 30, 1);
IPAddress AP_SUBNET(255, 255, 255, 0);

ESP8266WebServer server(80);

struct PinOption {
  const char* name;
  uint8_t gpio;
};

PinOption SAFE_PIN_OPTIONS[] = {
  {"D1", D1},
  {"D2", D2},
  {"D5", D5},
  {"D6", D6},
  {"D7", D7}
};

struct WifiConfig {
  String ssid;
  String password;
  bool useDhcp = false;
  String staticIp;
  String gateway;
  String subnet;
  String dns1;
  String dns2;
  String adminPassword = "admin";
  String relayPinName = DEFAULT_RELAY_PIN_NAME;
  String triggerPinName = DEFAULT_TRIGGER_PIN_NAME;
  bool relayActiveLow = true;
  bool triggerActiveLow = true;
};

WifiConfig config;
String currentMode = "AP";
String currentIp = "10.20.30.1";
String currentSsid = "";
unsigned long bootMs = 0;
bool rebootPending = false;
unsigned long rebootAtMs = 0;
int batteryPercent = -1;
int chargeOnPercent = 40;
int chargeOffPercent = 90;
bool charging = false;
bool allanTriggerActive = false;
bool allanRawActive = false;
unsigned long allanRawChangedMs = 0;

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
  if (end <= start) return fallback;
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
  return asString == "true" || asString == "1" || asString == "on";
}

String requestValue(const String& key) {
  if (server.hasArg(key)) return server.arg(key);
  if (!server.hasArg("plain")) return "";
  return readJsonString(server.arg("plain"), key);
}

bool requestBool(const String& key, bool fallback) {
  String value = requestValue(key);
  if (value.length() == 0) return fallback;
  value.toLowerCase();
  return value == "1" || value == "true" || value == "on" || value == "yes";
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

int relayOnLevel() {
  return config.relayActiveLow ? LOW : HIGH;
}

int relayOffLevel() {
  return config.relayActiveLow ? HIGH : LOW;
}

int triggerActiveLevel() {
  return config.triggerActiveLow ? LOW : HIGH;
}

uint8_t relayGpio() {
  return gpioForPinName(config.relayPinName, D1);
}

uint8_t triggerGpio() {
  return gpioForPinName(config.triggerPinName, D2);
}

void sanitizePinConfig() {
  config.relayPinName = normalizePinName(config.relayPinName, DEFAULT_RELAY_PIN_NAME);
  config.triggerPinName = normalizePinName(config.triggerPinName, DEFAULT_TRIGGER_PIN_NAME);
  if (config.relayPinName == config.triggerPinName) {
    config.relayPinName = DEFAULT_RELAY_PIN_NAME;
    config.triggerPinName = DEFAULT_TRIGGER_PIN_NAME;
  }
}

bool loadConfig() {
  if (!LittleFS.exists(CONFIG_PATH)) return false;
  File file = LittleFS.open(CONFIG_PATH, "r");
  if (!file) return false;
  String json = file.readString();
  file.close();

  config.ssid = readJsonString(json, "ssid");
  config.password = readJsonString(json, "password");
  config.useDhcp = false;
  config.staticIp = readJsonString(json, "staticIp");
  config.gateway = readJsonString(json, "gateway");
  config.subnet = readJsonString(json, "subnet");
  config.dns1 = readJsonString(json, "dns1");
  config.dns2 = readJsonString(json, "dns2");
  config.adminPassword = readJsonString(json, "adminPassword");
  if (config.adminPassword.length() == 0) {
    config.adminPassword = "admin";
  }
  config.relayPinName = readJsonString(json, "relayPin");
  config.triggerPinName = readJsonString(json, "triggerPin");
  config.relayActiveLow = readJsonBool(json, "relayActiveLow", true);
  config.triggerActiveLow = readJsonBool(json, "triggerActiveLow", true);
  sanitizePinConfig();
  chargeOnPercent = constrain(readJsonInt(json, "chargeOnPercent", chargeOnPercent), 0, 99);
  chargeOffPercent = constrain(readJsonInt(json, "chargeOffPercent", chargeOffPercent), chargeOnPercent + 1, 100);
  config.ssid.trim();
  return config.ssid.length() > 0;
}

bool saveConfig() {
  File file = LittleFS.open(CONFIG_PATH, "w");
  if (!file) return false;
  file.print("{\n");
  file.print("  \"ssid\":\""); file.print(jsonEscape(config.ssid)); file.print("\",\n");
  file.print("  \"password\":\""); file.print(jsonEscape(config.password)); file.print("\",\n");
  file.print("  \"adminPassword\":\""); file.print(jsonEscape(config.adminPassword)); file.print("\",\n");
  file.print("  \"relayPin\":\""); file.print(jsonEscape(config.relayPinName)); file.print("\",\n");
  file.print("  \"triggerPin\":\""); file.print(jsonEscape(config.triggerPinName)); file.print("\",\n");
  file.print("  \"relayActiveLow\":"); file.print(config.relayActiveLow ? "true" : "false"); file.print(",\n");
  file.print("  \"triggerActiveLow\":"); file.print(config.triggerActiveLow ? "true" : "false"); file.print(",\n");
  file.print("  \"useDhcp\":"); file.print(config.useDhcp ? "true" : "false"); file.print(",\n");
  file.print("  \"staticIp\":\""); file.print(jsonEscape(config.staticIp)); file.print("\",\n");
  file.print("  \"gateway\":\""); file.print(jsonEscape(config.gateway)); file.print("\",\n");
  file.print("  \"subnet\":\""); file.print(jsonEscape(config.subnet)); file.print("\",\n");
  file.print("  \"dns1\":\""); file.print(jsonEscape(config.dns1)); file.print("\",\n");
  file.print("  \"dns2\":\""); file.print(jsonEscape(config.dns2)); file.print("\",\n");
  file.print("  \"chargeOnPercent\":"); file.print(chargeOnPercent); file.print(",\n");
  file.print("  \"chargeOffPercent\":"); file.print(chargeOffPercent); file.print("\n");
  file.print("}\n");
  file.close();
  return true;
}

void scheduleReboot(unsigned long delayMs) {
  rebootPending = true;
  rebootAtMs = millis() + delayMs;
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

String contentTypeFor(const String& path) {
  if (path.endsWith(".html")) return "text/html";
  if (path.endsWith(".css")) return "text/css";
  if (path.endsWith(".js")) return "application/javascript";
  if (path.endsWith(".json")) return "application/json";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg")) return "image/jpeg";
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

void startApMode() {
  WiFi.disconnect();
  delay(100);
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAPConfig(AP_IP, AP_GATEWAY, AP_SUBNET);
  WiFi.softAP(AP_SSID, AP_PASS);
  currentMode = "AP";
  currentIp = WiFi.softAPIP().toString();
  currentSsid = "";
  Serial.println("WIFI_AP_STARTED");
}

bool applyStaticConfig() {
  IPAddress localIp;
  IPAddress gateway;
  IPAddress subnet;
  IPAddress dns1;
  IPAddress dns2;

  if (!localIp.fromString(config.staticIp)) return false;
  if (!gateway.fromString(config.gateway)) return false;
  if (!subnet.fromString(config.subnet)) return false;
  if (!dns1.fromString(config.dns1)) dns1 = gateway;
  if (!dns2.fromString(config.dns2)) dns2 = dns1;
  return WiFi.config(localIp, gateway, subnet, dns1, dns2);
}

bool isValidIpString(const String& value) {
  IPAddress parsed;
  return parsed.fromString(value);
}

uint32_t ipToUint32(const IPAddress& ip) {
  return ((uint32_t)ip[0] << 24) | ((uint32_t)ip[1] << 16) | ((uint32_t)ip[2] << 8) | (uint32_t)ip[3];
}

String derivePortalIpFromGateway(const String& gatewayValue) {
  IPAddress gateway;
  if (!gateway.fromString(gatewayValue)) return "";
  uint8_t lastByte = gateway[3] == 100 ? 101 : 100;
  String derived = String(gateway[0]);
  derived += ".";
  derived += String(gateway[1]);
  derived += ".";
  derived += String(gateway[2]);
  derived += ".";
  derived += String(lastByte);
  return derived;
}

bool isValidSubnetMaskString(const String& value) {
  IPAddress subnet;
  if (!subnet.fromString(value)) return false;
  uint32_t mask = ipToUint32(subnet);
  if (mask == 0) return false;
  uint32_t inverted = ~mask;
  return (inverted & (inverted + 1)) == 0;
}

bool isSameSubnet(const String& localValue, const String& gatewayValue, const String& subnetValue) {
  IPAddress localIp;
  IPAddress gateway;
  IPAddress subnet;
  if (!localIp.fromString(localValue)) return false;
  if (!gateway.fromString(gatewayValue)) return false;
  if (!subnet.fromString(subnetValue)) return false;
  uint32_t mask = ipToUint32(subnet);
  return (ipToUint32(localIp) & mask) == (ipToUint32(gateway) & mask);
}

void startStaOrFallback() {
  Serial.println("WIFI_STA_CONNECTING");
  WiFi.disconnect();
  delay(100);
  WiFi.mode(WIFI_STA);
  WiFi.hostname("BYG-PISOTAB-PRO");
  applyStaticConfig();
  WiFi.begin(config.ssid.c_str(), config.password.c_str());

  unsigned long started = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - started < STA_TIMEOUT_MS) {
    delay(250);
    yield();
  }

  if (WiFi.status() == WL_CONNECTED) {
    currentMode = "STA";
    currentIp = WiFi.localIP().toString();
    currentSsid = WiFi.SSID();
    Serial.println("WIFI_STA_CONNECTED");
  } else {
    Serial.println("WIFI_STA_FAILED_FALLBACK_AP");
    startApMode();
  }
}

bool readAllanTriggerRaw() {
  return digitalRead(triggerGpio()) == triggerActiveLevel();
}

void updateAllanTrigger() {
  bool rawActive = readAllanTriggerRaw();
  if (rawActive != allanRawActive) {
    allanRawActive = rawActive;
    allanRawChangedMs = millis();
  }
  if (rawActive != allanTriggerActive
      && millis() - allanRawChangedMs >= ALLAN_TRIGGER_DEBOUNCE_MS) {
    allanTriggerActive = rawActive;
    Serial.println(allanTriggerActive ? "ALLAN_TRIGGER_ON" : "ALLAN_TRIGGER_OFF");
  }
}

void handleStatus() {
  updateAllanTrigger();
  String body = "{";
  body += "\"ok\":true,";
  body += "\"board\":\""; body += BOARD_NAME; body += "\",";
  body += "\"mode\":\""; body += currentMode; body += "\",";
  body += "\"ip\":\""; body += jsonEscape(currentIp); body += "\",";
  body += "\"ssid\":\""; body += jsonEscape(currentSsid); body += "\",";
  body += "\"useDhcp\":"; body += (config.useDhcp ? "true" : "false"); body += ",";
  body += "\"uptime\":\""; body += uptimeText(); body += "\",";
  body += "\"freeHeap\":"; body += String(ESP.getFreeHeap()); body += ",";
  body += "\"battery\":"; body += String(batteryPercent); body += ",";
  body += "\"charging\":\""; body += (charging ? "ON" : "OFF"); body += "\",";
  body += "\"allanTrigger\":"; body += (allanTriggerActive ? "true" : "false"); body += ",";
  body += "\"session\":\""; body += (allanTriggerActive ? "ACTIVE" : "OFF"); body += "\",";
  body += "\"relayPin\":\""; body += jsonEscape(config.relayPinName); body += "\",";
  body += "\"triggerPin\":\""; body += jsonEscape(config.triggerPinName); body += "\",";
  body += "\"relayActiveLevel\":\""; body += (config.relayActiveLow ? "LOW" : "HIGH"); body += "\",";
  body += "\"triggerActiveLevel\":\""; body += (config.triggerActiveLow ? "LOW" : "HIGH"); body += "\",";
  body += "\"chargeOnPercent\":"; body += String(chargeOnPercent); body += ",";
  body += "\"chargeOffPercent\":"; body += String(chargeOffPercent);
  body += "}";
  sendJson(200, body);
}

String chargingStatusJson() {
  String body = "{";
  body += "\"ok\":true,";
  body += "\"battery\":"; body += String(batteryPercent); body += ",";
  body += "\"charging\":\""; body += (charging ? "ON" : "OFF"); body += "\",";
  body += "\"allanTrigger\":"; body += (allanTriggerActive ? "true" : "false"); body += ",";
  body += "\"session\":\""; body += (allanTriggerActive ? "ACTIVE" : "OFF"); body += "\",";
  body += "\"charge_on_percent\":"; body += String(chargeOnPercent); body += ",";
  body += "\"charge_off_percent\":"; body += String(chargeOffPercent); body += ",";
  body += "\"relay\":\""; body += (charging ? "ON" : "OFF"); body += "\"";
  body += "}";
  return body;
}

void turnChargingOn() {
  if (charging) return;
  charging = true;
  digitalWrite(relayGpio(), relayOnLevel());
  Serial.println("CHARGING_ON");
}

void turnChargingOff() {
  if (!charging) return;
  charging = false;
  digitalWrite(relayGpio(), relayOffLevel());
  Serial.println("CHARGING_OFF");
}

void smartChargingLogic() {
  if (batteryPercent < 0) return;
  if (batteryPercent <= chargeOnPercent && !charging) {
    turnChargingOn();
  }
  if (batteryPercent >= chargeOffPercent && charging) {
    turnChargingOff();
  }
}

void handleBattery() {
  int nextBattery = -1;
  if (server.hasArg("battery")) {
    nextBattery = server.arg("battery").toInt();
  } else if (server.hasArg("percent")) {
    nextBattery = server.arg("percent").toInt();
  } else if (server.hasArg("plain")) {
    String plain = server.arg("plain");
    nextBattery = readJsonInt(plain, "battery", -1);
    if (nextBattery < 0) {
      String raw = readJsonString(plain, "battery");
      if (raw.length() > 0) nextBattery = raw.toInt();
    }
  }
  if (nextBattery < 0 || nextBattery > 100) {
    sendJson(400, "{\"ok\":false,\"error\":\"Missing battery\"}");
    return;
  }
  batteryPercent = constrain(nextBattery, 0, 100);
  Serial.print("BATTERY_RECEIVED:");
  Serial.println(batteryPercent);
  smartChargingLogic();
  sendJson(200, chargingStatusJson());
}

void handleApiBattery() {
  handleBattery();
}

void handleChargingSettings() {
  if (server.hasArg("on")) {
    chargeOnPercent = constrain(server.arg("on").toInt(), 0, 99);
  }
  if (server.hasArg("off")) {
    chargeOffPercent = constrain(server.arg("off").toInt(), chargeOnPercent + 1, 100);
  }
  if (chargeOffPercent <= chargeOnPercent) {
    chargeOffPercent = min(100, chargeOnPercent + 1);
  }
  saveConfig();
  sendJson(200, chargingStatusJson());
  scheduleReboot(1000);
}

void handleChargeApi() {
  if (!server.hasArg("on") || !server.hasArg("off")) {
    sendJson(400, "{\"ok\":false,\"message\":\"Resume and stop percentages are required\"}");
    return;
  }
  int nextOn = constrain(server.arg("on").toInt(), 0, 99);
  int nextOff = constrain(server.arg("off").toInt(), 1, 100);
  if (nextOff <= nextOn) {
    sendJson(400, "{\"ok\":false,\"message\":\"Stop percent must be higher than resume percent\"}");
    return;
  }
  chargeOnPercent = nextOn;
  chargeOffPercent = nextOff;
  smartChargingLogic();
  if (!saveConfig()) {
    sendJson(500, "{\"ok\":false,\"message\":\"Failed to save smart charging\"}");
    return;
  }
  sendJson(200, chargingStatusJson());
  scheduleReboot(1000);
}

void handleChargingStatus() {
  sendJson(200, chargingStatusJson());
}

void handleScan() {
  if (currentMode == "AP") {
    WiFi.mode(WIFI_AP_STA);
  }
  int count = WiFi.scanNetworks(false, true);
  if (count < 0) {
    sendJson(503, "{\"ok\":false,\"message\":\"WiFi scan is busy. Try again.\"}");
    return;
  }
  String body = "[";
  for (int i = 0; i < count; i++) {
    if (i > 0) body += ",";
    body += "{";
    body += "\"ssid\":\""; body += jsonEscape(WiFi.SSID(i)); body += "\",";
    body += "\"rssi\":"; body += String(WiFi.RSSI(i)); body += ",";
    body += "\"channel\":"; body += String(WiFi.channel(i)); body += ",";
    body += "\"secure\":"; body += (WiFi.encryptionType(i) == ENC_TYPE_NONE ? "false" : "true");
    body += "}";
  }
  body += "]";
  WiFi.scanDelete();
  sendJson(200, body);
}

void handleLogin() {
  String username = requestValue("username");
  String password = requestValue("password");
  if (username == "admin" && password == config.adminPassword) {
    Serial.println("LOGIN_SUCCESS");
    sendJson(200, "{\"ok\":true}");
  } else {
    Serial.println("LOGIN_FAILED");
    sendJson(401, "{\"ok\":false,\"message\":\"Invalid username or password\"}");
  }
}

void handlePasswordChange() {
  String currentPassword = requestValue("currentPassword");
  String newPassword = requestValue("newPassword");

  if (newPassword.length() < 4) {
    sendJson(400, "{\"ok\":false,\"message\":\"New password must be at least 4 characters\"}");
    return;
  }
  if (currentPassword != config.adminPassword) {
    sendJson(401, "{\"ok\":false,\"message\":\"Current password is incorrect\"}");
    return;
  }

  config.adminPassword = newPassword;
  if (!saveConfig()) {
    sendJson(500, "{\"ok\":false,\"message\":\"Failed to save password\"}");
    return;
  }

  Serial.println("PASSWORD_CHANGED");
  sendJson(200, "{\"ok\":true,\"message\":\"Password changed\"}");
}

void handlePins() {
  String relayPinName = normalizePinName(requestValue("relayPin"), "");
  String triggerPinName = normalizePinName(requestValue("triggerPin"), "");
  String relayActiveLevel = requestValue("relayActiveLevel");
  String triggerActiveLevelValue = requestValue("triggerActiveLevel");
  relayActiveLevel.trim();
  triggerActiveLevelValue.trim();
  relayActiveLevel.toUpperCase();
  triggerActiveLevelValue.toUpperCase();

  if (relayPinName.length() == 0 || triggerPinName.length() == 0) {
    sendJson(400, "{\"ok\":false,\"message\":\"Choose safe pins only: D1, D2, D5, D6, D7\"}");
    return;
  }
  if (relayPinName == triggerPinName) {
    sendJson(400, "{\"ok\":false,\"message\":\"Relay pin and Allan trigger pin must be different\"}");
    return;
  }
  if (relayActiveLevel != "LOW" && relayActiveLevel != "HIGH") {
    sendJson(400, "{\"ok\":false,\"message\":\"Relay active level must be LOW or HIGH\"}");
    return;
  }
  if (triggerActiveLevelValue != "LOW" && triggerActiveLevelValue != "HIGH") {
    sendJson(400, "{\"ok\":false,\"message\":\"Trigger active level must be LOW or HIGH\"}");
    return;
  }

  config.relayPinName = relayPinName;
  config.triggerPinName = triggerPinName;
  config.relayActiveLow = relayActiveLevel == "LOW";
  config.triggerActiveLow = triggerActiveLevelValue == "LOW";
  sanitizePinConfig();

  if (!saveConfig()) {
    sendJson(500, "{\"ok\":false,\"message\":\"Failed to save pin config\"}");
    return;
  }

  Serial.println("PIN_CONFIG_SAVED");
  sendJson(200, "{\"ok\":true,\"message\":\"Pin config saved. Rebooting\"}");
  scheduleReboot(1000);
}

void handleSettings() {
  config.ssid = requestValue("ssid");
  config.password = requestValue("password");
  config.useDhcp = false;
  config.staticIp = requestValue("staticIp");
  config.gateway = requestValue("gateway");
  config.subnet = "255.255.255.0";
  config.dns1 = "";
  config.dns2 = "";
  config.ssid.trim();
  config.staticIp.trim();
  config.gateway.trim();
  config.subnet.trim();
  config.dns1.trim();
  config.dns2.trim();

  if (config.ssid.length() == 0) {
    sendJson(400, "{\"ok\":false,\"message\":\"WiFi SSID is required\"}");
    return;
  }
  if (config.staticIp.length() == 0) {
    config.staticIp = derivePortalIpFromGateway(config.gateway);
  }
  if (!isValidIpString(config.gateway)) {
    sendJson(400, "{\"ok\":false,\"message\":\"Valid gateway is required\"}");
    return;
  }
  if (!isValidIpString(config.staticIp)) {
    sendJson(400, "{\"ok\":false,\"message\":\"Valid portal IP is required\"}");
    return;
  }
  if (!isValidSubnetMaskString(config.subnet)) {
    sendJson(400, "{\"ok\":false,\"message\":\"Subnet mask must be valid\"}");
    return;
  }
  if (config.staticIp == config.gateway) {
    sendJson(400, "{\"ok\":false,\"message\":\"Portal IP and router gateway cannot be the same\"}");
    return;
  }
  if (!isSameSubnet(config.staticIp, config.gateway, config.subnet)) {
    sendJson(400, "{\"ok\":false,\"message\":\"Portal IP and router gateway must use the same network\"}");
    return;
  }

  if (!saveConfig()) {
    sendJson(500, "{\"ok\":false,\"message\":\"Failed to save config\"}");
    return;
  }

  Serial.println("SETTINGS_SAVED");
  sendJson(200, "{\"ok\":true,\"message\":\"Settings saved\"}");
}

void handleReboot() {
  Serial.println("REBOOT_REQUESTED");
  sendJson(200, "{\"ok\":true,\"message\":\"Rebooting\"}");
  scheduleReboot(800);
}

void handleReset() {
  LittleFS.remove(CONFIG_PATH);
  Serial.println("RESET_REQUESTED");
  sendJson(200, "{\"ok\":true,\"message\":\"Setup reset\"}");
  scheduleReboot(800);
}

void configureIoPins() {
  sanitizePinConfig();
  charging = false;
  pinMode(relayGpio(), OUTPUT);
  digitalWrite(relayGpio(), relayOffLevel());
  pinMode(triggerGpio(), INPUT_PULLUP);
  allanRawActive = readAllanTriggerRaw();
  allanTriggerActive = allanRawActive;
  allanRawChangedMs = millis();
  Serial.print("RELAY_PIN:");
  Serial.println(config.relayPinName);
  Serial.print("ALLAN_TRIGGER_PIN:");
  Serial.println(config.triggerPinName);
  Serial.println(allanTriggerActive ? "ALLAN_TRIGGER_ON" : "ALLAN_TRIGGER_OFF");
}

void setupRoutes() {
  server.on("/battery", HTTP_GET, handleBattery);
  server.on("/settings", HTTP_GET, handleChargingSettings);
  server.on("/status", HTTP_GET, handleChargingStatus);
  server.on("/api/status", HTTP_GET, handleStatus);
  server.on("/api/battery", HTTP_POST, handleApiBattery);
  server.on("/api/scan", HTTP_GET, handleScan);
  server.on("/api/login", HTTP_POST, handleLogin);
  server.on("/api/password", HTTP_POST, handlePasswordChange);
  server.on("/api/pins", HTTP_POST, handlePins);
  server.on("/api/settings", HTTP_POST, handleSettings);
  server.on("/api/charge", HTTP_POST, handleChargeApi);
  server.on("/api/reboot", HTTP_POST, handleReboot);
  server.on("/api/reset", HTTP_POST, handleReset);
  server.onNotFound([]() {
    if (!serveFile(server.uri())) {
      sendJson(404, "{\"ok\":false,\"message\":\"Not found\"}");
    }
  });
}

void setup() {
  Serial.begin(115200);
  delay(200);
  bootMs = millis();

  if (!LittleFS.begin()) {
    LittleFS.format();
    LittleFS.begin();
  }

  bool hasConfig = loadConfig();
  configureIoPins();

  if (hasConfig) {
    startStaOrFallback();
  } else {
    startApMode();
  }

  setupRoutes();
  server.begin();
  Serial.println("PORTAL_STARTED");
}

void loop() {
  updateAllanTrigger();
  server.handleClient();
  if (rebootPending && (long)(millis() - rebootAtMs) >= 0) {
    delay(100);
    ESP.restart();
  }
}
