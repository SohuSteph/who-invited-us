import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import BookIntro from './BookIntro'
import { PdfLibrary } from './PdfLibrary'
import { PodcastLibrary, type PodcastEpisode } from './PodcastLibrary'
import { buildDemoPdfArchive } from './pdfArchive'
import './App.css'

const STAGES = [
  {
    num: '01',
    title: 'Research',
    body: 'Surveys, literature reviews, and expert input that ground every story in evidence.',
  },
  {
    num: '02',
    title: 'Story Collection',
    body: 'Interviews and personal narratives that capture how young people actually live and think.',
  },
  {
    num: '03',
    title: 'Production',
    body: 'Documentary films, podcasts, and digital storytelling crafted for clarity and impact.',
  },
  {
    num: '04',
    title: 'Publication',
    body: 'Reports, episodes, and public engagement — plus space for audience judgment and feedback.',
  },
]

const PROJECT_OUTPUTS = [
  'Public surveys',
  'Interviews',
  'A documentary film',
  'A research report',
  'Social media content',
]

const SHORT_TERM = [
  'Produce meaningful, research-backed stories.',
  'Build an engaged community.',
  'Create high-quality documentary and podcast content.',
]

const LONG_TERM = [
  'Develop a global archive of youth experiences.',
  'Publish original research.',
  'Become a trusted platform for understanding how young people experience the modern world.',
]

const PDF_DOCS = buildDemoPdfArchive(100)

const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: 'ep-01-youtube',
    title: 'Ep. 01 — The stories we inherit',
    topic: 'Family expectations',
    summary:
      'Opening conversation on family scripts, duty, and what “being good” costs young women.',
    date: '2026-01',
    duration: '18 min',
    kind: 'youtube',
    src: 'https://www.youtube-nocookie.com/embed/D9Ihs241zeg',
  },
  {
    id: 'ep-02-youtube',
    title: 'Ep. 02 — Loneliness in a crowded feed',
    topic: 'Identity & belonging',
    summary:
      'A YouTube episode on social pressure, comparison, and finding language for what feels private.',
    date: '2026-02',
    duration: '14 min',
    kind: 'youtube',
    src: 'https://www.youtube-nocookie.com/embed/hT_nvWreIhg',
  },
  {
    id: 'ep-03-mp4',
    title: 'Ep. 03 — Host desk cut (MP4 sample)',
    topic: 'Behind the talk',
    summary:
      'Example of a self-hosted MP4 episode upload — same feedback thread as YouTube episodes.',
    date: '2026-03',
    duration: 'Sample clip',
    kind: 'mp4',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'ep-04-mp4',
    title: 'Ep. 04 — Field tape (MP4 sample)',
    topic: 'Story collection',
    summary:
      'Another MP4 example for raw-style episode video posted directly on the site.',
    date: '2026-04',
    duration: 'Sample clip',
    kind: 'mp4',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
]

type MediaTab = 'pdfs' | 'podcast' | 'films' | 'writing'

