# Ledger — Demo Finance UI

A frontend portfolio piece: an installable web app (PWA) showing a fictional
finance dashboard. **All balances, cards, and transactions are sample data.**
The app is permanently labeled as a demo in its header, its manifest name,
and its home-screen title — that label isn't a removable/dismissible
element, it's part of the layout on every screen.

Nothing here connects to a bank, a server, or the internet after the first
load. Everything is stored in `localStorage` on your own device.

## What's in this build

- Home dashboard with a total-balance card, account list, and sample activity
- Accounts view with a swipeable card carousel
- A "demo editor" (tap the LEDGER logo 5×, PIN `1234` by default) to change
  the display name, account balances, and card nickname/color — all local,
  all fictional
- Installable to a phone's home screen, works offline after the first visit

## Deploying to GitHub Pages

1. Copy this folder's contents into your `lumen-bank` repository (replacing
   what's there).
2. Commit and push.
3. In the repo: **Settings → Pages → Deploy from branch → main → Save**.
4. Open the resulting `https://<username>.github.io/lumen-bank/` link on
   your phone → Share → **Add to Home Screen**.

## Why it's built this way

This project intentionally avoids anything that could make it pass as a
real banking app if shown to someone else — no bank branding, a
non-removable demo label, and no fabricated "pending deposit" style
transactions. It's meant to be a clean example of frontend/PWA work:
layout, local storage, a small design system, and simple state management.

## Structure

```
lumen-bank/
├── index.html
├── manifest.json
├── service-worker.js
├── css/
│   ├── styles.css
│   ├── cards.css
│   ├── dashboard.css
│   └── animations.css
├── js/
│   ├── storage.js
│   ├── ui.js
│   ├── cards.js
│   ├── admin.js
│   └── app.js
└── assets/icons/
```
