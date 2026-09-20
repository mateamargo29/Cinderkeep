import type {
  EnemyArchetype,
  EnemyDef,
  EnemyKind,
  TowerBranchId,
  TowerDef,
  TowerKind,
  WaveDef,
} from "./types";
import { getBranch, getTowerForm, scaleTowerValue } from "./evolution";

export const COLS = 14;
export const ROWS = 9;
export const CELL = 72;
export const WORLD_W = COLS * CELL;
export const WORLD_H = ROWS * CELL;

export const START_GOLD = 90;
export const START_LIVES = 20;
export const SELL_RATIO = 0.55;
export const MAX_UPGRADE = 3;

export const PATH_WAYPOINTS: Array<[number, number]> = [
  [0, 1],
  [10, 1],
  [10, 3],
  [2, 3],
  [2, 5],
  [11, 5],
  [11, 7],
  [13, 7],
];

export const DMG_MULT = [1, 1.3, 1.65, 2.15];
export const RATE_MULT = [1, 1.24, 1.52, 1.9];
export const UPGRADE_COST = [0, 40, 65, 100];

export const TOWERS: Record<TowerKind, TowerDef> = {
  ballista: {
    kind: "ballista",
    name: "Balista",
    blurb: "Precisa. Alcance medio.",
    cost: 50,
    range: 2.65,
    fireRate: 1.15,
    damage: 14,
    splash: 0,
    slow: 0,
    projectileSpeed: 9.4,
    era: 0,
  },
  mortar: {
    kind: "mortar",
    name: "Mortero",
    blurb: "Explosión. Disparo lento.",
    cost: 80,
    range: 2.15,
    fireRate: 0.48,
    damage: 34,
    splash: 1.15,
    slow: 0,
    projectileSpeed: 5.2,
    era: 0,
  },
  spire: {
    kind: "spire",
    name: "Aguja",
    blurb: "Largo alcance. Ralentiza.",
    cost: 105,
    range: 3.35,
    fireRate: 0.82,
    damage: 22,
    splash: 0,
    slow: 0.42,
    projectileSpeed: 7.6,
    era: 0,
  },
};

