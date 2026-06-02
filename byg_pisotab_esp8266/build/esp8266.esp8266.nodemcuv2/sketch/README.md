#line 1 "C:\\Users\\Jay\\Documents\\GitHub\\Piso Tab Custom App\\firmware\\byg_pisotab_esp8266\\README.md"
# BYG-PISOTAB PRO ESP8266 Setup Portal

This project is for an ESP8266 NodeMCU ESP-12E using the Arduino framework, `ESP8266WebServer`, LittleFS, and a small plain HTML/CSS/JavaScript portal.

## Files

- `byg_pisotab_esp8266.ino` is the editable Arduino source code.
- `data/index.html`, `data/style.css`, and `data/app.js` are the LittleFS portal website files.
- `firmware.bin` is the compiled firmware output you create from the `.ino`.
- `LittleFS/data.bin` is the compiled filesystem image containing the portal files.

Two-bin flashing means you flash:

1. The firmware bin.
2. The LittleFS/data bin.

Both are needed. The firmware runs the ESP8266 logic, while LittleFS stores the login page and dashboard.

## Default Portal Login

- Username: `admin`
- Password: `admin`

There is no register page.

## WiFi Behavior

First boot, or no saved WiFi config:

- Starts AP setup mode.
- SSID: `BYG-PISOTAB-SETUP`
- Password: `12345678`
- AP IP: `10.20.30.1`
- Portal URL: `http://10.20.30.1`

After saving WiFi setup:

- Settings are saved to `/config.json` in LittleFS.
- Use the dashboard `Save and Reboot` button.
- ESP restarts and connects in STA mode.
- User sets the Router Gateway, for example `192.168.0.1`.
- User can set Portal IP, for example `192.168.0.100`. If left blank, the portal uses the gateway network and `.100`.
- The portal uses subnet mask `255.255.255.0` internally to keep setup simple.
- The same portal is served from the saved Portal IP.

## Smart Charging

This firmware includes the same ESP8266 smart-charging behavior used by the Android app bridge.

- Relay pin: `D1`
- Relay ON: `LOW`
- Relay OFF: `HIGH`
- Android sends the tablet battery to `GET /battery?percent=NN`
- Android sends thresholds to `GET /settings?on=40&off=90`
- Legacy smart-charging status is available at `GET /status`
- Portal users can edit the same thresholds from the Smart Charging card.

Charging turns ON when battery is less than or equal to the resume/on percent, and turns OFF when battery is greater than or equal to the stop/off percent.

Fallback:

- If STA connection fails for 20 seconds, it falls back to setup AP mode.
- Portal returns at `http://10.20.30.1`.

## API

- `GET /api/status`
- `POST /api/battery`
- `GET /api/scan`
- `POST /api/login`
- `POST /api/settings`
- `POST /api/charge`
- `POST /api/reboot`
- `POST /api/reset`
- `GET /battery?percent=NN`
- `GET /settings?on=40&off=90`
- `GET /status`

`/api/status` never exposes the WiFi password.

The Android ESP8266 variant reads tablet battery with `BatteryManager` and sends:

- `POST http://<esp8266_host>/api/battery`
- form body: `battery=85`
- JSON body is also accepted: `{ "battery": 85 }`

On receive, Serial Monitor prints `BATTERY_RECEIVED:85`.

## Serial Logs

Open Serial Monitor at `115200`.

Expected log tags:

- `WIFI_AP_STARTED`
- `WIFI_STA_CONNECTING`
- `WIFI_STA_CONNECTED`
- `WIFI_STA_FAILED_FALLBACK_AP`
- `PORTAL_STARTED`
- `LOGIN_SUCCESS`
- `LOGIN_FAILED`
- `SETTINGS_SAVED`
- `REBOOT_REQUESTED`
- `RESET_REQUESTED`

## Arduino IDE Flashing Steps

1. Install Arduino IDE.
2. Add ESP8266 boards URL in Preferences:
   `https://arduino.esp8266.com/stable/package_esp8266com_index.json`
3. Open Boards Manager and install `esp8266`.
4. Open `firmware/byg_pisotab_esp8266/byg_pisotab_esp8266.ino`.
5. Select board: `NodeMCU 1.0 (ESP-12E Module)`.
6. Select the correct COM port.
7. Recommended settings:
   - Flash Size: `4MB (FS:2MB OTA:~1019KB)` or another option with LittleFS space.
   - Upload Speed: `115200` or `921600`.
   - CPU Frequency: `80 MHz`.
8. Click Upload.
9. Open Serial Monitor at `115200`.

## LittleFS Upload Steps

The portal files must be uploaded to LittleFS after firmware upload.

Arduino IDE 1.x:

1. Install the ESP8266 LittleFS Data Upload tool.
2. Keep the files inside `firmware/byg_pisotab_esp8266/data`.
3. In Arduino IDE, use `Tools > ESP8266 LittleFS Data Upload`.
4. Reboot the ESP8266.

Arduino IDE 2.x:

1. Use an ESP8266 LittleFS upload plugin or the command-line upload tool.
2. Build/upload the filesystem image from the `data` folder.
3. Reboot the ESP8266.

## ESP Flasher Bin Method

If using a bin flasher, build two binaries first:

1. Build/export the sketch to get `firmware.bin`.
2. Build a LittleFS image from the `data` folder to get `data.bin`.
3. Flash `firmware.bin` to the normal app address used by your ESP8266 flasher.
4. Flash `data.bin` to the LittleFS filesystem address that matches your selected flash layout.
5. Reboot.

The filesystem address depends on the flash size and partition layout you selected. Use the address reported by the Arduino/ESP8266 build tools for your exact board settings.

## Quick Test

1. Flash firmware.
2. Upload LittleFS data.
3. Connect phone/tablet/PC WiFi to `BYG-PISOTAB-SETUP`.
4. Open `http://10.20.30.1`.
5. Login with `admin/admin`.
6. Tap `Scan WiFi`.
7. Enter router settings and a static IP.
8. Tap `Save and Reboot`.
9. After reboot, open the saved static IP in a browser.
