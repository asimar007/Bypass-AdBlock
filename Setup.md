# Setup Guide

This guide is for developers who want to build, modify, or contribute to the extension.

---

## Prerequisites

| Tool | Version | Install |
| --- | --- | --- |
| [Bun](https://bun.sh) | 1.0 or later | `curl -fsSL https://bun.sh/install \| bash` |
| [Node.js](https://nodejs.org) | 18 or later | Only needed if not using Bun |
| Chrome | Any recent version | — |

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/download-bypass.git
cd download-bypass
```

---

## 2. Install Dependencies

```bash
bun install
```

This also runs `wxt prepare` automatically (via `postinstall`) which generates the `.wxt/` type files.

---

## 3. Development Mode

```bash
bun run dev
```

WXT starts a dev server and rebuilds on every file save. The output goes to `.output/chrome-mv3/`.

**Load the extension in Chrome:**

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `.output/chrome-mv3/` folder

Chrome will auto-reload the extension whenever WXT rebuilds.

---

## 4. Build for Production

```bash
bun run build
```

Output: `.output/chrome-mv3/`

---

## 5. Create a Zip for Distribution

```bash
bun run zip
```

Output: `.output/bypass-adblock-1.0.0-chrome.zip`

This zip is what users install — see [Installation.md](Installation.md).

---

## 6. Type Check

```bash
bun run compile
```

Runs `tsc --noEmit` to verify TypeScript without building.

---

## Project Scripts

| Script | Command | Description |
| --- | --- | --- |
| Dev mode | `bun run dev` | Build + watch for changes |
| Build | `bun run build` | Production build |
| Zip | `bun run zip` | Create distributable zip |
| Type check | `bun run compile` | TypeScript check only |
| Firefox dev | `bun run dev:firefox` | Dev mode for Firefox |
| Firefox build | `bun run build:firefox` | Build for Firefox |
| Firefox zip | `bun run zip:firefox` | Zip for Firefox |

---

## Key Files to Edit

| File | What it does |
| --- | --- |
| `entrypoints/content.ts` | Core bypass logic — overlays, link reveal, script scan |
| `entrypoints/popup/App.tsx` | Popup UI — per-site toggle and bypass button |
| `wxt.config.ts` | Extension name, version, permissions |

---

## Adding Support for a New Site

**If the site has a known overlay class:**

Open `entrypoints/content.ts` and add the class to `OVERLAY_SELECTORS`:

```typescript
const OVERLAY_SELECTORS = [
  ".warn-box",
  ".your-new-selector", // add here
  ...
];
```

**If the overlay has unique text:**

Add a keyword to `OVERLAY_KEYWORDS` (partial match, case-insensitive):

```typescript
const OVERLAY_KEYWORDS = [
  "adblock",
  "your keyword", // add here
  ...
];
```

To find the right selector: open DevTools (`F12`) on the blocking site, right-click the overlay, and select **Inspect**.
