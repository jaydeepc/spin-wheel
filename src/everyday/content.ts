/**
 * EVERYDAY AI. The words, numbers and demo data.
 *
 * The film, in order:
 *   1 OPENING      what Everyday AI is (this is the first thing a visitor reads)
 *   2 PRIYA        meet Priya, a home-loan sales officer in Lucknow who is not from Tech
 *   3 her Tuesday  four product moments: SmartHelp, BYOT, BYOA, Prastuti
 *   4 ENGINEERING  a short chapter card: the people who build the apps she works in
 *   5 Piramal Mind the engineering team's own product moment (not part of her day)
 *   6 CLOSING      the five names once more
 *
 * The products are the heroes: a visitor should walk away knowing SmartHelp, BYOT, BYOA,
 * Prastuti and Piramal Mind, and what each one does.
 *
 * Every screen keeps to a budget (moments/README.md): the name, at most one statement, Priya's
 * line in her speech bubble, ONE picture. So not every field here is on screen: where one is
 * kept for the record only, its comment says so.
 *
 * WHO TELLS IT. Priya's Tuesday is the thread, but a moment is told by the person whose work it
 * is (`speaker`): BYOT by a collections officer, Piramal Mind by an engineer. The bubble carries
 * a small name tag, so a visitor always knows who is talking.
 *
 * REAL SCREENS. Where a real screenshot is to come (`shots`), the film draws a labelled
 * placeholder until its file is supplied.
 *
 * Everything on screen comes from here, so the story reads the same everywhere.
 * The demo details (ticket numbers, customer names, file names) are illustrative.
 * The five headline numbers are from the Everyday AI narrative slide.
 * There is no music and no narration: the film is silent, so a presenter can talk over it.
 */

export type Accent = 'flame' | 'azure' | 'navy'
export type ProductKey = 'smarthelp' | 'byot' | 'byoa' | 'prastuti' | 'mind'

/** The same five steps in every product moment, in this order. */
export const STEPS = ['before', 'name', 'demo', 'result', 'stat'] as const
export type Step = (typeof STEPS)[number]

/** Who tells a moment: the face and the name tag on the speech bubble. */
export interface Speaker {
  name: string
  /** A few words: what they do. Shown beside the name on the bubble's tag. */
  role: string
  portrait: string
}

/**
 * A place for a REAL screenshot of the product. While `src` is empty the film draws a labelled
 * placeholder there; put the file in public/everyday/shots/ and set `src` to show it.
 * Every screenshot: 1600 x 1000 px (16:10), PNG, the app's window only (no browser tabs, no desktop).
 */
export interface ShotSpec {
  src: string
  /** What the picture is, in a few words. Shown on the placeholder, and read out as the image's label. */
  label: string
  /** What must be in the picture. Shown on the placeholder only. */
  want: string
}

interface ProductBase {
  key: ProductKey
  /** Who tells this moment. */
  speaker: Speaker
  /** The product's name: the hero of its moment. */
  name: string
  /** What the name stands for, word by word, for acronyms (B·Y·O·T → Build Your Own Tech). */
  expansion?: string[]
  /** Prastuti is the Hindi word for "presentation". */
  devanagari?: string
  meaning?: string
  /** One short line: what it is. */
  promise: string
  accent: Accent
  time: string
  place: string
  /** A photo of this moment in her day, where there is one (about 460 x 540 px). Not drawn in the film at present: a moment shows ONE picture, the device. */
  photo?: string
  /** The old way. On screen: nothing of it at the before rest (Priya's line tells it), except Piramal Mind's headline. `detail` is not shown. */
  before: { headline: string; detail: string }
  /** The speaker (`speaker`), in their own words, at three points in the moment. */
  priya: { before: string; tool: string; after: string }
  /** The new way, in one sentence. */
  after: string
  stat: { value: string; label: string }
  /** 'day' is a moment in Priya's Tuesday. 'engineering' is its own chapter, after her day (Piramal Mind). */
  track: 'day' | 'engineering'
}

