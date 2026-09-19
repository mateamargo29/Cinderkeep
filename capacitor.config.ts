import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cinderkeep.game",
  appName: "Cinderkeep",
  webDir: "dist-mobile",
  server: { androidScheme: "https" },
  android: { backgroundColor: "#0c0b0a" },
};

export default config;
