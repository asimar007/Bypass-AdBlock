import React, { useState, useEffect } from "react";

const normalize = (host: string) => host.replace(/^www\./, "");

const App: React.FC = () => {
  const [currentHost, setCurrentHost] = useState("");
  const [sites, setSites] = useState<string[]>([]);
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      try {
        const host = normalize(new URL(tabs[0]?.url || "").hostname);
        setCurrentHost(host);
      } catch {}
    });
    chrome.storage.local.get("sites", (data) => {
      setSites((data.sites as string[]) || []);
    });
  }, []);

  const isEnabled = !!currentHost && sites.includes(currentHost);

  const toggleSite = () => {
    const next = isEnabled
      ? sites.filter((s) => s !== currentHost)
      : [...sites, currentHost];
    setSites(next);
    chrome.storage.local.set({ sites: next });
    setStatus({ text: isEnabled ? "Site disabled" : "Site enabled!", ok: !isEnabled });
    setTimeout(() => setStatus(null), 1800);
  };

  const removeSite = (site: string) => {
    const next = sites.filter((s) => s !== site);
    setSites(next);
    chrome.storage.local.set({ sites: next });
  };

  const runBypass = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const tabId = tabs[0]?.id;
      if (!tabId) { setStatus({ text: "No active tab", ok: false }); return; }
      chrome.tabs.sendMessage(tabId, { action: "bypass_all" }, () => {
        setStatus({ text: "Bypass applied!", ok: true });
        setTimeout(() => setStatus(null), 2000);
      });
    });
  };

  return (
    <div style={{ width: 260, background: "#0f0f1a", fontFamily: "'Segoe UI', Arial, sans-serif", boxSizing: "border-box", color: "#fff" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)", padding: "14px 16px", borderBottom: "1px solid #ffffff10" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#4caf50,#2e7d32)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            🔓
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>Download Bypass</div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 1 }}>Per-site control</div>
          </div>
        </div>
      </div>

      {/* Current site row */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #ffffff08" }}>
        <div style={{ fontSize: 10, color: "#666", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Current Site</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: currentHost ? "#e0e0e0" : "#444", fontWeight: 500 }}>
            {currentHost || "—"}
          </div>
          {currentHost && (
            <label style={{ position: "relative", display: "inline-block", width: 40, height: 22, cursor: "pointer", flexShrink: 0 }}>
              <input type="checkbox" checked={isEnabled} onChange={toggleSite} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: "absolute", inset: 0, background: isEnabled ? "#4caf50" : "#2a2a3a", borderRadius: 22, transition: "background 0.25s", border: "1px solid #ffffff15" }} />
              <span style={{ position: "absolute", top: 3, left: isEnabled ? 20 : 3, width: 16, height: 16, background: "#fff", borderRadius: "50%", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.5)" }} />
            </label>
          )}
        </div>
        {isEnabled && (
          <div style={{ marginTop: 6, fontSize: 10, color: "#4caf50" }}>● Active — auto-bypass on every visit</div>
        )}
      </div>

      {/* Bypass button */}
      <div style={{ padding: "12px 16px", borderBottom: sites.length > 0 ? "1px solid #ffffff08" : "none" }}>
        {isEnabled ? (
          <button
            onClick={runBypass}
            onMouseDown={() => setPressing(true)}
            onMouseUp={() => setPressing(false)}
            onMouseLeave={() => setPressing(false)}
            style={{
              width: "100%", padding: "9px 0",
              background: pressing ? "linear-gradient(135deg,#388e3c,#1b5e20)" : "linear-gradient(135deg,#4caf50,#2e7d32)",
              color: "#fff", border: "none", borderRadius: 8,
              cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: 0.4,
              boxShadow: pressing ? "none" : "0 2px 8px rgba(76,175,80,0.35)",
              transform: pressing ? "scale(0.98)" : "scale(1)",
              transition: "all 0.15s",
            }}
          >
            ⚡ Bypass Now
          </button>
        ) : (
          <div style={{ fontSize: 11, color: "#444", textAlign: "center", padding: "4px 0" }}>
            {currentHost ? "Enable this site to activate bypass" : "Open a website to get started"}
          </div>
        )}

        {status && (
          <div style={{
            marginTop: 8, padding: "6px 10px", borderRadius: 6,
            background: status.ok ? "#1b5e2033" : "#b71c1c33",
            border: `1px solid ${status.ok ? "#4caf5044" : "#ef535044"}`,
            fontSize: 11, color: status.ok ? "#81c784" : "#ef9a9a",
            textAlign: "center",
          }}>
            {status.ok ? "✓" : "✕"} {status.text}
          </div>
        )}
      </div>

      {/* Saved sites list */}
      {sites.length > 0 && (
        <div style={{ padding: "10px 16px 14px" }}>
          <div style={{ fontSize: 10, color: "#666", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Saved Sites ({sites.length})
          </div>
          {sites.map((site) => (
            <div key={site} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "5px 8px", marginBottom: 4, borderRadius: 6,
              background: site === currentHost ? "#1b5e2022" : "#ffffff08",
              border: `1px solid ${site === currentHost ? "#4caf5033" : "#ffffff08"}`,
            }}>
              <span style={{ fontSize: 11, color: site === currentHost ? "#81c784" : "#aaa" }}>{site}</span>
              <button
                onClick={() => removeSite(site)}
                style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13, padding: "0 2px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