export interface SmartHelpProduct extends ProductBase {
  key: 'smarthelp'
  demo: {
    /** What the screen is: the support desk. */
    desk: string
    /** The app the problem is in. */
    app: string
    ticket: { id: string; text: string }
    /** The old way: the ticket, still open on the old help desk. Only `still` is drawn (the stamp on the screenshot). */
    old: { desk: string; status: string; thread: { from: 'team' | 'priya'; text: string }[]; still: string }
    /** The real screens: the old help desk; SmartHelp with the issue typed in; the same chat, resolved. */
    shots: { before: ShotSpec; ask: ShotSpec; done: ShotSpec }
    /** The label on the one control. */
    raise: string
    /** What SmartHelp does with the ticket, in order. The last one is the fix. */
    steps: { k: string; v: string }[]
    /** The tag on the fix: it can only run commands that were approved as safe. */
    safe: string
    /** The chat's own closing line. Not drawn at present: the stamp (`closed`) says it, and the phone keeps to five rows. */
    resolved: string
    closed: string
    /** The two ways it resolves a ticket. The demo shows the second. */
    ways: { title: string; text: string }[]
    /** The same two ways in ONE short line, for a screen that has room for one line only. */
    twoWays: string
  }
}
export interface ByotProduct extends ProductBase {
  key: 'byot'
  demo: {
    app: string
    builtBy: string
    /** The parts the team put together to make the app. */
    blocks: string[]
    spoken: string
    fields: { k: string; v: string }[]
    filed: string
    beforeWhen: string
  }
}
export interface ByoaProduct extends ProductBase {
  key: 'byoa'
  demo: {
    agent: string
    builtBy: string
    /** What she told the agent to do, in plain words. That is the whole build. */
    recipe: string[]
    leads: { name: string; amount: string; ready: boolean; ask?: string }[]
    readyLabel: string
    needsLabel: string
  }
}
export interface PrastutiSlide {
  kind: 'title' | 'bars' | 'trend' | 'points'
  /** In Hindi, as the slide shows it. */
  title: string
  /** The same in English: a small gloss for a visitor who does not read Hindi. */
  en: string
  sub?: string
  /** kind 'bars': one bar per branch; value is a relative height (0 to 100), flag marks the one lagging. */
  bars?: { label: string; value: number; flag?: boolean }[]
  /** kind 'trend': relative points of a rising line, and the callout on it. */
  trend?: number[]
  callout?: string
  /** kind 'points' */
  points?: string[]
}
export interface PrastutiProduct extends ProductBase {
  key: 'prastuti'
  demo: {
    /** The language she speaks and the deck comes out in. */
    language: { native: string; en: string }
    /** What she says, in Hindi (Devanagari), and the same in English. */
    spoken: string
    spokenEn: string
    file: string
    slides: PrastutiSlide[]
    /** The stamp on the finished deck, in Hindi, and in English. */
    ready: string
    readyEn: string
    beforeWhen: string
    /** The real screens: the old way (a blank deck in PowerPoint); Prastuti's chat, where she talks; the deck it built. */
    shots: { before: ShotSpec; ask: ShotSpec; deck: ShotSpec }
  }
}
export interface MindProduct extends ProductBase {
  key: 'mind'
  demo: {
    /** What flows into it by itself, all the time. This is the memory. */
    ingests: string[]
    /** The small tag that says the memory fills by itself, all the time. */
    ingested: string
    /** The real screen: its knowledge graph. */
    shots: { graph: ShotSpec }
    /**
     * What it answers to `prompt`, along the lines of a real answer (illustrative wording): what
     * the value is now, where it lives, where that was decided (`refs`: one chip each), and what to change.
     */
    answer: {
      lead: string
      /** The two figures, shown large. */
      limits: { value: string; label: string }[]
      where: { k: string; v: string }
      decided: { k: string; refs: string[] }
      next: { k: string; v: string }
    }
    /** What the clusters of the graph are, named on it: where its context comes from. */
    sources: string[]
    /** The change the sales team asked for. */
    request: { id: string; from: string; text: string }
    developer: string
    /** What the developer types to the AI coding assistant. */
    prompt: string
    /** Piramal Mind talks back before anything is built. This is the intelligence. */
    talksBack: {
      lead: string
      text: string
      source: { id: string; title: string; when: string }
      ask: string
    }
    /** The label on the one control. */
    accept: string
    built: string
    /** What it joined up to know that. */
    connects: string[]
    /** The other thing it does: a defect comes in, and it works out why. */
    defect: { title: string; text: string }
    line: string
  }
}
export type Product = SmartHelpProduct | ByotProduct | ByoaProduct | PrastutiProduct | MindProduct

