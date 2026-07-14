import type { PdfDoc } from './PdfLibrary'

const FILES = [
  '/media/good-daughter-brief.pdf',
  '/media/episode-01-notes.pdf',
  '/media/survey-findings.pdf',
  '/media/interview-guide.pdf',
] as const

const TOPICS = [
  {
    category: 'Research briefs',
    label: 'Research brief',
    summary: 'Evidence snapshot linking surveys, literature, and expert notes for discussion.',
  },
  {
    category: 'Episode notes',
    label: 'Episode notes',
    summary: 'Companion PDF for the podcast: prompts, quotes, and questions for listeners.',
  },
  {
    category: 'Survey findings',
    label: 'Survey findings',
    summary: 'What respondents shared about pressure, care, identity, and belonging.',
  },
  {
    category: 'Field guides',
    label: 'Field guide',
    summary: 'Interview prompts and ethics notes used while gathering personal narratives.',
  },
  {
    category: 'Reports',
    label: 'Public report',
    summary: 'Longer write-up combining research, stories, and recommendations.',
  },
] as const

/** Demo archive of many PDFs to show search + pagination at scale. */
export function buildDemoPdfArchive(count = 100): PdfDoc[] {
  const docs: PdfDoc[] = []

  for (let i = 1; i <= count; i++) {
    const topic = TOPICS[(i - 1) % TOPICS.length]
    const month = ((i - 1) % 12) + 1
    const year = 2024 + Math.floor((i - 1) / 40)

    docs.push({
      id: `pdf-${String(i).padStart(3, '0')}`,
      title: `${topic.label} ${String(i).padStart(2, '0')}`,
      episode: `${topic.category} · #${i}`,
      category: topic.category,
      summary: topic.summary,
      src: FILES[(i - 1) % FILES.length],
      date: `${year}-${String(month).padStart(2, '0')}`,
    })
  }

  docs[0] = {
    ...docs[0],
    title: 'The Good Daughter Project — research brief',
    episode: 'Project companion',
    summary:
      'How family expectations shape the choices, responsibilities, opportunities, and identities of young women.',
  }
  docs[1] = {
    ...docs[1],
    title: 'Episode 01 — discussion notes',
    episode: 'Podcast companion',
    summary:
      'Key questions from the conversation for listeners to respond to after the episode.',
  }
  docs[2] = {
    ...docs[2],
    title: 'Early survey findings',
    episode: 'Public snapshot',
    summary:
      'What young people told us about pressure, care, and belonging — open for your judgment.',
  }

  return docs
}
