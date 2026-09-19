import type { EraId, EnemyKind, TowerBranchId, TowerKind } from "./types";

export type TowerTechDef = {
  id: string;
  eraIndex: number;
  kind: TowerKind;
  name: string;
  description: string;
  cost: number;
  visual: string;
  ability: string;
};

export type EraDef = {
  id: EraId;
  name: string;
  shortName: string;
  description: string;
  towerMultiplier: number;
  enemyMultiplier: number;
  researchBase: number;
  unlocksTowers: TowerKind[];
  unlocksEnemies: EnemyKind[];
};

export const ERAS: EraDef[] = [
  { id: "ash", name: "Era de Ceniza", shortName: "Ceniza", description: "Tecnología defensiva básica.", towerMultiplier: 1, enemyMultiplier: 1, researchBase: 120, unlocksTowers: ["ballista", "mortar", "spire"], unlocksEnemies: ["ashling", "streaker", "carapace", "warden"] },
  { id: "bronze", name: "Era del Bronce", shortName: "Bronce", description: "Metalurgia: aparecen ejércitos de bronce y nuevas defensas.", towerMultiplier: 1.12, enemyMultiplier: 1.16, researchBase: 190, unlocksTowers: [], unlocksEnemies: ["bronze_raider", "bronze_scout", "bronze_hoplite", "bronze_colossus"] },
  { id: "iron", name: "Era del Hierro", shortName: "Hierro", description: "Ingeniería militar, formaciones pesadas y regeneración enemiga.", towerMultiplier: 1.28, enemyMultiplier: 1.36, researchBase: 280, unlocksTowers: [], unlocksEnemies: ["iron_legionary", "iron_outrider", "iron_bulwark", "iron_warlord"] },
  { id: "industrial", name: "Era Industrial", shortName: "Industrial", description: "Máquinas, blindados y autorreparación cambian el frente.", towerMultiplier: 1.5, enemyMultiplier: 1.65, researchBase: 400, unlocksTowers: [], unlocksEnemies: ["industrial_trooper", "industrial_bike", "industrial_tank", "industrial_dreadnought"] },
  { id: "future", name: "Era del Futuro", shortName: "Futuro", description: "Escudos regenerativos y armas de energía dominan la batalla.", towerMultiplier: 1.85, enemyMultiplier: 2.05, researchBase: 0, unlocksTowers: [], unlocksEnemies: ["future_drone", "future_phase", "future_mech", "future_singularity"] },
];

export type WorldTheme = {
  name: string;
  subtitle: string;
  tint: string;
  pathGlow: string;
  keepAccent: string;
  riftColor: string;
  ambient: "embers" | "dust" | "sparks" | "smoke" | "quantum";
};

export const WORLD_THEMES: WorldTheme[] = [
  { name: "Yermo de Ceniza", subtitle: "Brasas, roca oscura y ruinas antiguas.", tint: "rgba(54,34,27,0.18)", pathGlow: "rgba(196,92,38,0.16)", keepAccent: "#c45c26", riftColor: "#c45c26", ambient: "embers" },
  { name: "Frontera de Bronce", subtitle: "Estandartes, metal cálido y polvo de campaña.", tint: "rgba(126,91,48,0.14)", pathGlow: "rgba(212,166,91,0.18)", keepAccent: "#d4a65b", riftColor: "#d08a45", ambient: "dust" },
  { name: "Bastión de Hierro", subtitle: "Fortificaciones, remaches y chispas de forja.", tint: "rgba(76,82,88,0.16)", pathGlow: "rgba(166,174,181,0.17)", keepAccent: "#a8afb5", riftColor: "#b26a45", ambient: "sparks" },
  { name: "Distrito Industrial", subtitle: "Humo, tuberías y maquinaria de guerra.", tint: "rgba(42,48,52,0.22)", pathGlow: "rgba(185,74,60,0.18)", keepAccent: "#b94a3c", riftColor: "#d15b3b", ambient: "smoke" },
  { name: "Nexo del Futuro", subtitle: "Circuitos, energía y geometría cuántica.", tint: "rgba(34,54,76,0.22)", pathGlow: "rgba(120,205,235,0.22)", keepAccent: "#86d6ef", riftColor: "#86d6ef", ambient: "quantum" },
];