/**
 * The people who tell the film. Priya's Tuesday is the thread; a colleague tells the moment that
 * is theirs. Names, roles and portraits are ILLUSTRATIVE until the real ones are confirmed.
 */
export const SPEAKERS = {
  priya: { name: 'Shilpa', role: 'Branch Sales Manager, Bangalore', portrait: '/people/shilpa-t.jpg' },
  rohan: { name: 'Rohan', role: 'Collections officer, Lucknow', portrait: '/people/arjun-menon.jpg' },
  atul: { name: 'Atul', role: 'Software Engineer, Journey App Team', portrait: '/people/atul.jpg' },
} satisfies Record<string, Speaker>

export const PRODUCTS: Product[] = [
  {
    key: 'smarthelp',
    speaker: SPEAKERS.priya,
    name: 'SmartHelp',
    promise: 'Support tickets that solve themselves.',
    accent: 'azure',
    time: '9:10 am',
    place: 'At the branch',
    track: 'day',
    before: { headline: 'A support ticket, a queue, a back-and-forth.', detail: 'The ticket goes back and forth. The customer waits.' },
    priya: {
      before: 'My customer did not get the eSign link. Earlier, I raised a ticket on our old support platform, and waited.',
      tool: 'Now I raise it on SmartHelp, our support desk.',
      after: 'It gave me the eSign links right there. No back-and-forth.',
    },
    after: 'The ticket is solved in the same chat. Nobody had to pick it up.',
    stat: { value: '~15%', label: 'of support tickets resolved with no human' },
    demo: {
      desk: 'Support desk',
      app: 'Sales Central',
      ticket: { id: '#4821', text: 'Customer did not receive the eSign link.' },
      old: {
        desk: 'Legacy support platform',
        status: 'With the backend team',
        thread: [
          { from: 'team', text: 'Please share a screenshot.' },
          { from: 'priya', text: 'Sent.' },
          { from: 'team', text: 'Can you try again?' },
          { from: 'priya', text: 'Still failing.' },
        ],
        still: 'Still open',
      },
      shots: {
        before: {
          src: '/everyday/shots/smarthelp-before.jpg',
          label: 'Legacy support platform: the old ticket',
          want: 'One ticket open in the old support platform, a few replies back and forth, status still "Pending with backend team".',
        },
        ask: {
          src: '/everyday/shots/smarthelp-ask.jpg',
          label: 'SmartHelp: the issue, filled in',
          want: 'SmartHelp on a desktop, the issue filled into the form, not sent yet.',
        },
        done: {
          src: '/everyday/shots/smarthelp-done.jpg',
          label: 'SmartHelp: solved in the same chat',
          want: 'The same issue a moment later: the AI Assistant has answered it in the chat.',
        },
      },
      raise: 'Create Ticket',
      steps: [
        { k: 'Understood', v: 'The customer did not get the eSign link' },
        { k: 'Found', v: 'eSign is initiated, one retry so far' },
        { k: 'Fixed', v: 'Shared the eSign links to retry' },
      ],
      safe: 'Safe, pre-approved command',
      resolved: 'Resolved. Please share the eSign links.',
      closed: 'Ticket closed. No human needed.',
      ways: [
        { title: 'It guides', text: 'If it is a step she can take, it shows her where in Sales Central.' },
        { title: 'It fixes', text: 'If it is a real defect, it runs a safe, pre-approved command.' },
      ],
      twoWays: 'It guides her in the app, or fixes the defect itself with a safe command.',
    },
  },
  {
    key: 'byot',
    speaker: SPEAKERS.rohan,
    name: 'BYOT',
    expansion: ['Build', 'Your', 'Own', 'Tech'],
    promise: 'Apps built by the team that needs them. No code.',
    accent: 'flame',
    time: '10:30 am',
    place: 'On a field visit',
    photo: '/everyday/moment-visit.jpg',
    before: { headline: 'Disposition notes, written by hand after every visit.', detail: 'Details slip. Follow-ups are late.' },
    priya: {
      before: 'After every customer visit, I used to write my disposition notes by hand.',
      tool: 'So my team built our own app, on BYOT. Nobody in my team writes code.',
      after: 'Now I just speak after the visit, and the note fills itself.',
    },
    after: 'The note is spoken on the spot, in the team’s own app.',
    stat: { value: '634', label: 'employees built their own tool' },
    track: 'day',
    demo: {
      app: 'Nirman',
      builtBy: 'Built by the collections team, on BYOT',
      blocks: ['Voice note', 'Customer', 'Disposition', 'Next step'],
      spoken: 'Met Mr Verma at his Aminabad shop. He will pay by Friday. Call again on Saturday.',
      fields: [
        { k: 'Customer', v: 'R. Verma' },
        { k: 'Met at', v: 'Aminabad, his shop' },
        { k: 'Disposition', v: 'Will pay by Friday' },
        { k: 'Next step', v: 'Call again on Saturday' },
      ],
      filed: 'Filed 10:42 am',
      beforeWhen: '9:40 pm',
    },
  },
  {
    key: 'byoa',
    speaker: SPEAKERS.priya,
    name: 'BYOA',
    expansion: ['Build', 'Your', 'Own', 'Agents'],
    promise: 'AI agents built by the person with the problem.',
    accent: 'azure',
    time: '12:30 pm',
    place: 'Over chai',
    photo: '/everyday/moment-team.jpg',
    before: { headline: 'Every new lead, screened by hand.', detail: 'The ready ones wait behind the rest.' },
    priya: {
      before: 'Every new lead, I used to screen by hand.',
      tool: 'So I built my own agent, on BYOA. I told it what to check, in plain words.',
      after: 'It checks eligibility and documents, and tells me what to ask. I call only the ones who are ready.',
    },
    after: 'Her own agent pre-screens every lead before she picks up the phone.',
    stat: { value: '623', label: 'agents built by the business' },
    track: 'day',
    demo: {
      agent: 'Lead Screener',
      builtBy: 'An agent built by Shilpa, on BYOA',
      recipe: ['Check eligibility', 'Check the documents', 'Tell me what to ask'],
      leads: [
        { name: 'A. Khan', amount: '₹32 L', ready: true },
        { name: 'S. Mishra', amount: '₹18 L', ready: true },
        { name: 'P. Gupta', amount: '₹45 L', ready: false, ask: 'Last 3 months’ bank statements' },
        { name: 'R. Yadav', amount: '₹24 L', ready: true },
        { name: 'N. Singh', amount: '₹27 L', ready: false, ask: 'Income proof' },
      ],
      readyLabel: 'Ready to call',
      needsLabel: 'Needs documents',
    },
  },
  {
    key: 'prastuti',
    speaker: SPEAKERS.priya,
    name: 'Prastuti',
    devanagari: 'प्रस्तुति',
    meaning: 'Hindi for “presentation”',
    promise: 'Talk, in your own language. The deck builds itself.',
    accent: 'flame',
    time: '4:00 pm',
    place: 'At the weekly review',
    track: 'day',
    photo: '/everyday/moment-deck.jpg',
    before: { headline: 'She knew the story. The slides were the hard part.', detail: 'Hours on formatting, the night before.' },
    priya: {
      before: 'I always knew why my branch numbers moved. Making the slides was the hard part.',
      tool: 'Now I talk Prastuti through my week, in Hindi, and attach the tracker.',
      after: 'The deck built itself, in Hindi. Eighteen minutes.',
    },
    after: 'She talks the week through in Hindi. Prastuti builds the deck, in Hindi.',
    stat: { value: '18 min', label: 'median deck, in conversation' },
    demo: {
      language: { native: 'हिन्दी', en: 'Hindi' },
      spoken: 'इस हफ़्ते लोन वितरण बढ़ा है। अलीगंज पीछे चल रहा है। तीन बड़ी फ़ाइलें मूल्यांकन में अटकी हैं।',
      spokenEn: 'Disbursals are up this week. Aliganj is lagging. Three large files are stuck in valuation.',
      file: 'branch-tracker.xlsx',
      slides: [
        { kind: 'title', title: 'साप्ताहिक समीक्षा', en: 'Weekly review', sub: 'लखनऊ · इस हफ़्ते' },
        {
          kind: 'bars',
          title: 'शाखा-वार लोन वितरण',
          en: 'Disbursals by branch',
          bars: [
            { label: 'गोमती नगर', value: 92 },
            { label: 'हज़रतगंज', value: 78 },
            { label: 'इंदिरा नगर', value: 66 },
            { label: 'अलीगंज', value: 38, flag: true },
          ],
        },
        { kind: 'trend', title: 'लोन वितरण बढ़ा', en: 'Disbursals are up', trend: [34, 40, 38, 52, 61, 74], callout: 'इस हफ़्ते' },
        { kind: 'points', title: 'क्या बदला', en: 'What moved', points: ['लोन वितरण बढ़ा', 'अलीगंज पीछे', '3 फ़ाइलें मूल्यांकन में'] },
      ],
      ready: 'प्रस्तुति तैयार',
      readyEn: 'Deck ready',
      beforeWhen: 'Sunday, 11 pm',
      shots: {
        before: {
          src: '/everyday/shots/prastuti-before.jpg',
          label: 'PowerPoint: the chart, made by hand',
          want: 'PowerPoint open on a hand-made chart slide: a crowded default chart, no takeaway.',
        },
        ask: {
          src: '/everyday/shots/prastuti-ask.jpg',
          label: 'Prastuti: the chat',
          want: 'Prastuti on a desktop, close on the chat: its last message, and the box where she talks.',
        },
        deck: {
          src: '/everyday/shots/prastuti-deck.jpg',
          label: 'Prastuti: the finished deck',
          want: 'Prastuti on a desktop with a real deck it built, in Hindi: the slide list and one chart slide open.',
        },
      },
    },
  },
  {
    key: 'mind',
    speaker: SPEAKERS.atul,
    name: 'Piramal Mind',
    promise: 'The memory and the intelligence of our engineering.',
    accent: 'navy',
    time: 'Every day',
    place: 'With the engineering team',
    track: 'engineering',
    before: { headline: 'What was decided, and why, was scattered.', detail: 'It lived in old tickets, old code and people’s heads.' },
    priya: {
      before: 'Someone asks to raise the personal-loan limit. Earlier, I had to hunt for where it is set, and who decided it.',
      tool: 'Now I just ask Piramal Mind.',
      after: 'It looked everywhere for me, and told me exactly what to change.',
    },
    after: 'It remembers every codebase, every ticket and every piece of information, and it connects them.',
    stat: { value: '80%', label: 'lower AI cost' },
    demo: {
      ingests: ['Every codebase', 'Every Jira ticket', 'Every discussion'],
      ingested: 'Auto-ingested',
      sources: ['Confluence', 'Jira', 'Outlook', 'Codebase', 'DB'],
      shots: {
        graph: {
          src: '/everyday/shots/mind-graph.jpg',
          label: 'Piramal Mind: the knowledge graph',
          want: 'The graph of everything it has read: documents, tickets, emails and code, joined up.',
        },
      },
      request: { id: 'SC-2291', from: 'From the Lucknow sales team', text: 'Raise the personal-loan limit.' },
      developer: 'Atul, Software Engineer, Journey App Team',
      prompt: 'How can I increase the max loan amount and max tenure for a personal loan?',
      answer: {
        lead: 'For a personal loan, today',
        limits: [
          { value: '₹10 L', label: 'Max loan amount' },
          { value: '5 years', label: 'Max tenure' },
        ],
        where: { k: 'Where it is set', v: 'In the DB config, not in the code' },
        decided: { k: 'I looked at', refs: ['Outlook', 'Jira', 'Confluence', 'DB'] },
        next: { k: 'To change it', v: 'Update the value in the DB config' },
      },
      talksBack: {
        lead: 'Before we work on this',
        text: 'AI steps were planned for the Events tab.',
        source: { id: 'SC-2104', title: 'AI steps go on the Events tab', when: 'Planned in a recent discussion' },
        ask: 'Shall we cross-check this?',
      },
      accept: 'Ask Piramal Mind',
      built: 'Built on the Events tab',
      connects: ['The request', 'The discussion', 'The code'],
      defect: { title: 'And when a defect comes in', text: 'It traces the ticket back to the change that caused it.' },
      line: 'It remembers. And it connects.',
    },
  },
]

