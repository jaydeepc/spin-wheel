import type { Person, Showcase, UseCase } from './types'

/**
 * The 12 use cases on the wheel: 6 BYOT and 6 BYOA, alternating one BYOT, one BYOA.
 * Drawn from the team's "BYOT & BYOA Final list" workbook. Names, teams, platform, numbers and quotes are the
 * sheet's. The sheet has no job titles or bios, so `role` and `bio` are empty, and a
 * story step is empty where the sheet says nothing about it. Quotes longer than the
 * 200-character limit are trimmed by whole clauses. Portraits are in /public/people.
 */
const person = (name: string, file: string, ext = 'jpg'): Person => ({ name, role: '', bio: '', photo: `/people/${file}.${ext}` })

const cases: Omit<UseCase, 'id' | 'active'>[] = [
  {
    wheelLabel: 'Payout Calculator',
    title: 'Partner Payout Calculator',
    team: 'EF Operations',
    platform: 'BYOT',
    summary: 'An automated, standardised process to calculate partner payouts.',
    oldWay: 'Partner payouts were prepared manually with repeated data handling, taking about 120 minutes per partner.',
    problem: 'Repeated data handling and manual preparation made every payout slow, about 120 minutes per partner.',
    solution: 'A BYOT calculator that works out partner payouts through one standardised process.',
    newWay: 'A payout takes about 5 minutes per partner, with less manual handling and effort.',
    quote:
      'The payout calculator has transformed partner payout processing. What once took around 120 minutes per partner now takes about 5 minutes, reducing repetitive effort.',
    metrics: [
      { value: '120 → 5 min', label: 'processing time per partner (~96% reduction)' },
      { value: '50 lakh+', label: 'transactions' },
      { value: '~14 hrs', label: 'saved monthly' },
    ],
    people: [person('Nishant Ghogate', 'nishant-ghogate')],
  },
  {
    wheelLabel: 'CX NPS Jira Agent',
    title: 'CX NPS Jira Agent',
    team: 'CX - Governance',
    platform: 'BYOA',
    summary: 'An agent that tracks every Jira work item a person has raised, across dashboards, and shares the status in one view.',
    oldWay: 'Jira updates came through scattered emails and individual inputs from different stakeholders, across multiple dashboards.',
    problem: 'There was no central, real-time view. Progress and accountability were hard to track, which led to delays and miscommunication.',
    solution: 'A BYOA agent that tracks all the work items a person raised in Jira, pulls updates from every channel and shares status proactively.',
    newWay: 'One real-time view of ticket status, progress and ownership, with no manual follow-ups.',
    quote: 'Keeping track of Jira work items used to mean chasing updates across dashboards and emails. Now, I get a unified view.',
    metrics: [{ value: '4 hrs', label: 'of turnaround time saved per week' }],
    people: [person('Neha Kanojia', 'neha-kanojia')],
  },
  {
    wheelLabel: 'LI Medical Consol',
    title: 'LI Medical Consol DB',
    team: 'HL',
    platform: 'BYOT',
    summary: 'A dashboard to curb life insurance cancellations caused by medical check-ups pending on the customer end.',
    oldWay: 'Life insurance pendency was tracked manually.',
    problem: 'Policies were being cancelled because medical check-ups stayed pending on the customer end.',
    solution: 'A BYOT dashboard on the disbursal dump and insurance MIS that tracks pendency and dispositions, with pre-built analysis.',
    newWay: 'Each department is accountable for its pending cases, and the premium value pending is visible bucket by bucket.',
    quote:
      'What once required manual tracking is now automated, giving us real-time visibility into insurance pendency, department-wise accountability, and opportunities for intervention.',
    metrics: [{ value: '₹12 Cr', label: 'of LI cancellation in Q1 FY 26, the gap targeted' }],
    people: [person('Divit Suchak', 'divit-suchak')],
  },
  {
    wheelLabel: 'Sentiment Analysis',
    title: 'Customer Sentiment Analysis Agent',
    team: 'CX - Governance',
    platform: 'BYOA',
    summary: 'An agent that reads customer verbatims, classifies their sentiment and finds the top themes and sub-themes.',
    oldWay: 'Customer verbatims were read and classified by hand, about 7 to 8 hours a week.',
    problem: 'Buying a sentiment analysis platform would be very costly',
    solution: 'A BYOA agent that marks each verbatim positive, negative or neutral and groups the feedback into themes and sub-topics.',
    newWay: 'Any theme can be queried on demand to uncover root causes and specific insights, in minutes.',
    quote:
      'Our Customer Sentiment Analysis Agent transforms unstructured customer feedback into actionable insights and root causes in minutes, significantly reducing analysis time and cost.',
    metrics: [
      { value: '₹5 to 6 lakh', label: 'saved on buying a sentiment analysis platform' },
      { value: '7 to 8 hrs', label: 'saved a week' },
    ],
    people: [person('Neha Kanojia', 'neha-kanojia')],
  },
  {
    wheelLabel: 'FCU Vendor Billing',
    title: 'FCU Vendor Billing Automation',
    team: 'Collection & Strategy',
    platform: 'BYOT',
    summary: 'AI-driven automation of FCU vendor billing that digitises verification-related payouts for the Central FCU team.',
    oldWay: 'FCU vendor billing took 12 to 15 days to complete.',
    problem: 'Billing for triggered verifications was slow, taking 12 to 15 days to turn around.',
    solution: 'A BYOT tool that runs vendor billing from the list of verifications triggered in LVS, the loan verification system.',
    newWay: 'Billing is done in about 3 days, with centralised workflows and better operational control.',
    quote: 'With AI-powered billing automation, we can process vendor payouts faster, with greater accuracy and significantly less manual effort.',
    metrics: [{ value: '~3 days', label: 'billing turnaround time, down from 12 to 15 days' }],
    people: [person('Rajendra Sule', 'rajendra-sule')],
  },
  {
    wheelLabel: 'Media Intelligence',
    title: 'Media Intelligence Online News Update',
    team: 'Marketing',
    platform: 'BYOA',
    summary: "Captures Piramal and its competitors' news and sends a daily update used by the marketing team.",
    oldWay: 'Piramal and competitor news was tracked through an agency and manual effort.',
    problem: 'Agency costs and manual monitoring slowed access to actionable market intelligence.',
    solution: 'A BYOA agent with a daily and weekly dashboard tracking Piramal Finance, competitors, BFSI trends and regulatory developments.',
    newWay: 'Lower agency costs and less manual effort, with faster access to actionable intelligence for more informed decisions.',
    quote:
      'Our daily market intelligence now arrives on its own, covering Piramal, our competitors and the wider BFSI space.',
    metrics: [{ value: '2+ hrs', label: 'saved daily' }],
    people: [person('Charushila Doiphode', 'charushila-doiphode', 'png')],
  },
  {
    wheelLabel: 'SOA Auto Mailer',
    title: 'CMML SOA Auto Mailer',
    team: 'CMML Operations',
    platform: 'BYOT',
    summary: 'A bulk SOA application that validates Facility IDs, matches documents and emails each customer their SOA.',
    oldWay: 'SOAs were validated, matched and sent to customers with repetitive manual effort.',
    problem: 'Doing this in the core system needed an enhancement estimated at about ₹11 lakh.',
    solution: 'A BYOT app that takes customer-file and SOA-document uploads, validates Facility IDs, matches documents and sends the emails.',
    newWay: 'Bulk SOAs go out with validation controls and no change to the core system, saving the CMML Ops team 10 hours a month.',
    quote:
      'Automating SOA validation, matching and dispatch has significantly reduced repetitive manual effort. We can now process bulk requests faster while maintaining better control over the workflow.',
    metrics: [
      { value: '150+', label: 'SOAs processed monthly' },
      { value: '90%', label: 'reduction in manual intervention' },
      { value: '₹11 lakh', label: 'estimated core-system cost avoided' },
    ],
    people: [person('Suraj Agrawal', 'suraj-agrawal')],
  },
  {
    wheelLabel: 'Saathi Invoice Bot',
    title: 'Saathi - Your Invoice Assistant',
    team: 'Collection & Strategy',
    platform: 'BYOA',
    summary: 'A personalised bot on top of a BYOT app for the Collections team to access vendor invoice information.',
    oldWay: 'The Collections team asked central support for vendor invoice information.',
    problem: 'Every invoice query added to central support effort and turnaround time.',
    solution: 'A BYOA bot built on top of a BYOT app, giving the Collections team quick access to vendor invoice information.',
    newWay: 'Reduced central support effort and a faster turnaround time.',
    quote: 'Saathi acts as my personal invoice assistant, giving me quick access to vendor invoice information whenever I need it.',
    metrics: [],
    people: [person('Mitesh Gupta', 'mitesh-gupta')],
  },
  {
    wheelLabel: 'Agency Monitor AI',
    title: 'Agency Monitor AI',
    team: 'Collection & Strategy',
    platform: 'BYOT',
    summary: 'Validates agency allocations against active empanelled agencies and flags the ones that break policy.',
    oldWay: 'Agency allocations were validated manually.',
    problem: 'Allocations after agreement expiry, or legal and hold cases sent to agencies, could slip through.',
    solution: 'A BYOT tool that catches allocations after agreement expiry, legal or hold cases sent to agencies, and missing performance reviews.',
    newWay: 'An exception dashboard and an AI email scan for review confirmations find non-compliant allocations faster.',
    quote:
      'This solution helps us automatically identify non-compliant agency allocations, improving governance while significantly reducing manual validation effort.',
    metrics: [],
    people: [person('Ushank Bhatkar', 'ushank-bhatkar')],
  },
  {
    wheelLabel: 'Lead Insight Agent',
    title: 'Credit team Lead Insight Agent',
    team: 'Credit',
    platform: 'BYOA',
    summary: 'An AI analyst for the Credit team that reads the Lead Sourcing export and answers questions in plain business language.',
    oldWay: 'Risk analysis meant manual Excel cuts and pivots.',
    problem: 'Anomalies, like a riskier band sanctioned more often than a better one, were hard to spot in pivots.',
    solution: 'A BYOA agent that reads the lead-level export and shows geo, ventile, CIBIL band and rejection-reason cuts, flagging cases that look off.',
    newWay: 'Faster, consistent risk analysis, with early flags on anomalies in sanctioning so the team can review underwriting and policy gaps sooner.',
    quote: 'Instead of spending hours creating pivots and reports, I can simply ask the Credit Lead Insight Agent questions and get instant insights on approvals, rejections, risk bands, and underwriting trends.',
    metrics: [],
    people: [person('Pooja Sawant', 'pooja-sawant', 'png')],
  },
  {
    wheelLabel: 'Gold Loan LTV',
    title: 'Gold Loan LTV Monitoring',
    team: 'TDex',
    platform: 'BYOT',
    summary: 'A gold loan LTV monitoring system for the Sales team to check daily gold prices among competitors and NBFCs.',
    oldWay: 'Checking the rates was a manual, delayed activity that depended on the Product team.',
    problem: 'Rate checks were delayed and Product dependent, so loans risked not using the accurate rate.',
    solution: 'A BYOT tool that shows daily gold prices among competitors and NBFCs next to the IBJA rate, open to branches.',
    newWay: 'Loans are disbursed at the accurate rate, based on the IBJA rate and competitor pricing. Faster to market.',
    quote:
      'A previously manual, delayed and Product dependent activity has been transformed into an automated, branch-accessible and scalable digital experience through LLM-enabled development.',
    metrics: [],
    people: [person('Anita John', 'anita-john')],
  },
  {
    wheelLabel: 'MLAP Daily Reporting',
    title: 'MLAP Daily Resolution Reporting BOT_LCS',
    team: 'Unsecured Collections',
    platform: 'BYOA',
    summary: 'An agent that emails one consolidated MLAP resolution report every day, with no manual query runs.',
    oldWay: 'Queries, Excel work and report preparation were done by hand.',
    problem: 'Daily query runs and report prep took manual effort, so weak pockets were spotted late.',
    solution: 'A BYOA agent that runs seven Snowflake SQL queries on the LCS data every day and emails the results as one consolidated report.',
    newWay: 'The team tracks resolution by bucket, MOB, channel and geography every day and spots weak pockets sooner.',
    quote: 'Our daily MLAP resolution view now reaches the team automatically every morning, so we can spot weak buckets, Channels and geographies sooner and focus follow-up where it matters.',
    metrics: [{ value: '7 reports', label: 'delivered daily in one consolidated email' }],
    people: [person('Abhishek Gupta', 'abhishek-gupta', 'png')],
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