export function getWorldTheme(eraIndex: number): WorldTheme {
  return WORLD_THEMES[Math.max(0, Math.min(eraIndex, WORLD_THEMES.length - 1))];
}

const BRANCHES: Record<TowerKind, string[]> = {
  ballista: ["Armazón reforzado", "Arbalesta de hierro", "Cañón de repetición", "Rayo perforante"],
  mortar: ["Mortero de bronce", "Obús de hierro", "Artillería pesada", "Mortero de plasma"],
  spire: ["Cristal conductor", "Foco de hierro", "Bobina eléctrica", "Núcleo de energía"],
};

const DESCRIPTIONS: Record<TowerKind, string[]> = {
  ballista: ["Puntas metálicas: proyectiles más rápidos.", "Mecanismo reforzado: atraviesa al primer objetivo.", "Repetición: dispara una ráfaga de 2 virotes.", "Rayo: proyectil energético con gran penetración."],
  mortar: ["Carga incendiaria: mayor explosión.", "Obús: más alcance de impacto.", "Artillería: impactos todavía más devastadores.", "Plasma: explosión energética de enorme área."],
  spire: ["Cristal: ralentización más intensa.", "Conductor: el rayo busca objetivos cercanos.", "Bobina: cadena eléctrica a un segundo enemigo.", "Núcleo: descarga de energía de gran alcance."],
};

const COSTS = [90, 150, 240, 360];

export const TECH_TREE: TowerTechDef[] = ERAS.slice(1).flatMap((era, offset) => {
  const eraIndex = offset + 1;
  return (Object.keys(BRANCHES) as TowerKind[]).map((kind) => ({
    id: `${era.id}:${kind}`,
    eraIndex,
    kind,
    name: BRANCHES[kind][offset],
    description: DESCRIPTIONS[kind][offset],
    cost: COSTS[offset],
    visual: `${era.shortName} · ${BRANCHES[kind][offset]}`,
    ability: DESCRIPTIONS[kind][offset],
  }));
});

export function getTech(eraIndex: number, kind: TowerKind) {
  return TECH_TREE.find((t) => t.eraIndex === eraIndex && t.kind === kind) ?? null;
}

export type EraProjectDef = {
  id: string;
  eraIndex: number;
  name: string;
  description: string;
  cost: number;
  effect: "salvage" | "ramparts" | "supply" | "quantum";
};

export const ERA_PROJECTS: EraProjectDef[] = [
  { id: "project:bronze:salvage", eraIndex: 1, name: "Taller de recuperación", description: "+2 oro por cada enemigo abatido.", cost: 115, effect: "salvage" },
  { id: "project:iron:ramparts", eraIndex: 2, name: "Murallas reforzadas", description: "+4 vidas al bastión al completar la investigación.", cost: 175, effect: "ramparts" },
  { id: "project:industrial:supply", eraIndex: 3, name: "Cadena de suministro", description: "+12 oro adicional al completar cada oleada.", cost: 250, effect: "supply" },
  { id: "project:future:quantum", eraIndex: 4, name: "Núcleo cuántico", description: "+10% de daño para todas las torres.", cost: 360, effect: "quantum" },
];

export function getEraProject(eraIndex: number) {
  return ERA_PROJECTS.find((project) => project.eraIndex === eraIndex) ?? null;
}

export function hasProjectEffect(ids: Iterable<string>, effect: EraProjectDef["effect"]) {
  const set = ids instanceof Set ? ids : new Set(ids);
  return ERA_PROJECTS.some((project) => project.effect === effect && set.has(project.id));
}

export function researchCost(index: number): number | null {
  if (index >= ERAS.length - 1) return null;
  return ERAS[index + 1].researchBase;
}

