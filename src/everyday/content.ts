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

interface ProductBase {
  key: ProductKey
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
  /** Priya, in her own words, at three points in the moment. */
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
    /** The old way: the same ticket going back and forth with the backend team. */
    old: { status: string; thread: { from: 'team' | 'priya'; text: string }[]; still: string }
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
  }
}
export interface MindProduct extends ProductBase {
  key: 'mind'
  demo: {
    /** What flows into it by itself, all the time. This is the memory. */
    ingests: string[]
    /** The small tag that says the memory fills by itself, all the time. */
    ingested: string
    /** The change Priya's team asked for. */
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

export const PRODUCTS: Product[] = [
  {
    key: 'smarthelp',
    name: 'SmartHelp',
    promise: 'Support tickets that solve themselves.',
    accent: 'azure',
    time: '9:10 am',
    place: 'At the branch',
    track: 'day',
    before: { headline: 'A support ticket, a queue, a back-and-forth.', detail: 'The ticket goes back and forth. The customer waits.' },
    priya: {
      before: 'The eKYC for my customer would not go through. Earlier, I raised a support ticket and waited for the backend team.',
      tool: 'Now I raise it on SmartHelp, our support desk.',
      after: 'It found the problem and fixed it itself. No back-and-forth.',
    },
    after: 'The ticket is solved in the same chat. Nobody had to pick it up.',
    stat: { value: '~15%', label: 'of support tickets resolved with no human' },
    demo: {
      desk: 'Support desk',
      app: 'Sales Central',
      ticket: { id: '#4821', text: 'Not able to complete eKYC for my customer.' },
      old: {
        status: 'With the backend team',
        thread: [
          { from: 'team', text: 'Please share a screenshot.' },
          { from: 'priya', text: 'Sent.' },
          { from: 'team', text: 'Can you try again?' },
          { from: 'priya', text: 'Still failing.' },
        ],
        still: 'Still open',
      },
      raise: 'Raise ticket',
      steps: [
        { k: 'Understood', v: 'eKYC is stuck for this customer' },
        { k: 'Found', v: 'Verified, but the status did not update' },
        { k: 'Fixed', v: 'Re-synced the eKYC status' },
      ],
      safe: 'Safe, pre-approved command',
      resolved: 'Resolved. Please try eKYC again.',
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
    name: 'BYOT',
    expansion: ['Build', 'Your', 'Own', 'Tech'],
    promise: 'Apps built by the team that needs them. No code.',
    accent: 'flame',
    time: '10:30 am',
    place: 'On a site visit',
    photo: '/everyday/moment-visit.jpg',
    before: { headline: 'Visit notes, written at night, from memory.', detail: 'Details slip. Follow-ups are late.' },
    priya: {
      before: 'I used to write my visit notes at night, from memory.',
      tool: 'So my team built our own app, on BYOT. Nobody in my team writes code.',
      after: 'Now I speak the note right after the visit, and it is filed.',
    },
    after: 'She speaks a note on the spot, in her team’s own app.',
    stat: { value: '634', label: 'employees built their own tool' },
    track: 'day',
    demo: {
      app: 'Visit Notes',
      builtBy: 'Built by the Lucknow sales team, on BYOT',
      blocks: ['Voice note', 'Customer', 'Property', 'Next step'],
      spoken: 'Met Mr Verma at the Gomti Nagar site. Second-floor slab is done. He needs the next tranche by Friday.',
      fields: [
        { k: 'Customer', v: 'R. Verma' },
        { k: 'Property', v: 'Gomti Nagar, Plot 14' },
        { k: 'Stage', v: 'Second-floor slab done' },
        { k: 'Next step', v: 'Tranche request by Friday' },
      ],
      filed: 'Filed 10:42 am',
      beforeWhen: '11:40 pm',
    },
  },
  {
    key: 'byoa',
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
      builtBy: 'An agent built by Priya, on BYOA',
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
    },
  },
  {
    key: 'mind',
    name: 'Piramal Mind',
    promise: 'The memory and the intelligence of our engineering.',
    accent: 'navy',
    time: 'Every day',
    place: 'With the engineering team',
    track: 'engineering',
    before: { headline: 'What was decided, and why, was scattered.', detail: 'It lived in old tickets, old code and people’s heads.' },
    priya: {
      before: 'My team asked for a change in our Sales Central app. Someone in Engineering builds it.',
      tool: 'The engineers who build my apps work with Piramal Mind.',
      after: 'It remembered what had already been decided. The change came out right.',
    },
    after: 'It remembers every codebase and every ticket, and it connects them.',
    stat: { value: '80%', label: 'lower AI cost' },
    demo: {
      ingests: ['Every codebase', 'Every Jira ticket', 'Every discussion'],
      ingested: 'Auto-ingested',
      request: { id: 'SC-2291', from: 'From the Lucknow sales team', text: 'Add a co-applicant step to the home-loan journey.' },
      developer: 'Arjun, engineer, journey apps',
      prompt: 'Add the co-applicant step. Use the blue header theme.',
      talksBack: {
        lead: 'Before I build this',
        text: 'The blue theme was replaced after a later discussion.',
        source: { id: 'SC-2104', title: 'Journey apps move to the new theme', when: 'Decided three weeks ago' },
        ask: 'Shall I use the new theme?',
      },
      accept: 'Use the new theme',
      built: 'Built in the new theme',
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
  title: 'Meet Priya.',
  role: 'Home-loan sales officer, Piramal Finance, Lucknow',
  /** "AI learned her job" is the phrase to emphasise. */
  line: { lead: 'She never learned AI. ', em: 'AI learned her job.', tail: ' This is her Tuesday.' },
  /** Her own words on this screen (in her speech bubble, by her photo). */
  said: 'I am not from Tech. Nobody on my team is.',
  portrait: '/everyday/priya.jpg', // 360 x 360, head and shoulders
  photo: '/everyday/priya-full.jpg', // 716 x 880, standing in the branch
} as const

/** 4 · The chapter card between her day and Piramal Mind. */
export const ENGINEERING = {
  eyebrow: 'Behind her Tuesday',
  headline: { lead: 'Someone builds the apps Priya works in. ', em: 'Our engineers', tail: ' have an Everyday AI of their own.' },
  /** Her own words on this screen (in her speech bubble). */
  said: 'Every app I opened today was built by our engineering team.',
} as const

/** 6 · The last screen: the five names once more. Short; the explanation was the first screen. */
export const CLOSING = {
  eyebrow: 'That is Everyday AI',
  /** Her own words on this screen (in her speech bubble). */
  said: 'That was my Tuesday.',
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
