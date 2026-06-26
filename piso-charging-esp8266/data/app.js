(function () {
  var pinOptions = [
    ["D1", "D1 / GPIO5"],
    ["D2", "D2 / GPIO4"],
    ["D3", "D3 / GPIO0"],
    ["D5", "D5 / GPIO14"],
    ["D6", "D6 / GPIO12"],
    ["D7", "D7 / GPIO13"]
  ];
  var userTimer = null;
  var adminTimer = null;
  var activeAdminPage = "statusPage";
  var paymentModalOpen = false;
  var selectedPaymentPort = 0;

  function qs(id) {
    return document.getElementById(id);
  }

  function setMsg(id, text, type) {
    var el = qs(id);
    if (!el) return;
    el.textContent = text || "";
    el.className = "message" + (type ? " " + type : "");
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

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function fmtTime(total) {
    total = Math.max(0, parseInt(total || 0, 10));
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    if (h > 0) return h + ":" + pad(m) + ":" + pad(s);
    return pad(m) + ":" + pad(s);
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

  function setPaymentModalOpen(open) {
    paymentModalOpen = !!open;
    qs("paymentModal").classList.toggle("hidden", !paymentModalOpen);
    document.body.classList.toggle("modal-open", paymentModalOpen);
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
    var ports = status && status.ports && status.ports.length ? status.ports : [
      {id: 1, enabled: true, active: false, remaining: 0},
      {id: 2, enabled: true, active: false, remaining: 0},
      {id: 3, enabled: true, active: false, remaining: 0}
    ];
    grid.innerHTML = "";
    var ownedPayment = status && status.paymentActive && status.paymentOwnedByClient !== false;
    ports.forEach(function (port) {
      var active = port.active && port.remaining > 0;
      var paying = status && status.paymentActive && status.paymentPort === port.id;
      var paymentLocked = status && status.paymentActive && !ownedPayment;
      var portLocked = port.lockedForClient === true;
      var busy = status && status.paymentActive && (!paying || !ownedPayment);
      var disabled = !port.enabled || paymentLocked || portLocked || busy;
      var pillClass = paying && ownedPayment ? "paying" : (active && !portLocked ? "active" : (paymentLocked || portLocked || busy ? "locked" : ""));
      var pillText = paying && ownedPayment
        ? "PAYING"
        : (active && !portLocked ? "CHARGING" : (paymentLocked || portLocked || busy ? "IN USE" : (port.enabled ? "READY" : "OFF")));
      var buttonText = paying && ownedPayment
        ? "VIEW PAYMENT"
        : (active && port.ownedByClient ? "ADD TIME" : (paymentLocked || portLocked || busy ? "IN USE" : "INSERT COIN"));
      var card = document.createElement("article");
      card.className = "port-card" + (port.enabled ? "" : " disabled") + (paying && ownedPayment ? " paying" : "") + (paymentLocked || portLocked || busy ? " locked" : "");
      card.innerHTML =
        '<div class="port-head">' +
          '<div class="port-title">PORT ' + port.id + '</div>' +
          '<div class="status-pill ' + pillClass + '">' + pillText + '</div>' +
        '</div>' +
        '<div class="timer-value">' + fmtTime(port.remaining) + '</div>' +
        '<button class="btn btn-red" type="button" data-pay-port="' + port.id + '">' +
          buttonText +
        '</button>';
      card.querySelector("[data-pay-port]").disabled = disabled;
      grid.appendChild(card);
    });
  }

  function renderPaymentModal(status) {
    status = status || {};
    var ownedPayment = status.paymentActive && status.paymentOwnedByClient !== false;
    if (ownedPayment) {
      selectedPaymentPort = status.paymentPort;
      setPaymentModalOpen(true);
    } else if (paymentModalOpen) {
      selectedPaymentPort = 0;
      setPaymentModalOpen(false);
      return;
    }

    if (!paymentModalOpen) return;
    var coinText = status.paymentCoinValue || 0;
    qs("modalPortLabel").textContent = "PORT " + (status.paymentPort || selectedPaymentPort || "-");
    qs("modalCoinAmount").textContent = "PHP " + coinText;
    qs("modalTimeAmount").textContent = fmtTime(status.paymentSeconds);
    qs("modalPulseMeta").textContent = status.pendingCoinPulses > 0
      ? ("Reading " + status.pendingCoinPulses + " pulses...")
      : (status.lastCoinValue ? ("Last coin: PHP " + status.lastCoinValue) : "Last coin: --");
    qs("donePayingBtn").disabled = !status.paymentActive || status.paymentSeconds <= 0;
    qs("cancelPaymentBtn").disabled = status.paymentSeconds > 0;
  }

  function renderUserStatus(status) {
    status = status || {};
    renderPorts(status);
    renderPaymentModal(status);
  }

  function loadUserStatus() {
    return api("/api/status").then(function (status) {
      renderUserStatus(status);
      return status;
    }).catch(function () {
      renderPorts(null);
      setMsg("userMsg", "Status unavailable. Reconnect to PISO_CHARGE_PRO.", "error");
    });
  }

  function beginPayment(port) {
    selectedPaymentPort = parseInt(port, 10);
    setMsg("userMsg", "Opening Port " + port + " payment...", "");
    post("/api/payment-begin", {port: port}).then(function (status) {
      renderUserStatus(status);
      setMsg("paymentMsg", "", "");
      setMsg("userMsg", "", "");
    }).catch(function (err) {
      setMsg("userMsg", err.message || "Unable to open payment.", "error");
      loadUserStatus();
    });
  }

  function finishPayment() {
    var port = selectedPaymentPort || 0;
    setMsg("paymentMsg", "Starting Port " + port + "...", "");
    post("/api/payment-finish", {port: port}).then(function (status) {
      setPaymentModalOpen(false);
      renderUserStatus(status);
      setMsg("userMsg", "Port " + port + " is charging.", "ok");
      setMsg("paymentMsg", "", "");
    }).catch(function (err) {
      setMsg("paymentMsg", err.message || "Unable to start charging.", "error");
      loadUserStatus();
    });
  }

  function cancelPayment() {
    post("/api/payment-cancel", {}).then(function (status) {
      setPaymentModalOpen(false);
      selectedPaymentPort = 0;
      renderUserStatus(status);
      setMsg("paymentMsg", "", "");
      setMsg("userMsg", "", "");
    }).catch(function (err) {
      setMsg("paymentMsg", err.message || "Unable to close payment.", "error");
      loadUserStatus();
    });
  }

  function fillPinSelects() {
    ["relay1Pin", "relay2Pin", "relay3Pin", "allanRelayPin", "coinPin"].forEach(function (id) {
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
    status = status || {};
    var ports = status.ports && status.ports.length ? status.ports : [
      {id: 1, active: false, remaining: 0},
      {id: 2, active: false, remaining: 0},
      {id: 3, active: false, remaining: 0}
    ];
    qs("adminIp").textContent = status.ip || "10.20.30.1";
    qs("adminUptime").textContent = status.uptimeText || fmtTime(status.uptime);
    qs("adminCoins").textContent = "PHP " + (status.coinValueTotal || 0);
    qs("salesDay").textContent = "PHP " + (status.salesDay || 0);
    qs("salesWeek").textContent = "PHP " + (status.salesWeek || 0);
    qs("salesMonth").textContent = "PHP " + (status.salesMonth || 0);
    qs("salesYear").textContent = "PHP " + (status.salesYear || 0);
    qs("adminCredit").textContent = status.paymentActive
      ? ("P" + status.paymentPort + " PHP " + (status.paymentCoinValue || 0))
      : (status.unassignedCoinValue ? ("PHP " + status.unassignedCoinValue) : "00:00");
    qs("adminCoinPulses").textContent = status.coinPulses || 0;
    qs("adminCoinInput").textContent = (status.coinPin || "D6") + (status.coinInputHigh === false ? " LOW" : " HIGH");
    qs("adminAllanRelay").textContent = (status.allanRelayPin || "D5") + " " + (status.allanRelayActive ? "ON" : "OFF");
    qs("adminPaymentLock").textContent = status.paymentActive
      ? ("P" + status.paymentPort + " " + (status.paymentOwnerIp || "locked"))
      : "--";
    qs("adminLastCoin").textContent = status.pendingCoinPulses > 0
      ? ("Reading " + status.pendingCoinPulses + " pulses")
      : (status.lastCoinValue ? ("PHP " + status.lastCoinValue) : "--");
    qs("adminRelays").textContent = ports.map(function (p) {
      return "R" + p.id + ":" + (p.active ? "ON" : "OFF");
    }).join("  ");
    qs("adminTimers").textContent = ports.map(function (p) {
      return "P" + p.id + " " + fmtTime(p.remaining);
    }).join("  ");
  }

  function loadAdminStatus() {
    return api("/api/status").then(renderAdminStatus).catch(function () {});
  }

  function populateSettings(data) {
    qs("apSsid").value = data.apSsid || "PISO_CHARGE_PRO";
    qs("apPassword").value = "";
    qs("adminUsername").value = data.adminUsername || "admin";
    qs("adminPassword").value = "";
    qs("secondsPerCoin").value = data.secondsPerCoin || 300;
    updateRatePreview();
    qs("relayActiveMode").value = data.relayActiveMode || "LOW";
    qs("relay1Pin").value = data.relay1Pin || "D1";
    qs("relay2Pin").value = data.relay2Pin || "D2";
    qs("relay3Pin").value = data.relay3Pin || "D3";
    qs("allanRelayPin").value = data.allanRelayPin || "D5";
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
    var pins = [data.relay1Pin, data.relay2Pin, data.relay3Pin, data.allanRelayPin, data.coinPin];
    return pins.filter(function (pin, index) {
      return pins.indexOf(pin) === index;
    }).length === pins.length;
  }

  function saveSettings(event) {
    event.preventDefault();
    var data = {
      apSsid: qs("apSsid").value.trim(),
      apPassword: qs("apPassword").value,
      adminUsername: qs("adminUsername").value.trim(),
      adminPassword: qs("adminPassword").value,
      secondsPerCoin: qs("secondsPerCoin").value,
      relayActiveMode: qs("relayActiveMode").value,
      relay1Pin: qs("relay1Pin").value,
      relay2Pin: qs("relay2Pin").value,
      relay3Pin: qs("relay3Pin").value,
      allanRelayPin: qs("allanRelayPin").value,
      coinPin: qs("coinPin").value,
      port1Enabled: qs("port1Enabled").checked ? "1" : "0",
      port2Enabled: qs("port2Enabled").checked ? "1" : "0",
      port3Enabled: qs("port3Enabled").checked ? "1" : "0"
    };

    if (!data.apSsid) {
      setMsg("settingsMsg", "AP SSID is required.", "error");
      return;
    }
    if (!data.adminUsername) {
      setMsg("settingsMsg", "Admin username is required.", "error");
      return;
    }
    if (data.apPassword && data.apPassword.length < 8) {
      setMsg("settingsMsg", "AP password needs at least 8 characters.", "error");
      return;
    }
    if (data.adminPassword && data.adminPassword.length < 4) {
      setMsg("settingsMsg", "Admin password needs at least 4 characters.", "error");
      return;
    }
    if (!uniquePins(data)) {
      setMsg("settingsMsg", "Relay, Allan timer, and coin pins must be unique.", "error");
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
    renderPorts(null);
    loadUserStatus();
    if (userTimer) clearInterval(userTimer);
    userTimer = setInterval(loadUserStatus, 1000);
  }

  function bootAdmin() {
    showOnly("adminLogin");
    loadAdmin();
  }

  function updateRatePreview() {
    var value = parseInt(qs("secondsPerCoin").value || "0", 10);
    qs("ratePreview").textContent = fmtTime(value);
  }

  document.addEventListener("click", function (event) {
    var payPort = actionValue(event.target, "data-pay-port");
    if (payPort) beginPayment(payPort);
  });

  qs("donePayingBtn").addEventListener("click", finishPayment);
  qs("cancelPaymentBtn").addEventListener("click", cancelPayment);
  qs("paymentBackdrop").addEventListener("click", cancelPayment);

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
  qs("secondsPerCoin").addEventListener("input", updateRatePreview);

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