const TABS: { id: MediaTab; label: string }[] = [
  { id: 'pdfs', label: 'PDFs' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'films', label: 'Films & vlogs' },
  { id: 'writing', label: 'Blog' },
]

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [tab, setTab] = useState<MediaTab>('pdfs')

  useEffect(() => {
    if (showIntro) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.9,
    })

    let rafId = requestAnimationFrame(function loop(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(loop)
    })

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      event.preventDefault()
      lenis.scrollTo(href, { offset: -80, duration: 1.7 })
    }
    document.addEventListener('click', onClick)

    const revealSelectors = [
      '.hero-brand',
      '.hero-baseline',
      '.hero-headline',
      '.hero-lede',
      '.hero-actions',
      '.hero-scroll',
      '.eyebrow',
      '.spotlight-title',
      '.spotlight-grid p',
      '.spotlight .btn-outline',
      '.section-title',
      '.section-lede',
      '.stage',
      '.project-title',
      '.project-lede',
      '.project-list li',
      '.project .btn-primary',
      '.goals-grid > div',
      '.media-tabs',
      '.media-panel',
      '.help-inner .btn-primary',
    ]
    const revealEls = document.querySelectorAll<HTMLElement>(
      revealSelectors.map((s) => `main ${s}`).join(', '),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-revealed', entry.isIntersecting)
        })
      },
      { rootMargin: '-6% 0px -8% 0px', threshold: 0 },
    )

    revealEls.forEach((el) => {
      el.setAttribute('data-reveal', '')
      observer.observe(el)
    })

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onClick)
      observer.disconnect()
      revealEls.forEach((el) => {
        el.removeAttribute('data-reveal')
        el.classList.remove('is-revealed')
      })
      lenis.destroy()
    }
  }, [showIntro])

  return (
    <div className={`page ${showIntro ? 'page-locked' : 'page-entered'}`}>
      {showIntro && <BookIntro onEnter={() => setShowIntro(false)} />}

      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="header-filigree" aria-hidden="true" />
        <nav className="nav" aria-label="Primary">
          <ul className="nav-group">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#why">Why</a>
            </li>
            <li>
              <a href="#process">How we work</a>
            </li>
          </ul>

          <a className="brand" href="#top" aria-label="Who Invited Us home">
            <span className="brand-name">
              Who Invited Us<span aria-hidden="true">?</span>
            </span>
            <span className="brand-baseline">Samaira Bhatia · Palak Gupta</span>
          </a>

          <ul className="nav-group nav-group-right">
            <li>
              <a href="#project">Project</a>
            </li>
            <li>
              <a href="#media">Library</a>
            </li>
            <li>
              <a href="#help">Get involved</a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-brand">
          <div className="hero-media" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=80"
              alt=""
            />
            <div className="hero-shade" />
          </div>

          <div className="hero-copy">
            <div className="illum-corners" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="hero-brand" id="hero-brand">
              Who Invited Us<span aria-hidden="true">?</span>
            </p>
            <p className="hero-baseline">Samaira Bhatia · Palak Gupta</p>
            <h1 className="hero-headline">
              Conversations, research, and room for your judgment.
            </h1>
            <p className="hero-lede">
              A podcast-style storytelling initiative — episodes, PDFs, films, and
              reports you can read, then respond to with feedback and your own take.
            </p>
            <div className="hero-actions">
              <a className="btn-primary" href="#media">
                Open the library <span aria-hidden="true">→</span>
              </a>
              <a className="btn-ghost-dark" href="#project">
                First project
              </a>
            </div>
            <a className="hero-scroll" href="#about" aria-label="Scroll to about">
              <span className="hero-scroll-line" aria-hidden="true" />
              <span>Scroll</span>
            </a>
          </div>
        </section>

        <section className="spotlight" id="about" aria-labelledby="about-title">
          <div className="spotlight-inner">
            <div className="ornament" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-diamond" />
              <span className="ornament-line" />
            </div>
            <p className="eyebrow">What we are building</p>
            <h2 className="spotlight-title" id="about-title">
              A structured way to understand and document youth experience.
            </h2>
            <div className="spotlight-grid">
              <p className="drop-cap">
                Who Invited Us? is a research-driven storytelling initiative that explores
                the experiences, challenges, and aspirations of young people through
                podcasts, documentaries, interviews, surveys, and public reports.
              </p>
              <p>
                Our goal is to bridge the gap between academic research and everyday
                conversations — and to invite listeners to add their own judgment under
                the documents we publish.
              </p>
            </div>
            <a className="btn-outline" href="#why">
              Why this matters <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="why" id="why" aria-labelledby="why-title">
          <div className="section-shell why-shell">
            <span className="why-mark" aria-hidden="true">
              ?
            </span>
            <div className="ornament" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-diamond" />
              <span className="ornament-line" />
            </div>
            <p className="eyebrow dark">Why we are doing this</p>
            <h2 className="section-title" id="why-title">
              Too many youth issues are oversimplified — or poorly understood.
            </h2>
            <p className="section-lede">
              Family expectations, identity, relationships, career pressure, loneliness,
              and social change shape young lives every day. We document these experiences
              authentically so people can better understand one another through both
              research and storytelling.
            </p>
          </div>
        </section>

        <section className="process" id="process" aria-labelledby="process-title">
          <div className="section-shell">
            <div className="ornament ornament-light" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-diamond" />
              <span className="ornament-line" />
            </div>
            <p className="eyebrow">How we work</p>
            <h2 className="section-title light" id="process-title">
              Each project follows four stages.
            </h2>
            <ol className="stages">
              {STAGES.map((stage) => (
                <li className="stage" key={stage.num}>
                  <span className="stage-num" aria-hidden="true">
                    {stage.num}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="project" id="project" aria-labelledby="project-title">
          <div className="project-media" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80"
              alt=""
            />
            <div className="project-shade" />
          </div>
          <div className="project-copy">
            <div className="illum-corners illum-corners-dark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="ornament ornament-light" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-diamond" />
              <span className="ornament-line" />
            </div>
            <p className="eyebrow">Our first project</p>
            <h2 className="project-title" id="project-title">
              The Good Daughter Project
            </h2>
            <p className="project-lede">
              A study exploring how family expectations shape the choices,
              responsibilities, opportunities, and identities of young women.
            </p>
            <ul className="project-list">
              {PROJECT_OUTPUTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a className="btn-primary" href="#media">
              Read the PDFs <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="goals" id="goals" aria-labelledby="goals-title">
          <div className="section-shell">
            <div className="ornament ornament-light" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-diamond" />
              <span className="ornament-line" />
            </div>
            <p className="eyebrow">What we hope to achieve</p>
            <h2 className="section-title light" id="goals-title">
              From early stories to a lasting archive.
            </h2>
            <div className="goals-grid">
              <div>
                <h3>Short term</h3>
                <ul>
                  {SHORT_TERM.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Long term</h3>
                <ul>
                  {LONG_TERM.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="media" id="media" aria-labelledby="media-title">
          <div className="section-shell">
            <div className="ornament" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-diamond" />
              <span className="ornament-line" />
            </div>
            <p className="eyebrow dark">Library</p>
            <h2 className="section-title" id="media-title">
              Listen, read, then weigh in.
            </h2>
            <p className="section-lede media-intro">
              PDFs scale with search and pages. Podcast episodes are <strong>YouTube</strong> or{' '}
              <strong>MP4</strong> video — watch one, then leave judgment and comments underneath.
            </p>

            <div className="media-tabs" role="tablist" aria-label="Media types">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  className={`media-tab${tab === t.id ? ' is-active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div
              className="media-panel"
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              key={tab}
            >
              {tab === 'pdfs' ? (
                <PdfLibrary docs={PDF_DOCS} />
              ) : null}

              {tab === 'podcast' ? (
                <PodcastLibrary episodes={PODCAST_EPISODES} />
              ) : null}

              {tab === 'films' ? (
                <div className="media-grid">
                  <article className="media-block">
                    <header className="media-block-head">
                      <p className="media-kind">YouTube · Film</p>
                      <h3>Documentary embed</h3>
                      <p>Films hosted on YouTube, playable on-site.</p>
                    </header>
                    <div className="embed-frame">
                      <iframe
                        title="Example documentary on YouTube"
                        src="https://www.youtube-nocookie.com/embed/D9Ihs241zeg"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  </article>
                  <article className="media-block">
                    <header className="media-block-head">
                      <p className="media-kind">YouTube · Vlog</p>
                      <h3>Field diary embed</h3>
                      <p>Shorter vlogs and behind-the-scenes notes.</p>
                    </header>
                    <div className="embed-frame">
                      <iframe
                        title="Example vlog on YouTube"
                        src="https://www.youtube-nocookie.com/embed/hT_nvWreIhg"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  </article>
                </div>
              ) : null}

              {tab === 'writing' ? (
                <div className="media-grid">
                  <article className="media-block media-block-wide">
                    <header className="media-block-head">
                      <p className="media-kind">Blog</p>
                      <h3>What “good daughter” really costs</h3>
                      <p className="blog-meta">Essay · Example post</p>
                    </header>
                    <div className="blog-body">
                      <p>
                        Family expectation is not always loud. Sometimes it is a quiet
                        checklist — grades, caretaking, marriage timelines — that shapes
                        who young women believe they are allowed to become.
                      </p>
                      <p>
                        This is a placeholder blog layout for long-form writing that sits
                        beside episodes and PDF findings from The Good Daughter Project.
                      </p>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => setTab('pdfs')}
                      >
                        Discuss the research PDFs <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </article>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="help" id="help" aria-labelledby="help-title">
          <div className="help-frame">
            <div className="frame-corners" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="help-inner">
              <div className="ornament" aria-hidden="true">
                <span className="ornament-line" />
                <span className="ornament-diamond" />
                <span className="ornament-line" />
              </div>
              <p className="eyebrow dark">How you could help</p>
              <h2 className="section-title" id="help-title">
                We are early — and building with partners.
              </h2>
              <p className="section-lede">
                We are looking for people who can contribute ideas, expertise, research
                support, outreach, strategic guidance, or project coordination.
              </p>
              <a
                className="btn-primary"
                href="mailto:hello@whoinvitedus.org?subject=Who%20Invited%20Us%20—%20I'd%20like%20to%20help"
              >
                Reach out <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="ornament ornament-light footer-ornament" aria-hidden="true">
          <span className="ornament-line" />
          <span className="ornament-diamond" />
          <span className="ornament-line" />
        </div>
        <p className="footer-brand">Who Invited Us?</p>
        <p className="footer-baseline">Samaira Bhatia · Palak Gupta</p>
        <p className="footer-note">
          Podcast conversations, research documents, and space for public judgment.
        </p>
        <p className="footer-colophon">Archive · Research · Judgment</p>
        <p className="footer-year">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