/** 1 · The first screen: what Everyday AI is. The film starts from here. */
export const OPENING = {
  eyebrow: 'Piramal Finance',
  title: 'Everyday AI',
  /** "our own job" is the phrase to emphasise. */
  headline: { lead: 'AI that every one of us can use, every day, to do ', em: 'our own job', tail: ' better.' },
  /** On screen: the three TITLES only, as one quiet row. The `text` of each is not shown any more. */
  pillars: [
    { title: 'In every day’s work', text: 'It lives inside the job they already do.' },
    { title: 'It does the work', text: 'It writes the deck and solves the ticket. It does not stop at a chat.' },
    { title: 'Our people build it', text: 'The person with the problem builds the tool.' },
  ],
  start: 'See it in one Tuesday',
} as const

/** 2 · Then Priya comes in, and her Tuesday explains it. */
export const PRIYA = {
  title: 'Meet Shilpa.',
  role: 'Branch Sales Manager, Personal Loans, Bangalore',
  /** "AI learned her job" is the phrase to emphasise. */
  line: { lead: 'She never learned AI. ', em: 'AI learned her job.', tail: ' This is her Tuesday.' },
  /** Her own words on this screen (in her speech bubble, by her photo). */
  said: 'I am not from Tech. Nobody on my team is.',
  portrait: '/people/shilpa-t.jpg', // square, head and shoulders
  photo: '/people/shilpa-t.jpg', // the same photo (no standing one yet)
} as const

