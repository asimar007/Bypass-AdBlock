import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Bypass AdBlock",
    description: "Reveals hidden download links & bypasses adblock detection",
    version: "1.0.0",
    permissions: ["activeTab", "storage", "scripting"],
    host_permissions: ["<all_urls>"],
  },
});
