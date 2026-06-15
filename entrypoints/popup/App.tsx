import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    chrome.storage.local.get("enabled", (data) => {
      setEnabled(data.enabled !== false);
    });
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    chrome.storage.local.set({ enabled: next });
    setStatus(next ? "Extension ON" : "Extension OFF");
    setTimeout(() => setStatus(""), 1500);
  };

  const runBypass = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const tabId = tabs[0]?.id;
      if (!tabId) { setStatus("No active tab"); return; }
      chrome.tabs.sendMessage(tabId, { action: "bypass_all" }, () => {
        setStatus("Done!");
        setTimeout(() => setStatus(""), 2000);
      });
    });
  };

  return (
    <div style={{ width: 210, padding: "16px", fontFamily: "Arial, sans-serif", boxSizing: "border-box" }}>
      {/* Header row with title + toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Download Bypass</span>
        <label style={{ position: "relative", display: "inline-block", width: 42, height: 23, cursor: "pointer", flexShrink: 0 }}>
          <input type="checkbox" checked={enabled} onChange={toggle} style={{ opacity: 0, width: 0, height: 0 }} />
          <span style={{
            position: "absolute", inset: 0,
            background: enabled ? "#4caf50" : "#bbb",
            borderRadius: 23,
            transition: "background 0.2s",
          }} />
          <span style={{
            position: "absolute",
            top: 3, left: enabled ? 21 : 3,
            width: 17, height: 17,
            background: "#fff",
            borderRadius: "50%",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }} />
        </label>
      </div>

      {/* Bypass button — only shown when enabled */}
      {enabled && (
        <button onClick={runBypass} style={{
          width: "100%", padding: "9px 0",
          background: "#4caf50", color: "#fff",
          border: "none", borderRadius: 6,
          cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>
          Bypass Now
        </button>
      )}

      {status && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#555", textAlign: "center" }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default App;
