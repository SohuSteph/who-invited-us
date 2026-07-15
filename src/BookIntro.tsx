import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import './BookIntro.css'

type Phase = 'idle' | 'turning' | 'leaving'

type BookIntroProps = {
  onEnter: () => void
}

/* Standard Galactic Alphabet–style glyphs (Minecraft enchanting table writing) */
const GLYPHS = 'ᔑʖᓵ↸ᒷ⎓⊣⍑╎ᒲリ∷𝙹ᑑᓭℸ⚍⍊∴⨅ꖎ'

function runeLine(seed: number, length: number) {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += GLYPHS[(seed * 17 + i * 13 + ((seed + i) % 5)) % GLYPHS.length]
    if (i % 3 === 2 && i < length - 1) out += ' '
  }
  return out
}

const RUNE_LEAF_COUNT = 9

const RUNE_LEAVES = Array.from({ length: RUNE_LEAF_COUNT }, (_, page) =>
  Array.from({ length: 11 }, (_, line) => runeLine(page * 31 + line * 7 + 3, 9 + ((page + line) % 5))),
)

function BookIntro({ onEnter }: BookIntroProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [hovered, setHovered] = useState(false)
  const timers = useRef<number[]>([])

  const isBusy = phase === 'turning' || phase === 'leaving'
  const isOpen = hovered || isBusy

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  function handleEnter() {
    if (isBusy) return
    setPhase('turning')
    timers.current.push(
      window.setTimeout(() => {
        setPhase('leaving')
        timers.current.push(window.setTimeout(onEnter, 750))
      }, 1280),
    )
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleEnter()
    }
  }

  return (
    <div
      className={`cine-intro ${isOpen ? 'is-open' : ''} ${
        phase === 'turning' ? 'is-turning' : ''
      } ${phase === 'leaving' ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cine-hint"
    >
      <p className="cine-hint" id="cine-hint">
        {isBusy ? 'Opening…' : isOpen ? 'Click to enter' : 'Hover to open the book'}
      </p>

      <div className="cine-stage">
        <div className="cine-glow" aria-hidden="true" />

        <div
          className="cine-book"
          role="button"
          tabIndex={0}
          aria-label="Open the book and enter the site"
          onMouseEnter={() => !isBusy && setHovered(true)}
          onMouseLeave={() => !isBusy && setHovered(false)}
          onFocus={() => !isBusy && setHovered(true)}
          onBlur={() => !isBusy && setHovered(false)}
          onClick={handleEnter}
          onKeyDown={handleKeyDown}
        >
          <div className="cine-book-inner">
            {/* Base page — the last one revealed before the bloom */}
            <div className="cine-page" aria-hidden="true">
              <span className="cine-page-diamond" />
            </div>

            {/* Rune leaves beneath the title leaf — enchanted writing */}
            {RUNE_LEAVES.map((lines, i) => (
              <div
                className="cine-leaf"
                key={`rune-${i}`}
                style={
                  {
                    '--i': i + 1,
                    '--leaf-end': `${-(167 - (i + 1) * 1.1)}deg`,
                  } as CSSProperties
                }
                aria-hidden="true"
              >
                <div className="cine-leaf-face">
                  <div className="cine-rune-page">
                    {lines.map((line, j) => (
                      <span className="cine-rune-line" key={j}>
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Title leaf — first page you see, first to turn */}
            <div
              className="cine-leaf"
              style={{ '--i': 0, '--leaf-end': '-167deg' } as CSSProperties}
              aria-hidden="true"
            >
              <div className="cine-leaf-face">
                <div className="cine-title-page">
                  <span className="cine-page-rule" />
                  <p className="cine-page-title">
                    Who Invited
                    <br />
                    Us?
                  </p>
                  <p className="cine-page-sub">
                    Research-driven stories about
                    <br />
                    how young people live and think
                  </p>
                  <span className="cine-page-rule" />
                </div>
              </div>
            </div>

            {/* Front cover — hinged at the spine */}
            <div className="cine-cover" aria-hidden="true">
              <div className="cine-cover-front">
                <div className="cine-cover-art">
                  <p className="cine-cover-title">
                    <span>Who</span>
                    <span>Invited Us?</span>
                  </p>
                  <span className="cine-cover-rule" />
                  <span className="cine-cover-diamond" />
                </div>
              </div>
              <div className="cine-cover-back" />
            </div>
          </div>

          <div className="cine-book-shadow" aria-hidden="true" />
        </div>

        {/* Ivory bloom that swallows the screen on exit */}
        <div className="cine-bloom" aria-hidden="true">
          <span className="cine-bloom-dot" />
        </div>
      </div>

      <button type="button" className="cine-skip" onClick={onEnter}>
        Skip intro
      </button>
    </div>
  )
}

export default BookIntro


