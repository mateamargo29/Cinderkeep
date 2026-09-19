import type { DifficultyId, EraId, MapId, MetaUpgradeId, MissionKind, RunStats } from "./types";

export type CampaignMissionDef = {
  kind: MissionKind;
  title: string;
  summary: string;
  briefing: string;
  waveLimit: number;
  target: number;
  minLives?: number;
  reactorRate?: number;
  leakPenalty?: number;
};

export type CampaignMapDef = {
  id: MapId;
  name: string;
  chapter: string;
  era: EraId;
  eraLabel: string;
  description: string;
  waypoints: Array<[number, number]>;
  enemyHpMultiplier: number;
  enemySpeedMultiplier: number;
  rewardMultiplier: number;
  unlockAfter: MapId | null;
  mission: CampaignMissionDef;
};

export const CAMPAIGN_MAPS: CampaignMapDef[] = [
  {
    id: "ash-pass",
    name: "Paso de Ceniza",
    chapter: "Capítulo I",
    era: "ash",
    eraLabel: "Ceniza",
    description: "El sendero original. Ideal para fundar el bastión y aprender a evolucionar durante la batalla.",
    waypoints: [[0,1],[10,1],[10,3],[2,3],[2,5],[11,5],[11,7],[13,7]],
    enemyHpMultiplier: 1,
    enemySpeedMultiplier: 1,
    rewardMultiplier: 1,
    unlockAfter: null,
    mission: {
      kind: "survive",
      title: "Primera Guardia",
      summary: "Resiste 8 oleadas y conserva el bastión.",
      briefing: "Establece la primera línea defensiva. Sobrevive ocho oleadas; cualquier cantidad de vidas restante es suficiente.",
      waveLimit: 8,
      target: 8,
    },
  },
  {
    id: "bronze-crossing",
    name: "Cruce de Bronce",
    chapter: "Capítulo II",
    era: "bronze",
    eraLabel: "Bronce",
    description: "Una ruta quebrada con cambios de dirección tempranos. Las columnas enemigas avanzan con mayor rapidez.",
    waypoints: [[0,7],[4,7],[4,5],[1,5],[1,2],[8,2],[8,6],[12,6],[12,1],[13,1]],
    enemyHpMultiplier: 1.04,
    enemySpeedMultiplier: 1.06,
    rewardMultiplier: 1.08,
    unlockAfter: "ash-pass",
    mission: {
      kind: "integrity",
      title: "Muralla de Bronce",
      summary: "Completa 10 oleadas y termina con al menos 10 vidas.",
      briefing: "No basta con sobrevivir: el cruce debe quedar operativo. Tras la décima oleada el bastión debe conservar 10 vidas o más.",
      waveLimit: 10,
      target: 10,
      minLives: 10,
    },
  },
  {
    id: "iron-gate",
    name: "Puerta de Hierro",
    chapter: "Capítulo III",
    era: "iron",
    eraLabel: "Hierro",
    description: "Un corredor defensivo largo. Los invasores llegan reforzados y obligan a cubrir dos grandes frentes.",
    waypoints: [[0,4],[3,4],[3,1],[11,1],[11,3],[6,3],[6,7],[13,7]],
    enemyHpMultiplier: 1.1,
    enemySpeedMultiplier: 1.02,
    rewardMultiplier: 1.16,
    unlockAfter: "bronze-crossing",
    mission: {
      kind: "boss_hunt",
      title: "Cacería de Hierro",
      summary: "Elimina 3 comandantes antes de agotar 12 oleadas.",
      briefing: "Los comandantes sostienen la ofensiva. Destruye tres jefes; la misión termina en cuanto cae el tercero.",
      waveLimit: 12,
      target: 3,
    },
  },
  {
    id: "industrial-ring",
    name: "Anillo Industrial",
    chapter: "Capítulo IV",
    era: "industrial",
    eraLabel: "Industrial",
    description: "El frente serpentea entre instalaciones mecánicas. Más resistencia enemiga, pero también mejores recompensas.",
    waypoints: [[0,1],[5,1],[5,3],[1,3],[1,7],[9,7],[9,5],[6,5],[6,3],[12,3],[12,7],[13,7]],
    enemyHpMultiplier: 1.17,
    enemySpeedMultiplier: 1.05,
    rewardMultiplier: 1.28,
    unlockAfter: "iron-gate",
    mission: {
      kind: "elimination",
      title: "Guerra de Desgaste",
      summary: "Elimina 110 unidades enemigas en un máximo de 10 oleadas.",
      briefing: "Rompe la capacidad industrial del enemigo. Cada baja cuenta; alcanza 110 eliminaciones antes de terminar la décima oleada.",
      waveLimit: 10,
      target: 110,
    },
  },
  {
    id: "quantum-nexus",
    name: "Nexo Cuántico",
    chapter: "Capítulo V",
    era: "future",
    eraLabel: "Futuro",
    description: "La campaña culmina en un circuito de energía. Los enemigos son más resistentes y veloces desde el primer minuto.",
    waypoints: [[0,7],[2,7],[2,1],[5,1],[5,6],[8,6],[8,2],[11,2],[11,7],[13,7]],
    enemyHpMultiplier: 1.25,
    enemySpeedMultiplier: 1.08,
    rewardMultiplier: 1.42,
    unlockAfter: "industrial-ring",
    mission: {
      kind: "reactor",
      title: "Carga del Nexo",
      summary: "Carga el reactor al 100%. Las fugas drenan energía.",
      briefing: "El Nexo solo se estabiliza bajo combate. Mientras una oleada esté activa, el reactor acumula energía; cada enemigo que atraviese el bastión descarga parte del núcleo.",
      waveLimit: 12,
      target: 100,
      reactorRate: 0.82,
      leakPenalty: 12,
    },
  },
];

