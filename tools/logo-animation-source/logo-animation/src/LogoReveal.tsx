import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

type Pt = [number, number];

// ---- Brand colors (sampled from the original logo) -------------------------
const YELLOW = '#F3E329';
const WHITE = '#FFFFFF';
const BG = '#1C1C1C';

// ---- Logo geometry (traced from the original, in "trace units") ------------
const YELLOW_SHAPE: Pt[] = [
  [150, 225], [240, 310], [240, 420], [350, 430], [525, 665],
  [160, 665], [240, 578], [320, 578], [305, 522], [150, 522],
];
const WHITE_BAR: Pt[] = [
  [228, 210], [490, 210], [570, 285], [575, 385], [480, 385],
  [480, 330], [455, 300], [300, 300], [275, 300],
];
const WHITE_LEG: Pt[] = [[383, 398], [500, 398], [715, 665], [595, 665]];
const DOT = {cx: 623, cy: 201, r: 69};

const CENTER: Pt = [432.5, 397.5];

// ---- Timing (in "design frames"; everything is stretched by TIME_SCALE) ----
const TIME_SCALE = 1.35;
const EDGE_DUR = 20; // how long one line takes to fly in
const EDGE_STAGGER = 2; // delay between consecutive lines of one shape
const TRAVEL = 1000; // how far off-screen the lines start
const WIPE_START = 38;
const WIPE_END = 54;
const GLINT_START = 58;
const GLINT_END = 84;
const STROKE = 5;

