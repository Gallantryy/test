/* ==========================================================
   admin.js
   Lets the person edit the demo data on their own device:
   name, per-account balances, and card nickname/color.
   Gated behind a locally-stored PIN (default 1234) purely as
   a "secret settings" affordance for the demo, not real security.
   ========================================================== */

const Admin = (() => {
  let tapCount = 0;
  let tapTimer = null;
  let pinBuffer = "";
  let mode = "auth"; // auth | setPin1 | setPin2
  let pendingNewPin = "";
  let selectedColor = "indigo";

  function init() {
    document.getElementById("logoTap").addEventListener("click", registerTap);
    document.getElementById("openAdminFromSettings").addEventListener("click", openAdmin);
    document.getElementById("resetDataBtn").addEventListener("click", handleReset);

    document.getElementById("adminScrim").addEventListener("click", closeAdmin);
    document.getElementById("cancelPin").addEventListener("click", closeAdmin);
    document.getElementById("closeEdit").addEventListener("click", closeAdmin);
    document.getElementById("pinPad").addEventListener("click", handlePinPad);
    document.getElementById("saveEdits").addEventListener("click", saveEdits);
    document.getElementById("changePinBtn").addEventListener("click", startChangePin);

    document.getElementById("colorSwatches").addEventListener("click", (e) => {
      const btn = e.target.closest(".swatch");
      if (!btn) return;
      selectedColor = btn.dataset.color;
      highlightSwatch();
    });
  }

  function registerTap() {
    tapCount += 1;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => (tapCount = 0), 1500);
    if (tapCount >= 5) {
      tapCount = 0;
      openAdmin();
    }
  }

  function openAdmin() {
    mode = "auth";
    pinBuffer = "";
    updatePinDots();
    document.getElementById("adminOverlay").hidden = false;
    document.getElementById("pinSheet").hidden = false;
    document.getElementById("editSheet").hidden = true;
    document.querySelector("#pinSheet .sheet__title").textContent = "Enter PIN";
    document.querySelector("#pinSheet .sheet__desc").innerHTML =
      "Default PIN is <strong>1234</strong>. This only unlocks editing of the sample data on this device.";
  }

  function closeAdmin() {
    document.getElementById("adminOverlay").hidden = true;
    mode = "auth";
    pinBuffer = "";
    pendingNewPin = "";
  }

  function handlePinPad(e) {
    const btn = e.target.closest("button[data-key]");
    if (!btn) return;
    const key = btn.dataset.key;

    if (key === "back") {
      pinBuffer = pinBuffer.slice(0, -1);
      updatePinDots();
      return;
    }
    if (pinBuffer.length >= 4) return;
    pinBuffer += key;
    updatePinDots();

    if (pinBuffer.length === 4) {
      setTimeout(() => submitPin(), 120);
    }
  }

  function updatePinDots() {
    const dots = document.querySelectorAll("#pinDots span");
    dots.forEach((d, i) => d.classList.toggle("filled", i < pinBuffer.length));
  }

  function submitPin() {
    const state = App.getState();

    if (mode === "auth") {
      if (pinBuffer === state.pin) {
        openEditSheet(state);
      } else {
        UI.toast("Incorrect PIN — try 1234");
        pinBuffer = "";
        updatePinDots();
      }
      return;
    }

    if (mode === "setPin1") {
      pendingNewPin = pinBuffer;
      pinBuffer = "";
      updatePinDots();
      mode = "setPin2";
      document.querySelector("#pinSheet .sheet__title").textContent = "Confirm new PIN";
      document.querySelector("#pinSheet .sheet__desc").textContent = "Enter it once more to confirm.";
      return;
    }

    if (mode === "setPin2") {
      if (pinBuffer === pendingNewPin) {
        const s = App.getState();
        s.pin = pendingNewPin;
        App.persist(s);
        UI.toast("PIN updated");
        openEditSheet(s);
      } else {
        UI.toast("PINs didn't match — try again");
        mode = "setPin1";
        pinBuffer = "";
        pendingNewPin = "";
        updatePinDots();
        document.querySelector("#pinSheet .sheet__title").textContent = "Set a new PIN";
        document.querySelector("#pinSheet .sheet__desc").textContent = "Choose 4 digits.";
      }
    }
  }

  function startChangePin() {
    mode = "setPin1";
    pinBuffer = "";
    pendingNewPin = "";
    document.getElementById("editSheet").hidden = true;
    document.getElementById("pinSheet").hidden = false;
    document.querySelector("#pinSheet .sheet__title").textContent = "Set a new PIN";
    document.querySelector("#pinSheet .sheet__desc").textContent = "Choose 4 digits.";
    updatePinDots();
  }

  function openEditSheet(state) {
    document.getElementById("pinSheet").hidden = true;
    document.getElementById("editSheet").hidden = false;

    document.getElementById("editName").value = state.profile.name;
    document.getElementById("editCardNickname").value = state.card.nickname;
    selectedColor = state.card.color;
    highlightSwatch();

    const wrap = document.getElementById("accountEditFields");
    wrap.innerHTML = state.accounts.map((acc) => `
      <label class="field">
        <span class="field__label">${escapeHtml(acc.name)} (${acc.type}) balance</span>
        <input type="number" step="0.01" inputmode="decimal" data-account-id="${acc.id}" class="account-balance-input" value="${acc.balance}">
      </label>
    `).join("");
  }

  function highlightSwatch() {
    document.querySelectorAll(".swatch").forEach((s) => {
      s.classList.toggle("is-selected", s.dataset.color === selectedColor);
    });
  }

  function saveEdits() {
    const state = App.getState();
    state.profile.name = document.getElementById("editName").value.trim() || state.profile.name;
    state.card.nickname = document.getElementById("editCardNickname").value.trim() || state.card.nickname;
    state.card.color = selectedColor;

    document.querySelectorAll(".account-balance-input").forEach((input) => {
      const id = input.dataset.accountId;
      const val = parseFloat(input.value);
      const acc = state.accounts.find((a) => a.id === id);
      if (acc && !Number.isNaN(val)) acc.balance = val;
    });

    App.persist(state);
    App.renderAll();
    UI.toast("Demo data saved");
    closeAdmin();
  }

  function handleReset() {
    if (!confirm("Reset all demo data back to the original sample values?")) return;
    const fresh = Storage.reset();
    App.setState(fresh);
    App.renderAll();
    UI.toast("Demo data reset");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  return { init };
})();