export const META_UPGRADES: Array<{
  id: MetaUpgradeId;
  name: string;
  description: string;
  maxLevel: number;
}> = [
  { id: "arsenal", name: "Arsenal permanente", description: "+4% de daño para todas las torres por nivel.", maxLevel: 5 },
  { id: "treasury", name: "Tesorería", description: "+12 de oro inicial por nivel.", maxLevel: 5 },
  { id: "bastion", name: "Fortificación", description: "+2 vidas iniciales por nivel.", maxLevel: 5 },
  { id: "salvage", name: "Recuperación", description: "+5% de oro por cada enemigo derrotado por nivel.", maxLevel: 5 },
];

export type CampaignRecord = {
  attempts: number;
  victories: number;
  bestDifficulty: DifficultyId | null;
  bestLives: number;
  bestTimeSeconds: number | null;
};

export type CampaignStats = {
  runs: number;
  victories: number;
  kills: number;
  bossKills: number;
  damageDealt: number;
  playSeconds: number;
};

export type CampaignProfile = {
  version: 1;
  xp: number;
  level: number;
  shards: number;
  victories: MapId[];
  selectedMap: MapId;
  upgrades: Record<MetaUpgradeId, number>;
  records: Record<MapId, CampaignRecord>;
  stats: CampaignStats;
};

const SAVE_KEY = "cinderkeep-campaign-v1";

function defaultRecord(): CampaignRecord {
  return { attempts: 0, victories: 0, bestDifficulty: null, bestLives: 0, bestTimeSeconds: null };
}

function defaultRecords(): Record<MapId, CampaignRecord> {
  return Object.fromEntries(CAMPAIGN_MAPS.map((map) => [map.id, defaultRecord()])) as Record<MapId, CampaignRecord>;
}

export function defaultCampaignProfile(): CampaignProfile {
  return {
    version: 1,
    xp: 0,
    level: 1,
    shards: 0,
    victories: [],
    selectedMap: "ash-pass",
    upgrades: { arsenal: 0, treasury: 0, bastion: 0, salvage: 0 },
    records: defaultRecords(),
    stats: { runs: 0, victories: 0, kills: 0, bossKills: 0, damageDealt: 0, playSeconds: 0 },
  };
}

