import type { Game, InitApi, RenderApi } from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import * as K from "./constants";

export type Screen = "title" | "howto" | "playing" | "won";
export type Suit = (typeof K.SUITS)[number];
export type PileKind = "stock" | "waste" | "foundation" | "tableau";
export interface CardState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly faceUp: boolean;
}
export interface DragState {
  readonly cards: readonly CardState[];
  readonly fromPile: "waste" | "foundation" | "tableau";
  readonly fromIndex: number;
  readonly x: number;
  readonly y: number;
}
export interface DropTargetState {
  readonly pile: "foundation" | "tableau";
  readonly index: number;
}
export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
}
export interface PressState {
  readonly x: number;
  readonly y: number;
  readonly at: number;
}
export interface FlyerState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}
export interface CascadeState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly stock: readonly CardState[];
  readonly waste: readonly CardState[];
  readonly wasteSets: readonly number[];
  readonly foundations: readonly (readonly CardState[])[];
  readonly tableau: readonly (readonly CardState[])[];
  readonly drag: DragState | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
}
type Rect = { x: number; y: number; w: number; h: number };
export interface CascadeSnapshot {
  version: number;
  screen: Screen;
  menuIndex: number;
  titleIndex: number;
  dealMode: string;
  turnCount: number;
  dealModeLabel: string;
  muted: boolean;
  autoFlip: boolean;
  winDetect: boolean;
  launching: boolean;
  trailPainting: boolean;
  stock: unknown[];
  waste: unknown[];
  wasteSets: number[];
  wasteVisibleCount: number;
  foundations: unknown[][];
  tableau: unknown[][];
  drag: unknown;
  dropTarget: DropTargetState | null;
  pointer: PointerState;
  lastPress: PressState | null;
  launchClock: number;
  launched: number;
  flyers: unknown[];
  cascadeDone: boolean;
  trailStamps: number;
  simTime: number;
}
export interface CascadeDebugApi {
  readonly version: number;
  reset(s: DeepReadonly<CascadeState>): CascadeState;
  snapshot(s: DeepReadonly<CascadeState>): CascadeSnapshot;
  reconcile(s: DeepReadonly<CascadeState>): CascadeState;
  menuItemRect(s: DeepReadonly<CascadeState>, i: number): Rect | null;
  setScreen(s: DeepReadonly<CascadeState>, v: Screen): CascadeState;
  setMenuIndex(s: DeepReadonly<CascadeState>, v: number): CascadeState;
  setTitleIndex(s: DeepReadonly<CascadeState>, v: number): CascadeState;
  addCard(
    s: DeepReadonly<CascadeState>,
    p: PileKind,
    i: number,
    u: Suit,
    r: number,
    f: boolean,
  ): CascadeState;
  removeCard(s: DeepReadonly<CascadeState>, id: number): CascadeState;
  setCardFaceUp(
    s: DeepReadonly<CascadeState>,
    id: number,
    f: boolean,
  ): CascadeState;
  clearPile(
    s: DeepReadonly<CascadeState>,
    p: PileKind,
    i: number,
  ): CascadeState;
  clearTable(s: DeepReadonly<CascadeState>): CascadeState;
  addWasteSet(s: DeepReadonly<CascadeState>, n: number): CascadeState;
  clearWasteSets(s: DeepReadonly<CascadeState>): CascadeState;
  deal(s: DeepReadonly<CascadeState>): CascadeState;
  turnStock(s: DeepReadonly<CascadeState>): CascadeState;
  move(
    s: DeepReadonly<CascadeState>,
    a: PileKind,
    i: number,
    row: number,
    b: "foundation" | "tableau",
    j: number,
  ): [CascadeState, boolean];
  autoMove(
    s: DeepReadonly<CascadeState>,
    p: "waste" | "tableau",
    i: number,
  ): [CascadeState, boolean];
  pointerDown(
    s: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerMove(
    s: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerUp(s: DeepReadonly<CascadeState>, x: number, y: number): CascadeState;
  setAutoFlip(s: DeepReadonly<CascadeState>, v: boolean): CascadeState;
  setWinDetect(s: DeepReadonly<CascadeState>, v: boolean): CascadeState;
  setLaunching(s: DeepReadonly<CascadeState>, v: boolean): CascadeState;
  setTrailPainting(s: DeepReadonly<CascadeState>, v: boolean): CascadeState;
  addFlyer(
    s: DeepReadonly<CascadeState>,
    u: Suit,
    r: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): CascadeState;
  setFlyerPosition(
    s: DeepReadonly<CascadeState>,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  setFlyerVelocity(
    s: DeepReadonly<CascadeState>,
    id: number,
    vx: number,
    vy: number,
  ): CascadeState;
  removeFlyer(s: DeepReadonly<CascadeState>, id: number): CascadeState;
  clearFlyers(s: DeepReadonly<CascadeState>): CascadeState;
  setLaunchClock(s: DeepReadonly<CascadeState>, v: number): CascadeState;
  clearTrail(s: DeepReadonly<CascadeState>): CascadeState;
  drawLaunchVx(): number;
}
export const BACKGROUND = "#102d2b";
const RED = new Set<Suit>(["hearts", "diamonds"]);
const stamps: { c: CardState; x: number; y: number }[] = [];
const red = (s: Suit) => RED.has(s);
const col = (s: Suit) => (red(s) ? "red" : "black");
const cpy = (c: CardState, face = c.faceUp): CardState => ({
  ...c,
  faceUp: face,
});
const rect = (x: number, y: number, w: number, h: number): Rect => ({
  x,
  y,
  w,
  h,
});
const inside = (r: Rect, x: number, y: number) =>
  x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
const emptyF = () => Array.from({ length: 4 }, () => [] as CardState[]);
const emptyT = () => Array.from({ length: 7 }, () => [] as CardState[]);
const last = <T>(a: readonly T[]): T | undefined => a[a.length - 1];
function initial(): CascadeState {
  return {
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    stock: [],
    waste: [],
    wasteSets: [],
    foundations: emptyF(),
    tableau: emptyT(),
    drag: null,
    dropTarget: null,
    pointer: { x: 0, y: 0, down: false },
    lastPress: null,
    autoFlip: true,
    winDetect: true,
    launching: true,
    trailPainting: true,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: 1,
    simTime: 0,
    muted: false,
  };
}
function pile(
  s: DeepReadonly<CascadeState>,
  p: PileKind,
  i: number,
): readonly CardState[] {
  if (p === "stock") return s.stock;
  if (p === "waste") return s.waste;
  if (p === "foundation") return s.foundations[i];
  return s.tableau[i];
}
function setPile(
  s: DeepReadonly<CascadeState>,
  p: PileKind,
  i: number,
  v: readonly CardState[],
): CascadeState {
  if (p === "stock") return { ...s, stock: v };
  if (p === "waste") return { ...s, waste: v };
  if (p === "foundation")
    return {
      ...s,
      foundations: s.foundations.map((x, n) => (n === i ? v : x)),
    };
  return { ...s, tableau: s.tableau.map((x, n) => (n === i ? v : x)) };
}
function validRun(r: readonly CardState[]): boolean {
  return (
    r.length > 0 &&
    r.every(
      (c, i) =>
        c.faceUp &&
        (i === 0 ||
          (c.rank === r[i - 1].rank - 1 && red(c.suit) !== red(r[i - 1].suit))),
    )
  );
}
function takesF(p: readonly CardState[], r: readonly CardState[]): boolean {
  if (r.length !== 1 || !r[0].faceUp) return false;
  const t = last(p);
  return t ? t.suit === r[0].suit && r[0].rank === t.rank + 1 : r[0].rank === 1;
}
function takesT(p: readonly CardState[], r: readonly CardState[]): boolean {
  if (!validRun(r)) return false;
  const t = last(p),
    c = r[0];
  return t
    ? t.faceUp && c.rank === t.rank - 1 && red(c.suit) !== red(t.suit)
    : c.rank === 13;
}
function off(p: readonly CardState[]): number {
  const d = p.filter((c) => !c.faceUp).length,
    u = p.length - d;
  return Math.max(
    K.FACE_UP_OFFSET_MIN,
    Math.min(
      K.FACE_UP_OFFSET,
      (K.COLUMN_BOTTOM_LIMIT -
        K.TABLEAU_Y -
        K.CARD_H -
        d * K.FACE_DOWN_OFFSET) /
        Math.max(1, u - 1),
    ),
  );
}
function pos(
  s: DeepReadonly<CascadeState>,
  p: "waste" | "foundation" | "tableau",
  i: number,
  row: number,
) {
  if (p === "waste") return { x: K.WASTE_X, y: K.TOP_ROW_Y };
  if (p === "foundation") return { x: K.FOUNDATION_X[i], y: K.TOP_ROW_Y };
  let y = K.TABLEAU_Y;
  const a = off(s.tableau[i]);
  for (let n = 1; n <= row; n++)
    y += s.tableau[i][n - 1].faceUp ? a : K.FACE_DOWN_OFFSET;
  return { x: K.COLUMN_X[i], y };
}
function change(
  s: DeepReadonly<CascadeState>,
  id: number,
  fn: (c: CardState) => CardState,
): CascadeState {
  return {
    ...s,
    stock: s.stock.map((c) => (c.id === id ? fn(c) : c)),
    waste: s.waste.map((c) => (c.id === id ? fn(c) : c)),
    foundations: s.foundations.map((p) =>
      p.map((c) => (c.id === id ? fn(c) : c)),
    ),
    tableau: s.tableau.map((p) => p.map((c) => (c.id === id ? fn(c) : c))),
  };
}
function take(
  s: DeepReadonly<CascadeState>,
  p: "waste" | "foundation" | "tableau",
  i: number,
  row: number,
  commit = true,
) {
  const a = pile(s, p, i);
  const r = p === "tableau" ? a.slice(row) : a.slice(row, row + 1);
  if (!validRun(r)) return { s: s as CascadeState, r: [] as CardState[] };
  let n = setPile(s, p, i, a.slice(0, row));
  if (commit && p === "waste" && s.wasteSets.length) {
    const w = [...s.wasteSets];
    w[w.length - 1]--;
    if (!last(w)) w.pop();
    n = { ...n, wasteSets: w };
  }
  const q = last(n.tableau[i]);
  if (commit && p === "tableau" && n.autoFlip && q && !q.faceUp)
    n = change(n, q.id, (c) => cpy(c, true));
  return { s: n, r };
}
function win(s: CascadeState): CascadeState {
  return {
    ...s,
    screen: "won",
    drag: null,
    dropTarget: null,
    launchClock: K.LAUNCH_INTERVAL,
    launched: 0,
    flyers: [],
    cascadeDone: false,
  };
}
function move(
  s: DeepReadonly<CascadeState>,
  a: PileKind,
  i: number,
  row: number,
  b: "foundation" | "tableau",
  j: number,
): [CascadeState, boolean] {
  if (a === "stock") return [s as CascadeState, false];
  const q = take(s, a, i, row);
  if (!q.r.length) return [s as CascadeState, false];
  const ok =
    b === "foundation"
      ? takesF(s.foundations[j], q.r)
      : takesT(s.tableau[j], q.r);
  if (!ok) return [s as CascadeState, false];
  const n = setPile(q.s, b, j, [...pile(q.s, b, j), ...q.r]);
  return [
    n.winDetect && n.foundations.every((x) => x.length === 13)
      ? win(n)
      : { ...n, drag: null, dropTarget: null },
    true,
  ];
}
function fresh(s: DeepReadonly<CascadeState>): CascadeState {
  const d = K.SUITS.flatMap((u) =>
    Array.from({ length: 13 }, (_, i) => ({ u, r: i + 1 })),
  );
  for (let i = d.length - 1; i; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  let id = s.nextId;
  const t = emptyT();
  for (let x = 0; x < 7; x++)
    for (let y = 0; y <= x; y++) {
      const q = d.shift()!;
      t[x].push({ id: id++, suit: q.u, rank: q.r, faceUp: y === x });
    }
  const stock = d.map((q) => ({
    id: id++,
    suit: q.u,
    rank: q.r,
    faceUp: false,
  }));
  stamps.length = 0;
  return {
    ...s,
    screen: "playing",
    menuIndex: 0,
    stock,
    waste: [],
    wasteSets: [],
    foundations: emptyF(),
    tableau: t,
    drag: null,
    dropTarget: null,
    launched: 0,
    launchClock: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: id,
  };
}
function turn(s: DeepReadonly<CascadeState>): CascadeState {
  if (s.stock.length) {
    const n = Math.min(K.TURN_COUNT, s.stock.length),
      r = s.stock
        .slice(-n)
        .reverse()
        .map((c) => cpy(c, true));
    return {
      ...s,
      stock: s.stock.slice(0, -n),
      waste: [...s.waste, ...r],
      wasteSets: [...s.wasteSets, n],
    };
  }
  if (!s.waste.length) return s as CascadeState;
  return {
    ...s,
    stock: [...s.waste].reverse().map((c) => cpy(c, false)),
    waste: [],
    wasteSets: [],
  };
}
function target(
  s: DeepReadonly<CascadeState>,
  d: DragState,
): DropTargetState | null {
  const x = d.x + K.CARD_W / 2,
    y = d.y + K.CARD_H / 2;
  for (let i = 0; i < 4; i++)
    if (
      inside(rect(K.FOUNDATION_X[i], K.TOP_ROW_Y, K.CARD_W, K.CARD_H), x, y) &&
      takesF(s.foundations[i], d.cards)
    )
      return { pile: "foundation", index: i };
  for (let i = 0; i < 7; i++) {
    const p = s.tableau[i];
    let h = K.TABLEAU_Y + K.CARD_H;
    if (p.length) {
      let yy = K.TABLEAU_Y;
      for (let n = 1; n < p.length; n++)
        yy += p[n - 1].faceUp ? off(p) : K.FACE_DOWN_OFFSET;
      h = yy + K.CARD_H;
    }
    if (
      inside(
        rect(K.COLUMN_X[i], K.TABLEAU_Y, K.CARD_W, h - K.TABLEAU_Y),
        x,
        y,
      ) &&
      takesT(p, d.cards)
    )
      return { pile: "tableau", index: i };
  }
  return null;
}
function event(
  s: CascadeState,
  type: "down" | "move" | "up",
  x: number,
  y: number,
): CascadeState {
  let n = { ...s, pointer: { x, y, down: type !== "up" } };
  if (type === "move" && s.drag) {
    const d = {
      ...s.drag,
      x: x - (s.pointer.x - s.drag.x),
      y: y - (s.pointer.y - s.drag.y),
    };
    return { ...n, drag: d, dropTarget: target(n, d) };
  }
  if (type === "down") {
    const p = s.screen === "playing" ? find(s, x, y) : null;
    const last = s.lastPress;
    const dbl =
      !!p &&
      !!last &&
      s.simTime - last.at <= K.DOUBLE_CLICK_WINDOW &&
      Math.hypot(x - last.x, y - last.y) <= K.DOUBLE_CLICK_SLOP;
    n = { ...n, lastPress: { x, y, at: s.simTime } };
    if (s.screen === "won") return fresh(n);
    if (dbl && p) {
      const f = s.foundations.findIndex((q) =>
        takesF(q, [pile(s, p.p, p.i)[p.row]]),
      );
      return f >= 0 ? move(n, p.p, p.i, p.row, "foundation", f)[0] : n;
    }
    if (p) {
      const q = take(n, p.p, p.i, p.row, false);
      if (q.r.length) {
        const z = pos(n, p.p, p.i, p.row);
        return {
          ...q.s,
          drag: { cards: q.r, fromPile: p.p, fromIndex: p.i, x: z.x, y: z.y },
          dropTarget: null,
        };
      }
    }
    return n;
  }
  if (type === "up") {
    if (!s.drag) {
      if (
        s.screen === "playing" &&
        inside(rect(K.STOCK_X, K.TOP_ROW_Y, K.CARD_W, K.CARD_H), x, y)
      )
        return turn(n);
      return menuClick(n, x, y, s.pointer.x, s.pointer.y);
    }
    const d = s.drag,
      dd = Math.hypot(x - (s.lastPress?.x ?? x), y - (s.lastPress?.y ?? y));
    if (dd <= K.DRAG_THRESHOLD) return { ...s, drag: null, dropTarget: null };
    const t = target(s, { ...d, x, y });
    if (!t) {
      return {
        ...setPile(s, d.fromPile, d.fromIndex, [
          ...pile(s, d.fromPile, d.fromIndex),
          ...d.cards,
        ]),
        drag: null,
        dropTarget: null,
      };
    }
    const destination = pile(s, t.pile, t.index);
    let landed = setPile(s, t.pile, t.index, [...destination, ...d.cards]);
    if (d.fromPile === "waste" && landed.wasteSets.length) {
      const sets = [...landed.wasteSets];
      sets[sets.length - 1]--;
      if (!last(sets)) sets.pop();
      landed = { ...landed, wasteSets: sets };
    }
    const exposed = last(landed.tableau[d.fromIndex]);
    if (
      d.fromPile === "tableau" &&
      landed.autoFlip &&
      exposed &&
      !exposed.faceUp
    )
      landed = change(landed, exposed.id, (c) => cpy(c, true));
    return landed.winDetect && landed.foundations.every((p) => p.length === 13)
      ? win(landed)
      : { ...landed, drag: null, dropTarget: null };
  }
  return n;
}
function find(
  s: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): { p: "waste" | "foundation" | "tableau"; i: number; row: number } | null {
  if (
    s.wasteSets.length &&
    inside(rect(K.WASTE_X, K.TOP_ROW_Y, K.CARD_W, K.CARD_H), x, y)
  )
    return { p: "waste", i: 0, row: s.waste.length - 1 };
  for (let i = 0; i < 4; i++)
    if (
      s.foundations[i].length &&
      inside(rect(K.FOUNDATION_X[i], K.TOP_ROW_Y, K.CARD_W, K.CARD_H), x, y)
    )
      return { p: "foundation", i, row: s.foundations[i].length - 1 };
  for (let i = 0; i < 7; i++) {
    const p = s.tableau[i];
    if (!p.length || x < K.COLUMN_X[i] || x > K.COLUMN_X[i] + K.CARD_W)
      continue;
    let yy = K.TABLEAU_Y,
      row = p.length - 1;
    for (let n = 0; n < p.length; n++) {
      const h =
        n === p.length - 1
          ? K.CARD_H
          : p[n].faceUp
            ? off(p)
            : K.FACE_DOWN_OFFSET;
      if (y >= yy && y < yy + h) {
        row = n;
        break;
      }
      yy += p[n].faceUp ? off(p) : K.FACE_DOWN_OFFSET;
    }
    if (y >= K.TABLEAU_Y && y <= yy + K.CARD_H) return { p: "tableau", i, row };
  }
  return null;
}
function menus(screen: Screen): Rect[] {
  return screen === "title"
    ? [rect(470, 390, 340, 58), rect(470, 466, 340, 58)]
    : screen === "howto"
      ? [rect(480, 600, 320, 58)]
      : screen === "playing"
        ? [
            rect(32, K.HUD_Y, 148, K.HUD_H),
            rect(190, K.HUD_Y, 128, K.HUD_H),
            rect(328, K.HUD_Y, 128, K.HUD_H),
          ]
        : [];
}
function menuClick(
  s: CascadeState,
  x: number,
  y: number,
  px: number,
  py: number,
): CascadeState {
  const rs = menus(s.screen),
    a = rs.findIndex((r) => inside(r, px, py)),
    b = rs.findIndex((r) => inside(r, x, y));
  if (a < 0 || a !== b) return s;
  if (s.screen === "title")
    return s.menuIndex === 0
      ? fresh({ ...s, titleIndex: 0 })
      : { ...s, screen: "howto", titleIndex: 1, menuIndex: 0 };
  if (s.screen === "howto")
    return { ...s, screen: "title", menuIndex: s.titleIndex };
  return s.menuIndex === 0
    ? fresh(s)
    : s.menuIndex === 1
      ? { ...s, screen: "title", menuIndex: s.titleIndex }
      : { ...s, muted: !s.muted };
}
function activate(s: CascadeState): CascadeState {
  if (s.screen === "title")
    return s.menuIndex === 0
      ? fresh({ ...s, titleIndex: 0 })
      : { ...s, screen: "howto", titleIndex: 1, menuIndex: 0 };
  if (s.screen === "howto")
    return { ...s, screen: "title", menuIndex: s.titleIndex };
  return s.menuIndex === 0
    ? fresh(s)
    : s.menuIndex === 1
      ? { ...s, screen: "title", menuIndex: s.titleIndex }
      : { ...s, muted: !s.muted };
}
function vx() {
  return (
    (Math.random() < 0.5 ? -1 : 1) *
    (K.LAUNCH_VX_MIN + Math.random() * (K.LAUNCH_VX_MAX - K.LAUNCH_VX_MIN))
  );
}
function cascade(s: CascadeState, dt: number): CascadeState {
  let f = s.flyers
    .map((a) => {
      let vy = a.vy + K.GRAVITY * dt;
      const x = a.x + a.vx * dt;
      let y = a.y + vy * dt;
      if (y >= K.FLOOR_Y && vy > 0) {
        y = K.FLOOR_Y;
        vy = -vy * K.BOUNCE_DAMP;
      }
      if (s.trailPainting)
        stamps.push({
          c: { id: a.id, suit: a.suit, rank: a.rank, faceUp: true },
          x,
          y,
        });
      return { ...a, x, y, vy };
    })
    .filter((a) => a.x + K.CARD_W >= 0 && a.x <= K.STAGE_W);
  let clock = s.launchClock + dt,
    launched = s.launched;
  const fs = s.foundations.map((p) => [...p]);
  while (s.launching && clock >= K.LAUNCH_INTERVAL && launched < 52) {
    clock -= K.LAUNCH_INTERVAL;
    let i = launched % 4;
    for (let n = 0; n < 4 && !fs[i].length; n++) i = (i + 1) % 4;
    const c = fs[i].pop();
    if (!c) break;
    f = [
      ...f,
      {
        id: c.id,
        suit: c.suit,
        rank: c.rank,
        x: K.FOUNDATION_X[i],
        y: K.TOP_ROW_Y,
        vx: vx(),
        vy: K.LAUNCH_VY,
      },
    ];
    launched++;
  }
  return {
    ...s,
    foundations: fs,
    flyers: f,
    launchClock: clock,
    launched,
    cascadeDone: launched === 52 && !f.length,
    trailStamps: s.trailPainting
      ? s.trailStamps + s.flyers.length
      : s.trailStamps,
  };
}
const rank = (r: number) =>
  r === 1 ? "A" : r === 11 ? "J" : r === 12 ? "Q" : r === 13 ? "K" : String(r);
const glyph = (s: Suit) =>
  ({ spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" })[s];
function card(
  ctx: CanvasRenderingContext2D,
  c: CardState,
  x: number,
  y: number,
  hi = false,
) {
  ctx.fillStyle = c.faceUp ? "#f7f1dc" : "#183f54";
  ctx.strokeStyle = hi ? "#f5c451" : "#d8c9a5";
  ctx.lineWidth = hi ? 5 : 2;
  ctx.beginPath();
  ctx.roundRect(x, y, K.CARD_W, K.CARD_H, 10);
  ctx.fill();
  ctx.stroke();
  if (!c.faceUp) {
    ctx.strokeStyle = "#4d91a1";
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 10, y + 10, 80, 120);
    return;
  }
  ctx.fillStyle = red(c.suit) ? "#be3b40" : "#172c3b";
  ctx.font = "bold 25px Georgia";
  ctx.fillText(`${rank(c.rank)}${glyph(c.suit)}`, x + 10, y + 30);
  ctx.font = "52px Georgia";
  ctx.textAlign = "center";
  ctx.fillText(glyph(c.suit), x + 50, y + 88);
  ctx.textAlign = "left";
}
function txt(
  ctx: CanvasRenderingContext2D,
  v: string,
  x: number,
  y: number,
  size: number,
  fill = "#f3ead2",
  a: CanvasTextAlign = "left",
) {
  ctx.fillStyle = fill;
  ctx.font = `${size}px Arial`;
  ctx.textAlign = a;
  ctx.fillText(v, x, y);
}
function table(s: DeepReadonly<CascadeState>, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#17433e";
  ctx.fillRect(0, 0, K.STAGE_W, K.STAGE_H);
  const empty = (x: number, y: number) => {
    ctx.strokeStyle = "rgba(222,203,157,.35)";
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(x + 2, y + 2, 96, 136);
    ctx.setLineDash([]);
  };
  if (s.stock.length) card(ctx, last(s.stock)!, K.STOCK_X, K.TOP_ROW_Y);
  else empty(K.STOCK_X, K.TOP_ROW_Y);
  if (s.wasteSets.length) card(ctx, last(s.waste)!, K.WASTE_X, K.TOP_ROW_Y);
  else empty(K.WASTE_X, K.TOP_ROW_Y);
  for (let i = 0; i < 4; i++) {
    if (s.foundations[i].length)
      card(ctx, last(s.foundations[i])!, K.FOUNDATION_X[i], K.TOP_ROW_Y);
    else empty(K.FOUNDATION_X[i], K.TOP_ROW_Y);
  }
  for (let i = 0; i < 7; i++) {
    const p = s.tableau[i],
      a = off(p);
    let y = K.TABLEAU_Y;
    if (!p.length) empty(K.COLUMN_X[i], K.TABLEAU_Y);
    for (const c of p) {
      if (!s.drag || !s.drag.cards.some((q) => q.id === c.id))
        card(
          ctx,
          c,
          K.COLUMN_X[i],
          y,
          s.dropTarget?.pile === "tableau" && s.dropTarget.index === i,
        );
      y += c.faceUp ? a : K.FACE_DOWN_OFFSET;
    }
  }
  for (const z of stamps) card(ctx, z.c, z.x, z.y);
  for (const f of s.flyers) card(ctx, { ...f, faceUp: true }, f.x, f.y);
  if (s.drag)
    s.drag.cards.forEach((c, i) => card(ctx, c, s.drag!.x, s.drag!.y + i * 34));
  ctx.fillStyle = "#0e2929";
  ctx.fillRect(0, K.HUD_Y, K.STAGE_W, K.HUD_H);
  menus("playing").forEach((r, i) => {
    ctx.fillStyle = s.menuIndex === i ? "#c3933b" : "#275c55";
    ctx.fillRect(r.x, r.y, r.w, r.h);
    txt(ctx, K.HUD_ITEMS[i], r.x + r.w / 2, r.y + 24, 14, "#fff7df", "center");
  });
  txt(ctx, K.DEAL_MODE_LABEL, 1110, 704, 14, "#d8c79d", "center");
}
function render(s: DeepReadonly<CascadeState>, ctx: CanvasRenderingContext2D) {
  if (s.screen === "playing") {
    table(s, ctx);
    return;
  }
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, K.STAGE_W, K.STAGE_H);
  if (s.screen === "howto") {
    txt(ctx, "HOW TO PLAY", 640, 120, 54, "#f4c85b", "center");
    [
      "Build every foundation from ACE to KING.",
      "Columns build down and alternate color.",
      "Only a KING fills an empty column.",
      "Turn the STOCK and recycle it when empty.",
      "Drag cards, or DOUBLE-CLICK to send one home.",
    ].forEach((v, i) =>
      txt(ctx, v, 640, 220 + i * 48, 22, "#f3ead2", "center"),
    );
    const r = menus("howto")[0];
    ctx.fillStyle = "#c3933b";
    ctx.fillRect(r.x, r.y, r.w, r.h);
    txt(ctx, K.HOWTO_BACK_LABEL, 640, 638, 19, "#fff7df", "center");
    return;
  }
  if (s.screen === "won") {
    table(s, ctx);
    ctx.fillStyle = "rgba(7,22,23,.55)";
    ctx.fillRect(0, 0, K.STAGE_W, K.STAGE_H);
    txt(ctx, K.WIN_TEXT, 640, 330, 74, "#f4c85b", "center");
    txt(
      ctx,
      s.cascadeDone ? "CLICK TO DEAL AGAIN" : "THE CASCADE IS IN MOTION",
      640,
      380,
      19,
      "#f3ead2",
      "center",
    );
    return;
  }
  txt(ctx, K.TITLE_TEXT, 640, 170, 92, "#f4c85b", "center");
  txt(ctx, K.TAGLINE_TEXT, 640, 208, 19, "#b6d9c5", "center");
  txt(ctx, K.DEAL_MODE_LABEL, 640, 270, 17, "#e7d7a5", "center");
  menus("title").forEach((r, i) => {
    ctx.fillStyle = s.menuIndex === i ? "#c3933b" : "#275c55";
    ctx.fillRect(r.x, r.y, r.w, r.h);
    txt(ctx, K.TITLE_ITEMS[i], 640, r.y + 37, 19, "#fff7df", "center");
  });
}
function snap(s: DeepReadonly<CascadeState>): CascadeSnapshot {
  const c = (x: CardState) => ({ ...x, color: col(x.suit) });
  return {
    version: 1,
    screen: s.screen,
    menuIndex: s.menuIndex,
    titleIndex: s.titleIndex,
    dealMode: K.DEAL_MODE,
    turnCount: K.TURN_COUNT,
    dealModeLabel: K.DEAL_MODE_LABEL,
    muted: s.muted,
    autoFlip: s.autoFlip,
    winDetect: s.winDetect,
    launching: s.launching,
    trailPainting: s.trailPainting,
    stock: s.stock.map(c),
    waste: s.waste.map(c),
    wasteSets: [...s.wasteSets],
    wasteVisibleCount: last(s.wasteSets) ?? 0,
    foundations: s.foundations.map((p) => p.map(c)),
    tableau: s.tableau.map((p) => p.map(c)),
    drag: s.drag,
    dropTarget: s.drag ? target(s, s.drag) : null,
    pointer: s.pointer,
    lastPress: s.lastPress,
    launchClock: s.launchClock,
    launched: s.launched,
    flyers: s.flyers.map((f) => ({ ...f })),
    cascadeDone: s.cascadeDone,
    trailStamps: s.trailStamps,
    simTime: s.simTime,
  };
}
export const game: Game<CascadeState, CascadeDebugApi> = {
  initialize(api: InitApi<CascadeState>) {
    for (const [n, keys] of Object.entries(K.MENU_BINDINGS))
      api.input.register(n, { keys: [...keys] });
    Object.values(K.CUES).forEach((n, i) =>
      api.audio.define(n, {
        freq: 220 + i * 45,
        durationMs: 70 + i * 10,
        gain: 0.12,
      }),
    );
    api.diagnostics.register(
      "screen / deal",
      (s) => `${s.screen} / ${K.DEAL_MODE}`,
    );
    api.diagnostics.register(
      "stock / waste",
      (s) => `${s.stock.length} / ${s.waste.length}`,
    );
    api.diagnostics.register("foundations", (s) =>
      s.foundations.map((p) => p.length).join(" "),
    );
    api.diagnostics.register("tableau", (s) =>
      s.tableau.map((p) => p.length).join(" "),
    );
    api.diagnostics.register("hand", (s) =>
      s.drag ? `yes (${s.drag.cards.length})` : "no",
    );
    api.diagnostics.register(
      "cascade",
      (s) => `${s.launched} / ${s.flyers.length}`,
    );
    const d = {
      version: 1,
      reset: () => {
        stamps.length = 0;
        return initial();
      },
      snapshot: snap,
      reconcile: (s) => ({
        ...s,
        dropTarget: s.drag ? target(s, s.drag) : null,
      }),
      menuItemRect: (s, i) => menus(s.screen)[i] ?? null,
      setScreen: (s, v) => ({ ...s, screen: v }),
      setMenuIndex: (s, v) => ({ ...s, menuIndex: v }),
      setTitleIndex: (s, v) => ({ ...s, titleIndex: v }),
      addCard: (s, p, i, u, r, f) => ({
        ...setPile(s, p, i, [
          ...pile(s, p, i),
          { id: s.nextId, suit: u, rank: r, faceUp: f },
        ]),
        nextId: s.nextId + 1,
      }),
      removeCard: (s, id) => ({
        ...s,
        stock: s.stock.filter((c) => c.id !== id),
        waste: s.waste.filter((c) => c.id !== id),
        foundations: s.foundations.map((p) => p.filter((c) => c.id !== id)),
        tableau: s.tableau.map((p) => p.filter((c) => c.id !== id)),
      }),
      setCardFaceUp: (s, id, f) => change(s, id, (c) => cpy(c, f)),
      clearPile: (s, p, i) =>
        setPile(
          { ...s, wasteSets: p === "waste" ? [] : s.wasteSets },
          p,
          i,
          [],
        ),
      clearTable: (s) => ({
        ...s,
        stock: [],
        waste: [],
        wasteSets: [],
        foundations: emptyF(),
        tableau: emptyT(),
        drag: null,
        dropTarget: null,
      }),
      addWasteSet: (s, n) => ({ ...s, wasteSets: [...s.wasteSets, n] }),
      clearWasteSets: (s) => ({ ...s, wasteSets: [] }),
      deal: fresh,
      turnStock: turn,
      move,
      autoMove: (s, p, i) => {
        const a = pile(s, p, i),
          r = p === "waste" ? a.length - 1 : a.length - 1,
          c = a[r],
          j = c ? s.foundations.findIndex((q) => takesF(q, [c])) : -1;
        return j < 0
          ? [s as CascadeState, false]
          : move(s, p, i, r, "foundation", j);
      },
      pointerDown: (s, x, y) => event(s as CascadeState, "down", x, y),
      pointerMove: (s, x, y) => event(s as CascadeState, "move", x, y),
      pointerUp: (s, x, y) => event(s as CascadeState, "up", x, y),
      setAutoFlip: (s, v) => ({ ...s, autoFlip: v }),
      setWinDetect: (s, v) => ({ ...s, winDetect: v }),
      setLaunching: (s, v) => ({ ...s, launching: v }),
      setTrailPainting: (s, v) => ({ ...s, trailPainting: v }),
      addFlyer: (s, u, r, x, y, vx, vy) => ({
        ...s,
        flyers: [...s.flyers, { id: s.nextId, suit: u, rank: r, x, y, vx, vy }],
        nextId: s.nextId + 1,
      }),
      setFlyerPosition: (s, id, x, y) => ({
        ...s,
        flyers: s.flyers.map((f) => (f.id === id ? { ...f, x, y } : f)),
      }),
      setFlyerVelocity: (s, id, vx, vy) => ({
        ...s,
        flyers: s.flyers.map((f) => (f.id === id ? { ...f, vx, vy } : f)),
      }),
      removeFlyer: (s, id) => ({
        ...s,
        flyers: s.flyers.filter((f) => f.id !== id),
      }),
      clearFlyers: (s) => ({ ...s, flyers: [] }),
      setLaunchClock: (s, v) => ({ ...s, launchClock: v }),
      clearTrail: (s) => {
        stamps.length = 0;
        return { ...s, trailStamps: 0 };
      },
      drawLaunchVx: vx,
    } as CascadeDebugApi;
    return [initial(), d];
  },
  update(state, api, dt) {
    let s = { ...state, simTime: state.simTime + dt, muted: api.audio.muted() };
    for (const q of api.input.pointerSamples()) s = event(s, q.type, q.x, q.y);
    if (api.input.pressed(K.MENU_UP))
      s = {
        ...s,
        menuIndex:
          s.screen === "howto"
            ? 0
            : (s.menuIndex + (s.screen === "title" ? 2 : 3) - 1) %
              (s.screen === "title" ? 2 : 3),
      };
    else if (api.input.pressed(K.MENU_DOWN))
      s = {
        ...s,
        menuIndex:
          s.screen === "howto"
            ? 0
            : (s.menuIndex + 1) % (s.screen === "title" ? 2 : 3),
      };
    else if (api.input.pressed(K.MENU_CONFIRM)) {
      if (s.screen === "playing" && s.menuIndex === 2)
        api.audio.setMuted(!api.audio.muted());
      s = activate(s);
    } else if (api.input.pressed(K.MENU_BACK) && s.screen === "howto")
      s = { ...s, screen: "title", menuIndex: s.titleIndex };
    if (s.screen === "won" && !s.cascadeDone) s = cascade(s, dt);
    return s;
  },
  render(s, api: RenderApi) {
    render(s, api.ctx as CanvasRenderingContext2D);
  },
};
