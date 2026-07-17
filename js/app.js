/* ==========================================================
   app.js
   Boots the app: loads state, renders every view, and wires
   up navigation. Admin.js and cards.js read state through the
   small App.getState()/App.persist() interface below.
   ========================================================== */

const App = (() => {
  let state = null;

  function getState() { return state; }
  function setState(next) { state = next; }
  function persist(next) {
    state = next;
    Storage.save(state);
  }

  function greetingForNow() {
    const h = new Date().getHours();
    if (h < 5) return "Still up";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }

  function totalBalance() {
    return state.accounts.reduce((sum, a) => sum + a.balance, 0);
  }

  function renderGreeting() {
    document.getElementById("greeting").textContent =
      `${greetingForNow()}, ${state.profile.name}`;
  }

  function renderBalance() {
    const el = document.getElementById("totalBalance");
    const value = Storage.currency(totalBalance());
    el.innerHTML = value.split("").map((ch) => `<span>${ch}</span>`).join("");
    el.classList.remove("is-rolling");
    // restart animation
    void el.offsetWidth;
    el.classList.add("is-rolling");

    const primary = state.accounts[0];
    if (primary) {
      document.getElementById("primaryAccountLabel").textContent =
        `Primary — ${primary.name}`;
    }
  }

  function renderHomeAccounts() {
    const wrap = document.getElementById("homeAccountList");
    wrap.innerHTML = state.accounts.map((a) => Cards.accountRow(a, false)).join("");
  }

  function renderHomeTx() {
    const wrap = document.getElementById("homeTxList");
    wrap.innerHTML = state.transactions.slice(0, 6).map(Cards.txRow).join("");
  }

  function renderAccountsView() {
    const carousel = document.getElementById("cardCarousel");
    carousel.innerHTML = state.accounts
      .map((a) => Cards.payCard(state.card, a))
      .join("");

    const list = document.getElementById("accountsFullList");
    list.innerHTML = state.accounts.map((a) => Cards.accountRow(a, true)).join("");
  }

  function renderAll() {
    renderGreeting();
    renderBalance();
    renderHomeAccounts();
    renderHomeTx();
    renderAccountsView();
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch((err) => {
          console.warn("Ledger: service worker registration failed.", err);
        });
      });
    }
  }

  function init() {
    state = Storage.load();
    UI.initTabs();
    Admin.init();
    renderAll();
    registerServiceWorker();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { getState, setState, persist, renderAll };
})();