export function loadCampaignProfile(): CampaignProfile {
  if (typeof window === "undefined") return defaultCampaignProfile();
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultCampaignProfile();
    const parsed = JSON.parse(raw) as Partial<CampaignProfile>;
    if (parsed.version !== 1) return defaultCampaignProfile();
    const base = defaultCampaignProfile();
    const profile: CampaignProfile = {
      ...base,
      ...parsed,
      victories: Array.isArray(parsed.victories) ? parsed.victories.filter((id): id is MapId => CAMPAIGN_MAPS.some((map) => map.id === id)) : [],
      selectedMap: CAMPAIGN_MAPS.some((map) => map.id === parsed.selectedMap) ? (parsed.selectedMap as MapId) : base.selectedMap,
      upgrades: { ...base.upgrades, ...(parsed.upgrades ?? {}) },
      records: defaultRecords(),
      stats: { ...base.stats, ...(parsed.stats ?? {}) },
    };
    const parsedRecords = parsed.records as Partial<Record<MapId, Partial<CampaignRecord>>> | undefined;
    for (const map of CAMPAIGN_MAPS) {
      const stored = parsedRecords?.[map.id];
      profile.records[map.id] = {
        ...defaultRecord(),
        ...(stored ?? {}),
        bestDifficulty: stored?.bestDifficulty === "recruit" || stored?.bestDifficulty === "warden" || stored?.bestDifficulty === "conqueror" ? stored.bestDifficulty : null,
        attempts: Math.max(0, Number(stored?.attempts) || 0),
        victories: Math.max(0, Number(stored?.victories) || 0),
        bestLives: Math.max(0, Number(stored?.bestLives) || 0),
        bestTimeSeconds: stored?.bestTimeSeconds == null ? null : Math.max(0, Number(stored.bestTimeSeconds) || 0),
      };
    }
    profile.stats = {
      runs: Math.max(0, Number(profile.stats.runs) || 0),
      victories: Math.max(0, Number(profile.stats.victories) || 0),
      kills: Math.max(0, Number(profile.stats.kills) || 0),
      bossKills: Math.max(0, Number(profile.stats.bossKills) || 0),
      damageDealt: Math.max(0, Number(profile.stats.damageDealt) || 0),
      playSeconds: Math.max(0, Number(profile.stats.playSeconds) || 0),
    };
    profile.level = levelFromXp(profile.xp);
    const selected = getCampaignMap(profile.selectedMap);
    if (!isMapUnlocked(profile, selected)) profile.selectedMap = CAMPAIGN_MAPS.find((map) => isMapUnlocked(profile, map))?.id ?? "ash-pass";
    for (const def of META_UPGRADES) profile.upgrades[def.id] = Math.max(0, Math.min(def.maxLevel, Number(profile.upgrades[def.id]) || 0));
    return profile;
  } catch {
    return defaultCampaignProfile();
  }
}

export function saveCampaignProfile(profile: CampaignProfile) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(profile)); } catch { }
}

export function getCampaignMap(id: MapId) {
  return CAMPAIGN_MAPS.find((map) => map.id === id) ?? CAMPAIGN_MAPS[0];
}

export function isMapUnlocked(profile: CampaignProfile, map: CampaignMapDef) {
  return map.unlockAfter == null || profile.victories.includes(map.unlockAfter);
}

export function upgradeCost(level: number) {
  return 2 + Math.max(0, level);
}

export function levelFromXp(xp: number) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 140)) + 1);
}

export function xpForNextLevel(level: number) {
  return 140 * level * level;
}

export function awardForMap(map: CampaignMapDef, lives: number) {
  const index = CAMPAIGN_MAPS.findIndex((item) => item.id === map.id);
  const missionBonus = map.mission.kind === "survive" ? 1 : 1.08;
  return {
    xp: Math.round((110 + index * 45 + Math.max(0, lives) * 2) * map.rewardMultiplier * missionBonus),
    shards: 2 + Math.floor(index / 2) + (map.mission.kind === "reactor" ? 1 : 0),
  };
}

const DIFFICULTY_RANK: Record<DifficultyId, number> = { recruit: 1, warden: 2, conqueror: 3 };

export function recordCampaignRun(
  profile: CampaignProfile,
  mapId: MapId,
  difficulty: DifficultyId,
  lives: number,
  runStats: RunStats,
  victory: boolean,
) {
  const record = profile.records[mapId] ?? defaultRecord();
  record.attempts += 1;
  profile.stats.runs += 1;
  profile.stats.kills += Math.max(0, runStats.kills);
  profile.stats.bossKills += Math.max(0, runStats.bossKills);
  profile.stats.damageDealt += Math.max(0, runStats.damageDealt);
  profile.stats.playSeconds += Math.max(0, runStats.elapsedSeconds);

  if (victory) {
    record.victories += 1;
    profile.stats.victories += 1;
    record.bestLives = Math.max(record.bestLives, Math.max(0, lives));
    const elapsed = Math.max(0, Math.floor(runStats.elapsedSeconds));
    if (elapsed > 0 && (record.bestTimeSeconds == null || elapsed < record.bestTimeSeconds)) record.bestTimeSeconds = elapsed;
    if (record.bestDifficulty == null || DIFFICULTY_RANK[difficulty] > DIFFICULTY_RANK[record.bestDifficulty]) record.bestDifficulty = difficulty;
  }

  profile.records[mapId] = record;
}
