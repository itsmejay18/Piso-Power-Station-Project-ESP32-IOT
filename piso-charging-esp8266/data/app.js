(function () {
  var pinOptions = [
    ["D1", "D1 / GPIO5"],
    ["D2", "D2 / GPIO4"],
    ["D5", "D5 / GPIO14"],
    ["D6", "D6 / GPIO12"],
    ["D7", "D7 / GPIO13"]
  ];
  var userTimer = null;
  var adminTimer = null;
  var activeAdminPage = "statusPage";

  function qs(id) {
    return document.getElementById(id);
  }

  function setMsg(id, text, type) {
    var el = qs(id);
    if (!el) return;
    el.textContent = text || "";
    el.className = "message" + (type ? " " + type : "");
  }

  function setSimMsg(text, type) {
    setMsg("simMsg", text, type);
    setMsg("adminSimMsg", text, type);
  }

  function actionValue(target, attr) {
    while (target && target !== document) {
      if (target.getAttribute && target.hasAttribute(attr)) {
        return target.getAttribute(attr);
      }
      target = target.parentNode;
    }
    return null;
  }

  function encodeForm(data) {
    var pairs = [];
    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
    }
    return pairs.join("&");
  }

  function api(path, options) {
    return fetch(path, options || {}).then(function (res) {
      return res.text().then(function (text) {
        var data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch (err) {}
        if (!res.ok) {
          throw new Error(data.message || "Request failed");
        }
        return data;
      });
    });
  }

  function post(path, data) {
    return api(path, {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: encodeForm(data || {})
    });
  }

  function fmtTime(total) {
    total = Math.max(0, parseInt(total || 0, 10));
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    if (h > 0) {
      return h + ":" + pad(m) + ":" + pad(s);
    }
    return pad(m) + ":" + pad(s);
  }

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function showOnly(id) {
    ["userPortal", "adminLogin", "adminDashboard"].forEach(function (screenId) {
      qs(screenId).classList.toggle("hidden", screenId !== id);
    });
    if (id !== "adminDashboard") setNavOpen(false);
  }

  function setNavOpen(open) {
    var menuBtn = qs("menuBtn");
    document.body.classList.toggle("nav-open", !!open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function showAdminPage(pageId, keepDrawerState) {
    var pagePanels = document.querySelectorAll(".page-panel");
    var navLinks = document.querySelectorAll(".nav-link");
    activeAdminPage = pageId || "statusPage";

    for (var p = 0; p < pagePanels.length; p++) {
      pagePanels[p].classList.toggle("active", pagePanels[p].id === activeAdminPage);
    }
    for (var n = 0; n < navLinks.length; n++) {
      navLinks[n].classList.toggle("active", navLinks[n].getAttribute("data-page") === activeAdminPage);
    }
    if (!keepDrawerState) setNavOpen(false);
    window.scrollTo(0, 0);
  }

  function renderPorts(status) {
    var grid = qs("portsGrid");
    grid.innerHTML = "";
    status.ports.forEach(function (port) {
      var card = document.createElement("article");
      card.className = "port-card" + (port.enabled ? "" : " disabled");
      var active = port.active && port.remaining > 0;
      card.innerHTML =
        '<div class="port-head">' +
          '<div class="port-title">PORT ' + port.id + '</div>' +
          '<div class="status-pill ' + (active ? "active" : "") + '">' + (active ? "ACTIVE" : (port.enabled ? "READY" : "OFF")) + '</div>' +
        '</div>' +
        '<div class="timer-value">' + fmtTime(port.remaining) + '</div>' +
        '<div class="port-actions">' +
          '<button class="btn btn-red" type="button" data-start-port="' + port.id + '">START PORT ' + port.id + '</button>' +
          '<button class="btn btn-blue" type="button" data-add-port="' + port.id + '">ADD CREDIT</button>' +
        '</div>';
      var startBtn = card.querySelector("[data-start-port]");
      var addBtn = card.querySelector("[data-add-port]");
      startBtn.disabled = !port.enabled;
      addBtn.disabled = !port.enabled;
      grid.appendChild(card);
    });
  }

  function renderUserStatus(status) {
    qs("creditValue").textContent = fmtTime(status.creditSeconds);
    qs("coinValue").textContent = status.coinValueTotal || 0;
    qs("coinMeta").textContent = status.pendingCoinPulses > 0
      ? ("Reading " + status.pendingCoinPulses + " pulses...")
      : ("Last coin: " + (status.lastCoinValue ? ("PHP " + status.lastCoinValue) : "--"));
    qs("apLabel").textContent = (status.apSsid || "PISO_CHARGE_PRO") + " / " + (status.ip || "10.20.30.1");
    renderPorts(status);
  }

  function loadUserStatus() {
    return api("/api/status").then(function (status) {
      renderUserStatus(status);
      return status;
    }).catch(function () {
      setMsg("userMsg", "Status unavailable. Reconnect to PISO_CHARGE_PRO.", "error");
    });
  }

  function startPort(port) {
    setMsg("userMsg", "Starting Port " + port + "...", "");
    post("/api/start", {port: port}).then(function (status) {
      renderUserStatus(status);
      setMsg("userMsg", "Port " + port + " is running.", "ok");
    }).catch(function (err) {
      setMsg("userMsg", err.message || "Unable to start port.", "error");
      loadUserStatus();
    });
  }

  function addCreditToPort(port) {
    setMsg("userMsg", "Adding credit to Port " + port + "...", "");
    post("/api/add-credit-to-port", {port: port}).then(function (status) {
      renderUserStatus(status);
      setMsg("userMsg", "Credit added to Port " + port + ".", "ok");
    }).catch(function (err) {
      setMsg("userMsg", err.message || "Unable to add credit.", "error");
      loadUserStatus();
    });
  }

  function simulateCoin(value) {
    setSimMsg("Adding simulated PHP " + value + "...", "");
    post("/api/simulate-coin", {value: value}).then(function (status) {
      renderUserStatus(status);
      renderAdminStatus(status);
      setSimMsg("Simulated PHP " + value + " added to available credit.", "ok");
    }).catch(function (err) {
      setSimMsg(err.message || "Coin simulation failed.", "error");
    });
  }

  function addTestTime(port) {
    setSimMsg("Adding test time to Port " + port + "...", "");
    post("/api/add-test-time", {port: port, value: 1}).then(function (status) {
      renderUserStatus(status);
      renderAdminStatus(status);
      setSimMsg("Port " + port + " test time added. Relay should be ON.", "ok");
    }).catch(function (err) {
      setSimMsg(err.message || "Test time failed.", "error");
    });
  }

  function fillPinSelects() {
    ["relay1Pin", "relay2Pin", "relay3Pin", "coinPin"].forEach(function (id) {
      var select = qs(id);
      select.innerHTML = "";
      pinOptions.forEach(function (option) {
        var item = document.createElement("option");
        item.value = option[0];
        item.textContent = option[1];
        select.appendChild(item);
      });
    });
  }

  function renderAdminStatus(status) {
    qs("adminIp").textContent = status.ip || "10.20.30.1";
    qs("adminUptime").textContent = status.uptimeText || fmtTime(status.uptime);
    qs("adminCoins").textContent = "PHP " + (status.coinValueTotal || 0);
    qs("adminCredit").textContent = fmtTime(status.creditSeconds);
    qs("adminCoinPulses").textContent = status.coinPulses || 0;
    qs("adminLastCoin").textContent = status.pendingCoinPulses > 0
      ? ("Reading " + status.pendingCoinPulses + " pulses")
      : (status.lastCoinValue ? ("PHP " + status.lastCoinValue) : "--");
    qs("adminRelays").textContent = status.ports.map(function (p) {
      return "R" + p.id + ":" + (p.active ? "ON" : "OFF");
    }).join("  ");
    qs("adminTimers").textContent = status.ports.map(function (p) {
      return "P" + p.id + " " + fmtTime(p.remaining);
    }).join("  ");
  }

  function loadAdminStatus() {
    return api("/api/status").then(renderAdminStatus).catch(function () {});
  }

  function populateSettings(data) {
    qs("apSsid").value = data.apSsid || "PISO_CHARGE_PRO";
    qs("apPassword").value = "";
    qs("secondsPerCoin").value = data.secondsPerCoin || 300;
    qs("relayActiveMode").value = data.relayActiveMode || "HIGH";
    qs("relay1Pin").value = data.relay1Pin || "D1";
    qs("relay2Pin").value = data.relay2Pin || "D2";
    qs("relay3Pin").value = data.relay3Pin || "D5";
    qs("coinPin").value = data.coinPin || "D6";
    qs("port1Enabled").checked = data.port1Enabled !== false;
    qs("port2Enabled").checked = data.port2Enabled !== false;
    qs("port3Enabled").checked = data.port3Enabled !== false;
  }

  function loadAdmin() {
    showOnly("adminDashboard");
    showAdminPage(activeAdminPage, true);
    fillPinSelects();
    api("/admin/api/settings").then(function (data) {
      populateSettings(data);
      loadAdminStatus();
      if (adminTimer) clearInterval(adminTimer);
      adminTimer = setInterval(loadAdminStatus, 2500);
    }).catch(function () {
      showOnly("adminLogin");
    });
  }

  function uniquePins(data) {
    var pins = [data.relay1Pin, data.relay2Pin, data.relay3Pin, data.coinPin];
    return pins.filter(function (pin, index) {
      return pins.indexOf(pin) === index;
    }).length === pins.length;
  }

  function saveSettings(event) {
    event.preventDefault();
    var data = {
      apSsid: qs("apSsid").value.trim(),
      apPassword: qs("apPassword").value,
      secondsPerCoin: qs("secondsPerCoin").value,
      relayActiveMode: qs("relayActiveMode").value,
      relay1Pin: qs("relay1Pin").value,
      relay2Pin: qs("relay2Pin").value,
      relay3Pin: qs("relay3Pin").value,
      coinPin: qs("coinPin").value,
      port1Enabled: qs("port1Enabled").checked ? "1" : "0",
      port2Enabled: qs("port2Enabled").checked ? "1" : "0",
      port3Enabled: qs("port3Enabled").checked ? "1" : "0"
    };

    if (!data.apSsid) {
      setMsg("settingsMsg", "AP SSID is required.", "error");
      return;
    }
    if (data.apPassword && data.apPassword.length < 8) {
      setMsg("settingsMsg", "AP password needs at least 8 characters.", "error");
      return;
    }
    if (!uniquePins(data)) {
      setMsg("settingsMsg", "Relay and coin pins must be unique.", "error");
      return;
    }

    setMsg("settingsMsg", "Saving settings...", "");
    post("/admin/api/save-settings", data).then(function () {
      setMsg("settingsMsg", "Saved. ESP8266 is rebooting.", "ok");
    }).catch(function (err) {
      setMsg("settingsMsg", err.message || "Save failed.", "error");
    });
  }

  function bootUser() {
    showOnly("userPortal");
    loadUserStatus();
    if (userTimer) clearInterval(userTimer);
    userTimer = setInterval(loadUserStatus, 2000);
  }

  function bootAdmin() {
    showOnly("adminLogin");
    loadAdmin();
  }

  document.addEventListener("click", function (event) {
    var start = actionValue(event.target, "data-start-port");
    var add = actionValue(event.target, "data-add-port");
    var test = actionValue(event.target, "data-test-relay");
    var simCoin = actionValue(event.target, "data-sim-coin");
    var testTime = actionValue(event.target, "data-test-time-port");
    if (start) startPort(start);
    if (add) addCreditToPort(add);
    if (simCoin) simulateCoin(simCoin);
    if (testTime) addTestTime(testTime);
    if (test) {
      setMsg("testMsg", "Testing Relay " + test + "...", "");
      post("/admin/api/test-relay", {relay: test}).then(function (status) {
        renderAdminStatus(status);
        setMsg("testMsg", "Relay " + test + " tested.", "ok");
      }).catch(function (err) {
        setMsg("testMsg", err.message || "Relay test failed.", "error");
      });
    }
  });

  qs("refreshBtn").addEventListener("click", function () {
    setMsg("userMsg", "Refreshing...", "");
    loadUserStatus().then(function () {
      setMsg("userMsg", "", "");
    });
  });

  qs("adminRefreshBtn").addEventListener("click", loadAdminStatus);

  qs("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    setMsg("loginMsg", "Checking login...", "");
    post("/admin/api/login", {
      username: qs("username").value,
      password: qs("password").value
    }).then(function () {
      history.replaceState(null, "", "/admin");
      setMsg("loginMsg", "", "");
      loadAdmin();
    }).catch(function (err) {
      setMsg("loginMsg", err.message || "Login failed.", "error");
    });
  });

  qs("settingsForm").addEventListener("submit", saveSettings);

  qs("resetBtn").addEventListener("click", function () {
    if (!confirm("Reset PISO CHARGE PRO settings?")) return;
    setMsg("settingsMsg", "Resetting defaults...", "");
    post("/admin/api/reset-settings", {}).then(function () {
      setMsg("settingsMsg", "Defaults restored. ESP8266 is rebooting.", "ok");
    }).catch(function (err) {
      setMsg("settingsMsg", err.message || "Reset failed.", "error");
    });
  });

  qs("logoutBtn").addEventListener("click", function () {
    post("/admin/api/logout", {}).finally(function () {
      history.replaceState(null, "", "/admin/login");
      showOnly("adminLogin");
    });
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

  if (location.pathname.indexOf("/admin") === 0) {
    bootAdmin();
  } else {
    bootUser();
  }
})();
