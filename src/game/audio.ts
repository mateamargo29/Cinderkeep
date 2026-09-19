type Bus = { ctx: AudioContext; master: GainNode; sfx: GainNode; music: GainNode };

let bus: Bus | null = null;
let muted = false;
let droneTimer = 0;

function ensure(): Bus | null {
  if (typeof window === "undefined") return null;
  if (bus) return bus;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC({ latencyHint: "interactive" });
  const master = ctx.createGain();
  const sfx = ctx.createGain();
  const music = ctx.createGain();
  master.gain.value = muted ? 0 : 0.85;
  sfx.gain.value = 0.7;
  music.gain.value = 0.22;
  sfx.connect(master);
  music.connect(master);
  master.connect(ctx.destination);
  bus = { ctx, master, sfx, music };
  return bus;
}

export function unlockAudio() {
  const b = ensure();
  if (!b) return;
  if (b.ctx.state === "suspended") void b.ctx.resume();
}

export function setMuted(next: boolean) {
  muted = next;
  if (bus) bus.master.gain.setTargetAtTime(next ? 0 : 0.85, bus.ctx.currentTime, 0.03);
}

export function isMuted() {
  return muted;
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, slide = 0) {
  const b = bus;
  if (!b || muted) return;
  const t = b.ctx.currentTime;
  const osc = b.ctx.createOscillator();
  const g = b.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(b.sfx);
  osc.start(t);
  osc.stop(t + dur + 0.04);
}

export function sfxPlace() { tone(180, 0.12, "triangle", 0.12); tone(90, 0.16, "sine", 0.08); }
export function sfxShoot(kind: "ballista" | "mortar" | "spire") {
  const rate = 1 + (Math.random() * 0.16 - 0.08);
  if (kind === "ballista") tone(520 * rate, 0.07, "square", 0.045, -220);
  else if (kind === "mortar") tone(110 * rate, 0.18, "sawtooth", 0.07, -40);
  else tone(640 * rate, 0.1, "sine", 0.05, 180);
}
export function sfxHit() { tone(240 + Math.random() * 80, 0.05, "square", 0.035); }
export function sfxKill() { tone(140, 0.16, "sawtooth", 0.07, -80); tone(320, 0.1, "triangle", 0.04); }
export function sfxLeak() { tone(220, 0.28, "square", 0.08, -140); }
export function sfxUpgrade() { tone(440, 0.09, "sine", 0.06); tone(660, 0.14, "sine", 0.05); }
export function sfxWave() { tone(160, 0.22, "triangle", 0.06, 80); }
export function sfxWin() { tone(392, 0.18, "sine", 0.07); tone(523, 0.22, "sine", 0.06); tone(659, 0.32, "sine", 0.05); }
export function sfxLose() { tone(180, 0.4, "sawtooth", 0.08, -120); }

export function tickMusic(dt: number) {
  const b = bus;
  if (!b || muted || b.ctx.state === "suspended") return;
  droneTimer -= dt;
  if (droneTimer > 0) return;
  droneTimer = 2.4;
  const t = b.ctx.currentTime;
  const osc = b.ctx.createOscillator();
  const g = b.ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 55;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.045, t + 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
  osc.connect(g).connect(b.music);
  osc.start(t);
  osc.stop(t + 2.3);
}

export function resumeIfNeeded() {
  const b = bus;
  if (b && b.ctx.state === "suspended") void b.ctx.resume();
}