export type TowerEraForm = {
  name: string;
  role: string;
  description: string;
  damageMultiplier: number;
  fireRateMultiplier: number;
  rangeMultiplier: number;
  splashMultiplier: number;
  slowBonus: number;
  projectileSpeedMultiplier: number;
  pierce: number;
  volley: number;
  chain: boolean;
  pulse: boolean;
};

const TOWER_FORMS: Record<TowerKind, TowerEraForm[]> = {
  ballista: [
    { name: "Balista", role: "Arma de asedio", description: "Virote preciso de la Era de Ceniza.", damageMultiplier: 1, fireRateMultiplier: 1, rangeMultiplier: 1, splashMultiplier: 1, slowBonus: 0, projectileSpeedMultiplier: 1, pierce: 0, volley: 1, chain: false, pulse: false },
    { name: "Arbalesta de Bronce", role: "Perforadora", description: "Puntas metálicas que atraviesan una unidad.", damageMultiplier: 1.08, fireRateMultiplier: 1.02, rangeMultiplier: 1.03, splashMultiplier: 1, slowBonus: 0, projectileSpeedMultiplier: 1.12, pierce: 1, volley: 1, chain: false, pulse: false },
    { name: "Balista de Hierro", role: "Repetidora", description: "Mecanismo reforzado con ráfagas de dos virotes.", damageMultiplier: 1.16, fireRateMultiplier: 1.06, rangeMultiplier: 1.06, splashMultiplier: 1, slowBonus: 0, projectileSpeedMultiplier: 1.18, pierce: 1, volley: 2, chain: false, pulse: false },
    { name: "Cañón de Repetición", role: "Artillería móvil", description: "Proyectiles perforantes de alta velocidad.", damageMultiplier: 1.28, fireRateMultiplier: 1.1, rangeMultiplier: 1.12, splashMultiplier: 1.1, slowBonus: 0, projectileSpeedMultiplier: 1.32, pierce: 2, volley: 2, chain: false, pulse: false },
    { name: "Rayo Perforante", role: "Arma energética", description: "Un haz concentrado que atraviesa múltiples enemigos.", damageMultiplier: 1.5, fireRateMultiplier: 1.16, rangeMultiplier: 1.2, splashMultiplier: 1.18, slowBonus: 0.04, projectileSpeedMultiplier: 1.7, pierce: 4, volley: 2, chain: false, pulse: false },
  ],
  mortar: [
    { name: "Mortero", role: "Artillería", description: "Explosión lenta y poderosa.", damageMultiplier: 1, fireRateMultiplier: 1, rangeMultiplier: 1, splashMultiplier: 1, slowBonus: 0, projectileSpeedMultiplier: 1, pierce: 0, volley: 1, chain: false, pulse: false },
    { name: "Mortero de Bronce", role: "Incendiario", description: "Cargas calientes con mayor radio de explosión.", damageMultiplier: 1.1, fireRateMultiplier: 1.01, rangeMultiplier: 1.04, splashMultiplier: 1.22, slowBonus: 0.04, projectileSpeedMultiplier: 1.05, pierce: 0, volley: 1, chain: false, pulse: false },
    { name: "Obús de Hierro", role: "Demolición", description: "Mayor alcance y explosiones capaces de castigar grupos.", damageMultiplier: 1.22, fireRateMultiplier: 1.04, rangeMultiplier: 1.1, splashMultiplier: 1.38, slowBonus: 0.07, projectileSpeedMultiplier: 1.12, pierce: 0, volley: 1, chain: false, pulse: false },
    { name: "Artillería Pesada", role: "Supresión", description: "Dos proyectiles por salva y un área de impacto devastadora.", damageMultiplier: 1.38, fireRateMultiplier: 1.08, rangeMultiplier: 1.16, splashMultiplier: 1.6, slowBonus: 0.1, projectileSpeedMultiplier: 1.2, pierce: 0, volley: 2, chain: false, pulse: false },
    { name: "Mortero de Plasma", role: "Arma de energía", description: "Descargas que cubren una zona enorme.", damageMultiplier: 1.65, fireRateMultiplier: 1.12, rangeMultiplier: 1.24, splashMultiplier: 1.9, slowBonus: 0.16, projectileSpeedMultiplier: 1.45, pierce: 0, volley: 2, chain: false, pulse: true },
  ],
  spire: [
    { name: "Aguja", role: "Control", description: "Descarga de largo alcance que ralentiza.", damageMultiplier: 1, fireRateMultiplier: 1, rangeMultiplier: 1, splashMultiplier: 1, slowBonus: 0, projectileSpeedMultiplier: 1, pierce: 0, volley: 1, chain: false, pulse: false },
    { name: "Cristal Conductor", role: "Control", description: "Ralentización más intensa y alcance mejorado.", damageMultiplier: 1.06, fireRateMultiplier: 1.03, rangeMultiplier: 1.06, splashMultiplier: 1, slowBonus: 0.1, projectileSpeedMultiplier: 1.08, pierce: 0, volley: 1, chain: false, pulse: false },
    { name: "Bobina de Hierro", role: "Conductor", description: "El rayo salta hacia un objetivo cercano.", damageMultiplier: 1.18, fireRateMultiplier: 1.06, rangeMultiplier: 1.1, splashMultiplier: 1, slowBonus: 0.14, projectileSpeedMultiplier: 1.16, pierce: 0, volley: 1, chain: true, pulse: false },
    { name: "Torre Tesla", role: "Cadena eléctrica", description: "La descarga encadena objetivos y controla el frente.", damageMultiplier: 1.34, fireRateMultiplier: 1.1, rangeMultiplier: 1.18, splashMultiplier: 1, slowBonus: 0.18, projectileSpeedMultiplier: 1.25, pierce: 0, volley: 1, chain: true, pulse: false },
    { name: "Núcleo de Energía", role: "Control absoluto", description: "Descargas encadenadas con pulsos de energía.", damageMultiplier: 1.58, fireRateMultiplier: 1.15, rangeMultiplier: 1.28, splashMultiplier: 1, slowBonus: 0.24, projectileSpeedMultiplier: 1.45, pierce: 0, volley: 1, chain: true, pulse: true },
  ],
};

