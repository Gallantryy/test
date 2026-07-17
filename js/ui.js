/* ==========================================================
   ui.js
   Small shared UI helpers: toasts + tab bar view switching.
   ========================================================== */

const UI = (() => {
  let toastTimer = null;

  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
  }

  function initTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const views = {
      home: document.getElementById("view-home"),
      accounts: document.getElementById("view-accounts"),
      settings: document.getElementById("view-settings")
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.view;
        buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
        Object.entries(views).forEach(([key, section]) => {
          if (!section) return;
          section.hidden = key !== target;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  return { toast, initTabs };
})();
