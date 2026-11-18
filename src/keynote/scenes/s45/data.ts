/**
 * The train story, slides 45 to 49: every word and number, copied from the pack
 * (exports/_rig/keynote-src/pack/45 … 49: text.json block ids and data.json fields in the comments).
 */

/* ---------------------------------------------------------------- slide 45 */

/** 45 data.json → banner (t03: "Same track. " navy, the rest flame) */
export const BANNER_45 = { text: 'Same track. A more powerful engine each time.', flame: ['A more powerful engine each time.'] }

export interface Generation {
  key: string
  /** the engine's cut-out (pack/45 images.json) and its placement rect on the slide */
  file: string
  rect: [number, number, number, number]
  /** the figure as printed (t04, t08, t12, t16) */
  value: string
  valueLine: string
  title: string
  text: string
  highlighted?: boolean
}

/** 45 data.json → stages[] ; rects from images.json → placements[0].rect */
export const GENERATIONS: Generation[] = [
  {
    key: 'trolley',
    file: 'illus-train-1-hand-trolley.png',
    rect: [0.0765, 0.4281, 0.1545, 0.1307],
    value: '~7%',
    valueLine: 'of our code written with AI’s help',
    title: 'AI finishes the sentence',
    text: 'It suggests the next few words as an engineer types.',
  },
  {
    key: 'steam',
    file: 'illus-train-2-steam-engine.png',
    rect: [0.2836, 0.3801, 0.2026, 0.1814],
    value: '40 to 45%',
    valueLine: 'of our code written with AI’s help',
    title: 'AI knows one whole project',
    text: 'It understands a project and changes many files together.',
  },
  {
    key: 'electric',
    file: 'illus-train-3-electric-loco.png',
    rect: [0.5116, 0.4081, 0.2078, 0.152],
    value: '70%+',
    valueLine: 'of our code written with AI’s help',
    title: 'AI works across projects',
    text: 'It analyses, designs and codes across many projects at once.',
  },
  {
    key: 'aidlc',
    file: '',
    rect: [0, 0, 0, 0],
    value: 'AIDLC',
    valueLine: 'AI-Driven Delivery Life Cycle',
    title: 'AI joins the whole life cycle',
    text: 'It helps from the first idea to support, for every role in engineering.',
    highlighted: true,
  },
]

/** The landscape (45 and 46: the same file), 2688 x 540, at its pack rect [0, 0.2534, 1, 0.3574]. */
export const LANDSCAPE = { n: 45, file: 'illus-railway-landscape.jpg', px: [2688, 540] as const }
/** The whole high-speed train (pack/46 images.json), 2021 x 349, rect [0.2491, 0.3521, 0.6902, 0.2107]. */
export const TRAIN = { n: 46, file: 'illus-train-high-speed-full.png', rect: [0.2491, 0.3521, 0.6902, 0.2107] as const }

/* ---------------------------------------------------------------- slide 46 */

/** 46 data.json → banner (t03, t04), pill (t05), labels (t09, t12) */
export const BANNER_46 = { title: 'AIDLC: AI-Driven Delivery Life Cycle', flame: ['AIDLC'], line: 'Same track, same signals, a more powerful engine.' }
export const PILL_46 = { text: '20+ purpose-built AI agents', flame: ['20+'] }
export const LABELS_46 = { agents: 'AI AGENTS', people: 'OUR PEOPLE' }

export interface Stage {
  n: number
  stage: string
  ai: string
  /** bold words of the AI line (t08: "Solution Hub" is bold navy) */
  bold?: string[]
  agents: string[]
  people: string
}

/** 46 data.json → stages[] */
export const STAGES: Stage[] = [
  { n: 1, stage: 'Requirements', ai: 'Solution Hub turns a business conversation into requirements.', bold: ['Solution Hub'], agents: ['PRD Creator', 'PRD Reviewer'], people: 'Review and refine' },
  { n: 2, stage: 'Screen design', ai: 'AI proposes options for how the screens look.', agents: ['UX Design Creator', 'UX Design Reviewer'], people: 'Designers choose' },
  { n: 3, stage: 'System design', ai: 'AI proposes options for the architecture.', agents: ['Software Design Creator', 'Software Design Reviewer'], people: 'Architects choose' },
  { n: 4, stage: 'Coding', ai: 'AI writes the code, step by step.', agents: ['Coder'], people: 'Engineers guide every step' },
  { n: 5, stage: 'Code review', ai: 'AI checks code quality and security.', agents: ['Review Genie', 'Security Reviewer'], people: 'Engineers approve' },
  { n: 6, stage: 'Testing', ai: 'AI writes the tests and checks them.', agents: ['Test Case Creator', 'Test Reviewer'], people: 'Testers add scenarios and approve' },
  { n: 7, stage: 'Release', ai: 'AI helps with releases, picks up support tickets and troubleshoots.', agents: ['SmartHelp', 'On-call Agent'], people: 'Teams oversee and escalate' },
]