const enemy = (
  def: Omit<EnemyDef, "regenRate" | "shieldRatio" | "shieldRegenRate" | "slowResist" | "resistBallista" | "resistMortar" | "resistSpire"> &
    Partial<Pick<EnemyDef, "regenRate" | "shieldRatio" | "shieldRegenRate" | "slowResist" | "resistBallista" | "resistMortar" | "resistSpire">>,
): EnemyDef => ({
  regenRate: 0,
  shieldRatio: 0,
  shieldRegenRate: 0,
  slowResist: 0,
  resistBallista: 0,
  resistMortar: 0,
  resistSpire: 0,
  ...def,
});

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  ashling: enemy({ kind: "ashling", name: "Cazador de Piedra", hp: 38, speed: 1.55, gold: 7, armor: 0, scale: 0.92, sprite: "ashling", era: 0, role: "infantry", boss: false, leakDamage: 1, ability: "Guerrero tribal armado con sílex y pieles." }),
  streaker: enemy({ kind: "streaker", name: "Corredor Tribal", hp: 24, speed: 2.55, gold: 9, armor: 0, scale: 0.88, sprite: "streaker", era: 0, role: "fast", boss: false, leakDamage: 1, ability: "Explorador ligero que aprovecha cualquier hueco en la defensa.", slowResist: 0.05 }),
  carapace: enemy({ kind: "carapace", name: "Bruto de Piedra", hp: 110, speed: 0.95, gold: 15, armor: 0.32, scale: 1.12, sprite: "carapace", era: 0, role: "armored", boss: false, leakDamage: 1, ability: "Pieles gruesas, hueso y placas de roca improvisadas." }),
  warden: enemy({ kind: "warden", name: "Jefe del Clan", hp: 780, speed: 0.7, gold: 90, armor: 0.18, scale: 1.7, sprite: "carapace", era: 0, role: "boss", boss: true, leakDamage: 3, ability: "Grito de guerra: acelera temporalmente a los guerreros cercanos; una fuga cuesta 3 vidas." }),

  bronze_raider: enemy({ kind: "bronze_raider", name: "Saqueador de Bronce", hp: 42, speed: 1.52, gold: 8, armor: 0.05, scale: 0.95, sprite: "ashling", era: 1, role: "infantry", boss: false, leakDamage: 1, ability: "Armadura ligera de bronce.", resistSpire: 0.04 }),
  bronze_scout: enemy({ kind: "bronze_scout", name: "Explorador de Bronce", hp: 26, speed: 2.65, gold: 10, armor: 0.02, scale: 0.88, sprite: "streaker", era: 1, role: "fast", boss: false, leakDamage: 1, ability: "Reduce parte de la ralentización.", slowResist: 0.12 }),
  bronze_hoplite: enemy({ kind: "bronze_hoplite", name: "Hoplita de Bronce", hp: 118, speed: 0.9, gold: 17, armor: 0.38, scale: 1.14, sprite: "carapace", era: 1, role: "armored", boss: false, leakDamage: 1, ability: "Escudo frontal; alto blindaje.", resistBallista: 0.05 }),
  bronze_colossus: enemy({ kind: "bronze_colossus", name: "Coloso de Bronce", hp: 720, speed: 0.68, gold: 95, armor: 0.25, scale: 1.72, sprite: "carapace", era: 1, role: "boss", boss: true, leakDamage: 3, ability: "Muro de bronce: genera escudos temporales para sí mismo y aliados cercanos.", resistBallista: 0.05, resistMortar: 0.05 }),

  iron_legionary: enemy({ kind: "iron_legionary", name: "Legionario de Hierro", hp: 46, speed: 1.48, gold: 9, armor: 0.08, scale: 0.97, sprite: "ashling", era: 2, role: "infantry", boss: false, leakDamage: 1, ability: "Infantería disciplinada con placas de hierro." }),
  iron_outrider: enemy({ kind: "iron_outrider", name: "Jinete de Hierro", hp: 29, speed: 2.72, gold: 11, armor: 0.04, scale: 0.9, sprite: "streaker", era: 2, role: "fast", boss: false, leakDamage: 1, ability: "Gran velocidad y resistencia al control.", slowResist: 0.18 }),
  iron_bulwark: enemy({ kind: "iron_bulwark", name: "Baluarte de Hierro", hp: 126, speed: 0.86, gold: 19, armor: 0.44, scale: 1.16, sprite: "carapace", era: 2, role: "armored", boss: false, leakDamage: 1, ability: "Blindaje pesado; resiste virotes.", resistBallista: 0.08 }),
  iron_warlord: enemy({ kind: "iron_warlord", name: "Señor de la Guerra", hp: 760, speed: 0.66, gold: 105, armor: 0.3, scale: 1.76, sprite: "carapace", era: 2, role: "boss", boss: true, leakDamage: 3, ability: "Estandarte de hierro: cura y limpia efectos de control de los aliados cercanos.", regenRate: 0.0025, resistBallista: 0.06, resistMortar: 0.06 }),

  industrial_trooper: enemy({ kind: "industrial_trooper", name: "Fusilero Industrial", hp: 50, speed: 1.5, gold: 10, armor: 0.12, scale: 0.98, sprite: "ashling", era: 3, role: "infantry", boss: false, leakDamage: 1, ability: "Equipo mecánico; soporta explosiones menores.", resistMortar: 0.04 }),
  industrial_bike: enemy({ kind: "industrial_bike", name: "Corredor Motorizado", hp: 32, speed: 2.85, gold: 12, armor: 0.05, scale: 0.9, sprite: "streaker", era: 3, role: "fast", boss: false, leakDamage: 1, ability: "Motor rápido y aislado contra control eléctrico.", slowResist: 0.32, resistSpire: 0.08 }),
  industrial_tank: enemy({ kind: "industrial_tank", name: "Blindado Industrial", hp: 135, speed: 0.82, gold: 22, armor: 0.48, scale: 1.2, sprite: "carapace", era: 3, role: "armored", boss: false, leakDamage: 2, ability: "Blindaje mecánico con autorreparación.", regenRate: 0.004, resistMortar: 0.16 }),
  industrial_dreadnought: enemy({ kind: "industrial_dreadnought", name: "Acorazado Terrestre", hp: 800, speed: 0.64, gold: 120, armor: 0.34, scale: 1.82, sprite: "carapace", era: 3, role: "boss", boss: true, leakDamage: 4, ability: "Blindaje de emergencia: fortifica a los enemigos cercanos y reduce temporalmente el daño recibido.", regenRate: 0.004, resistBallista: 0.1, resistMortar: 0.12, resistSpire: 0.08, slowResist: 0.18 }),

  future_drone: enemy({ kind: "future_drone", name: "Dron de Asalto", hp: 54, speed: 1.62, gold: 12, armor: 0.1, scale: 0.94, sprite: "ashling", era: 4, role: "infantry", boss: false, leakDamage: 1, ability: "Escudo energético ligero.", shieldRatio: 0.18, shieldRegenRate: 0.02, resistMortar: 0.05 }),
  future_phase: enemy({ kind: "future_phase", name: "Corredor de Fase", hp: 35, speed: 3.0, gold: 14, armor: 0.04, scale: 0.88, sprite: "streaker", era: 4, role: "fast", boss: false, leakDamage: 1, ability: "Escudo breve y fuerte resistencia a ralentización.", shieldRatio: 0.08, shieldRegenRate: 0.015, slowResist: 0.5, resistSpire: 0.14 }),
  future_mech: enemy({ kind: "future_mech", name: "Meca de Asedio", hp: 145, speed: 0.88, gold: 26, armor: 0.5, scale: 1.22, sprite: "carapace", era: 4, role: "armored", boss: false, leakDamage: 2, ability: "Gran escudo energético y regeneración.", regenRate: 0.004, shieldRatio: 0.28, shieldRegenRate: 0.022, resistMortar: 0.12, resistBallista: 0.08 }),
  future_singularity: enemy({ kind: "future_singularity", name: "Núcleo de Singularidad", hp: 850, speed: 0.68, gold: 150, armor: 0.36, scale: 1.88, sprite: "carapace", era: 4, role: "boss", boss: true, leakDamage: 5, ability: "Pulso de singularidad: recarga escudos y acelera unidades cercanas en pulsos periódicos.", regenRate: 0.004, shieldRatio: 0.35, shieldRegenRate: 0.028, slowResist: 0.32, resistBallista: 0.12, resistMortar: 0.14, resistSpire: 0.12 }),
};

