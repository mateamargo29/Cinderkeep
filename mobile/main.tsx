import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Cinderkeep } from "../src/components/game/Cinderkeep";
import "../src/styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró el contenedor raíz de Cinderkeep");

createRoot(root).render(
  <StrictMode>
    <Cinderkeep />
  </StrictMode>,
);
