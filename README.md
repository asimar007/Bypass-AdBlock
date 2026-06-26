# Bypass AdBlock — Chrome Extension

A Chrome extension that automatically removes adblock detection walls and reveals hidden download links on sites you choose.

Not published on the Chrome Web Store. Install manually via zip — see [Installation.md](Installation.md).

---

## Features

- **Per-site control** — enable the extension only on sites you choose. It remembers your choices.
- **Auto bypass on every visit** — once a site is enabled, bypass runs automatically when you open it.
- **Removes adblock overlays** — detects and removes blocking walls by CSS selector, keyword match, and visual heuristics (works for any language).
- **Reveals hidden download links** — makes links visible that sites hide when adblock is detected.
- **SPA navigation aware** — re-runs bypass when URL changes without a full page reload (React Router, Vue Router, etc.).
- **Manual trigger** — "Bypass Now" button in the popup for sites that load overlays dynamically.

---

## How It Works

```text
Page loads
    │
    ├── content script runs at document_start
    │       ├── checks if this domain is in your saved sites list
    │       ├── if YES → override adblock flags + remove overlays + reveal links
    │       └── MutationObserver watches for overlays added dynamically
    │
    └── Click extension icon
            ├── toggle ON/OFF for current site (saved permanently)
            └── "Bypass Now" → manually re-triggers all bypass steps
```

## Tech Stack

| Tool                   | Purpose                          |
| ---------------------- | -------------------------------- |
| [WXT](https://wxt.dev) | Chrome extension framework       |
| React 19               | Popup UI                         |
| TypeScript             | Type safety                      |
| Bun                    | Package manager and build runner |

---

## Permissions

| Permission                     | Why                                                  |
| ------------------------------ | ---------------------------------------------------- |
| `activeTab`                    | Read current tab URL to show the right site in popup |
| `storage`                      | Save the list of enabled sites                       |
| `scripting`                    | Inject bypass logic into pages                       |
| `host_permissions: <all_urls>` | Run content script on all sites                      |

---

## Links

- [Setup Guide](Setup.md) — for developers who want to build or modify the extension
- [Installation Guide](Installation.md) — install the extension via zip file
- [GitHub Repository](https://github.com/asimar007/Bypass-AdBlock)
- [Releases](https://github.com/asimar007/Bypass-AdBlock/releases)
