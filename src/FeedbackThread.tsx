import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

export type FeedbackComment = {
  id: string
  name: string
  judgment: string
  body: string
  createdAt: string
}

const JUDGMENTS = [
  'Agree',
  'Disagree',
  'Complicated',
  'Needs more research',
  'This resonates',
] as const

function loadAll(storageKey: string): Record<string, FeedbackComment[]> {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, FeedbackComment[]>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveAll(storageKey: string, data: Record<string, FeedbackComment[]>) {
  localStorage.setItem(storageKey, JSON.stringify(data))
}

type Props = {
  storageKey: string
  itemId: string
  note?: string
}

export function FeedbackThread({ storageKey, itemId, note }: Props) {
  const [commentsByItem, setCommentsByItem] = useState<Record<string, FeedbackComment[]>>({})
  const [name, setName] = useState('')
  const [judgment, setJudgment] = useState<string>(JUDGMENTS[0])
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setCommentsByItem(loadAll(storageKey))
  }, [storageKey])

  useEffect(() => {
    setSubmitted(false)
    setBody('')
  }, [itemId])

  const comments = commentsByItem[itemId] ?? []

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    const next: FeedbackComment = {
      id: crypto.randomUUID(),
      name: name.trim() || 'Anonymous',
      judgment,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }

    setCommentsByItem((prev) => {
      const updated = {
        ...prev,
        [itemId]: [...(prev[itemId] ?? []), next],
      }
      saveAll(storageKey, updated)
      return updated
    })

    setBody('')
    setSubmitted(true)
  }

  return (
    <section className="feedback" aria-labelledby={`feedback-title-${itemId}`}>
      <h4 id={`feedback-title-${itemId}`}>Your feedback & judgment</h4>
      <p className="feedback-note">
        {note ??
          'Share what you think — agree, push back, or add context from your own experience. Responses are saved in this browser for now (demo).'}
      </p>

      <form className="feedback-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anonymous"
            autoComplete="nickname"
          />
        </label>

        <label className="field">
          <span>Your judgment</span>
          <select value={judgment} onChange={(e) => setJudgment(e.target.value)}>
            {JUDGMENTS.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </label>

        <label className="field field-full">
          <span>Comment</span>
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              setSubmitted(false)
            }}
            rows={4}
            required
            placeholder="What stood out? What would you challenge or add?"
          />
        </label>

        <div className="feedback-submit">
          <button type="submit" className="btn-primary">
            Post feedback
          </button>
          {submitted ? <p className="feedback-thanks">Thanks — your response is up.</p> : null}
        </div>
      </form>

      <div className="comment-list" aria-live="polite">
        {comments.length === 0 ? (
          <p className="comment-empty">No responses yet. Be the first to weigh in.</p>
        ) : (
          [...comments].reverse().map((c) => (
            <article className="comment" key={c.id}>
              <header>
                <strong>{c.name}</strong>
                <span className="comment-judgment">{c.judgment}</span>
                <time dateTime={c.createdAt}>
                  {new Date(c.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </time>
              </header>
              <p>{c.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
