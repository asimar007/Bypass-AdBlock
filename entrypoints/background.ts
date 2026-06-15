export default defineBackground(() => {
  // Simple relay for manual messages (if needed)
  chrome.runtime.onMessage.addListener(
    (
      message: { action: string },
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void,
    ) => {
      if (message.action === "manual_bypass") {
        chrome.tabs
          .query({ active: true, currentWindow: true })
          .then(([tab]: chrome.tabs.Tab[]) => {
            if (tab.id)
              chrome.tabs.sendMessage(tab.id, { action: "force_reveal" });
          });
        sendResponse({ status: "ok" });
      }
      return true;
    },
  );
});
