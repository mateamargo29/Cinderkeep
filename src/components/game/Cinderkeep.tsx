import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Game } from "@/game/engine";
import { CAMPAIGN_MAPS, META_UPGRADES, getCampaignMap, upgradeCost as metaUpgradeCost } from "@/game/campaign";
import { TOWERS } from "@/game/config";
import { ERAS, TECH_TREE, getBranches, getEraProject } from "@/game/evolution";
import { DIFFICULTIES } from "@/game/settings";
import type { DifficultyId, GameSpeed, HudState, MapId, MetaUpgradeId, TowerKind } from "@/game/types";

const INITIAL: HudState = {
  gold: 90, lives: 20, wave: 0, totalWaves: 8, phase: "menu", selectedKind: null, selectedTower: null,
  remainingInWave: 0, muted: false, assetsReady: false, hoverCol: -1, hoverRow: -1,
  era: "ash", eraName: "Era de Ceniza", eraIndex: 0, eraCount: 5, researchCost: 120, researchReady: false,
  researchedTech: [], availableTech: [], selectedTech: null,
  campaignMap: "ash-pass", campaignMapName: "Paso de Ceniza", campaignEraLabel: "Ceniza",
  campaignXp: 0, campaignLevel: 1, campaignShards: 0, campaignVictories: [],
  campaignUpgrades: { arsenal: 0, treasury: 0, bastion: 0, salvage: 0 },
  campaignRewardXp: 0, campaignRewardShards: 0,
  campaignRecords: {
    "ash-pass": { attempts: 0, victories: 0, bestDifficulty: null, bestLives: 0, bestTimeSeconds: null },
    "bronze-crossing": { attempts: 0, victories: 0, bestDifficulty: null, bestLives: 0, bestTimeSeconds: null },
    "iron-gate": { attempts: 0, victories: 0, bestDifficulty: null, bestLives: 0, bestTimeSeconds: null },
    "industrial-ring": { attempts: 0, victories: 0, bestDifficulty: null, bestLives: 0, bestTimeSeconds: null },
    "quantum-nexus": { attempts: 0, victories: 0, bestDifficulty: null, bestLives: 0, bestTimeSeconds: null },
  },
  campaignStats: { runs: 0, victories: 0, kills: 0, bossKills: 0, damageDealt: 0, playSeconds: 0 },
  missionTitle: "Primera Guardia", missionBriefing: "Resiste ocho oleadas y conserva el bastión.",
  missionProgress: 0, missionTarget: 8, missionProgressLabel: "0/8 oleadas", missionFailedReason: null,
  difficulty: "warden", difficultyName: "Guardián", paused: false, gameSpeed: 1, reducedEffects: false, tutorialSeen: false,
  runStats: { kills: 0, bossKills: 0, towersBuilt: 0, towersSold: 0, goldEarned: 0, goldSpent: 0, livesLost: 0, leaks: 0, damageDealt: 0, shotsFired: 0, elapsedSeconds: 0, highestEra: 0 },
};

const TOWER_KINDS: TowerKind[] = ["ballista", "mortar", "spire"];
const SPEEDS: GameSpeed[] = [1, 2, 3];

async function lockOrientation(orientation: "portrait" | "landscape") {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await ScreenOrientation.lock({ orientation });
  } catch {
    // En web o dispositivos que no permitan bloquear orientación, la UI muestra una ayuda para girar.
  }
}

