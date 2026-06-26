export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  main() {
    // ---- Override adblock detection + patch pushState for SPA nav detection ----
    const injectOverride = () => {
      const script = document.createElement("script");
      script.textContent = `
        window.canRunAds = true;
        window.adblockEnabled = false;
        window.hasAdblock = false;
        (function() {
          const orig = history.pushState.bind(history);
          history.pushState = function(...args) {
            orig(...args);
            window.dispatchEvent(new Event('pushstate'));
          };
        })();
      `;
      document.documentElement.appendChild(script);
      script.remove();
    };

    // ---- Remove blocking overlays ----
    const OVERLAY_PHRASES = [
      "Download Links Disabled",
      "AdBlock चालू होने पर",
      "Please support our website by disabling AdBlock",
    ];
    const OVERLAY_SELECTORS = [
      ".warn-box",
      ".adblock-warning",
      ".adblock-detected",
      ".ad-blocker-detected",
      ".adblock-overlay",
      "#adblock-warning",
      "#adblock-overlay",
    ];
    const CONTAINER_HINTS = ["warn", "overlay", "modal", "adblock", "block", "popup"];

    const matchesOverlay = (text: string) => OVERLAY_PHRASES.some((p) => text.includes(p));

    const removeOverlays = () => {
      OVERLAY_SELECTORS.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      const nodesToRemove: Element[] = [];
      while (walker.nextNode()) {
        const el = walker.currentNode as Element;
        const text = el.textContent || "";
        if (!matchesOverlay(text)) continue;

        const childMatches = Array.from(el.children).some((c) =>
          matchesOverlay(c.textContent || ""),
        );
        if (childMatches) continue;

        let target: Element = el;
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          const cls = (parent.className || "").toString().toLowerCase();
          const id = (parent.id || "").toLowerCase();
          if (CONTAINER_HINTS.some((h) => cls.includes(h) || id.includes(h))) {
            target = parent;
            break;
          }
          parent = parent.parentElement;
        }

        if (!nodesToRemove.includes(target)) nodesToRemove.push(target);
      }
      nodesToRemove.forEach((el) => el.remove());
    };

    // ---- Reveal hidden download links ----
    const revealLinks = () => {
      document.querySelectorAll("a").forEach((link) => {
        const href = link.getAttribute("href") || "";
        const dataHref = link.getAttribute("data-href") || "";
        const dataUrl = link.getAttribute("data-url") || "";
        const isDownload =
          href.includes("download") ||
          dataHref.includes("download") ||
          link.textContent?.toLowerCase().includes("download");
        if (isDownload) {
          link.style.display = "";
          link.style.visibility = "";
          link.style.opacity = "1";
          link.removeAttribute("disabled");
          if (dataHref && !href) link.setAttribute("href", dataHref);
          if (dataUrl && !href) link.setAttribute("href", dataUrl);
        }
      });
    };

    // ---- Run all bypass steps ----
    const runAll = () => {
      injectOverride();
      removeOverlays();
      revealLinks();
    };

    // ---- Mutation observer (reconnect/disconnect based on enabled state) ----
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
      removeOverlays();
      revealLinks();

      // Detect SPA navigation (URL changed without a full page reload)
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        runAll();
      }
    });

    // Also catch history.pushState / popstate navigation
    const onUrlChange = () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        runAll();
      }
    };
    window.addEventListener("popstate", onUrlChange);
    window.addEventListener("pushstate", onUrlChange);

    const startObserver = () => {
      const observe = () =>
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      if (document.body) observe();
      else document.addEventListener("DOMContentLoaded", observe, { once: true });
    };

    // ---- Per-site enable check ----
    const currentHost = location.hostname.replace(/^www\./, "");

    const isSiteEnabled = (sites: string[]) => sites.includes(currentHost);

    const boot = (sites: string[]) => {
      if (!isSiteEnabled(sites)) return;
      if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", runAll, { once: true });
      else runAll();
      startObserver();
    };

    chrome.storage.local.get("sites", (data) => boot((data.sites as string[]) || []));

    // ---- React to per-site toggle without needing a page reload ----
    chrome.storage.onChanged.addListener((changes) => {
      if (!("sites" in changes)) return;
      const newSites: string[] = (changes.sites.newValue as string[]) || [];
      const oldSites: string[] = (changes.sites.oldValue as string[]) || [];
      if (!isSiteEnabled(oldSites) && isSiteEnabled(newSites)) {
        runAll();
        startObserver();
      } else if (isSiteEnabled(oldSites) && !isSiteEnabled(newSites)) {
        observer.disconnect();
      }
    });

    // ---- Manual trigger from popup ----
    chrome.runtime.onMessage.addListener((msg: { action: string }) => {
      if (msg.action === "bypass_all") {
        runAll();
        const notif = document.createElement("div");
        notif.textContent = "✓ Bypass applied";
        notif.style.cssText =
          "position:fixed;top:16px;right:16px;background:#4caf50;color:white;padding:8px 16px;border-radius:8px;z-index:10000;font-family:sans-serif;font-size:14px;";
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
      }
    });
  },
});
