import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Cinderkeep } from "../src/components/game/Cinderkeep";
import "../src/styles.css";

async function configureNativeShell() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setBackgroundColor({ color: "#0c0b0a" });
    await StatusBar.setStyle({ style: Style.Light });
  } catch {
    // La UI sigue usando sus propios márgenes de seguridad si el plugin no responde.
  }
}

void configureNativeShell();

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró el contenedor raíz de Cinderkeep");

createRoot(root).render(<Cinderkeep />);
