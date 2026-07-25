import './LiminalLogo.css'

type LiminalLogoProps = {
  className?: string
  size?: 'intro' | 'mark'
}

type Pt = { x: number; y: number; z: number }

function buildHelix(cx: number, top: number, bottom: number, amp: number, turns: number, samples: number) {
  const a: Pt[] = []
  const b: Pt[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const y = top + (bottom - top) * t
    const angle = t * turns * Math.PI * 2
    a.push({ x: cx + amp * Math.sin(angle), y, z: Math.cos(angle) })
    b.push({ x: cx + amp * Math.sin(angle + Math.PI), y, z: Math.cos(angle + Math.PI) })
  }
  return { a, b }
}

function toPath(pts: Pt[]) {
  return pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ')
}

function depthPath(pts: Pt[], front: boolean) {
  const chunks: string[] = []
  let chunk: Pt[] = []

  const flush = () => {
    if (chunk.length < 2) {
      chunk = []
      return
    }
    chunks.push(toPath(chunk))
    chunk = []
  }

  pts.forEach((p, i) => {
    const isFront = p.z >= 0
    if (isFront === front) {
      if (chunk.length === 0 && i > 0) chunk.push(pts[i - 1])
      chunk.push(p)
    } else {
      flush()
    }
  })
  flush()
  return chunks
}

/** Fingerprint whorl tinted to DNA strand colors (teal / violet). */
function Fingerprint({
  className,
  transform,
  tone,
}: {
  className: string
  transform: string
  tone: 'teal' | 'violet'
}) {
  const c =
    tone === 'teal'
      ? {
          pad: 'url(#lim-print-pad-teal)',
          core: 'url(#lim-print-core-teal)',
          ridges: ['#1f6f6c', '#2a8a86', '#3aa39e', '#4db8b3', '#6ecfc9', '#8fe0db', '#b0efe9', '#d4f7f4'],
        }
      : {
          pad: 'url(#lim-print-pad-violet)',
          core: 'url(#lim-print-core-violet)',
          ridges: ['#6a2f8a', '#7d3d9e', '#9450b6', '#b06dd4', '#c489e0', '#d5a4ea', '#e4c0f4', '#f0d8fa'],
        }

  return (
    <g className={`liminal-logo-print ${className}`} transform={transform}>
      <ellipse cx="0" cy="1" rx="16" ry="20" fill={c.pad} opacity="0.5" />

      <path
        d="M-15 -0.8 C-14.8 -13, -8.4 -19, 0 -19.4 C8.4 -19, 14.8 -13, 15 -0.8 C15.15 4.8, 11.4 11.2, 6.8 15.2 M-15 -0.8 C-15.15 4.8, -11.4 11.2, -6.8 15.2"
        fill="none"
        stroke={c.ridges[0]}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M-12.6 -0.6 C-12.4 -10.8, -7 -15.8, 0 -16.1 C7 -15.8, 12.4 -10.8, 12.6 -0.6 C12.75 4.1, 9.5 9.5, 5.5 13 M-12.6 -0.6 C-12.75 4.1, -9.5 9.5, -5.5 13"
        fill="none"
        stroke={c.ridges[1]}
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M-10.2 -0.4 C-10.1 -8.8, -5.8 -12.8, 0 -13.1 C5.8 -12.8, 10.1 -8.8, 10.2 -0.4 C10.3 3.5, 7.6 8, 4.3 11 M-10.2 -0.4 C-10.3 3.5, -7.6 8, -4.3 11"
        fill="none"
        stroke={c.ridges[2]}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M-7.8 -0.2 C-7.7 -6.9, -4.4 -10.2, 0 -10.4 C4.4 -10.2, 7.7 -6.9, 7.8 -0.2 C7.9 2.9, 5.8 6.6, 3.2 9 M-7.8 -0.2 C-7.9 2.9, -5.8 6.6, -3.2 9"
        fill="none"
        stroke={c.ridges[3]}
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      <path
        d="M-5.5 0 C-5.4 -5.2, -3 -7.6, 0 -7.8 C3 -7.6, 5.4 -5.2, 5.5 0 C5.55 2.3, 4 5, 2.2 6.8 M-5.5 0 C-5.55 2.3, -4 5, -2.2 6.8"
        fill="none"
        stroke={c.ridges[4]}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M-3.2 0.2 C-3.15 -3.4, -1.7 -5.1, 0 -5.2 C1.7 -5.1, 3.15 -3.4, 3.2 0.2 C3.25 1.6, 2.1 3.4, 1.05 4.5 M-3.2 0.2 C-3.25 1.6, -2.1 3.4, -1.05 4.5"
        fill="none"
        stroke={c.ridges[5]}
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M-1.35 0.35 C-1.3 -1.6, -0.65 -2.45, 0 -2.5 C0.65 -2.45, 1.3 -1.6, 1.35 0.35 C1.35 1.15, 0.8 1.85, 0.35 2.25 M-1.35 0.35 C-1.35 1.15, -0.8 1.85, -0.35 2.25"
        fill="none"
        stroke={c.ridges[6]}
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      <path
        d="M-11.5 4 C-9 8, -5 12, -1.6 14.2"
        fill="none"
        stroke={c.ridges[0]}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M11.5 4 C9 8, 5 12, 1.6 14.2"
        fill="none"
        stroke={c.ridges[0]}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M-8.2 7 C-5.5 10.2, -2.5 12.6, 0 13.5 C2.5 12.6, 5.5 10.2, 8.2 7"
        fill="none"
        stroke={c.ridges[2]}
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M-5.2 9.5 C-3.2 11.5, -1.4 12.8, 0 13.2 C1.4 12.8, 3.2 11.5, 5.2 9.5"
        fill="none"
        stroke={c.ridges[3]}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M-13.5 1.2 C-12 4.2, -9.8 7, -7.2 9.2"
        fill="none"
        stroke={c.ridges[1]}
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path
        d="M13.5 1.2 C12 4.2, 9.8 7, 7.2 9.2"
        fill="none"
        stroke={c.ridges[1]}
        strokeWidth="0.85"
        strokeLinecap="round"
      />

      <circle cx="0" cy="0.5" r="1.25" fill={c.core} />
    </g>
  )
}

