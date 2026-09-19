import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const win = process.platform === "win32";
const npm = win ? "npm.cmd" : "npm";
const npx = win ? "npx.cmd" : "npx";
const run = (cmd, args, options = {}) => execFileSync(cmd, args, { stdio: "inherit", ...options });

if (!existsSync("node_modules")) {
  console.error("[Cinderkeep] Faltan dependencias. Ejecuta primero: npm install");
  process.exit(1);
}
run(npm, ["run", "mobile:build"]);
if (!existsSync("android")) run(npx, ["cap", "add", "android"]);
run(npx, ["cap", "sync", "android"]);
const gradle = win ? "gradlew.bat" : "./gradlew";
run(gradle, ["assembleDebug"], { cwd: resolve("android") });
const source = resolve("android", "app", "build", "outputs", "apk", "debug", "app-debug.apk");
if (!existsSync(source)) throw new Error("No se encontró la APK esperada");
mkdirSync("release", { recursive: true });
const target = resolve("release", "Cinderkeep-v3.0.1-debug.apk");
copyFileSync(source, target);
console.log(`[Cinderkeep] APK lista: ${target}`);
