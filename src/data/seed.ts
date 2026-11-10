import type { Person, Showcase, UseCase } from './types'

/**
 * SAMPLE CONTENT — every use case, number, name, bio and quote below is illustrative
 * placeholder copy written to show the layout and the tone. The names are invented and
 * the four portraits in /public/people are AI-generated faces of people who do not exist. Replace it in /admin with
 * the real tools, verified figures, the actual creators, their photos and their own words
 * before the event.
 *
 * Tone to keep when replacing: small, specific jobs one person fixed for themselves and
 * their team. Plain words. Nothing that would have made it onto a Tech roadmap.
 */
const cases: Omit<UseCase, 'id' | 'active'>[] = [
  {
    wheelLabel: 'Field Visit Planner',
    title: 'Field Visit Planner',
    team: 'Collections',
    platform: 'BYOT',
    summary:
      'A morning visit list for twelve field officers, built by their area manager to replace an hour of phone calls.',
    oldWay: 'Every morning the area manager sorted an Excel dump by hand and phoned each officer with their accounts for the day.',
    problem: 'The calls ate the first hour. Officers still doubled back across the same pin codes.',
    solution: 'A small BYOT app that sorts each officer’s accounts by area and promise date and shows them as a list on the phone.',
    newWay: 'Officers open the list at nine and go. The morning calls are now only for the tricky accounts.',
    quote:
      'I used to spend my first hour on the phone reading out account numbers. Now I have a cup of tea and look at who needs help.',
    metrics: [
      { value: '1 hr', label: 'of morning calls no longer needed' },
      { value: '12', label: 'field officers open it every day' },
    ],
    people: [
      {
        name: 'Abhishek Biswas',
        role: 'Area Collections Manager · Collections',
        bio: 'Runs a team of twelve field officers across two districts. Fifteen years in collections, most of it on a motorbike. Had never built an app.',
        photo: '',
      },
    ],
  },
  {
    wheelLabel: 'Promise Reminder',
    title: 'Promise-to-Pay Reminder Agent',
    team: 'Collections',
    platform: 'BYOA',
    summary:
      'An agent that reads call notes, picks out the date a customer promised to pay, and reminds the caller that morning.',
    oldWay: 'Callers typed promise dates into a remarks box, then kept their own sticky notes to remember who to ring back.',
    problem: 'Sticky notes fall off monitors. Some promised dates passed without anyone calling.',
    solution: 'A BYOA agent that reads the day’s remarks, pulls out each promise date and builds a call-back list for every caller.',
    newWay: 'Each caller starts the day with a short list of who promised what. Nobody keeps sticky notes.',
    quote:
      'My team’s desks were covered in yellow notes. I just wanted something to remember the dates so we did not have to.',
    metrics: [
      { value: '22', label: 'callers get a list each morning' },
      { value: '10 min', label: 'saved per caller at the start of the day' },
      { value: '0', label: 'sticky notes on the floor' },
    ],
    people: [
      {
        name: 'Priya Nair',
        role: 'Tele-calling Team Lead · Collections',
        bio: 'Leads 22 callers on the collections floor and started as one eight years ago. The only thing built before this was the shift roster.',
        photo: '/people/priya-nair.jpg',
      },
    ],
  },
  {
    wheelLabel: 'Branch Hiring Tracker',
    title: 'Branch Hiring Tracker',
    team: 'Human Resources',
    platform: 'BYOT',
    summary:
      'One shared list of open branch roles, built by a recruiter who was tired of merging five spreadsheets every Friday.',
    oldWay: 'Each regional recruiter kept a separate spreadsheet. On Fridays one recruiter stitched them into a status mail.',
    problem: 'The merge took half a day and was out of date by Monday. Old vacancies got lost in the rows.',
    solution: 'A BYOT tracker where branch managers raise a role and recruiters update its stage. Roles open over 30 days turn amber.',
    newWay: 'Everyone looks at the same list. The Friday merge is gone and the oldest roles get worked first.',
    quote: 'Friday afternoons were copy and paste. Now I leave on time, and nobody asks me for the status mail.',
    metrics: [
      { value: 'Half a day', label: 'back every Friday' },
      { value: '5 → 1', label: 'spreadsheets to keep up to date' },
    ],
    people: [
      {
        name: 'Rohan Deshmukh',
        role: 'Talent Acquisition Lead · Human Resources',
        bio: 'Hires branch staff for the western region. Spends most days on the phone with candidates and branch managers.',
        photo: '/people/rohan-deshmukh.jpg',
      },
    ],
  },
  {
    wheelLabel: 'Onboarding Buddy',
    title: 'Onboarding Buddy',
    team: 'Human Resources',
    platform: 'BYOA',
    summary:
      'A chat agent that answers the questions every new joiner asks in week one, so they do not have to wait for HR.',
    oldWay: 'New joiners emailed HR about ID cards, leave and laptops. The same forty questions, every batch.',
    problem: 'Replies took a day or two. Joiners sat waiting and the HR inbox never emptied.',
    solution: 'A BYOA agent loaded with the joining handbook and HR policies. It answers on chat and says when to ask a person.',
    newWay: 'Most questions get an answer in seconds. HR hears only about the ones that need a human.',
    quote:
      'I was telling someone where to collect their ID card forty times a month. I like new joiners, but not that question.',
    metrics: [{ value: '8 in 10', label: 'joiner questions answered without HR' }],
    people: [
      {
        name: 'Ananya Iyer',
        role: 'HR Business Partner · Human Resources',
        bio: 'Looks after joining and day-to-day HR for thirty branches. Background in psychology and people work, not software.',
        photo: '',
      },
    ],
  },
  {
    wheelLabel: 'Branch Helpdesk',
    title: 'Branch Repair Helpdesk',
    team: 'Administration',
    platform: 'BYOT',
    summary: 'Branch staff report a broken AC or a dead UPS with a photo, and can see who is fixing it.',
    oldWay: 'Branches phoned or emailed the regional admin desk. Requests sat in one inbox and vendors were chased by phone.',
    problem: 'Nobody could say how many repairs were open or how long a branch had been waiting.',
    solution: 'A BYOT form with a photo upload. Each request goes to the right vendor and stays open until the branch says it is fixed.',
    newWay: 'Every repair has a name and a date against it. Branches stop calling to ask what happened.',
    quote:
      'In May my phone rang all day about air conditioners. Now the branch can see the vendor is coming on Thursday, so they do not call.',
    metrics: [
      { value: '6 → 2 days', label: 'typical wait for a repair' },
      { value: '38', label: 'branches raising requests' },
    ],
    people: [
      {
        name: 'Suresh Patil',
        role: 'Regional Admin Manager · Administration',
        bio: 'Keeps 38 branches running: power, air conditioning, furniture, vendors. Knows every electrician in the region by first name.',
        photo: '',
      },
      {
        name: 'Farah Khan',
        role: 'Branch Operations Executive · Operations',
        bio: 'Works the front desk of a busy branch and raised most of the early requests. Tested every version on a phone between customers.',
        photo: '',
      },
    ],
  },
  {
    wheelLabel: 'Loan File Checker',
    title: 'Loan File Checker',
    team: 'Operations',
    platform: 'BYOA',
    summary:
      'An agent that goes through a loan file against the checklist and lists what is missing before a checker opens it.',
    oldWay: 'Checkers opened every document in a file and ticked a paper checklist. Gaps went back to the branch by email.',
    problem: 'Files bounced two or three times for small misses, like a signature or a mismatched date.',
    solution: 'A BYOA agent that reads the documents, compares names, amounts and dates, and writes one list of gaps for the branch.',
    newWay: 'The branch gets every gap in one go. Checkers confirm the list instead of hunting for it.',
    quote:
      'The misses were always the same five things. I wrote them down for the agent the way I would explain them to a new joiner.',
    metrics: [
      { value: '45 → 10 min', label: 'to check a typical file' },
      { value: '5', label: 'common misses it looks for first' },
    ],
    people: [
      {
        name: 'Meenakshi Rao',
        role: 'Disbursement Checker · Operations',
        bio: 'Has checked loan files for nine years and can spot a missing signature from across the room. Trained in commerce, not coding.',
        photo: '',
      },
      {
        name: 'Vikram Sethi',
        role: 'Central Ops Manager · Operations',
        bio: 'Manages the checking desk of fourteen people. Wrote the paper checklist the agent now follows.',
        photo: '',
      },
    ],
  },
  {
    wheelLabel: 'Travel Request Form',
    title: 'Travel Request Form',
    team: 'Administration',
    platform: 'BYOT',
    summary: 'A travel request form that already knows the policy, so the travel desk stops explaining it by email.',
    oldWay: 'Employees emailed the travel desk in their own words. The desk wrote back asking for dates, grade and approver.',
    problem: 'A simple trip took a dozen emails. Half were the desk explaining what the policy allows.',
    solution: 'A BYOT form that asks the right questions once and shows only the travel class and hotel limit for that grade.',
    newWay: 'Requests arrive complete and within policy. The desk books most of them the same day.',
    quote: 'I know the travel policy by heart because I have typed it into emails for six years. Now the form says it for me.',
    metrics: [{ value: '12 → 3', label: 'emails to book a trip' }],
    people: [
      {
        name: 'Kavita Joshi',
        role: 'Travel Desk Coordinator · Administration',
        bio: 'Books travel for about 900 employees with one colleague. Six years on the travel desk, and the person everyone calls from the airport.',
        photo: '',
      },
    ],
  },
  {
    wheelLabel: 'Legal Notice Drafter',
    title: 'Legal Notice Drafter',
    team: 'Legal',
    platform: 'BYOA',
    summary:
      'An agent that fills in the first draft of a standard recovery notice, so the legal officer only reads and corrects.',
    oldWay: 'Legal officers copied the last notice, changed the name, amount and dates by hand, and checked the state format.',
    problem: 'It was slow typing, and a copied amount or an old date sometimes slipped through.',
    solution: 'A BYOA agent that takes the account details, picks the right template and drafts the notice for a lawyer to review.',
    newWay: 'The lawyer still reads and signs every notice. The typing is gone.',
    quote:
      'I trained for five years to read law, then spent my afternoons changing names in Word. I wanted the afternoons back.',
    metrics: [
      { value: '40 → 10 min', label: 'per notice, including the review' },
      { value: '6', label: 'state formats it knows' },
    ],
    people: [
      {
        name: 'Arjun Menon',
        role: 'Senior Legal Officer · Legal',
        bio: 'Drafts and reviews recovery notices for six states. A lawyer by training who had never written a line of code.',
        photo: '/people/arjun-menon.jpg',
      },
    ],
  },
  {
    wheelLabel: 'NOC Tracker',
    title: 'NOC and Closure Tracker',
    team: 'Operations',
    platform: 'BYOT',
    summary: 'A simple countdown for every closed loan, so a customer’s property papers go back on time.',
    oldWay: 'Closures were tracked in three places: the loan system, the vault register and courier emails.',
    problem: 'Nobody had one view of where the papers were. Delays showed up only when the customer called.',
    solution: 'A BYOT tracker that starts a clock when a loan closes and shows each step until the papers are handed over.',
    newWay: 'The team opens one list each morning, sorted by days left, and works from the top.',
    quote:
      'Someone has repaid a home loan over fifteen years. They should not have to call us twice to get their papers back.',
    metrics: [
      { value: '3 → 1', label: 'places to look for a file' },
      { value: 'Day 5', label: 'when the team now acts, not day 25' },
    ],
    people: [
      {
        name: 'Sunita Verma',
        role: 'Customer Service Lead · Operations',
        bio: 'Handles closure requests and the calls that follow. Twelve years in customer service, all of it across a counter or on a phone.',
        photo: '/people/sunita-verma.jpg',
      },
    ],
  },
  {
    wheelLabel: 'Circular Digest',
    title: 'Regulatory Circular Digest',
    team: 'Compliance',
    platform: 'BYOA',
    summary: 'An agent that reads each new regulatory circular and drafts a short note on who it affects.',
    oldWay: 'A compliance officer read every circular in full, wrote a summary and mailed it to one long distribution list.',
    problem: 'Most people on the list did not need most mails, so the ones that mattered went unread.',
    solution: 'A BYOA agent that drafts a plain summary of each circular and suggests which teams it applies to. The officer approves it.',
    newWay: 'Each team gets only the circulars meant for them, usually the same day.',
    quote:
      'People had stopped opening my mails, and I could not blame them. Now when I write to a team, they know it is for them.',
    metrics: [
      { value: 'Same day', label: 'from circular to summary' },
      { value: '2 hrs', label: 'of reading saved on a heavy day' },
    ],
    people: [
      {
        name: 'Imran Sheikh',
        role: 'Compliance Manager · Compliance',
        bio: 'Reads every regulatory circular so that others do not have to. A company secretary by training.',
        photo: '',
      },
    ],
  },
]

export function makeId(): string {
  return 'uc_' + Math.random().toString(36).slice(2, 10)
}

export function seedShowcase(): Showcase {
  return {
    version: 1,
    useCases: cases.map((c, i) => ({ ...c, id: `seed_${i + 1}`, active: true })),
    settings: { sound: false, autoStopSeconds: 20 },
  }
}

export function blankPerson(): Person {
  return { name: '', role: '', bio: '', photo: '' }
}

export function blankUseCase(): UseCase {
  return {
    id: makeId(),
    wheelLabel: 'New use case',
    title: 'New use case',
    team: '',
    platform: 'BYOT',
    summary: '',
    oldWay: '',
    problem: '',
    solution: '',
    newWay: '',
    quote: '',
    // Numbers are optional supporting facts, so a new use case starts without any.
    metrics: [],
    people: [blankPerson()],
    active: true,
  }
}