/** White sparkle with a soft yellow hint. */
function Star({
  className,
  cx,
  cy,
  r,
}: {
  className: string
  cx: number
  cy: number
  r: number
}) {
  const arm = r * 2.4
  const notch = r * 0.55

  return (
    <g className={`liminal-logo-star ${className}`} transform={`translate(${cx} ${cy})`}>
      <circle cx="0" cy="0" r={r * 2.8} fill="url(#lim-star-glow)" opacity="0.85" />
      <path
        d={`M0 ${-arm}
           C${notch * 0.2} ${-notch}, ${notch} ${-notch * 0.2}, ${arm} 0
           C${notch} ${notch * 0.2}, ${notch * 0.2} ${notch}, 0 ${arm}
           C${-notch * 0.2} ${notch}, ${-notch} ${notch * 0.2}, ${-arm} 0
           C${-notch} ${-notch * 0.2}, ${-notch * 0.2} ${-notch}, 0 ${-arm}Z`}
        fill="url(#lim-star-white)"
      />
      <circle cx="0" cy="0" r={r * 0.5} fill="#ffffff" opacity="0.95" />
    </g>
  )
}

function LiminalLogo({ className = '', size = 'intro' }: LiminalLogoProps) {
  const { a, b } = buildHelix(110, 24, 196, 32, 2.15, 68)
  const pathA = toPath(a)
  const pathB = toPath(b)
  const backA = depthPath(a, false)
  const frontA = depthPath(a, true)
  const backB = depthPath(b, false)
  const frontB = depthPath(b, true)

  const rungs: {
    x1: number
    y1: number
    x2: number
    y2: number
    front: boolean
    kind: 'at' | 'cg'
  }[] = []
  for (let i = 2; i < a.length - 1; i += 3) {
    const pa = a[i]
    const pb = b[i]
    if (Math.abs(pa.x - pb.x) < 12) continue
    rungs.push({
      x1: pa.x,
      y1: pa.y,
      x2: pb.x,
      y2: pb.y,
      front: (pa.z + pb.z) / 2 >= 0,
      kind: i % 6 === 2 ? 'at' : 'cg',
    })
  }

  return (
    <div
      className={`liminal-logo liminal-logo--${size} ${className}`.trim()}
      aria-hidden="true"
    >
      <svg
        className="liminal-logo-svg"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          {/* White circle with faint warm edge */}
          <linearGradient id="lim-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f7f4ec" />
            <stop offset="100%" stopColor="#efe6c8" />
          </linearGradient>

          <linearGradient id="lim-strand-teal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b8f3ef" />
            <stop offset="45%" stopColor="#4db8b3" />
            <stop offset="100%" stopColor="#1f6f6c" />
          </linearGradient>
          <linearGradient id="lim-strand-violet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0c6ff" />
            <stop offset="45%" stopColor="#b06dd4" />
            <stop offset="100%" stopColor="#6a2f8a" />
          </linearGradient>

          <linearGradient id="lim-rung-at" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f0a35e" />
            <stop offset="100%" stopColor="#e36b7a" />
          </linearGradient>
          <linearGradient id="lim-rung-cg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ec4f0" />
            <stop offset="100%" stopColor="#7ddea0" />
          </linearGradient>

          <radialGradient id="lim-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6a3d7a" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#2f6b68" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#1f1f1f" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lim-print-pad-teal" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#8fe0db" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#4db8b3" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#1f6f6c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lim-print-pad-violet" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#d5a4ea" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#b06dd4" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#6a2f8a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lim-print-core-teal" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e8fffc" />
            <stop offset="55%" stopColor="#6ecfc9" />
            <stop offset="100%" stopColor="#2a8a86" />
          </radialGradient>
          <radialGradient id="lim-print-core-violet" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f8ecff" />
            <stop offset="55%" stopColor="#c489e0" />
            <stop offset="100%" stopColor="#7d3d9e" />
          </radialGradient>

          {/* White stars with a soft yellow sparkle */}
          <radialGradient id="lim-star-white" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#fff8e8" />
            <stop offset="100%" stopColor="#f0e0a8" />
          </radialGradient>
          <radialGradient id="lim-star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6d0" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <filter id="lim-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.85" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle className="liminal-logo-bloom" cx="110" cy="110" r="86" fill="url(#lim-glow)" />

        <g className="liminal-logo-ring">
          <circle
            cx="110"
            cy="110"
            r="92"
            fill="none"
            stroke="rgba(248,246,242,0.12)"
            strokeWidth="1.4"
          />
          <circle
            className="liminal-logo-ring-spin"
            cx="110"
            cy="110"
            r="92"
            fill="none"
            stroke="url(#lim-ring)"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeDasharray="215 363"
          />
          <circle
            className="liminal-logo-ring-spin liminal-logo-ring-spin-b"
            cx="110"
            cy="110"
            r="92"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeDasharray="40 538"
            strokeDashoffset="100"
          />
        </g>

        <g className="liminal-logo-dna">
          <path
            className="liminal-logo-strand liminal-logo-strand-a"
            d={pathA}
            fill="none"
            stroke="rgba(77,184,179,0.28)"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
          <path
            className="liminal-logo-strand liminal-logo-strand-b"
            d={pathB}
            fill="none"
            stroke="rgba(176,109,212,0.35)"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeDasharray="4 5"
          />

          <g opacity="0.32">
            {backA.map((d, i) => (
              <path
                key={`ba-${i}`}
                d={d}
                fill="none"
                stroke="#4db8b3"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {backB.map((d, i) => (
              <path
                key={`bb-${i}`}
                d={d}
                fill="none"
                stroke="#b06dd4"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {rungs
              .filter((r) => !r.front)
              .map((r, i) => (
                <line
                  key={`rb-${i}`}
                  className="liminal-logo-rung"
                  x1={r.x1}
                  y1={r.y1}
                  x2={r.x2}
                  y2={r.y2}
                  stroke={r.kind === 'at' ? '#e36b7a' : '#6ec4f0'}
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              ))}
          </g>

          {/* Fingerprints in helix pockets — DNA teal / violet tones */}
          <Fingerprint
            className="liminal-logo-print-top"
            transform="translate(110 66) scale(0.95)"
            tone="violet"
          />
          <Fingerprint
            className="liminal-logo-print-bot"
            transform="translate(110 154) scale(0.95)"
            tone="teal"
          />

          <g filter="url(#lim-soft)">
            {rungs
              .filter((r) => r.front)
              .map((r, i) => (
                <line
                  key={`rf-${i}`}
                  className="liminal-logo-rung"
                  x1={r.x1}
                  y1={r.y1}
                  x2={r.x2}
                  y2={r.y2}
                  stroke={r.kind === 'at' ? 'url(#lim-rung-at)' : 'url(#lim-rung-cg)'}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              ))}
            {frontA.map((d, i) => (
              <path
                key={`fa-${i}`}
                d={d}
                fill="none"
                stroke="url(#lim-strand-teal)"
                strokeWidth="3.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {frontB.map((d, i) => (
              <path
                key={`fb-${i}`}
                d={d}
                fill="none"
                stroke="url(#lim-strand-violet)"
                strokeWidth="3.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </g>

        {/* White sparkles with a soft yellow tip */}
        <g className="liminal-logo-stars">
          <Star className="s1" cx={42} cy={66} r={2.4} />
          <Star className="s2" cx={176} cy={54} r={2.1} />
          <Star className="s3" cx={48} cy={152} r={2.3} />
          <Star className="s4" cx={172} cy={158} r={2} />
          <Star className="s5" cx={36} cy={108} r={1.7} />
          <Star className="s6" cx={184} cy={112} r={1.9} />
          <Star className="s7" cx={110} cy={26} r={2} />
          <Star className="s8" cx={70} cy={38} r={1.5} />
          <Star className="s9" cx={152} cy={182} r={1.6} />
        </g>
      </svg>
    </div>
  )
}

export default LiminalLogo
