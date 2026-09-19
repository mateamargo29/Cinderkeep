export type ImageLike = HTMLCanvasElement;

export type Atlas = {
  image: ImageLike;
  cols: number;
  rows: number;
};

export type GameAssets = {
  grass: ImageLike;
  path: ImageLike;
  pad: ImageLike;
  ballista: ImageLike;
  mortar: ImageLike;
  spire: ImageLike;
  keep: ImageLike;
  ashling: Atlas;
  streaker: Atlas;
  carapace: Atlas;
};

type Paint = (ctx: CanvasRenderingContext2D, w: number, h: number, frame?: number) => void;

function canvas(w: number, h: number, paint: Paint): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D no disponible");
  paint(ctx, w, h);
  return c;
}

function tile(base: string, line: string, kind: "grass" | "path" | "pad") {
  return canvas(64, 64, (ctx, w, h) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    if (kind === "grass") {
      for (let i = 0; i < 14; i++) {
        const x = (i * 19) % 64;
        const y = (i * 31) % 64;
        ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x + 3, y - 4); ctx.stroke();
      }
    } else if (kind === "path") {
      for (let y = 8; y < 64; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(64, y - 5); ctx.stroke(); }
    } else {
      ctx.strokeRect(7, 7, 50, 50);
      ctx.beginPath(); ctx.moveTo(32, 8); ctx.lineTo(32, 56); ctx.moveTo(8, 32); ctx.lineTo(56, 32); ctx.stroke();
    }
  });
}

function tower(kind: "ballista" | "mortar" | "spire") {
  return canvas(96, 96, (ctx) => {
    ctx.translate(48, 52);
    ctx.fillStyle = "#2a2622"; ctx.beginPath(); ctx.arc(0, 10, 25, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#c4b08a"; ctx.lineWidth = 5;
    if (kind === "ballista") {
      ctx.beginPath(); ctx.moveTo(-30, -4); ctx.lineTo(30, -4); ctx.moveTo(-24, -17); ctx.quadraticCurveTo(0, 7, 24, -17); ctx.stroke();
      ctx.strokeStyle = "#eee8e0"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -27); ctx.lineTo(0, 23); ctx.stroke();
    } else if (kind === "mortar") {
      ctx.rotate(-0.45); ctx.fillStyle = "#7c756d"; ctx.fillRect(-8, -35, 16, 48); ctx.strokeRect(-8, -35, 16, 48);
    } else {
      ctx.strokeStyle = "#a9d8e8"; ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(-14, 16); ctx.lineTo(14, 16); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = "#a9d8e8"; ctx.beginPath(); ctx.arc(0, -35, 5, 0, Math.PI * 2); ctx.fill();
    }
  });
}

function keep() {
  return canvas(112, 112, (ctx) => {
    ctx.translate(56, 62);
    ctx.fillStyle = "#3a3530"; ctx.fillRect(-34, -30, 68, 54);
    ctx.fillStyle = "#69615a";
    for (const x of [-34, -12, 12]) ctx.fillRect(x, -43, 22, 18);
    ctx.fillStyle = "#151311"; ctx.fillRect(-8, 2, 16, 22);
    ctx.strokeStyle = "#c4b08a"; ctx.lineWidth = 3; ctx.strokeRect(-34, -30, 68, 54);
  });
}

function enemyAtlas(shape: "ashling" | "streaker" | "carapace") {
  return canvas(128, 128, (ctx) => {
    for (let frame = 0; frame < 4; frame++) {
      const col = frame % 2, row = Math.floor(frame / 2);
      const ox = col * 64 + 32, oy = row * 64 + 32;
      ctx.save(); ctx.translate(ox, oy);
      const bob = frame % 2 ? 2 : -1;
      if (shape === "ashling") {
        ctx.fillStyle = "#8c6f55"; ctx.beginPath(); ctx.arc(0, bob, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#d8b36f"; ctx.fillRect(5, -7 + bob, 5, 5);
      } else if (shape === "streaker") {
        ctx.fillStyle = "#75685c"; ctx.beginPath(); ctx.moveTo(-20, bob); ctx.lineTo(13, -13 + bob); ctx.lineTo(20, 12 + bob); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#c4b08a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-25, 16); ctx.lineTo(-8, 8); ctx.stroke();
      } else {
        ctx.fillStyle = "#57524c"; ctx.beginPath(); ctx.arc(0, bob, 21, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#a79d92"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, bob, 17, Math.PI * 0.15, Math.PI * 1.85); ctx.stroke();
      }
      ctx.restore();
    }
  });
}

export async function loadAssets(): Promise<GameAssets> {
  return {
    grass: tile("#24211b", "#343027", "grass"),
    path: tile("#3a332b", "#51483d", "path"),
    pad: tile("#27231f", "#5c5349", "pad"),
    ballista: tower("ballista"), mortar: tower("mortar"), spire: tower("spire"), keep: keep(),
    ashling: { image: enemyAtlas("ashling"), cols: 2, rows: 2 },
    streaker: { image: enemyAtlas("streaker"), cols: 2, rows: 2 },
    carapace: { image: enemyAtlas("carapace"), cols: 2, rows: 2 },
  };
}