export function Cinderkeep() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [hud, setHud] = useState(INITIAL);
  const [screen, setScreen] = useState<"home" | "campaign" | "settings">("home");
  const [techOpen, setTechOpen] = useState(false);
  const [tutorial, setTutorial] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    void lockOrientation("portrait");
    const canvas = canvasRef.current;
    if (!canvas) {
      setBootError("No se pudo crear el lienzo del juego.");
      return;
    }

    let disposed = false;
    const game = new Game(canvas, setHud);
    gameRef.current = game;

    void game.init()
      .then(() => {
        if (disposed) return;
        setBootError(null);
        game.resize();
        game.startLoop();
      })
      .catch((error: unknown) => {
        if (disposed) return;
        const message = error instanceof Error ? error.message : String(error);
        setBootError(message || "Error desconocido durante el inicio.");
      });

    return () => {
      disposed = true;
      game.destroy();
    };
  }, []);

  const g = () => gameRef.current;
  const playing = hud.phase === "build" || hud.phase === "wave";

  useEffect(() => {
    const target = hud.phase === "menu" ? "portrait" : "landscape";
    void lockOrientation(target).finally(() => {
      window.setTimeout(() => gameRef.current?.resize(), 80);
      window.setTimeout(() => gameRef.current?.resize(), 320);
    });
  }, [hud.phase]);

  const leaveBattle = () => {
    g()?.returnToMenu();
    setScreen("campaign");
    setTechOpen(false);
  };

  return (
    <main className={`app-shell ${playing ? "game-active" : ""}`}>
      <header className="app-header z-10 flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/95 px-3 pb-2">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-bold">Cinderkeep</h1>
          <p className="truncate text-[11px] text-muted">
            {playing ? `${hud.campaignMapName} · ${hud.eraName}` : `Campaña · Nivel ${hud.campaignLevel}`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {playing ? <><Badge>❤️ {hud.lives}</Badge><Badge>🪙 {hud.gold}</Badge></> : <><Badge>💎 {hud.campaignShards}</Badge><Badge>🏆 {hud.campaignLevel}</Badge></>}
          <button className="btn-square" onClick={() => g()?.toggleMute()}>{hud.muted ? "🔇" : "🔊"}</button>
        </div>
      </header>

      <div className="game-stage">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full touch-none ${playing ? "block" : "hidden"}`}
          style={{ touchAction: "none", background: "#0c0b0a" }}
        />

        {bootError && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center bg-bg p-5">
            <div className="w-full max-w-md rounded-xl border border-danger/60 bg-surface p-5 text-center">
              <h2 className="font-display text-xl font-bold">Cinderkeep no pudo iniciar</h2>
              <p className="mt-2 text-sm text-muted">La app está instalada correctamente, pero el motor encontró un error al preparar el juego.</p>
              <code className="mt-4 block max-h-32 overflow-auto rounded-lg bg-bg p-3 text-left text-[11px] text-danger">{bootError}</code>
              <button className="btn-primary mt-4 w-full" onClick={() => window.location.reload()}>Reintentar inicio</button>
            </div>
          </div>
        )}

        {hud.phase === "menu" && screen === "home" && (
          <Panel>
            <div className="max-w-xl text-center">
              <p className="mb-2 text-xs uppercase tracking-[.3em] text-brass">Tower defense por eras</p>
              <h2 className="font-display text-4xl font-bold">Cinderkeep</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Defiende el bastión, evoluciona desde la Era de Ceniza hasta el Futuro y adapta tus torres al ejército enemigo.
              </p>
              <div className="mt-6 grid gap-3">
                <button className="btn-primary" disabled={!hud.assetsReady} onClick={() => setScreen("campaign")}>Jugar campaña</button>
                <button className="btn-secondary" onClick={() => setScreen("settings")}>Ajustes</button>
                <button className="btn-secondary" onClick={() => setTutorial(true)}>Cómo jugar</button>
              </div>
              <p className="mt-5 text-xs text-subtle">
                Victorias {hud.campaignVictories.length}/{CAMPAIGN_MAPS.length} · Partidas {hud.campaignStats.runs} · Bajas {hud.campaignStats.kills}
              </p>
            </div>
          </Panel>
        )}

        {hud.phase === "menu" && screen === "campaign" && (
          <Panel scroll>
            <div className="w-full max-w-4xl">
              <div className="mb-4 flex items-center justify-between">
                <div><h2 className="font-display text-2xl font-bold">Campaña</h2><p className="text-xs text-muted">Elige un frente y prepara tu defensa.</p></div>
                <button className="btn-secondary" onClick={() => setScreen("home")}>Volver</button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {CAMPAIGN_MAPS.map((map) => {
                  const unlocked = map.unlockAfter == null || hud.campaignVictories.includes(map.unlockAfter);
                  const active = hud.campaignMap === map.id;
                  const rec = hud.campaignRecords[map.id];
                  return (
                    <button key={map.id} disabled={!unlocked} onClick={() => g()?.selectCampaignMap(map.id)}
                      className={`rounded-xl border p-3 text-left transition ${active ? "border-brass bg-surface-2" : "border-border bg-surface"} disabled:opacity-35`}>
                      <p className="text-[10px] uppercase tracking-wider text-subtle">{map.chapter} · {map.eraLabel}</p>
                      <p className="mt-1 font-display text-sm font-semibold">{unlocked ? map.name : "🔒 Bloqueado"}</p>
                      <p className="mt-2 text-[11px] leading-snug text-muted">{map.mission.summary}</p>
                      <p className="mt-2 text-[10px] text-subtle">Victorias {rec.victories} · Intentos {rec.attempts}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
                <section className="rounded-xl border border-border bg-surface p-4">
                  <h3 className="font-display text-xl font-semibold">{hud.campaignMapName}</h3>
                  <p className="mt-1 text-xs text-brass">{hud.missionTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{hud.missionBriefing}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button key={d.id} className={hud.difficulty === d.id ? "chip-active" : "chip"} onClick={() => g()?.setDifficulty(d.id)}>
                        {d.name}
                      </button>
                    ))}
                  </div>
                  <button className="btn-primary mt-4 w-full" onClick={() => g()?.startRun(hud.campaignMap)}>Iniciar misión</button>
                </section>

                <section className="rounded-xl border border-border bg-surface p-4">
                  <h3 className="font-display font-semibold">Mejoras permanentes</h3>
                  <div className="mt-3 space-y-2">
                    {META_UPGRADES.map((u) => {
                      const level = hud.campaignUpgrades[u.id];
                      const cost = metaUpgradeCost(level);
                      return (
                        <button key={u.id} disabled={level >= u.maxLevel || hud.campaignShards < cost} onClick={() => g()?.buyMetaUpgrade(u.id)}
                          className="w-full rounded-lg border border-border bg-surface-2 p-2 text-left disabled:opacity-40">
                          <div className="flex justify-between text-xs font-semibold"><span>{u.name} {level}/{u.maxLevel}</span><span>💎 {level >= u.maxLevel ? "MAX" : cost}</span></div>
                          <p className="mt-1 text-[10px] text-muted">{u.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          </Panel>
        )}

        {hud.phase === "menu" && screen === "settings" && (
          <Panel>
            <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-2xl font-bold">Ajustes</h2>
              <p className="mt-1 text-xs text-muted">Preferencias guardadas en el dispositivo.</p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold">Dificultad</p>
                  <div className="grid grid-cols-3 gap-2">{DIFFICULTIES.map((d) => <button key={d.id} className={hud.difficulty === d.id ? "chip-active" : "chip"} onClick={() => g()?.setDifficulty(d.id)}>{d.name}</button>)}</div>
                </div>
                <button className="btn-secondary w-full" onClick={() => g()?.toggleReducedEffects()}>
                  Efectos reducidos: {hud.reducedEffects ? "Sí" : "No"}
                </button>
                <button className="btn-secondary w-full" onClick={() => setTutorial(true)}>Ver tutorial</button>
                <button className="btn-primary w-full" onClick={() => setScreen("home")}>Guardar y volver</button>
              </div>
            </div>
          </Panel>
        )}

        {playing && (
          <div className="mission-hud pointer-events-none absolute inset-x-2 top-2 z-20 flex items-start justify-between gap-2">
            <div className="rounded-lg border border-border bg-bg/85 px-3 py-2 backdrop-blur">
              <p className="text-[10px] uppercase tracking-wider text-subtle">{hud.missionTitle}</p>
              <p className="text-xs font-semibold">{hud.missionProgressLabel}</p>
            </div>
            <div className="pointer-events-auto flex gap-1">
              {SPEEDS.map((s) => <button key={s} onClick={() => g()?.setGameSpeed(s)} className={hud.gameSpeed === s ? "chip-active" : "chip"}>{s}×</button>)}
              <button className="chip" onClick={() => g()?.togglePause()}>{hud.paused ? "▶" : "Ⅱ"}</button>
            </div>
          </div>
        )}
      </div>

      {playing && (
        <footer className="game-footer z-10 shrink-0 border-t border-border bg-surface/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2">
          {hud.selectedTower && (
            <div className="mb-2 flex gap-2 overflow-x-auto">
              <span className="chip shrink-0">{hud.selectedTower.name} · DMG {hud.selectedTower.damage}</span>
              <button className="chip" disabled={hud.selectedTower.dmgCost == null || hud.gold < hud.selectedTower.dmgCost} onClick={() => g()?.upgradeDamage()}>Daño {hud.selectedTower.dmgCost ?? "MAX"}</button>
              <button className="chip" disabled={hud.selectedTower.rateCost == null || hud.gold < hud.selectedTower.rateCost} onClick={() => g()?.upgradeRate()}>Cadencia {hud.selectedTower.rateCost ?? "MAX"}</button>
              <button className="chip" onClick={() => g()?.sell()}>Vender +{hud.selectedTower.sellValue}</button>
            </div>
          )}
          <div className="flex gap-2 overflow-x-auto">
            {TOWER_KINDS.map((kind) => (
              <button key={kind} disabled={hud.gold < TOWERS[kind].cost} onClick={() => g()?.chooseKind(hud.selectedKind === kind ? null : kind)}
                className={`tower-build-button min-w-24 rounded-lg border px-3 py-2 text-left ${hud.selectedKind === kind ? "border-brass bg-surface-2" : "border-border bg-bg"} disabled:opacity-40`}>
                <p className="font-display text-xs font-semibold">{TOWERS[kind].name}</p><p className="text-[10px] text-muted">🪙 {TOWERS[kind].cost}</p>
              </button>
            ))}
            <button className="min-w-24 rounded-lg border border-border bg-bg px-3 py-2 text-xs font-semibold" onClick={() => setTechOpen(true)}>Tecnología</button>
            <button disabled={!hud.researchReady} className="min-w-24 rounded-lg border border-border bg-bg px-3 py-2 text-xs font-semibold disabled:opacity-35" onClick={() => g()?.researchEra()}>
              Siguiente era<br/><span className="text-[10px] text-muted">{hud.researchCost ?? "MAX"}</span>
            </button>
            <button disabled={hud.phase !== "build"} className="min-w-24 rounded-lg bg-accent px-3 py-2 font-display text-xs font-bold text-accent-fg disabled:opacity-35" onClick={() => g()?.launchWave()}>
              {hud.phase === "wave" ? `${hud.remainingInWave} enemigos` : `Oleada ${hud.wave + 1}/${hud.totalWaves}`}
            </button>
          </div>
        </footer>
      )}

      {playing && (
        <div className="rotation-fallback">
          <div className="rounded-xl border border-border bg-surface px-5 py-4 text-center shadow-xl">
            <p className="font-display text-lg font-bold">Gira el teléfono</p>
            <p className="mt-1 text-xs text-muted">Las partidas de Cinderkeep están optimizadas para pantalla horizontal.</p>
          </div>
        </div>
      )}

      {techOpen && playing && (
        <Modal title="Árbol tecnológico" onClose={() => setTechOpen(false)}>
          <div className="space-y-4">
            {ERAS.map((era, index) => (
              <section key={era.id} className={`rounded-xl border p-3 ${index <= hud.eraIndex ? "border-border bg-surface" : "border-border/50 opacity-45"}`}>
                <div className="flex items-center justify-between"><h3 className="font-display font-semibold">{era.name}</h3><span className="text-[10px] text-muted">{index <= hud.eraIndex ? "Desbloqueada" : "Bloqueada"}</span></div>
                <p className="mt-1 text-xs text-muted">{era.description}</p>
                {index > 0 && index <= hud.eraIndex && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {TOWER_KINDS.map((kind) => {
                      const tech = TECH_TREE.find((t) => t.eraIndex === index && t.kind === kind);
                      if (!tech) return null;
                      const done = hud.researchedTech.includes(tech.id);
                      return <button key={tech.id} disabled={done || hud.gold < tech.cost} className="rounded-lg border border-border bg-surface-2 p-2 text-left disabled:opacity-45" onClick={() => g()?.researchTech(tech.id)}>
                        <p className="text-xs font-semibold">{tech.name}</p><p className="text-[10px] text-muted">{done ? "Investigada" : `🪙 ${tech.cost}`}</p>
                      </button>;
                    })}
                  </div>
                )}
                {index === 2 && index <= hud.eraIndex && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {TOWER_KINDS.map((kind) => <div key={kind} className="rounded-lg border border-border/70 p-2">
                      <p className="mb-2 text-[10px] uppercase text-subtle">{TOWERS[kind].name} · doctrina</p>
                      {getBranches(kind).map((b) => <button key={b.id} disabled={hud.researchedTech.some((id) => id.startsWith(`${kind}:`)) || hud.gold < b.cost}
                        className="mb-1 w-full rounded-md border border-border bg-bg p-2 text-left text-xs disabled:opacity-45" onClick={() => g()?.researchBranch(b.id)}>
                        {b.shortName} · 🪙 {b.cost}
                      </button>)}
                    </div>)}
                  </div>
                )}
                {index > 0 && index <= hud.eraIndex && (() => {
                  const p = getEraProject(index); if (!p) return null; const done = hud.researchedTech.includes(p.id);
                  return <button disabled={done || hud.gold < p.cost} className="mt-3 w-full rounded-lg border border-brass/40 bg-bg p-2 text-left disabled:opacity-45" onClick={() => g()?.researchProject(p.id)}>
                    <p className="text-xs font-semibold">{p.name}</p><p className="text-[10px] text-muted">{done ? "Completado" : `${p.description} · 🪙 ${p.cost}`}</p>
                  </button>;
                })()}
              </section>
            ))}
          </div>
        </Modal>
      )}

      {hud.paused && playing && (
        <Panel layer>
          <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 text-center">
            <h2 className="font-display text-2xl font-bold">Pausa</h2>
            <div className="mt-4 grid gap-2">
              <button className="btn-primary" onClick={() => g()?.togglePause()}>Continuar</button>
              <button className="btn-secondary" onClick={() => g()?.startRun(hud.campaignMap)}>Reiniciar misión</button>
              <button className="btn-secondary" onClick={leaveBattle}>Abandonar</button>
            </div>
          </div>
        </Panel>
      )}

      {(hud.phase === "victory" || hud.phase === "defeat") && (
        <Panel layer scroll>
          <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-5 text-center">
            <h2 className="font-display text-3xl font-bold">{hud.phase === "victory" ? "Misión cumplida" : "Misión fallida"}</h2>
            <p className="mt-2 text-sm text-muted">{hud.phase === "victory" ? `${hud.missionTitle} completada.` : hud.missionFailedReason ?? "El bastión ha caído."}</p>
            {hud.phase === "victory" && <p className="mt-3 text-sm text-brass">+{hud.campaignRewardXp} XP · +{hud.campaignRewardShards} 💎</p>}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <Badge>Bajas {hud.runStats.kills}</Badge><Badge>Jefes {hud.runStats.bossKills}</Badge>
              <Badge>Torres {hud.runStats.towersBuilt}</Badge><Badge>Fugas {hud.runStats.leaks}</Badge>
              <Badge>Daño {Math.round(hud.runStats.damageDealt)}</Badge><Badge>{Math.floor(hud.runStats.elapsedSeconds)} s</Badge>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button className="btn-secondary" onClick={() => g()?.startRun(hud.campaignMap)}>Reintentar</button>
              <button className="btn-primary" onClick={leaveBattle}>Volver a campaña</button>
            </div>
          </div>
        </Panel>
      )}

      {tutorial && (
        <Panel layer scroll>
          <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-5">
            <h2 className="font-display text-2xl font-bold">Cómo jugar</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted">
              <li><strong className="text-fg">1. Frente:</strong> elige un mapa; cada uno tiene una misión distinta.</li>
              <li><strong className="text-fg">2. Defensa:</strong> selecciona una torre y toca una casilla libre. Toca una torre construida para mejorarla.</li>
              <li><strong className="text-fg">3. Oleadas:</strong> lanza la ofensiva cuando estés listo. Usa pausa y velocidades 1×, 2× y 3×.</li>
              <li><strong className="text-fg">4. Eras:</strong> investiga Bronce, Hierro, Industrial y Futuro. Las torres y enemigos cambian con cada época.</li>
              <li><strong className="text-fg">5. Progreso:</strong> gana XP y esquirlas para desbloquear frentes y mejoras permanentes.</li>
            </ol>
            <button className="btn-primary mt-5 w-full" onClick={() => { g()?.markTutorialSeen(true); setTutorial(false); }}>Entendido</button>
          </div>
        </Panel>
      )}
    </main>
  );
}

function Panel({ children, scroll = false, layer = false }: { children: React.ReactNode; scroll?: boolean; layer?: boolean }) {
  if (!layer) {
    return <div className={`menu-surface flex items-center justify-center p-4 ${scroll ? "overflow-y-auto" : ""}`}>{children}</div>;
  }

  return <div className={`absolute inset-0 z-50 flex items-center justify-center bg-bg p-4 ${scroll ? "overflow-y-auto" : ""}`}>{children}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="absolute inset-0 z-40 overflow-y-auto bg-bg/95 p-3">
    <div className="mx-auto max-w-5xl rounded-xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-bold">{title}</h2><button className="btn-secondary" onClick={onClose}>Cerrar</button></div>
      {children}
    </div>
  </div>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex min-h-8 items-center justify-center rounded-md border border-border bg-bg/80 px-2 py-1 text-xs">{children}</span>;
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