export function getTowerForm(kind: TowerKind, eraIndex: number): TowerEraForm {
  return TOWER_FORMS[kind][Math.max(0, Math.min(eraIndex, 4))];
}

export function getTowerName(kind: TowerKind, eraIndex: number) {
  return getTowerForm(kind, eraIndex).name;
}

export type TowerBranchDef = {
  id: TowerBranchId;
  kind: TowerKind;
  eraIndex: number;
  name: string;
  shortName: string;
  role: string;
  description: string;
  cost: number;
  damageMultiplier: number;
  fireRateMultiplier: number;
  rangeMultiplier: number;
  splashMultiplier: number;
  slowBonus: number;
  projectileSpeedMultiplier: number;
  pierceBonus: number;
  volleyBonus: number;
  armorPierce: number;
  burnDps: number;
  slowFactor: number;
  chainMultiplier: number;
};

export const SPECIALIZATIONS: TowerBranchDef[] = [
  { id: "ballista:siege", kind: "ballista", eraIndex: 2, name: "Doctrina de Asedio", shortName: "Asedio", role: "Antiblindaje", description: "Virotes pesados: enorme impacto y penetración a costa de cadencia.", cost: 185, damageMultiplier: 1.48, fireRateMultiplier: 0.78, rangeMultiplier: 1.08, splashMultiplier: 1, slowBonus: 0, projectileSpeedMultiplier: 1.08, pierceBonus: 2, volleyBonus: -1, armorPierce: 0.2, burnDps: 0, slowFactor: 0.55, chainMultiplier: 1 },
  { id: "ballista:rapid", kind: "ballista", eraIndex: 2, name: "Doctrina de Repetición", shortName: "Repetición", role: "Saturación", description: "Mecanismos rápidos: más virotes y cadencia, pero cada impacto es más ligero.", cost: 185, damageMultiplier: 0.76, fireRateMultiplier: 1.5, rangeMultiplier: 0.98, splashMultiplier: 1, slowBonus: 0, projectileSpeedMultiplier: 1.16, pierceBonus: 0, volleyBonus: 1, armorPierce: 0.04, burnDps: 0, slowFactor: 0.55, chainMultiplier: 1 },
  { id: "mortar:demolition", kind: "mortar", eraIndex: 2, name: "Doctrina de Demolición", shortName: "Demolición", role: "Área pesada", description: "Proyectiles de gran calibre para romper grupos y blindajes compactos.", cost: 200, damageMultiplier: 1.34, fireRateMultiplier: 0.84, rangeMultiplier: 1.06, splashMultiplier: 1.38, slowBonus: 0.04, projectileSpeedMultiplier: 0.94, pierceBonus: 0, volleyBonus: 0, armorPierce: 0.1, burnDps: 0, slowFactor: 0.55, chainMultiplier: 1 },
  { id: "mortar:incendiary", kind: "mortar", eraIndex: 2, name: "Doctrina Incendiaria", shortName: "Incendiaria", role: "Daño sostenido", description: "Cargas incendiarias: menor golpe inicial, pero dejan fuego persistente en los enemigos.", cost: 200, damageMultiplier: 0.86, fireRateMultiplier: 1.16, rangeMultiplier: 1.02, splashMultiplier: 1.12, slowBonus: 0.08, projectileSpeedMultiplier: 1.08, pierceBonus: 0, volleyBonus: 0, armorPierce: 0, burnDps: 11, slowFactor: 0.62, chainMultiplier: 1 },
  { id: "spire:storm", kind: "spire", eraIndex: 2, name: "Doctrina de Tormenta", shortName: "Tormenta", role: "Cadena eléctrica", description: "Prioriza descargas rápidas que saltan entre enemigos cercanos.", cost: 210, damageMultiplier: 1.08, fireRateMultiplier: 1.22, rangeMultiplier: 1.02, splashMultiplier: 1, slowBonus: 0.04, projectileSpeedMultiplier: 1.15, pierceBonus: 0, volleyBonus: 0, armorPierce: 0.08, burnDps: 0, slowFactor: 0.58, chainMultiplier: 1.32 },
  { id: "spire:frost", kind: "spire", eraIndex: 2, name: "Doctrina Criogénica", shortName: "Criogénica", role: "Control extremo", description: "Convierte la descarga en pulsos fríos: menos daño, mucha más ralentización.", cost: 210, damageMultiplier: 0.82, fireRateMultiplier: 0.96, rangeMultiplier: 1.14, splashMultiplier: 1, slowBonus: 0.28, projectileSpeedMultiplier: 1.02, pierceBonus: 0, volleyBonus: 0, armorPierce: 0.02, burnDps: 0, slowFactor: 0.36, chainMultiplier: 0.8 },
];

export function getBranch(id: TowerBranchId | null | undefined) {
  if (!id) return null;
  return SPECIALIZATIONS.find((branch) => branch.id === id) ?? null;
}

export function getBranches(kind: TowerKind) {
  return SPECIALIZATIONS.filter((branch) => branch.kind === kind);
}

export function branchForKind(ids: Iterable<string>, kind: TowerKind): TowerBranchId | null {
  const set = ids instanceof Set ? ids : new Set(ids);
  return SPECIALIZATIONS.find((branch) => branch.kind === kind && set.has(branch.id))?.id ?? null;
}

export function scaleTowerValue(value: number, eraIndex: number) {
  return value * ERAS[Math.max(0, Math.min(eraIndex, ERAS.length - 1))].towerMultiplier;
}

export function scaleEnemyValue(value: number, eraIndex: number) {
  return value * ERAS[Math.max(0, Math.min(eraIndex, ERAS.length - 1))].enemyMultiplier;
}
