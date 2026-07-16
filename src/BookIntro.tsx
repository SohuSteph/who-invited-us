import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import './BookIntro.css'

type Phase = 'playing' | 'ready' | 'leaving'

type BookIntroProps = {
  onEnter: () => void
}

function BookIntro({ onEnter }: BookIntroProps) {
  const [phase, setPhase] = useState<Phase>('playing')
  const [beat, setBeat] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const schedule = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms))
    }

    schedule(280, () => setBeat(1))
    schedule(900, () => setBeat(2))
    schedule(1600, () => setBeat(3))
    schedule(2300, () => setBeat(4))
    schedule(3000, () => {
      setBeat(5)
      setPhase('ready')
    })

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  function handleEnter() {
    if (phase === 'leaving') return
    setPhase('leaving')
    timers.current.push(window.setTimeout(onEnter, 780))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (phase === 'ready') handleEnter()
    }
  }

  return (
    <div
      className={`doc-intro beat-${beat} is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-intro-brand"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <div className="doc-intro-media" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2400&q=80"
          alt=""
        />
        <div className="doc-intro-shade" />
        <div className="doc-intro-grain" />
      </div>

      <div className="doc-intro-filigree" aria-hidden="true" />

      <div className="doc-intro-frame" aria-hidden="true">
        <span className="doc-frame-edge doc-frame-top" />
        <span className="doc-frame-edge doc-frame-bottom" />
        <span className="doc-frame-rail doc-frame-rail-l" />
        <span className="doc-frame-rail doc-frame-rail-r" />
        <div className="doc-frame-corners">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="doc-intro-copy">
        <div className="doc-intro-ornament" aria-hidden="true">
          <span className="doc-ornament-line" />
          <span className="doc-ornament-diamond" />
          <span className="doc-ornament-line" />
        </div>

        <p className="doc-intro-eyebrow">Research · Film · Conversation</p>

        <p className="doc-intro-brand" id="doc-intro-brand">
          Who Invited Us<span aria-hidden="true">?</span>
        </p>

        <p className="doc-intro-baseline">Samaira Bhatia · Palak Gupta</p>

        <div className="doc-intro-rule" aria-hidden="true" />

        <p className="doc-intro-lede">
          Stories and evidence about how young people live and think —
          documentaries, interviews, surveys, and room for your judgment.
        </p>

        <div className="doc-intro-actions">
          <button
            type="button"
            className="doc-intro-enter"
            onClick={handleEnter}
            disabled={phase === 'leaving'}
          >
            Enter the archive
            <span aria-hidden="true"> →</span>
          </button>
          <p className="doc-intro-hint">or press Enter</p>
        </div>

        <p className="doc-intro-colophon" aria-hidden="true">
          Archive · Research · Judgment
        </p>
      </div>

      <button type="button" className="doc-intro-skip" onClick={onEnter}>
        Skip
      </button>

      <div className="doc-intro-bloom" aria-hidden="true" />
    </div>
  )
}

export default BookIntro
