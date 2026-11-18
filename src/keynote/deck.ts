/**
 * THE DECK. The 65 slides of the Investor and Analyst Day morning keynote, in order, and its
 * sections (the agenda, slide 2).
 *
 * The words here are the source pack's (exports/_rig/keynote-src/pack/index.json → headline,
 * breadcrumb, sections; pack/NN/text.json for every other word of a slide). The pack is the
 * authority for exact characters: `node exports/_rig/keynote-src/tools/check_deck.mjs` compares
 * this file with it, and must print "deck.ts agrees with the pack".
 *
 * `title` is the slide's own headline, word for word. `crumb` is the slide's own breadcrumb
 * (the small spaced caps at its top left), [] where the slide has none. The chrome's section
 * rail and breadcrumb are drawn from this file; a scene never draws them itself.
 */

export type SectionKey = 'open' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'close'
export type Theme = 'light' | 'dark'

export interface Slide {
  /** 1 to 65. */
  n: number
  /** 's01' to 's65': the scene's folder under scenes/. */
  id: string
  section: SectionKey
  /** The slide's own breadcrumb words, in order. [] if it has none. */
  crumb: string[]
  /** The separator the deck prints between crumb[i] and crumb[i + 1] ('/' unless given). */
  crumbSep?: string[]
  /** The slide's own headline, exact. */
  title: string
  theme: Theme
  /** The slide opens its section: one big line on a quiet page. */
  divider?: boolean
  /**
   * The picture of the page that a stub shows: public/keynote/pages/NN.jpg. It is the deck's own
   * page; on the seven pages whose authors left review marks (NOTED) the page was drawn again
   * from the deck with those marks taken out, so no picture under public/ carries one.
   */
  page: string
  /** A small picture of the same, for the overview grid. */
  thumb: string
}

export interface Section {
  key: Exclude<SectionKey, 'open' | 'close'>
  /** The agenda's letter. */
  letter: string
  /** The agenda's wording, exact. */
  name: string
  first: number
  last: number
}

/** The agenda as slide 2 of the deck prints it, A to G, word for word. */
export const AGENDA_DECK: { letter: string; name: string }[] = [
  { letter: 'A', name: 'Piramal & AI the Context' },
  { letter: 'B', name: 'Introduction of our theme for 2026 AI day' },
  { letter: 'C', name: 'AI – Year in Retrospect' },
  { letter: 'D', name: 'Piramal.AI' },
  { letter: 'E', name: 'AI in Action @ Piramal' },
  { letter: 'F', name: 'AI - Under the Hood @ Piramal' },
  { letter: 'G', name: 'Implications for investors' },
]

/**
 * G, "Implications for investors", was moved out of the morning keynote: the keynote ends on the
 * finale after section F. So the keynote's agenda (slide 2, the section dividers) lists the six
 * parts it actually presents, the same six as the rail at the top, and nothing is promised that
 * is never reached. ONE SWITCH: set this to true and G is back on slide 2 and on the dividers
 * (both lay themselves out from the list's length).
 */
export const AGENDA_SHOWS_G = false

/** The agenda the keynote shows. */
export const AGENDA: { letter: string; name: string }[] = AGENDA_SHOWS_G ? AGENDA_DECK : AGENDA_DECK.slice(0, 6)

export const SECTIONS: Section[] = [
  { key: 'A', letter: 'A', name: AGENDA[0].name, first: 3, last: 8 },
  { key: 'B', letter: 'B', name: AGENDA[1].name, first: 9, last: 14 },
  { key: 'C', letter: 'C', name: AGENDA[2].name, first: 15, last: 25 },
  { key: 'D', letter: 'D', name: AGENDA[3].name, first: 26, last: 30 },
  { key: 'E', letter: 'E', name: AGENDA[4].name, first: 31, last: 54 },
  { key: 'F', letter: 'F', name: AGENDA[5].name, first: 55, last: 64 },
]

const Y12 = 'THE PAST 12 MONTHS IN AI'
const PAI = 'PIRAMAL.AI'
const HOOD = 'AI – UNDER THE HOOD'

type Row = [title: string, crumb?: string[], opts?: Partial<Pick<Slide, 'theme' | 'divider' | 'crumbSep'>>]

