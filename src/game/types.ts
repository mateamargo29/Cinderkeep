export type TowerKind = "ballista" | "mortar" | "spire";
export type EnemyArchetype = "ashling" | "streaker" | "carapace" | "warden";
export type EnemyKind =
  | EnemyArchetype
  | "bronze_raider"
  | "bronze_scout"
  | "bronze_hoplite"
  | "bronze_colossus"
  | "iron_legionary"
  | "iron_outrider"
  | "iron_bulwark"
  | "iron_warlord"
  | "industrial_trooper"
  | "industrial_bike"
  | "industrial_tank"
  | "industrial_dreadnought"
  | "future_drone"
  | "future_phase"
  | "future_mech"
  | "future_singularity";
export type EnemyRole = "infantry" | "fast" | "armored" | "boss";
export type Phase = "menu" | "build" | "wave" | "victory" | "defeat";
export type EraId = "ash" | "bronze" | "iron" | "industrial" | "future";
export type MapId = "ash-pass" | "bronze-crossing" | "iron-gate" | "industrial-ring" | "quantum-nexus";
export type MetaUpgradeId = "arsenal" | "treasury" | "bastion" | "salvage";
export type MissionKind = "survive" | "integrity" | "boss_hunt" | "elimination" | "reactor";
export type DifficultyId = "recruit" | "warden" | "conqueror";
export type GameSpeed = 1 | 2 | 3;
export type TowerBranchId =
  | "ballista:siege"
  | "ballista:rapid"
  | "mortar:demolition"
  | "mortar:incendiary"
  | "spire:storm"
  | "spire:frost";

export type Vec2 = { x: number; y: number };

export type TowerDef = {
  kind: TowerKind;
  name: string;
  blurb: string;
  cost: number;
  range: number;
  fireRate: number;
  damage: number;
  splash: number;
  slow: number;
  projectileSpeed: number;
  era: number;
};

export type EnemyDef = {
  kind: EnemyKind;
  name: string;
  hp: number;
  speed: number;
  gold: number;
  armor: number;
  scale: number;
  sprite: "ashling" | "streaker" | "carapace";
  era: number;
  role: EnemyRole;
  boss: boolean;
  leakDamage: number;
  ability: string;
  regenRate: number;
  shieldRatio: number;
  shieldRegenRate: number;
  slowResist: number;
  resistBallista: number;
  resistMortar: number;
  resistSpire: number;
};

export type SpawnGroup = {
  kind: EnemyArchetype;
  count: number;
  interval: number;
  delay: number;
  hpScale?: number;
  goldScale?: number;
};

export type WaveDef = { groups: SpawnGroup[] };

export type Tower = {
  id: number;
  kind: TowerKind;
  col: number;
  row: number;
  x: number;
  y: number;
  dmgLevel: number;
  rateLevel: number;
  spent: number;
  cooldown: number;
  angle: number;
  recoil: number;
};

export type Enemy = {
  alive: boolean;
  id: number;
  kind: EnemyKind;
  role: EnemyRole;
  boss: boolean;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  shieldRegen: number;
  shieldCooldown: number;
  speed: number;
  gold: number;
  armor: number;
  scale: number;
  leakDamage: number;
  wp: number;
  pathT: number;
  slow: number;
  flash: number;
  anim: number;
  facing: number;
  lane: number;
  era: number;
  regen: number;
  slowFactor: number;
  slowResist: number;
  resistBallista: number;
  resistMortar: number;
  resistSpire: number;
  burn: number;
  burnDps: number;
  abilityTimer: number;
  abilityFlash: number;
  speedBoost: number;
  speedBoostTimer: number;
  fortify: number;
  fortifyTimer: number;
};

export type Projectile = {
  alive: boolean;
  kind: TowerKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  splash: number;
  slow: number;
  targetId: number;
  ttl: number;
  destX: number;
  destY: number;
  homing: boolean;
  pierce: number;
  techEra: number;
  branchId: TowerBranchId | null;
  armorPierce: number;
  burnDps: number;
  slowFactor: number;
  chainMultiplier: number;
};

export type Particle = {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

export type Floater = {
  alive: boolean;
  x: number;
  y: number;
  vy: number;
  life: number;
  text: string;
  color: string;
};

export type RunStats = {
  kills: number;
  bossKills: number;
  towersBuilt: number;
  towersSold: number;
  goldEarned: number;
  goldSpent: number;
  livesLost: number;
  leaks: number;
  damageDealt: number;
  shotsFired: number;
  elapsedSeconds: number;
  highestEra: number;
};

export type SelectedTowerInfo = {
  id: number;
  kind: TowerKind;
  name: string;
  dmgLevel: number;
  rateLevel: number;
  dmgCost: number | null;
  rateCost: number | null;
  sellValue: number;
  damage: number;
  fireRate: number;
  range: number;
  role: string;
};

export type HudState = {
  gold: number;
  lives: number;
  wave: number;
  totalWaves: number;
  phase: Phase;
  selectedKind: TowerKind | null;
  selectedTower: SelectedTowerInfo | null;
  remainingInWave: number;
  muted: boolean;
  assetsReady: boolean;
  hoverCol: number;
  hoverRow: number;
  era: EraId;
  eraName: string;
  eraIndex: number;
  eraCount: number;
  researchCost: number | null;
  researchReady: boolean;
  researchedTech: string[];
  availableTech: string[];
  selectedTech: string | null;
  campaignMap: MapId;
  campaignMapName: string;
  campaignEraLabel: string;
  campaignXp: number;
  campaignLevel: number;
  campaignShards: number;
  campaignVictories: MapId[];
  campaignUpgrades: Record<MetaUpgradeId, number>;
  campaignRewardXp: number;
  campaignRewardShards: number;
  campaignRecords: Record<MapId, {
    attempts: number;
    victories: number;
    bestDifficulty: DifficultyId | null;
    bestLives: number;
    bestTimeSeconds: number | null;
  }>;
  campaignStats: {
    runs: number;
    victories: number;
    kills: number;
    bossKills: number;
    damageDealt: number;
    playSeconds: number;
  };
  missionTitle: string;
  missionBriefing: string;
  missionProgress: number;
  missionTarget: number;
  missionProgressLabel: string;
  missionFailedReason: string | null;
  difficulty: DifficultyId;
  difficultyName: string;
  paused: boolean;
  gameSpeed: GameSpeed;
  reducedEffects: boolean;
  tutorialSeen: boolean;
  runStats: RunStats;
};
