import { useEffect, useMemo, useState } from 'react'
import { FeedbackThread } from './FeedbackThread'

export type PdfDoc = {
  id: string
  title: string
  episode?: string
  category: string
  summary: string
  src: string
  date: string
}

const STORAGE_KEY = 'wiu-pdf-feedback-v1'
const PAGE_SIZE = 12

type Props = {
  docs: PdfDoc[]
}

function loadCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, { length: number }[] | unknown>
    if (!parsed || typeof parsed !== 'object') return {}
    const counts: Record<string, number> = {}
    for (const [id, list] of Object.entries(parsed)) {
      counts[id] = Array.isArray(list) ? list.length : 0
    }
    return counts
  } catch {
    return {}
  }
}

export function PdfLibrary({ docs }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setCounts(loadCounts())
  }, [activeId])

  const categories = useMemo(() => {
    const set = new Set(docs.map((d) => d.category))
    return ['All', ...Array.from(set).sort()]
  }, [docs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return docs.filter((doc) => {
      const inCategory = category === 'All' || doc.category === category
      if (!inCategory) return false
      if (!q) return true
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        (doc.episode?.toLowerCase().includes(q) ?? false) ||
        doc.category.toLowerCase().includes(q)
      )
    })
  }, [docs, query, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [query, category])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageDocs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const active = useMemo(
    () => docs.find((d) => d.id === activeId) ?? null,
    [docs, activeId],
  )

  const openDoc = (id: string) => {
    setActiveId(id)
    requestAnimationFrame(() => {
      document.getElementById('pdf-reader')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)

  return (
    <div className="pdf-library">
      <div className="pdf-toolbar">
        <label className="pdf-search">
          <span className="visually-hidden">Search PDFs</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, topics, episodes…"
          />
        </label>

        <div className="pdf-filters" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pdf-filter${category === cat ? ' is-active' : ''}`}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="pdf-count" aria-live="polite">
          Showing <strong>{rangeStart}–{rangeEnd}</strong> of <strong>{filtered.length}</strong>
          {filtered.length !== docs.length ? ` (filtered from ${docs.length})` : ' PDFs'}
        </p>
      </div>

      {pageDocs.length === 0 ? (
        <p className="pdf-hint">No PDFs match that search. Try another word or clear filters.</p>
      ) : (
        <div className="pdf-list" role="list">
          {pageDocs.map((doc) => {
            const count = counts[doc.id] ?? 0
            const isActive = doc.id === activeId
            return (
              <button
                key={doc.id}
                type="button"
                role="listitem"
                className={`pdf-card${isActive ? ' is-active' : ''}`}
                onClick={() => openDoc(doc.id)}
                aria-pressed={isActive}
              >
                <span className="pdf-card-badge">{doc.category}</span>
                <span className="pdf-card-title">{doc.title}</span>
                {doc.episode ? <span className="pdf-card-meta">{doc.episode}</span> : null}
                <span className="pdf-card-summary">{doc.summary}</span>
                <span className="pdf-card-foot">
                  <span>{doc.date}</span>
                  <span>
                    {count} {count === 1 ? 'response' : 'responses'}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}

      {filtered.length > PAGE_SIZE ? (
        <div className="pdf-pagination">
          <button
            type="button"
            className="btn-outline-dark"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <p className="pdf-page-label">
            Page {page} of {totalPages}
          </p>
          <button
            type="button"
            className="btn-outline-dark"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      ) : null}

      {active ? (
        <div className="pdf-reader" id="pdf-reader">
          <div className="pdf-reader-head">
            <div>
              <p className="media-kind">Now reading · {active.category}</p>
              <h3>{active.title}</h3>
              <p className="pdf-reader-sub">
                {active.episode ? `${active.episode} · ` : ''}
                Read the document, then leave your judgment below.
              </p>
            </div>
            <div className="pdf-reader-actions">
              <a
                className="btn-outline-dark"
                href={active.src}
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab
              </a>
              <button type="button" className="btn-text" onClick={() => setActiveId(null)}>
                Close
              </button>
            </div>
          </div>

          <div className="pdf-frame pdf-frame-tall">
            <iframe title={`PDF: ${active.title}`} src={active.src} />
          </div>

          <FeedbackThread storageKey={STORAGE_KEY} itemId={active.id} />
        </div>
      ) : (
        <p className="pdf-hint">
          {docs.length} documents in the library — search or filter, then open one to read
          and leave feedback.
        </p>
      )}
    </div>
  )
}