export const ERA_ENEMY_ROSTERS: ReadonlyArray<Record<EnemyArchetype, EnemyKind>> = [
  { ashling: "ashling", streaker: "streaker", carapace: "carapace", warden: "warden" },
  { ashling: "bronze_raider", streaker: "bronze_scout", carapace: "bronze_hoplite", warden: "bronze_colossus" },
  { ashling: "iron_legionary", streaker: "iron_outrider", carapace: "iron_bulwark", warden: "iron_warlord" },
  { ashling: "industrial_trooper", streaker: "industrial_bike", carapace: "industrial_tank", warden: "industrial_dreadnought" },
  { ashling: "future_drone", streaker: "future_phase", carapace: "future_mech", warden: "future_singularity" },
];

export function resolveEnemyKind(archetype: EnemyArchetype, eraIndex: number): EnemyKind {
  const tier = Math.max(0, Math.min(eraIndex, ERA_ENEMY_ROSTERS.length - 1));
  return ERA_ENEMY_ROSTERS[tier][archetype];
}

export function getEraEnemyRoster(eraIndex: number): EnemyDef[] {
  const tier = Math.max(0, Math.min(eraIndex, ERA_ENEMY_ROSTERS.length - 1));
  return (Object.values(ERA_ENEMY_ROSTERS[tier]) as EnemyKind[]).map((kind) => ENEMIES[kind]);
}

