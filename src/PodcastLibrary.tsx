import { useMemo, useState } from 'react'
import { FeedbackThread } from './FeedbackThread'

export type PodcastEpisode = {
  id: string
  title: string
  summary: string
  date: string
  duration: string
  kind: 'youtube' | 'mp4'
  src: string
  topic: string
}

const STORAGE_KEY = 'wiu-podcast-feedback-v1'

type Props = {
  episodes: PodcastEpisode[]
}

export function PodcastLibrary({ episodes }: Props) {
  const [activeId, setActiveId] = useState<string | null>(episodes[0]?.id ?? null)
  const [filter, setFilter] = useState<'All' | 'youtube' | 'mp4'>('All')

  const filtered = useMemo(() => {
    if (filter === 'All') return episodes
    return episodes.filter((ep) => ep.kind === filter)
  }, [episodes, filter])

  const active = useMemo(
    () => episodes.find((ep) => ep.id === activeId) ?? null,
    [episodes, activeId],
  )

  const openEpisode = (id: string) => {
    setActiveId(id)
    requestAnimationFrame(() => {
      document.getElementById('podcast-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="podcast-library">
      <div className="pdf-filters" role="group" aria-label="Filter podcast format">
        {(
          [
            ['All', 'All'],
            ['youtube', 'YouTube'],
            ['mp4', 'MP4 video'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`pdf-filter${filter === value ? ' is-active' : ''}`}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="podcast-list" role="list">
        {filtered.map((ep) => {
          const isActive = ep.id === activeId
          return (
            <button
              key={ep.id}
              type="button"
              role="listitem"
              className={`pdf-card${isActive ? ' is-active' : ''}`}
              onClick={() => openEpisode(ep.id)}
              aria-pressed={isActive}
            >
              <span className="pdf-card-badge">
                {ep.kind === 'youtube' ? 'YouTube' : 'MP4'}
              </span>
              <span className="pdf-card-title">{ep.title}</span>
              <span className="pdf-card-meta">{ep.topic}</span>
              <span className="pdf-card-summary">{ep.summary}</span>
              <span className="pdf-card-foot">
                <span>{ep.date}</span>
                <span>{ep.duration}</span>
              </span>
            </button>
          )
        })}
      </div>

      {active ? (
        <div className="podcast-player" id="podcast-player">
          <div className="pdf-reader-head">
            <div>
              <p className="media-kind">
                Now playing · {active.kind === 'youtube' ? 'YouTube' : 'MP4 video'}
              </p>
              <h3>{active.title}</h3>
              <p className="pdf-reader-sub">
                {active.topic} · Watch the episode, then leave your judgment below.
              </p>
            </div>
          </div>

          {active.kind === 'youtube' ? (
            <div className="embed-frame podcast-frame">
              <iframe
                title={`YouTube: ${active.title}`}
                src={active.src}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <div className="mp4-frame">
              <video controls playsInline preload="metadata" src={active.src}>
                Sorry, your browser can’t play this MP4.
              </video>
            </div>
          )}

          <FeedbackThread
            storageKey={STORAGE_KEY}
            itemId={active.id}
            note="Respond to the episode — what landed, what you’d challenge, or what you’d add from your own experience. Saved in this browser for now (demo)."
          />
        </div>
      ) : (
        <p className="pdf-hint">Pick an episode to watch, then leave feedback underneath.</p>
      )}
    </div>
  )
}