const flyEase = Easing.bezier(0.16, 1, 0.3, 1); // fast start, hard snap at the end

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const progress = (f: number, start: number) =>
  interpolate(f, [start, start + EDGE_DUR], [0, 1], {
    easing: flyEase,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const pointsAttr = (pts: Pt[]) => pts.map((p) => p.join(',')).join(' ');

// ---- One line segment flying in --------------------------------------------
const Edge: React.FC<{
  a: Pt;
  b: Pt;
  idx: number;
  color: string;
  start: number;
  f: number;
  strokeWidth: number;
}> = ({a, b, idx, color, start, f, strokeWidth}) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const t: Pt = [dx / len, dy / len];
  let n: Pt = [-t[1], t[0]];
  const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (n[0] * (mid[0] - CENTER[0]) + n[1] * (mid[1] - CENTER[1]) < 0) {
    n = [-n[0], -n[1]];
  }
  // Alternate: some lines shoot in along their own direction, others from outside
  const dir: Pt =
    idx % 2 === 0
      ? idx % 4 === 0
        ? t
        : [-t[0], -t[1]]
      : n;

  const draw = (fr: number, opacity: number, key: string) => {
    const p = progress(fr, start);
    const d = TRAVEL * (1 - p);
    const alpha = clamp01((fr - start) / 3) * opacity;
    if (alpha <= 0) return null;
    return (
      <line
        key={key}
        x1={a[0] + dir[0] * d}
        y1={a[1] + dir[1] * d}
        x2={b[0] + dir[0] * d}
        y2={b[1] + dir[1] * d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        opacity={alpha}
      />
    );
  };

  const arrived = progress(f, start) >= 1;
  return (
    <>
      {/* speed trails while the line is still travelling */}
      {!arrived && draw(f - 4, 0.18, 'trail2')}
      {!arrived && draw(f - 2, 0.38, 'trail1')}
      {draw(f, 1, 'main')}
    </>
  );
};

const EdgeLoop: React.FC<{
  pts: Pt[];
  color: string;
  start: number;
  f: number;
  strokeWidth: number;
}> = ({pts, color, start, f, strokeWidth}) => (
  <>
    {pts.map((p, i) => (
      <Edge
        key={i}
        a={p}
        b={pts[(i + 1) % pts.length]}
        idx={i}
        color={color}
        start={start + i * EDGE_STAGGER}
        f={f}
        strokeWidth={strokeWidth}
      />
    ))}
  </>
);

// ---- Main composition -------------------------------------------------------
export const LogoReveal: React.FC<{transparent?: boolean}> = ({transparent}) => {
  const frame = useCurrentFrame();
  const f = frame / TIME_SCALE;

  // lines thin out once the solid fill has taken over
  const strokeWidth = interpolate(f, [50, 62], [STROKE, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ring of the dot draws on, spinning from the top
  const circ = 2 * Math.PI * DOT.r;
  const ringP = interpolate(f, [12, 36], [0, 1], {
    easing: Easing.bezier(0.2, 0.9, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // diagonal wipe that turns the outline into solid color
  const wipeX = interpolate(f, [WIPE_START, WIPE_END], [-150, 900], {
    easing: Easing.bezier(0.5, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const SKEW = 160;
  const wipe = `-400,-100 ${wipeX + SKEW},-100 ${wipeX - SKEW},900 -400,900`;

  // glint that sweeps across once it is solid
  const glintX = interpolate(f, [GLINT_START, GLINT_END], [-120, 900], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const W = 42;
  const glint = [
    [glintX + SKEW - W, -100],
    [glintX + SKEW + W, -100],
    [glintX - SKEW + W, 900],
    [glintX - SKEW - W, 900],
  ]
    .map((p) => p.join(','))
    .join(' ');

  // small push-in, then a punch when the logo locks
  const scale = interpolate(f, [0, 54, 60, 80], [0.93, 1, 1.04, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const S = 1.25; // trace units -> pixels
  const vbW = 1920 / S;
  const vbH = 1080 / S;
  const viewBox = `${CENTER[0] - vbW / 2} ${CENTER[1] - vbH / 2} ${vbW} ${vbH}`;

  return (
    <AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : BG}}>
      <svg
        width={1920}
        height={1080}
        viewBox={viewBox}
        shapeRendering="geometricPrecision"
        style={{display: 'block'}}
      >
        <defs>
          <clipPath id="wipe">
            <polygon points={wipe} />
          </clipPath>
          <clipPath id="shapes">
            <polygon points={pointsAttr(YELLOW_SHAPE)} />
            <polygon points={pointsAttr(WHITE_BAR)} />
            <polygon points={pointsAttr(WHITE_LEG)} />
            <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} />
          </clipPath>
        </defs>

        <g
          transform={`translate(${CENTER[0]} ${CENTER[1]}) scale(${scale}) translate(${-CENTER[0]} ${-CENTER[1]})`}
        >
          {/* 1. lines flying together */}
          <EdgeLoop pts={YELLOW_SHAPE} color={YELLOW} start={0} f={f} strokeWidth={strokeWidth} />
          <EdgeLoop pts={WHITE_LEG} color={WHITE} start={3} f={f} strokeWidth={strokeWidth} />
          <EdgeLoop pts={WHITE_BAR} color={WHITE} start={6} f={f} strokeWidth={strokeWidth} />
          {strokeWidth > 0 && f >= 12 && (
            <circle
              cx={DOT.cx}
              cy={DOT.cy}
              r={DOT.r}
              fill="none"
              stroke={YELLOW}
              strokeWidth={strokeWidth}
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - ringP)}
              transform={`rotate(-90 ${DOT.cx} ${DOT.cy})`}
            />
          )}

          {/* 2. solid fill wiped in over the outline */}
          <g clipPath="url(#wipe)">
            <polygon points={pointsAttr(YELLOW_SHAPE)} fill={YELLOW} />
            <polygon points={pointsAttr(WHITE_BAR)} fill={WHITE} />
            <polygon points={pointsAttr(WHITE_LEG)} fill={WHITE} />
            <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill={YELLOW} />
          </g>

          {/* 3. glint */}
          {f >= GLINT_START && f <= GLINT_END && (
            <g clipPath="url(#shapes)">
              <polygon points={glint} fill="#FFFBD1" opacity={0.85} />
            </g>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
