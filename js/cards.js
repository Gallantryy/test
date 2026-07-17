/* ==========================================================
   cards.js
   Turns state (accounts / card / transactions) into HTML for
   the home view, the accounts view, and the card carousel.
   ========================================================== */

const Cards = (() => {
  const ACCOUNT_ICON = { Checking: "🏦", Savings: "🌱", Credit: "💳" };

  function accountRow(acc, detailed) {
    const icon = ACCOUNT_ICON[acc.type] || "🏦";
    if (!detailed) {
      return `
        <div class="account-row" data-id="${acc.id}">
          <div class="account-row__icon">${icon}</div>
          <div class="account-row__body">
            <p class="account-row__name">${escapeHtml(acc.name)}</p>
            <p class="account-row__mask">•••• ${acc.mask}</p>
          </div>
          <div class="account-row__amount">${Storage.currency(acc.balance)}</div>
        </div>`;
    }
    return `
      <div class="account-row" data-id="${acc.id}">
        <div class="account-row__icon">${icon}</div>
        <div class="account-row__body">
          <p class="account-row__name">${escapeHtml(acc.name)}</p>
          <p class="account-row__mask">${acc.type} •••• ${acc.mask}</p>
        </div>
        <div class="account-row__balances">
          <span class="account-row__amount">${Storage.currency(acc.balance)}</span>
          <small>available</small>
        </div>
      </div>`;
  }

  function txRow(tx) {
    const positive = tx.amount > 0;
    return `
      <div class="tx-row">
        <div class="tx-row__icon">${tx.icon || "•"}</div>
        <div class="tx-row__body">
          <p class="tx-row__name">${escapeHtml(tx.name)}</p>
          <p class="tx-row__meta">${escapeHtml(tx.category)} · ${escapeHtml(tx.date)}</p>
        </div>
        <div class="tx-row__amount ${positive ? "is-positive" : ""}">${positive ? "+" : ""}${Storage.currency(tx.amount)}</div>
      </div>`;
  }

  function payCard(card, acc) {
    return `
      <div class="pay-card pay-card--${card.color}">
        <div class="pay-card__top">
          <div>
            <div class="pay-card__bank">LEDGER · DEMO</div>
          </div>
          <div class="pay-card__type">${acc ? acc.type.toUpperCase() : "CARD"}</div>
        </div>
        <div class="pay-card__number">•••• •••• •••• ${acc ? acc.mask : "0000"}</div>
        <div class="pay-card__bottom">
          <div>
            <div class="pay-card__label">Card nickname</div>
            <div class="pay-card__value">${escapeHtml(card.nickname)}</div>
          </div>
          <div>
            <div class="pay-card__label">Balance</div>
            <div class="pay-card__value">${acc ? Storage.currency(acc.balance) : "—"}</div>
          </div>
        </div>
      </div>`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  return { accountRow, txRow, payCard };
})();
