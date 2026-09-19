import type { DifficultyId } from "./types";

export type DifficultyDef = {
  id: DifficultyId;
  name: string;
  description: string;
  enemyHp: number;
  enemySpeed: number;
  enemyGold: number;
  startGoldBonus: number;
  startLivesBonus: number;
  rewardMultiplier: number;
};

export const DIFFICULTIES: DifficultyDef[] = [
  {
    id: "recruit",
    name: "Recluta",
    description: "Para aprender sistemas y campaña. Enemigos menos resistentes y más recursos iniciales.",
    enemyHp: 0.84,
    enemySpeed: 0.94,
    enemyGold: 1.08,
    startGoldBonus: 18,
    startLivesBonus: 4,
    rewardMultiplier: 0.9,
  },
  {
    id: "warden",
    name: "Guardián",
    description: "Experiencia equilibrada y recomendada. Balance base de Cinderkeep.",
    enemyHp: 1,
    enemySpeed: 1,
    enemyGold: 1,
    startGoldBonus: 0,
    startLivesBonus: 0,
    rewardMultiplier: 1,
  },
  {
    id: "conqueror",
    name: "Conquistador",
    description: "Para campañas dominadas: enemigos más duros y veloces, con mejores recompensas.",
    enemyHp: 1.22,
    enemySpeed: 1.08,
    enemyGold: 1.1,
    startGoldBonus: -8,
    startLivesBonus: -2,
    rewardMultiplier: 1.2,
  },
];

export type GameSettings = {
  version: 1;
  difficulty: DifficultyId;
  reducedEffects: boolean;
  tutorialSeen: boolean;
};

const SETTINGS_KEY = "cinderkeep-settings-v1";

export function defaultGameSettings(): GameSettings {
  return { version: 1, difficulty: "warden", reducedEffects: false, tutorialSeen: false };
}

export function getDifficulty(id: DifficultyId): DifficultyDef {
  return DIFFICULTIES.find((item) => item.id === id) ?? DIFFICULTIES[1];
}

export function loadGameSettings(): GameSettings {
  if (typeof window === "undefined") return defaultGameSettings();
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultGameSettings();
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    const base = defaultGameSettings();
    const difficulty = DIFFICULTIES.some((item) => item.id === parsed.difficulty) ? (parsed.difficulty as DifficultyId) : base.difficulty;
    return {
      version: 1,
      difficulty,
      reducedEffects: Boolean(parsed.reducedEffects),
      tutorialSeen: Boolean(parsed.tutorialSeen),
    };
  } catch {
    return defaultGameSettings();
  }
}

export function saveGameSettings(settings: GameSettings) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { }
}
