import './LiminalLogo.css'

type LiminalLogoProps = {
  className?: string
  size?: 'intro' | 'mark'
}

type Pt = { x: number; y: number }

type Pocket = {
  path: string
  cx: number
  cy: number
  rx: number
  ry: number
}

function toCurvePath(pts: Pt[]) {
  if (pts.length < 2) return ''
  if (pts.length === 2) {
    return `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} L${pts[1].x.toFixed(2)} ${pts[1].y.toFixed(2)}`
  }

  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

function toPath(pts: Pt[]) {
  return pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ')
}

/**
 * One full turn → two end pockets + a true open crossing in the middle.
 */
function buildDnaStrip(
  cx: number,
  cy: number,
  halfHeight: number,
  amp: number,
  samples: number,
) {
  const a: Pt[] = []
  const b: Pt[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const y = cy - halfHeight + halfHeight * 2 * t
    const angle = t * Math.PI * 2
    // Wide at t=0.25 & 0.75 (pockets); narrow at t=0, 0.5, 1 (crossings / middle gap)
    const waist = 0.28 + 0.72 * Math.pow(Math.abs(Math.sin(t * Math.PI * 2)), 0.85)
    const r = amp * waist
    a.push({ x: cx + r * Math.sin(angle), y })
    b.push({ x: cx + r * Math.sin(angle + Math.PI), y })
  }
  return { a, b }
}

/** Build the exact gap polygon + its fit ellipse for portal rings. */
function buildPocket(
  strandA: Pt[],
  strandB: Pt[],
  t0: number,
  t1: number,
  insetAmt: number,
): Pocket | null {
  const slice = (pts: Pt[]) =>
    pts.filter((_, i) => {
      const t = i / (pts.length - 1)
      return t >= t0 && t <= t1
    })

  const left = slice(strandA)
  const right = slice(strandB)
  if (left.length < 3 || right.length < 3) return null

  const inset = (p: Pt, other: Pt) => {
    const mx = (p.x + other.x) / 2
    const my = (p.y + other.y) / 2
    return {
      x: p.x + (mx - p.x) * insetAmt,
      y: p.y + (my - p.y) * insetAmt,
    }
  }

  const n = Math.min(left.length, right.length)
  const L: Pt[] = []
  const R: Pt[] = []
  for (let i = 0; i < n; i++) {
    L.push(inset(left[i], right[i]))
    R.push(inset(right[i], left[i]))
  }

  const all = [...L, ...R]
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let sx = 0
  let sy = 0
  for (const p of all) {
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
    minY = Math.min(minY, p.y)
    maxY = Math.max(maxY, p.y)
    sx += p.x
    sy += p.y
  }

  const rev = [...R].reverse()
  const path = `${toPath(L)} ${rev.map((p) => `L${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')} Z`

  return {
    path,
    cx: sx / all.length,
    cy: sy / all.length,
    // Slightly under half-size so rings sit inside the gap edges
    rx: ((maxX - minX) / 2) * 0.82,
    ry: ((maxY - minY) / 2) * 0.82,
  }
}

type PortalProps = {
  clipId: string
  pocket: Pocket
  variant: 'top' | 'bot'
}

/** Flat translucent portal fitted to the exact helix gap. */
function FlatPortal({ clipId, pocket, variant }: PortalProps) {
  const delay = variant === 'bot' ? 'liminal-portal--delay' : ''
  const { path, cx, cy, rx, ry } = pocket

  return (
    <g className={`liminal-portal ${delay}`} clipPath={`url(#${clipId})`}>
      <path
        className="liminal-portal-fill"
        d={path}
        fill={`url(#lim-portal-fill-${variant})`}
      />
      <path
        className="liminal-portal-wash"
        d={path}
        fill={`url(#lim-portal-wash-${variant})`}
      />

      <ellipse
        className="liminal-portal-ring r1"
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke="url(#lim-portal-ring)"
        strokeWidth="1"
      />
      <ellipse
        className="liminal-portal-ring r2"
        cx={cx}
        cy={cy}
        rx={rx * 0.72}
        ry={ry * 0.72}
        fill="none"
        stroke="url(#lim-portal-ring)"
        strokeWidth="0.9"
      />
      <ellipse
        className="liminal-portal-ring r3"
        cx={cx}
        cy={cy}
        rx={rx * 0.46}
        ry={ry * 0.46}
        fill="none"
        stroke="url(#lim-portal-ring)"
        strokeWidth="0.8"
      />
      <ellipse
        className="liminal-portal-ring r4"
        cx={cx}
        cy={cy}
        rx={rx * 0.24}
        ry={ry * 0.24}
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.65"
      />

      <ellipse
        className="liminal-portal-ripple"
        cx={cx}
        cy={cy}
        rx={rx * 0.3}
        ry={ry * 0.3}
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.7"
      />

      <ellipse
        className="liminal-portal-core"
        cx={cx}
        cy={cy}
        rx={rx * 0.14}
        ry={ry * 0.14}
        fill={`url(#lim-portal-core-${variant})`}
      />
    </g>
  )
}

function LiminalLogo({ className = '', size = 'intro' }: LiminalLogoProps) {
  const CX = 100
  const CY = 100
  const RING = 78
  const INNER = RING - 10
  const halfH = INNER * 0.86
  const amp = INNER * 0.42

  const { a, b } = buildDnaStrip(CX, CY, halfH, amp, 140)
  const pathSolid = toCurvePath(a)
  const pathDash = toCurvePath(b)

  // Top pocket ~t=0.25, bottom ~t=0.75; middle crossing left empty
  const top = buildPocket(a, b, 0.08, 0.42, 0.12)
  const bot = buildPocket(a, b, 0.58, 0.92, 0.12)

  return (
    <div
      className={`liminal-logo liminal-logo--${size} ${className}`.trim()}
      aria-hidden="true"
    >
      <svg
        className="liminal-logo-svg"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Liminal"
      >
        <defs>
          <linearGradient id="lim-ring" x1="12%" y1="8%" x2="88%" y2="92%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="40%" stopColor="#1f1f1f" />
            <stop offset="100%" stopColor="#2a2430" />
          </linearGradient>

          <linearGradient id="lim-strand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e2e2e" />
            <stop offset="45%" stopColor="#1f1f1f" />
            <stop offset="100%" stopColor="#3a2a42" />
          </linearGradient>

          <linearGradient id="lim-strand-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="lim-portal-fill-top" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#8a5a98" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#4a2c5a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2a1834" stopOpacity="0.4" />
          </radialGradient>
          <radialGradient id="lim-portal-fill-bot" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#7a4a88" stopOpacity="0.68" />
            <stop offset="50%" stopColor="#4a2c5a" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#241428" stopOpacity="0.38" />
          </radialGradient>

          <radialGradient id="lim-portal-wash-top" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.16" />
            <stop offset="45%" stopColor="#b892c4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4a2c5a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lim-portal-wash-bot" cx="55%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.14" />
            <stop offset="45%" stopColor="#a078b0" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4a2c5a" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lim-portal-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4a8d4" />
            <stop offset="50%" stopColor="#8a5a98" />
            <stop offset="100%" stopColor="#4a2c5a" />
          </linearGradient>

          <radialGradient id="lim-portal-core-top" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#6b3d7a" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#1f1228" stopOpacity="0.65" />
          </radialGradient>
          <radialGradient id="lim-portal-core-bot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#5a3068" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#1a0f22" stopOpacity="0.65" />
          </radialGradient>

          <radialGradient id="lim-disc" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="55%" stopColor="#f8f6f2" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#1f1f1f" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lim-glow" cx="50%" cy="48%" r="52%">
            <stop offset="0%" stopColor="#4a2c5a" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#1f1f1f" stopOpacity="0" />
          </radialGradient>

          <filter id="lim-soft" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="lim-depth" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.2"
              floodColor="#1f1f1f"
              floodOpacity="0.25"
            />
          </filter>

          <clipPath id="lim-inside-ring">
            <circle cx={CX} cy={CY} r={INNER} />
          </clipPath>

          {top ? (
            <clipPath id="lim-gap-top">
              <path d={top.path} />
            </clipPath>
          ) : null}
          {bot ? (
            <clipPath id="lim-gap-bot">
              <path d={bot.path} />
            </clipPath>
          ) : null}

          {/* Keep fill under strands — stroke knock-out matches DNA width */}
          <mask id="lim-pocket-mask" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="200" height="200" fill="white" />
            <path
              d={pathSolid}
              fill="none"
              stroke="black"
              strokeWidth="4.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={pathDash}
              fill="none"
              stroke="black"
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        <g filter="url(#lim-depth)">
          <circle className="liminal-logo-bloom" cx={CX} cy={CY} r={RING + 6} fill="url(#lim-glow)" />
          <circle cx={CX} cy={CY} r={RING - 1.5} fill="url(#lim-disc)" />

          <g clipPath="url(#lim-inside-ring)" mask="url(#lim-pocket-mask)">
            {top ? <FlatPortal clipId="lim-gap-top" pocket={top} variant="top" /> : null}
            {bot ? <FlatPortal clipId="lim-gap-bot" pocket={bot} variant="bot" /> : null}
          </g>

          <circle
            className="liminal-logo-ring"
            cx={CX}
            cy={CY}
            r={RING}
            fill="none"
            stroke="url(#lim-ring)"
            strokeWidth="3.2"
          />
          <circle
            cx={CX}
            cy={CY}
            r={RING - 2.1}
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.7"
            opacity="0.55"
          />
          <circle
            cx={CX}
            cy={CY}
            r={RING + 1.6}
            fill="none"
            stroke="#1f1f1f"
            strokeWidth="0.5"
            opacity="0.2"
          />

          <g className="liminal-logo-dna" clipPath="url(#lim-inside-ring)" filter="url(#lim-soft)">
            <path
              d={pathSolid}
              fill="none"
              stroke="url(#lim-strand-sheen)"
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <path
              d={pathDash}
              fill="none"
              stroke="url(#lim-strand-sheen)"
              strokeWidth="4.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
            <path
              className="liminal-logo-strand liminal-logo-strand-solid"
              d={pathSolid}
              fill="none"
              stroke="url(#lim-strand)"
              strokeWidth="3.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="liminal-logo-strand liminal-logo-strand-dash"
              d={pathDash}
              fill="none"
              stroke="url(#lim-strand)"
              strokeWidth="2.85"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5.8 4.2"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

export default LiminalLogo