export const WAVES: WaveDef[] = [
  { groups: [{ kind: "ashling", count: 8, interval: 0.9, delay: 0 }] },
  { groups: [{ kind: "ashling", count: 12, interval: 0.72, delay: 0 }] },
  { groups: [{ kind: "ashling", count: 8, interval: 0.75, delay: 0 }, { kind: "streaker", count: 6, interval: 0.55, delay: 2.4 }] },
  { groups: [{ kind: "ashling", count: 10, interval: 0.7, delay: 0 }, { kind: "carapace", count: 3, interval: 1.4, delay: 2.6 }, { kind: "warden", count: 1, interval: 1, delay: 5.2, hpScale: 0.42, goldScale: 0.55 }] },
  { groups: [{ kind: "streaker", count: 14, interval: 0.48, delay: 0 }] },
  { groups: [{ kind: "carapace", count: 6, interval: 1.1, delay: 0 }, { kind: "ashling", count: 10, interval: 0.6, delay: 1.5 }] },
  { groups: [{ kind: "carapace", count: 8, interval: 0.95, delay: 0 }, { kind: "streaker", count: 10, interval: 0.5, delay: 2 }] },
  { groups: [{ kind: "ashling", count: 16, interval: 0.5, delay: 0 }, { kind: "carapace", count: 6, interval: 1.05, delay: 2 }, { kind: "warden", count: 1, interval: 1, delay: 6.6, hpScale: 0.72, goldScale: 0.78 }] },
  { groups: [{ kind: "carapace", count: 10, interval: 0.85, delay: 0 }, { kind: "streaker", count: 12, interval: 0.42, delay: 1.2 }] },
  { groups: [{ kind: "ashling", count: 14, interval: 0.48, delay: 0 }, { kind: "carapace", count: 8, interval: 0.8, delay: 1 }, { kind: "streaker", count: 10, interval: 0.4, delay: 4 }] },
  { groups: [{ kind: "carapace", count: 12, interval: 0.7, delay: 0 }, { kind: "streaker", count: 14, interval: 0.38, delay: 2 }, { kind: "ashling", count: 12, interval: 0.45, delay: 5 }] },
  { groups: [{ kind: "carapace", count: 8, interval: 0.85, delay: 0 }, { kind: "warden", count: 1, interval: 1, delay: 3.5 }, { kind: "streaker", count: 12, interval: 0.42, delay: 6 }, { kind: "ashling", count: 10, interval: 0.5, delay: 8 }] },
];

export const TOTAL_WAVES = WAVES.length;

export function towerCombat(
  kind: TowerKind,
  dmgLevel: number,
  rateLevel: number,
  eraIndex = 0,
  branchId: TowerBranchId | null = null,
) {
  const t = TOWERS[kind];
  const tier = Math.max(0, Math.min(eraIndex, 4));
  const form = getTowerForm(kind, tier);
  const rawBranch = getBranch(branchId);
  const branch = rawBranch?.kind === kind ? rawBranch : null;
  const damageMultiplier = branch?.damageMultiplier ?? 1;
  const fireRateMultiplier = branch?.fireRateMultiplier ?? 1;
  const rangeMultiplier = branch?.rangeMultiplier ?? 1;
  const splashMultiplier = branch?.splashMultiplier ?? 1;
  const projectileSpeedMultiplier = branch?.projectileSpeedMultiplier ?? 1;
  const slowBonus = branch?.slowBonus ?? 0;
  return {
    name: branch ? `${form.name} · ${branch.shortName}` : form.name,
    role: branch?.role ?? form.role,
    branchName: branch?.name ?? null,
    damage: scaleTowerValue(t.damage * DMG_MULT[dmgLevel] * form.damageMultiplier * damageMultiplier, tier),
    fireRate: t.fireRate * RATE_MULT[rateLevel] * form.fireRateMultiplier * fireRateMultiplier,
    range: t.range * CELL * form.rangeMultiplier * rangeMultiplier,
    splash: t.splash * CELL * form.splashMultiplier * splashMultiplier,
    slow: Math.min(0.95, t.slow + form.slowBonus + slowBonus),
    projectileSpeed: t.projectileSpeed * CELL * form.projectileSpeedMultiplier * projectileSpeedMultiplier,
    pierce: form.pierce + (branch?.pierceBonus ?? 0),
    volley: Math.max(1, form.volley + (branch?.volleyBonus ?? 0)),
    chain: branch?.id === "spire:frost" ? false : form.chain || branch?.id === "spire:storm",
    pulse: form.pulse,
    armorPierce: branch?.armorPierce ?? 0,
    burnDps: branch?.burnDps ? scaleTowerValue(branch.burnDps, tier) : 0,
    slowFactor: branch?.slowFactor ?? 0.55,
    chainMultiplier: branch?.chainMultiplier ?? 1,
    branchId: branch?.id ?? null,
  };
}

export function upgradeCost(level: number): number | null {
  if (level >= MAX_UPGRADE) return null;
  return UPGRADE_COST[level + 1];
}
