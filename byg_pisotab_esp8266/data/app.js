(function () {
  var authKey = "byg_pisotab_auth";
  var loginPage = document.getElementById("loginPage");
  var dashboardPage = document.getElementById("dashboardPage");
  var statusTimer = null;
  var activePage = "statusPage";
  var autoScanned = false;

  function qs(id) {
    return document.getElementById(id);
  }

  function showDashboard() {
    loginPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");
    showAdminPage(activePage, true);
    autoScanned = false;
    refreshStatus(true);
    if (statusTimer) clearInterval(statusTimer);
    statusTimer = setInterval(refreshStatus, 3000);
  }

  function showLogin() {
    setNavOpen(false);
    dashboardPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    if (statusTimer) clearInterval(statusTimer);
  }

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", !!open);
    qs("menuBtn").setAttribute("aria-expanded", open ? "true" : "false");
  }

  function showAdminPage(pageId, keepDrawerState) {
    var pagePanels = document.querySelectorAll(".page-panel");
    var navLinks = document.querySelectorAll(".nav-link");
    activePage = pageId || "wifiPage";

    for (var p = 0; p < pagePanels.length; p++) {
      pagePanels[p].classList.toggle("active", pagePanels[p].id === activePage);
    }
    for (var n = 0; n < navLinks.length; n++) {
      navLinks[n].classList.toggle("active", navLinks[n].getAttribute("data-page") === activePage);
    }
    if (!keepDrawerState) setNavOpen(false);
    window.scrollTo(0, 0);
  }

  function setMsg(id, text, type) {
    var el = qs(id);
    el.textContent = text || "";
    el.className = "message" + (type ? " " + type : "");
  }

  function api(path, options) {
    return fetch(path, options || {}).then(function (res) {
      return res.text().then(function (text) {
        var data = {};
        try { data = text ? JSON.parse(text) : {}; } catch (e) {}
        if (!res.ok) {
          throw new Error(data.message || "Request failed");
        }
        return data;
      });
    });
  }

  function postForm(path, data) {
    var pairs = [];
    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
    }
    return api(path, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: pairs.join("&")
    });
  }

  function parseIp(value) {
    var parts = String(value || "").trim().split(".");
    if (parts.length !== 4) return null;
    var bytes = [];
    for (var i = 0; i < 4; i++) {
      if (!/^\d{1,3}$/.test(parts[i])) return null;
      var n = parseInt(parts[i], 10);
      if (n < 0 || n > 255) return null;
      bytes.push(n);
    }
    return bytes;
  }

  function ipToNumber(bytes) {
    return (((bytes[0] << 24) >>> 0) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  }

  function sameSubnet(ip, gateway, subnet) {
    var mask = ipToNumber(subnet);
    return ((ipToNumber(ip) & mask) >>> 0) === ((ipToNumber(gateway) & mask) >>> 0);
  }

  function derivePortalIp(gatewayValue) {
    var gateway = parseIp(gatewayValue);
    if (!gateway) return "";
    var last = gateway[3] === 100 ? 101 : 100;
    return gateway[0] + "." + gateway[1] + "." + gateway[2] + "." + last;
  }

  function validateNetworkSettings(data) {
    var ip = parseIp(data.staticIp);
    var gateway = parseIp(data.gateway);
    var subnet = [255, 255, 255, 0];

    if (!gateway) return "Router gateway must be valid.";
    if (!ip) return "Portal static IP must be valid.";
    if (data.staticIp.trim() === data.gateway.trim()) {
      return "Portal IP and router gateway cannot be the same.";
    }
    if (!sameSubnet(ip, gateway, subnet)) {
      return "Portal IP and router gateway must use the same subnet.";
    }
    return "";
  }

  function refreshStatus(chooseStartPage) {
    api("/api/status").then(function (s) {
      qs("boardValue").textContent = s.board || "ESP8266";
      qs("modeValue").textContent = s.mode || "...";
      qs("modeDetail").textContent = s.mode || "...";
      qs("ipValue").textContent = s.ip || "...";
      qs("ipDetail").textContent = s.ip || "...";
      qs("ssidValue").textContent = s.ssid || (s.mode === "AP" ? "SETUP AP" : "...");
      qs("ssidDetail").textContent = s.ssid || (s.mode === "AP" ? "BYG-PISOTAB-SETUP" : "...");
      qs("uptimeValue").textContent = s.uptime || "...";
      qs("chargeValue").textContent = s.charging || "OFF";
      qs("batteryValue").textContent = s.battery >= 0 ? (s.battery + "%") : "Waiting";
      qs("relayValue").textContent = s.charging || "OFF";
      qs("allanDetail").textContent = (s.allanTrigger ? "ACTIVE" : "OFF") + " on " + (s.triggerPin || "D2");
      qs("thresholdValue").textContent = s.chargeOnPercent + "% / " + s.chargeOffPercent + "%";
      if (document.activeElement !== qs("chargeOn")) qs("chargeOn").value = s.chargeOnPercent;
      if (document.activeElement !== qs("chargeOff")) qs("chargeOff").value = s.chargeOffPercent;
      if (document.activeElement !== qs("relayPin")) qs("relayPin").value = s.relayPin || "D1";
      if (document.activeElement !== qs("triggerPin")) qs("triggerPin").value = s.triggerPin || "D2";
      if (document.activeElement !== qs("relayActiveLevel")) qs("relayActiveLevel").value = s.relayActiveLevel || "LOW";
      if (document.activeElement !== qs("triggerActiveLevel")) qs("triggerActiveLevel").value = s.triggerActiveLevel || "LOW";
      if (chooseStartPage) {
        if (s.mode === "AP") {
          showAdminPage("networksPage", true);
          if (!autoScanned) {
            autoScanned = true;
            runScan(qs("scanPageBtn"));
          }
        } else {
          showAdminPage("statusPage", true);
        }
      }
    }).catch(function () {
      setMsg("saveMsg", "Status unavailable. Reconnect to the portal.", "error");
    });
  }

  function renderNetworks(list) {
    var host = qs("scanList");
    host.innerHTML = "";
    if (!list || !list.length) {
      host.textContent = "No WiFi networks found.";
      host.className = "scan-list muted";
      return;
    }
    host.className = "scan-list";
    list.forEach(function (net) {
      var row = document.createElement("button");
      row.type = "button";
      row.className = "network";
      row.innerHTML = "<span>" + escapeHtml(net.ssid || "(hidden)") + "</span><small>" +
        net.rssi + " dBm " + (net.secure ? "LOCK" : "OPEN") + "</small>";
      row.addEventListener("click", function () {
        qs("ssid").value = net.ssid || "";
        showAdminPage("wifiPage", false);
      });
      host.appendChild(row);
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  qs("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    setMsg("loginMsg", "Authenticating...", "");
    postForm("/api/login", {
      username: qs("username").value,
      password: qs("password").value
    }).then(function () {
      localStorage.setItem(authKey, "1");
      setMsg("loginMsg", "", "");
      showDashboard();
    }).catch(function (err) {
      localStorage.removeItem(authKey);
      setMsg("loginMsg", err.message || "Login failed", "error");
    });
  });

  qs("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem(authKey);
    setNavOpen(false);
    showLogin();
  });

  qs("menuBtn").addEventListener("click", function () {
    setNavOpen(!document.body.classList.contains("nav-open"));
  });

  qs("drawerBackdrop").addEventListener("click", function () {
    setNavOpen(false);
  });

  var navLinks = document.querySelectorAll(".nav-link");
  for (var n = 0; n < navLinks.length; n++) {
    navLinks[n].addEventListener("click", function () {
      showAdminPage(this.getAttribute("data-page"), false);
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 880) setNavOpen(false);
  });

  qs("gateway").addEventListener("input", function () {
    if (qs("staticIp").value.trim()) return;
    qs("staticIp").value = derivePortalIp(this.value);
  });

  function runScan(btn) {
    btn.disabled = true;
    btn.textContent = "SCANNING...";
    qs("scanList").textContent = "Scanning nearby WiFi networks...";
    qs("scanList").className = "scan-list muted";
    api("/api/scan").then(renderNetworks).catch(function (err) {
      qs("scanList").textContent = err.message || "Scan failed.";
      qs("scanList").className = "scan-list muted";
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = "SCAN WIFI";
    });
  }

  qs("scanBtn").addEventListener("click", function () {
    showAdminPage("networksPage", true);
    runScan(qs("scanPageBtn"));
  });

  qs("scanPageBtn").addEventListener("click", function () {
    runScan(this);
  });

  qs("chargeForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var on = parseInt(qs("chargeOn").value, 10);
    var off = parseInt(qs("chargeOff").value, 10);
    if (isNaN(on) || isNaN(off) || on < 0 || off > 100 || off <= on) {
      setMsg("chargeMsg", "Stop percent must be higher than resume percent.", "error");
      return;
    }
    setMsg("chargeMsg", "Saving smart charging...", "");
    postForm("/api/charge", { on: on, off: off }).then(function () {
      setMsg("chargeMsg", "Smart charging saved. ESP is rebooting...", "ok");
      refreshStatus();
    }).catch(function (err) {
      setMsg("chargeMsg", err.message || "Charging save failed", "error");
    });
  });

  qs("pinForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var relayPin = qs("relayPin").value;
    var triggerPin = qs("triggerPin").value;

    if (relayPin === triggerPin) {
      setMsg("pinMsg", "Relay pin and Allan trigger pin must be different.", "error");
      return;
    }

    setMsg("pinMsg", "Saving pin configuration...", "");
    postForm("/api/pins", {
      relayPin: relayPin,
      relayActiveLevel: qs("relayActiveLevel").value,
      triggerPin: triggerPin,
      triggerActiveLevel: qs("triggerActiveLevel").value
    }).then(function () {
      setMsg("pinMsg", "Pins saved. ESP is rebooting...", "ok");
    }).catch(function (err) {
      setMsg("pinMsg", err.message || "Pin save failed", "error");
    });
  });

  qs("passwordForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var currentPassword = qs("currentPassword").value;
    var newPassword = qs("newPassword").value;
    var confirmPassword = qs("confirmPassword").value;

    if (newPassword.length < 4) {
      setMsg("passwordMsg", "New password must be at least 4 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg("passwordMsg", "New password and confirmation do not match.", "error");
      return;
    }

    setMsg("passwordMsg", "Changing portal password...", "");
    postForm("/api/password", {
      currentPassword: currentPassword,
      newPassword: newPassword
    }).then(function () {
      qs("passwordForm").reset();
      setMsg("passwordMsg", "Password changed. Use it on the next login.", "ok");
    }).catch(function (err) {
      setMsg("passwordMsg", err.message || "Password change failed", "error");
    });
  });

  qs("settingsForm").addEventListener("submit", function (event) {
    event.preventDefault();
    setMsg("saveMsg", "Saving settings...", "");
    var form = new FormData(event.target);
    var data = {};
    form.forEach(function (value, key) { data[key] = value; });
    data.staticIp = String(data.staticIp || "").trim() || derivePortalIp(data.gateway);
    data.subnet = "255.255.255.0";
    data.dns1 = "";
    data.dns2 = "";
    var networkError = validateNetworkSettings(data);
    if (networkError) {
      setMsg("saveMsg", networkError, "error");
      return;
    }
    postForm("/api/settings", data).then(function () {
      setMsg("saveMsg", "Saved. Rebooting now...", "ok");
      return postForm("/api/reboot", {});
    }).catch(function (err) {
      setMsg("saveMsg", err.message || "Save failed", "error");
    });
  });

  qs("rebootBtn").addEventListener("click", function () {
    if (!confirm("Reboot ESP8266 now?")) return;
    setMsg("saveMsg", "Rebooting...", "ok");
    postForm("/api/reboot", {});
  });

  qs("resetBtn").addEventListener("click", function () {
    if (!confirm("Clear saved WiFi setup and restart to AP mode?")) return;
    setMsg("saveMsg", "Resetting setup...", "");
    postForm("/api/reset", {}).then(function () {
      setMsg("saveMsg", "Setup reset. Rebooting to AP mode...", "ok");
    }).catch(function (err) {
      setMsg("saveMsg", err.message || "Reset failed", "error");
    });
  });

  if (localStorage.getItem(authKey) === "1") {
    showDashboard();
  } else {
    showLogin();
  }
})();
