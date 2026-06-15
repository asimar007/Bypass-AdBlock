import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("enabled", (data) => {
      setEnabled(data.enabled !== false);
    });
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    chrome.storage.local.set({ enabled: next });
    setStatus({ text: next ? "Extension enabled" : "Extension disabled", ok: next });
    setTimeout(() => setStatus(null), 1800);
  };

  const runBypass = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const tabId = tabs[0]?.id;
      if (!tabId) {
        setStatus({ text: "No active tab found", ok: false });
        setTimeout(() => setStatus(null), 2000);
        return;
      }
      chrome.tabs.sendMessage(tabId, { action: "bypass_all" }, () => {
        setStatus({ text: "Bypass applied!", ok: true });
        setTimeout(() => setStatus(null), 2000);
      });
    });
  };

  return (
    <div style={{
      width: 240,
      background: "#0f0f1a",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      boxSizing: "border-box",
      color: "#fff",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "16px 16px 14px",
        borderBottom: "1px solid #ffffff10",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: enabled ? "linear-gradient(135deg,#4caf50,#2e7d32)" : "#333",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, transition: "background 0.3s",
            }}>
              🔓
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>Download Bypass</div>
              <div style={{ fontSize: 10, color: enabled ? "#4caf50" : "#666", marginTop: 1, transition: "color 0.3s" }}>
                {enabled ? "● Active on all sites" : "○ Disabled"}
              </div>
            </div>
          </div>

          {/* Toggle */}
          <label style={{ position: "relative", display: "inline-block", width: 40, height: 22, cursor: "pointer", flexShrink: 0 }}>
            <input type="checkbox" checked={enabled} onChange={toggle} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{
              position: "absolute", inset: 0,
              background: enabled ? "#4caf50" : "#333",
              borderRadius: 22,
              transition: "background 0.25s",
              border: "1px solid #ffffff15",
            }} />
            <span style={{
              position: "absolute",
              top: 3, left: enabled ? 20 : 3,
              width: 16, height: 16,
              background: "#fff",
              borderRadius: "50%",
              transition: "left 0.25s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }} />
          </label>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px" }}>
        {enabled ? (
          <button
            onClick={runBypass}
            onMouseDown={() => setPressing(true)}
            onMouseUp={() => setPressing(false)}
            onMouseLeave={() => setPressing(false)}
            style={{
              width: "100%",
              padding: "10px 0",
              background: pressing
                ? "linear-gradient(135deg,#388e3c,#1b5e20)"
                : "linear-gradient(135deg,#4caf50,#2e7d32)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.4,
              boxShadow: pressing ? "none" : "0 2px 8px rgba(76,175,80,0.4)",
              transform: pressing ? "scale(0.98)" : "scale(1)",
              transition: "all 0.15s",
            }}
          >
            ⚡ Bypass Now
          </button>
        ) : (
          <div style={{
            textAlign: "center", fontSize: 12, color: "#555",
            padding: "10px 0", letterSpacing: 0.2,
          }}>
            Toggle on to enable bypass
          </div>
        )}

        {/* Status */}
        {status && (
          <div style={{
            marginTop: 10,
            padding: "7px 10px",
            borderRadius: 6,
            background: status.ok ? "#1b5e2033" : "#b71c1c33",
            border: `1px solid ${status.ok ? "#4caf5044" : "#ef535044"}`,
            fontSize: 11,
            color: status.ok ? "#81c784" : "#ef9a9a",
            textAlign: "center",
            letterSpacing: 0.2,
          }}>
            {status.ok ? "✓" : "✕"} {status.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
