import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import BookIntro from './BookIntro'
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
    body: 'Documentary films and digital storytelling crafted for clarity, care, and impact.',
  },
  {
    num: '04',
    title: 'Publication',
    body: 'Reports, films, and public engagement that turn research into shared understanding.',
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
  'Create high-quality documentary content.',
]

const LONG_TERM = [
  'Develop a global archive of youth experiences.',
  'Publish original research.',
  'Become a trusted platform for understanding how young people experience the modern world.',
]

const MEDIA_FORMATS = [
  'PDF reports',
  'YouTube films',
  'Blog essays',
  'Vlog diaries',
  'Spotify audio',
]

function App() {
  const [showIntro, setShowIntro] = useState(true)

  // Fluid inertia scrolling + scroll-linked text reveals once the site is entered
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

    // Route in-page anchor clicks through Lenis for eased travel
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      event.preventDefault()
      lenis.scrollTo(href, { offset: -80, duration: 1.7 })
    }
    document.addEventListener('click', onClick)

    // Text blocks fade in/out with scroll, in both directions.
    // Selectors are chosen to never nest inside one another.
    const revealSelectors = [
      '.hero-brand',
      '.hero-headline',
      '.hero-lede',
      '.hero-actions',
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
      '.person',
      '.goals-grid > div',
      '.format-pills',
      '.media-block',
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
            Who Invited Us<span aria-hidden="true">?</span>
          </a>

          <ul className="nav-group nav-group-right">
            <li>
              <a href="#project">Project</a>
            </li>
            <li>
              <a href="#media">Media</a>
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
            <p className="hero-brand" id="hero-brand">
              Who Invited Us<span aria-hidden="true">?</span>
            </p>
            <h1 className="hero-headline">
              Research-driven stories about how young people live and think.
            </h1>
            <p className="hero-lede">
              Documentaries, interviews, surveys, and public reports — turning real
              experience and evidence into content people can actually use.
            </p>
            <div className="hero-actions">
              <a className="btn-primary" href="#project">
                Our first project <span aria-hidden="true">→</span>
              </a>
              <a className="btn-ghost-dark" href="#help">
                Get involved
              </a>
            </div>
          </div>
        </section>

        <section className="spotlight" id="about" aria-labelledby="about-title">
          <div className="spotlight-inner">
            <p className="eyebrow">What we are building</p>
            <h2 className="spotlight-title" id="about-title">
              A structured way to understand and document youth experience.
            </h2>
            <div className="spotlight-grid">
              <p>
                Who Invited Us? is a research-driven storytelling initiative that explores
                the experiences, challenges, and aspirations of young people through
                documentaries, interviews, surveys, and public reports.
              </p>
              <p>
                Our goal is to bridge the gap between academic research and everyday
                conversations by turning real stories and evidence into engaging,
                accessible content.
              </p>
            </div>
            <a className="btn-outline" href="#why">
              Why this matters <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="why" id="why" aria-labelledby="why-title">
          <div className="section-shell">
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
            <a className="btn-primary" href="#help">
              Support this work <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="team" id="team" aria-labelledby="team-title">
          <div className="section-shell">
            <p className="eyebrow dark">Team</p>
            <h2 className="section-title" id="team-title">
              The people behind the work.
            </h2>
            <div className="team-grid">
              <article className="person">
                <h3>Palak Gupta</h3>
                <p>
                  Research, strategy, analysis, partnerships, and project development.
                </p>
              </article>
              <article className="person">
                <h3>Samaira Bhatia</h3>
                <p>Filmmaking, editing, storytelling, and creative direction.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="goals" id="goals" aria-labelledby="goals-title">
          <div className="section-shell">
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
            <p className="eyebrow dark">Stories & media</p>
            <h2 className="section-title" id="media-title">
              Built for reports, films, writing, and audio.
            </h2>
            <p className="section-lede media-intro">
              Each project can publish across formats — research PDFs, YouTube
              documentaries, blog essays, vlog diaries, and Spotify conversations.
              Examples below show how that content will live on the site.
            </p>
            <ul className="format-pills" aria-label="Supported formats">
              {MEDIA_FORMATS.map((format) => (
                <li key={format}>{format}</li>
              ))}
            </ul>

            <div className="media-grid">
              <article className="media-block media-block-wide">
                <header className="media-block-head">
                  <p className="media-kind">PDF report</p>
                  <h3>Sample research brief</h3>
                  <p>
                    Embed public reports and findings so readers can skim or download
                    the full PDF.
                  </p>
                </header>
                <div className="pdf-frame">
                  <iframe
                    title="Sample research brief PDF"
                    src="/media/sample-research-brief.pdf"
                  />
                </div>
                <a
                  className="btn-outline-dark"
                  href="/media/sample-research-brief.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open PDF <span aria-hidden="true">→</span>
                </a>
              </article>

              <article className="media-block">
                <header className="media-block-head">
                  <p className="media-kind">YouTube · Film</p>
                  <h3>Documentary embed</h3>
                  <p>Feature-length and short films hosted on YouTube, playable on-site.</p>
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
                  <p>Shorter vlogs and behind-the-scenes notes from story collection.</p>
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

              <article className="media-block">
                <header className="media-block-head">
                  <p className="media-kind">Blog</p>
                  <h3>What “good daughter” really costs</h3>
                  <p className="blog-meta">Essay · Example post</p>
                </header>
                <div className="blog-body">
                  <p>
                    Family expectation is not always loud. Sometimes it is a quiet
                    checklist — grades, caretaking, marriage timelines — that shapes who
                    young women believe they are allowed to become.
                  </p>
                  <p>
                    This is a placeholder blog layout for long-form writing that sits
                    beside films and survey findings from The Good Daughter Project.
                  </p>
                  <a className="text-link" href="#project">
                    Read with the project <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>

              <article className="media-block">
                <header className="media-block-head">
                  <p className="media-kind">Spotify · Audio</p>
                  <h3>Podcast / conversation embed</h3>
                  <p>Interviews and audio essays listeners can play without leaving the page.</p>
                </header>
                <div className="spotify-frame">
                  <iframe
                    title="Example Spotify episode"
                    src="https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5?utm_source=generator"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="help" id="help" aria-labelledby="help-title">
          <div className="help-inner">
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
        </section>
      </main>

      <footer className="site-footer">
        <p className="footer-brand">Who Invited Us?</p>
        <p className="footer-note">
          Research-driven storytelling about how young people live and think.
        </p>
      </footer>
    </div>
  )
}

export default App