/* ---------------------------------------------------------------- slide 47 */

/** 47 data.json → stats[] (t03 to t08) */
export const STATS_47 = [
  { to: 60, suffix: '+', title: 'AI agents built by our engineers', line: 'Each one built for one job.' },
  { to: 70, suffix: '+', title: 'skills written for those agents', line: 'Carefully curated, one task at a time.' },
]
/** 47 data.json → pictureCaption (t09: first line navy, second flame) */
export const CAPTION_47 = ['Our engineers drive the train.', 'They also build the engines.']
/** 47 data.json → skill (t10 to t15) */
export const SKILL = {
  label: 'WHAT IS A SKILL?',
  title: 'A skill is a short playbook that teaches an agent how Piramal does one task.',
  flame: ['how Piramal does one task'],
  pills: ['Step-by-step instructions', 'Our standards and checklists', 'Ready tools and templates'],
  text: 'An agent picks up the right skill when a task needs it. Our engineers curate every skill, so the agents keep getting better.',
  bold: ['Our engineers curate every skill, so the agents keep getting better.'],
}
/** 47 data.json → banner (t16) */
export const BANNER_47 = {
  text: 'While the agents drive the work, our engineers keep building new agents and sharpening their skills.',
  flame: ['our engineers keep building new agents and sharpening their skills.'],
}
/** pack/47 images.json: 1298 x 865 at rect [0.045, 0.2734, 0.4426, 0.5241] */
export const WORKSHOP = { n: 47, file: 'illus-engineers-workshop.jpg' }

/* ---------------------------------------------------------------- slide 48 */

/** 48 data.json → compare[] (t03 to t13), footnote (t14) */
export const COMPARE = [
  {
    key: 'buy',
    label: 'BUYING SOFTWARE',
    file: 'illus-coach-empty-seats.jpg',
    title: 'A ticket for every seat',
    bullets: ['A licence for every user, every year.', 'Built for many companies at once.', 'Still the right choice for standard needs.'],
  },
  {
    key: 'build',
    label: 'BUILDING IT OURSELVES, WITH AIDLC',
    file: 'illus-coach-team.jpg',
    title: 'Our own coach',
    bullets: ['We pay for the infrastructure it runs on.', 'Built around the way Piramal works.', 'A new colleague needs no new licence.'],
  },
]
export const FOOTNOTE_48 = {
  lead: 'Across the industry: ',
  text: '35% of the teams in Retool’s 2026 survey have already replaced at least one purchased tool with software they built.',
}

/* ---------------------------------------------------------------- slide 49 */

/** 49 data.json → headlineStat (t03 to t06) */
export const STAT_49 = {
  from: 55,
  to: 60,
  line: 'less time from requirement to tested software',
  sub: 'on average, across 17 tracked pieces of work',
  pills: ['Best case 95%', 'Usually 50 to 75%'],
}
/** 49 data.json → charts[0] (t07 to t22) */
export const DAYS = {
  title: 'DAYS OF WORK AT EACH STAGE',
  series: ['Earlier', 'With AIDLC'],
  rows: [
    { label: 'Requirements', earlier: 1.5, aidlc: 0.3, earlierText: '1.5 days', aidlcText: '0.3 days' },
    { label: 'Design', earlier: 2.5, aidlc: 1, earlierText: '2.5 days', aidlcText: '1 day' },
    { label: 'Build', earlier: 3.5, aidlc: 1.2, earlierText: '3.5 days', aidlcText: '1.2 days' },
    { label: 'Testing', earlier: 0.75, aidlc: 0.35, earlierText: '0.75 days', aidlcText: '0.35 days' },
  ],
  /** t21 */
  note: [
    { b: 'Biggest gains: ', t: 'well-defined, repeatable work and test writing.' },
    { b: 'Smaller gains: ', t: 'unclear needs and complex design.' },
  ],
}
/** 49 data.json → quotes[] (t23 to t28); the portraits are real photographs, 189 x 189, shown as they are */
export const QUOTES = [
  { file: 'photo-jayendra.jpg', text: 'A task that took a full day now takes 1 to 1.5 hours.', name: 'Jayendra', role: 'Engineering Manager' },
  { file: 'photo-aryan-garg.jpg', text: 'A feature that took 4 to 5 days now takes about 7 hours.', name: 'Aryan Garg', role: 'Developer' },
  { file: 'photo-anil-kumar.jpg', text: 'Testing effort fell from about 2.5 hours to about 25 minutes.', name: 'Anil Kumar', role: 'QA Lead' },
]
/** pack/49 images.json: 902 x 440 at rect [0.045, 0.2801, 0.3076, 0.2667] (the deck crops a hair off the right and the bottom) */
export const STATION = { n: 49, file: 'illus-train-station.jpg' }