/** Slide n is ROWS[n - 1]. */
const ROWS: Row[] = [
  /* 01 */ ['Investor and Analyst Day 2026', [], { theme: 'dark' }],
  /* 02 */ ['Agenda'],
  /* 03 */ ['The Year That Moved Us Forward', [], { theme: 'dark' }],
  /* 04 */ ['We have built a large, diversified retail-led business'],
  /* 05 */ ['We strengthened our foundation with key milestones'],
  /* 06 */ ['Our retail scale-up (along with declining opex and controlled risk) is among the fastest ones in industry'],
  /* 07 */ ['Growth business profitability is now driving company performance.'],
  /* 08 */ ['Top 5 Outcomes of Piramal.ai'],
  /* 09 */ ['Our Theme for today', [], { divider: true }],
  /* 10 */ ['Building AI for Bharat'],
  /* 11 */ ['1. “What do I talk about when I talk about AI ?”'],
  /* 12 */ ['2 · BHARAT, our focus is serving Middle India'],
  /* 13 */ ['2 · Serving Bharat starts with understanding its people'],
  /* 14 */ ['3 · BUILDING – is our EDGE.'],
  /* 15 */ ['AI – Year in Retrospect', [], { theme: 'dark', divider: true }],
  /* 16 */ ['What happened in the world of AI in the past 12m?', [Y12]],
  /* 17 */ ['Almost everyone uses AI now, but only 6 in 100 can see it in their profits.', [Y12, 'ENOUGH OF PILOTS']],
  /* 18 */ ['Composite AI: Predictive AI and GenAI were two separate worlds, and now they work as one.', [Y12, 'COMPOSITE AI']],
  /* 19 */ [
    'Open-weight models are catching up: they now carry 7 in 10 developer tokens, and a token costs about half.',
    [Y12, 'OPEN WEIGHT MODELS CATCHING UP'],
  ],
  /* 20 */ ['Everyone expected agents to fly free this year, but the string stayed firmly in human hands.', [Y12, 'AGENTIC WORKFLOWS']],
  /* 21 */ ['AI is reshaping software: companies now build what they used to buy.', [Y12, 'AI RESHAPES SAAS']],
  /* 22 */ ["AI's bottleneck has moved from chips to electricity.", [Y12, 'COMPUTE HITS A POWER WALL']],
  /* 23 */ [
    "Sovereign and Indic AI enter adolescence: India's own models grew up and found their voice this year.",
    [Y12, 'SOVEREIGN & INDIC AI'],
  ],
  /* 24 */ ['AI now arms the attacker and the defender alike, and cybersecurity sits in the boardroom.', [Y12, 'AI SECURITY ARMS RACE']],
  /* 25 */ ['At Piramal, these shifts are already showing up in the numbers', [Y12, 'THE PIRAMAL LINK']],
  /* 26 */ ['Piramal.AI', [], { theme: 'dark', divider: true }],
  /* 27 */ ['What happened in Piramal.AI in the past 12m?', [Y12]],
  /* 28 */ ['While we have multiple agents helping across functions, we have star agents shapes our core lending functions'],
  /* 29 */ ['AI is now part of how we lend, from Sales to Collections', [PAI, 'AI IN EVERY LENDING FUNCTION']],
  /* 30 */ ['Our AI, Tech & data science capabilities have achieved massive scale'],
  /* 31 */ ['AI in Action @ Piramal', [], { theme: 'dark', divider: true }],
  /* 32 */ ['Top 5 Outcomes of Piramal.ai'],
  /* 33 */ ['On his own, Sushil runs five checks, one after another, through a mountain of documents.', [PAI, 'CREDIT.AI'], { crumbSep: ['|'] }],
  /* 34 */ ['ABCD is Sushil’s pit crew: 15 specialist agents work on the same case at the same time.', [PAI, 'CREDIT.AI'], { crumbSep: ['|'] }],
  /* 35 */ ['ABCD recommends, with its reasons on all five Cs, and Sushil makes the call.', [PAI, 'CREDIT.AI'], { crumbSep: ['|'] }],
  /* 36 */ ['ABCD Banking Agent, helps understand Cashflows of long and UPI heavy statements', [PAI, 'UNDERWRITE BETTER'], { crumbSep: ['|'] }],
  /* 37 */ ['ABCD Banking Agent, raises triggers like Flight risk, Visa activity', [PAI, 'UNDERWRITE BETTER'], { crumbSep: ['|'] }],
  /* 38 */ ['ABCD Banking Agent, raises triggers like Gaming & Crypto Transactions', [PAI, 'UNDERWRITE BETTER'], { crumbSep: ['|'] }],
  /* 39 */ ['ABCD Banking agent - A Composite AI network helps score customer with reasoning', [PAI, 'UNDERWRITE BETTER'], { crumbSep: ['|'] }],
  /* 40 */ [
    'Today, every collection visit starts fresh, records one fixed outcome and follows a fixed calendar.',
    [PAI, 'UNDERWRITE BETTER. + ENHANCE PRODUCTIVITY.'],
    { crumbSep: ['|'] },
  ],
  /* 41 */ [
    'Nivaaran captures what the customer tells us and turns it into the next collection decision.',
    [PAI, 'UNDERWRITE BETTER. + ENHANCE PRODUCTIVITY.'],
    { crumbSep: ['|'] },
  ],
  /* 42 */ ['Without a GPS, our sales manager plans from memory, asks around and loses business on the way.', [PAI, 'DRIVE GROWTH'], { crumbSep: ['|'] }],
  /* 43 */ ['With Arya, our sales manager simply starts his day and AI guides every turn.', [PAI, 'DRIVE GROWTH'], { crumbSep: ['|'] }],
  /* 44 */ ['PIA is doing 100cr+ cross-sell, Humans steps in when needed', [PAI, 'DRIVE GROWTH + IMPROVE CX'], { crumbSep: ['|'] }],
  /* 45 */ ['AI used to finish our lines of code. Today it works at every stage of how we build software.', [PAI, 'AI IN SOFTWARE DEVELOPMENT'], { crumbSep: ['|'] }],
  /* 46 */ ['In AIDLC, AI agents do the heavy lifting at every stage and our people make every decision.', [PAI, 'AI IN SOFTWARE DEVELOPMENT'], { crumbSep: ['|'] }],
  /* 47 */ ['Our engineers now build the AI agents and write the skills that make every agent better at its job.', [PAI, 'AI IN SOFTWARE DEVELOPMENT'], { crumbSep: ['|'] }],
  /* 48 */ ['Building is now so fast that we build more of our own software and pay for infrastructure, not per seat.', [PAI, 'AI IN SOFTWARE DEVELOPMENT'], { crumbSep: ['|'] }],
  /* 49 */ ['With AIDLC, we now deliver the same work in less than half the time.', [PAI, 'AI IN SOFTWARE DEVELOPMENT'], { crumbSep: ['|'] }],
  /* 50 */ ['Martin trains new joiners in Tamil, because Prastuti builds his decks in their language.', [PAI, 'EVERYDAY AI', 'PRASTUTI'], { crumbSep: ['|', '/'] }],
  /* 51 */ ['Non-Tech people building their own tech and agents.'],
  /* 52 */ ['Non-Tech people building their own tech and agents.'],
  /* 53 */ ['Non-Tech people building their own tech and agents.'],
  /* 54 */ ['LI & GI Surrender Verification'],
  /* 55 */ ['Under the Hood Of AI', [], { theme: 'dark', divider: true }],
  /* 56 */ ['At Piramal, we have built an AI ecosystem', [HOOD, 'AI ECOSYSTEM']],
  /* 57 */ ['AI usage increased 20x with our usecases expansion across functions, Cost per token down 46%', [HOOD, 'OPEN ARCHITECTURE']],
  /* 58 */ ['Our Hybrid approach to Frontier APIs vs Open wt using our Own GPU Platform'],
  /* 59 */ ['Six pillars turn open models into in-house AI'],
  /* 60 */ ['Four levers help us utilize GPU efficiently'],
  /* 61 */ ['The Team'],
  /* 62 */ ['Published at top AI conferences, in India and the world'],
  /* 63 */ ['Patenting our ideas and sharing them worldwide'],
  /* 64: the slide has no headline of its own; its breadcrumb names it */ ['Our Team', [HOOD, 'OUR TEAM']],
  /* 65 */ ['Thank You', [], { theme: 'dark' }],
]

