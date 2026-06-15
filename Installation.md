# Installation Guide

This extension is not on the Chrome Web Store. Follow the steps below to install it manually using a zip file.

---

## What You Need

- Google Chrome (any recent version)
- The extension zip file: `bypass-adblock-chrome.zip`

---

## Step 1 — Download the Zip

Download the latest `bypass-adblock-chrome.zip` from the [Releases](https://github.com/your-username/download-bypass/releases) page.

---

## Step 2 — Extract the Zip

Extract the zip file to a permanent folder on your computer.

> **Important:** Do not delete this folder after installing. Chrome loads the extension from it directly.

**Windows:**

```text
Right-click the zip → Extract All → Choose a folder → Extract
```

**Mac:**

```text
Double-click the zip → folder appears automatically
```

**Linux:**

```bash
unzip bypass-adblock-chrome.zip -d bypass-adblock
```

---

## Step 3 — Load in Chrome

1. Open Chrome and go to:

   ```text
   chrome://extensions
   ```

2. Enable **Developer mode** using the toggle in the top-right corner.

3. Click **Load unpacked**.

4. Select the extracted folder (the one containing `manifest.json`).

5. The extension appears in your toolbar.

---

## Step 4 — Pin the Extension (Optional)

1. Click the puzzle icon in the Chrome toolbar.
2. Find **Bypass AdBlock**.
3. Click the pin icon to keep it visible.

---

## How to Use

1. Go to any site that blocks downloads with an adblock wall (e.g. `movies4u.co.in`).
2. Click the **Bypass AdBlock** icon in the toolbar.
3. Toggle the switch **ON** for the current site.
4. The page bypass runs immediately — no refresh needed.
5. Next time you visit the same site, bypass runs automatically.

---

## Updating the Extension

When a new version is released:

1. Download the new zip.
2. Extract it and **replace** the contents of your existing folder.
3. Go to `chrome://extensions` and click the **reload icon** on the extension card.

---

## Uninstalling

1. Go to `chrome://extensions`.
2. Find **Bypass AdBlock**.
3. Click **Remove**.

You can now safely delete the extracted folder.

---

## Installing on Android (Kiwi Browser)

Chrome on Android does not support extensions. Use **Kiwi Browser** instead:

1. Install [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) from the Play Store.
2. Transfer the zip file to your Android device (Google Drive, WhatsApp, etc.).
3. Open Kiwi → tap the menu (`...`) → **Extensions**.
4. Enable **Developer mode**.
5. Tap **+ (from .zip / .crx / .user.js)** and select the zip file.

---

## Troubleshooting

**Extension icon not visible**

Click the puzzle icon in the toolbar and pin the extension.

**Bypass not working on a site**

Click the extension icon and tap **Bypass Now** to manually trigger it. If it still does not work, the site may use an overlay class or text not yet in the extension's detection list — open an issue on GitHub with the site URL.

**"Load unpacked" button not visible**

Make sure **Developer mode** is turned on at `chrome://extensions`.

**Extension disappears after Chrome update**

Chrome occasionally disables manually loaded extensions after major updates. Go to `chrome://extensions` and click **Enable** on the extension card.