/** 4 · The chapter card between her day and Piramal Mind. */
export const ENGINEERING = {
  eyebrow: 'Behind her Tuesday',
  headline: { lead: 'Someone builds the apps Shilpa works in. ', em: 'Our engineers', tail: ' have an Everyday AI of their own.' },
  /** Her own words on this screen (in her speech bubble). */
  said: 'Big apps like Sales Central are built by our engineering team.',
} as const

/** 6 · The last screen: the five names once more. Short; the explanation was the first screen. */
export const CLOSING = {
  eyebrow: 'That is Everyday AI',
  /** Her own words on this screen (in her speech bubble). */
  said: 'That is a Tuesday at Piramal Finance.',
} as const

/**
 * The few words on the controls. The film waits for the visitor at every step (it does not play
 * by itself unless Auto-play is switched on), and the Next button is how it moves.
 */
export const PROMPTS = {
  /** The one button that moves the film on a step. */
  next: 'Next',
  /** The small button beside it: a step back. */
  back: 'Back',
  /** What the Next button reads on the last screen, and the small restart button's label. */
  again: 'Start again',
  /** The small switch that lets the film play by itself (off unless asked for). */
  auto: 'Auto-play',
  /** Auto-play only: beside a demo control, while it waits for a visitor who is there. */
  yourTurn: 'Your turn',
} as const

/** Brand colours per accent (CSS variables from globals.css are also available: --flame, --azure, --ink-deep…). */
export const ACCENTS: Record<Accent, { main: string; ink: string; soft: string; haze: string }> = {
  flame: { main: '#f16443', ink: '#c8431c', soft: '#fff1ea', haze: '#fbd6cd' },
  azure: { main: '#4384d4', ink: '#2d6ad1', soft: '#eaf3ff', haze: '#b9e2ff' },
  navy: { main: '#071a50', ink: '#071a50', soft: '#eef1f8', haze: '#c9d6f2' },
}

export const productByKey = (key: ProductKey) => PRODUCTS.find((p) => p.key === key) as Product