/**
 * The pages on which the deck's authors left review marks: yellow note boxes (8, 25, 29, 30, 61,
 * 65), yellow highlighter (30, 38) and a written instruction (61). public/keynote/pages/NN.jpg of
 * these was drawn again without them (exports/_rig/keynote-src/tools/clean_pages.py). The words
 * of the notes are role "internal-note" in the pack's text.json: they never appear in /keynote.
 */
export const NOTED = [8, 25, 29, 30, 38, 61, 65]

export const pad = (n: number) => String(n).padStart(2, '0')

/**
 * For a scene that spans several slides (SceneModule.slides): all its beats in a row, slide by
 * slide. `beats: spanBeats(SLIDES_OF_THE_SCENE)`.
 */
export const spanBeats = (slides: Record<number, string[]>): string[] =>
  Object.keys(slides)
    .map(Number)
    .sort((a, b) => a - b)
    .flatMap((n) => slides[n])

export function sectionOf(n: number): SectionKey {
  if (n <= 2) return 'open'
  if (n >= 65) return 'close'
  return (SECTIONS.find((s) => n >= s.first && n <= s.last) as Section).key
}

export const SLIDES: Slide[] = ROWS.map(([title, crumb = [], opts = {}], i) => {
  const n = i + 1
  return {
    n,
    id: `s${pad(n)}`,
    section: sectionOf(n),
    crumb,
    crumbSep: opts.crumbSep,
    title,
    theme: opts.theme ?? 'light',
    divider: opts.divider,
    page: `/keynote/pages/${pad(n)}.jpg`,
    thumb: `/keynote/thumbs/${pad(n)}.jpg`,
  }
})

export const COUNT = SLIDES.length

export const slide = (n: number): Slide => SLIDES[Math.min(COUNT, Math.max(1, Math.round(n))) - 1]

export const section = (key: SectionKey): Section | null => SECTIONS.find((s) => s.key === key) ?? null
