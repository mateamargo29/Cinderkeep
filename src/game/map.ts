import { CELL, COLS, ROWS } from "./config";
import type { Vec2 } from "./types";

export type BuiltPath = { points: Vec2[]; cells: Set<string>; length: number };

export function cellCenter(col: number, row: number): Vec2 {
  return { x: (col + 0.5) * CELL, y: (row + 0.5) * CELL };
}

export function buildPath(waypoints: Array<[number, number]>): BuiltPath {
  const cells = new Set<string>();
  const points: Vec2[] = waypoints.map(([c, r]) => cellCenter(c, r));

  for (let i = 0; i < waypoints.length - 1; i++) {
    const [c0, r0] = waypoints[i];
    const [c1, r1] = waypoints[i + 1];
    if (r0 === r1) {
      const a = Math.min(c0, c1);
      const b = Math.max(c0, c1);
      for (let c = a; c <= b; c++) cells.add(`${c},${r0}`);
    } else if (c0 === c1) {
      const a = Math.min(r0, r1);
      const b = Math.max(r0, r1);
      for (let r = a; r <= b; r++) cells.add(`${c0},${r}`);
    } else {
      throw new Error("Los tramos del mapa deben ser ortogonales");
    }
  }

  let length = 0;
  for (let i = 0; i < points.length - 1; i++) {
    length += Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
  }

  return { points, cells, length };
}

export function inBounds(col: number, row: number) {
  return col >= 0 && row >= 0 && col < COLS && row < ROWS;
}
