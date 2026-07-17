/* ==========================================================
   storage.js
   All state lives in localStorage under one key. Nothing here
   ever talks to a network — this is a self-contained demo.
   ========================================================== */

const Storage = (() => {
  const KEY = "ledgerDemoState.v1";

  const DEFAULT_STATE = {
    profile: { name: "Alex" },
    pin: "1234",
    card: { nickname: "Everyday Card", color: "indigo" },
    accounts: [
      { id: "checking", name: "Everyday", type: "Checking", mask: "4821", balance: 2374.83 },
      { id: "savings", name: "Save Goal", type: "Savings", mask: "7731", balance: 640.00 },
      { id: "credit", name: "Sample Credit", type: "Credit", mask: "9012", balance: 0.00 }
    ],
    transactions: [
      { id: "t1", name: "Demo Payroll", category: "Income", date: "Jul 15", amount: 640.00, icon: "💼" },
      { id: "t2", name: "Corner Market", category: "Groceries", date: "Jul 15", amount: -38.42, icon: "🛒" },
      { id: "t3", name: "Fuel Stop", category: "Transport", date: "Jul 14", amount: -41.10, icon: "⛽" },
      { id: "t4", name: "Coffee Bar", category: "Dining", date: "Jul 13", amount: -6.25, icon: "☕" },
      { id: "t5", name: "Streaming Sub", category: "Subscriptions", date: "Jul 12", amount: -12.99, icon: "🎬" },
      { id: "t6", name: "Bookstore", category: "Shopping", date: "Jul 10", amount: -22.50, icon: "📚" }
    ]
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      // shallow-merge to survive schema additions between versions
      return Object.assign(structuredClone(DEFAULT_STATE), parsed);
    } catch (e) {
      console.warn("Ledger: could not read saved demo data, using defaults.", e);
      return structuredClone(DEFAULT_STATE);
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn("Ledger: could not save demo data.", e);
      return false;
    }
  }

  function reset() {
    localStorage.removeItem(KEY);
    return structuredClone(DEFAULT_STATE);
  }

  function currency(n) {
    const sign = n < 0 ? "-" : "";
    return sign + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return { load, save, reset, currency, DEFAULT_STATE };
})();
