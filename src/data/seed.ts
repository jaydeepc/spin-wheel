import type { Showcase, UseCase } from './types'

/**
 * SAMPLE CONTENT — every use case, number and name below is illustrative
 * placeholder copy written to show the layout. Replace it in /#/admin with
 * the real solutions, verified figures and the actual builders before the event.
 */
const cases: Omit<UseCase, 'id' | 'active'>[] = [
  {
    wheelLabel: 'Field Visit Planner',
    title: 'Field Visit Planner',
    team: 'Collections',
    platform: 'BYOT',
    summary:
      'A daily route and priority list for every field collections officer, built by an area manager who was tired of planning visits on paper.',
    oldWay:
      'Each morning, officers picked accounts from an Excel dump and decided their own route. Managers learnt what happened only at the evening call.',
    problem:
      'High-risk accounts were missed, officers criss-crossed the same pin codes, and nobody could see the day until it was over.',
    solution:
      'A BYOT app that ranks accounts by bucket, promise date and distance, then gives each officer an ordered visit list with one-tap outcome logging.',
    newWay:
      'Officers start the day with a plan. Managers watch visits close in real time and reassign before lunch, not after dinner.',
    metrics: [
      { value: '31%', label: 'more visits per officer per day' },
      { value: '2.4 hrs', label: 'planning time saved per manager, daily' },
      { value: '640', label: 'field officers using it every day' },
    ],
    people: [
      { name: 'Sample Name One', role: 'Area Collections Manager · Collections' },
      { name: 'Sample Name Two', role: 'Collections Officer · Collections' },
    ],
  },
  {
    wheelLabel: 'Promise-to-Pay Agent',
    title: 'Promise-to-Pay Follow-up Agent',
    team: 'Collections',
    platform: 'BYOA',
    summary:
      'An agent that remembers every promise a customer makes and follows up in their language, on the day, without a caller lifting the phone.',
    oldWay:
      'Callers noted promise dates in remarks fields and relied on memory, sticky notes and next-day lists to follow up.',
    problem:
      'One in three promises was never followed up on the promised day. Broken promises rolled silently into the next bucket.',
    solution:
      'A BYOA agent reads call remarks, extracts the promise, sends a reminder in the customer’s language and escalates to a caller only if the payment does not land.',
    newWay:
      'Every promise is tracked. Callers spend their time on customers who need a conversation, not on reminders.',
    metrics: [
      { value: '100%', label: 'of promises followed up on the day' },
      { value: '18%', label: 'lift in kept promises' },
      { value: '9', label: 'languages supported' },
    ],
    people: [
      { name: 'Sample Name Three', role: 'Tele-calling Team Lead · Collections' },
      { name: 'Sample Name Four', role: 'Collections Strategy Analyst · Collections' },
    ],
  },
  {
    wheelLabel: 'Onboarding Buddy',
    title: 'Onboarding Buddy',
    team: 'Human Resources',
    platform: 'BYOA',
    summary:
      'A joining-day companion that answers every new hire’s question, chases their documents and tells HR only what needs a human.',
    oldWay:
      'New joiners emailed HR for everything from ID cards to leave policy. Document collection ran on reminders and spreadsheets.',
    problem:
      'HR business partners spent their first-week time answering the same forty questions, and joining kits stayed incomplete for weeks.',
    solution:
      'A BYOA agent trained on HR policies that answers questions on chat, checks each joiner’s document list and nudges until it is complete.',
    newWay:
      'New hires get answers in seconds, at any hour. HR sees one dashboard of who is stuck and why.',
    metrics: [
      { value: '82%', label: 'of joiner queries resolved without HR' },
      { value: '11 → 3 days', label: 'to a complete joining kit' },
      { value: '4,200', label: 'new hires onboarded with it' },
    ],
    people: [
      { name: 'Sample Name Five', role: 'HR Business Partner · Human Resources' },
      { name: 'Sample Name Six', role: 'Onboarding Executive · Human Resources' },
    ],
  },
  {
    wheelLabel: 'Branch Hiring Tracker',
    title: 'Branch Hiring Tracker',
    team: 'Human Resources',
    platform: 'BYOT',
    summary:
      'One live view of every open position across branches, built by a recruiter to replace the weekly chase for status.',
    oldWay:
      'Open positions lived in each regional recruiter’s spreadsheet. A weekly call stitched them together into a deck.',
    problem:
      'By the time the deck was ready it was out of date. Branches ran short-staffed because nobody saw a role ageing.',
    solution:
      'A BYOT tracker where branch managers raise a role, recruiters update the stage, and ageing roles flag themselves.',
    newWay:
      'Leaders open one screen instead of asking for one deck. Recruiters work the oldest roles first.',
    metrics: [
      { value: '38 → 24 days', label: 'average time to fill a branch role' },
      { value: '0', label: 'weekly status decks' },
      { value: '500+', label: 'branches covered' },
    ],
    people: [
      { name: 'Sample Name Seven', role: 'Talent Acquisition Lead · Human Resources' },
    ],
  },
  {
    wheelLabel: 'Branch Helpdesk',
    title: 'Branch Facility Helpdesk',
    team: 'Administration',
    platform: 'BYOT',
    summary:
      'A photo, a tap, a ticket. Branch staff report a broken AC or a dead UPS and watch it get fixed.',
    oldWay:
      'Branches called or emailed the regional admin. Requests sat in inboxes and vendors were chased over the phone.',
    problem:
      'No one knew how many issues were open, how long they had waited, or which vendor was slow.',
    solution:
      'A BYOT helpdesk app: staff raise a ticket with a photo, it routes to the right vendor, and the branch closes it only when the work is done.',
    newWay:
      'Every issue has an owner and a clock. Admin reviews vendors on data, not on memory.',
    metrics: [
      { value: '6 → 2 days', label: 'average time to resolve' },
      { value: '94%', label: 'tickets closed within SLA' },
      { value: '1,900', label: 'tickets handled each month' },
    ],
    people: [
      { name: 'Sample Name Eight', role: 'Regional Admin Manager · Administration' },
      { name: 'Sample Name Nine', role: 'Branch Operations Executive · Operations' },
    ],
  },
  {
    wheelLabel: 'Travel Desk Agent',
    title: 'Travel Desk Agent',
    team: 'Administration',
    platform: 'BYOA',
    summary:
      'Tell it where you need to be. It checks policy, finds the options and books on approval.',
    oldWay:
      'Employees emailed the travel desk, waited for options, replied with a choice and waited again for approval and tickets.',
    problem:
      'A simple trip took a dozen emails. Late bookings meant higher fares and out-of-policy exceptions.',
    solution:
      'A BYOA agent that reads the request, applies the travel policy by grade, proposes in-policy options and raises one approval.',
    newWay:
      'Trips are booked in one conversation. The travel desk handles exceptions, not every itinerary.',
    metrics: [
      { value: '1 day → 15 min', label: 'request to booking' },
      { value: '14%', label: 'lower average fare' },
      { value: '97%', label: 'bookings within policy' },
    ],
    people: [
      { name: 'Sample Name Ten', role: 'Travel Desk Coordinator · Administration' },
    ],
  },
  {
    wheelLabel: 'Loan File Checker',
    title: 'Loan File Checker',
    team: 'Operations',
    platform: 'BYOA',
    summary:
      'An agent that reads a loan file the way a seasoned ops checker would, and says exactly what is missing before it reaches disbursement.',
    oldWay:
      'Ops checkers opened every document in a file and ticked a checklist by hand. Gaps went back to the branch by email.',
    problem:
      'Files bounced two or three times for small misses. Customers waited while paper moved back and forth.',
    solution:
      'A BYOA agent that reads each document, matches names, amounts and dates against the sanction, and returns one clear list of gaps to the branch.',
    newWay:
      'Branches fix a file once. Checkers review the agent’s findings instead of hunting for them.',
    metrics: [
      { value: '45 → 8 min', label: 'to check a file' },
      { value: '63%', label: 'fewer files sent back' },
      { value: '1.5 days', label: 'faster to disbursement' },
    ],
    people: [
      { name: 'Sample Name Eleven', role: 'Central Ops Manager · Operations' },
      { name: 'Sample Name Twelve', role: 'Disbursement Checker · Operations' },
      { name: 'Sample Name Thirteen', role: 'Branch Credit Manager · Credit' },
    ],
  },
  {
    wheelLabel: 'NOC Tracker',
    title: 'NOC & Closure Tracker',
    team: 'Operations',
    platform: 'BYOT',
    summary:
      'When a customer repays their loan, their documents should come home on time. This makes sure they do.',
    oldWay:
      'Loan closures were tracked across the core system, the vault’s register and courier emails.',
    problem:
      'No single view of where a customer’s property papers were. Delays surfaced only when the customer complained.',
    solution:
      'A BYOT tracker that starts a clock at closure and follows NOC issue, document retrieval and handover, with alerts before the regulatory deadline.',
    newWay:
      'Every closed loan has a countdown. Teams act on day five, not on day twenty-nine.',
    metrics: [
      { value: '99.6%', label: 'documents returned within timeline' },
      { value: '71%', label: 'fewer closure complaints' },
      { value: '12 days', label: 'average closure-to-handover' },
    ],
    people: [
      { name: 'Sample Name Fourteen', role: 'Customer Service Lead · Operations' },
      { name: 'Sample Name Fifteen', role: 'Vault Custodian · Operations' },
    ],
  },
  {
    wheelLabel: 'Legal Notice Drafter',
    title: 'Legal Notice Drafter',
    team: 'Legal',
    platform: 'BYOA',
    summary:
      'First drafts of recovery notices in minutes, in the right format for the right state, reviewed and signed by a lawyer.',
    oldWay:
      'Legal officers copied the last notice, changed names and amounts by hand, and checked the format against a state-wise folder.',
    problem:
      'Drafting swallowed the legal team’s week. Copy-paste errors in amounts and dates forced re-issues.',
    solution:
      'A BYOA agent that pulls the account facts, picks the correct template and language, and drafts the notice for a lawyer to review.',
    newWay:
      'Lawyers review and sign. Their time goes to strategy on hard cases instead of typing.',
    metrics: [
      { value: '40 → 5 min', label: 'per notice' },
      { value: '3×', label: 'notices issued per officer' },
      { value: '0', label: 're-issues for drafting errors' },
    ],
    people: [
      { name: 'Sample Name Sixteen', role: 'Senior Legal Officer · Legal' },
      { name: 'Sample Name Seventeen', role: 'Recovery Manager · Collections' },
    ],
  },
  {
    wheelLabel: 'Circular Digest',
    title: 'Regulatory Circular Digest',
    team: 'Compliance',
    platform: 'BYOA',
    summary:
      'Every new circular, read the day it lands, summarised in plain words and sent to the people it actually affects.',
    oldWay:
      'Compliance officers read each circular in full, wrote a summary note and emailed it to a broad distribution list.',
    problem:
      'Important changes were buried in long mails. Function heads could not tell which circulars needed action from them.',
    solution:
      'A BYOA agent that monitors regulator releases, summarises each one, tags the affected functions and drafts the action list for compliance to approve.',
    newWay:
      'Each function gets only what applies to it, with a clear list of what to do and by when.',
    metrics: [
      { value: 'Same day', label: 'from circular to action list' },
      { value: '5 hrs', label: 'saved per officer each week' },
      { value: '100%', label: 'of actions tracked to closure' },
    ],
    people: [
      { name: 'Sample Name Eighteen', role: 'Compliance Manager · Compliance' },
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
    settings: { sound: false, autoStopSeconds: 20, sampleContent: true },
  }
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
    metrics: [{ value: '', label: '' }],
    people: [{ name: '', role: '' }],
    active: true,
  }
}
