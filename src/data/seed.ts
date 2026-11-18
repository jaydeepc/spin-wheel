import type { Person, Showcase, UseCase } from './types'

/**
 * The 20 use cases on the wheel, in the order of the "Final" sheet of the team's
 * "BYOT & BYOA Final list" workbook. Names, teams, platform, numbers and quotes are the
 * sheet's. The sheet has no job titles or bios, so `role` and `bio` are empty, and a
 * story step is empty where the sheet says nothing about it. Quotes longer than the
 * 200-character limit are trimmed by whole clauses. Portraits are in /public/people.
 */
const person = (name: string, file: string): Person => ({ name, role: '', bio: '', photo: `/people/${file}.jpg` })

const cases: Omit<UseCase, 'id' | 'active'>[] = [
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
    wheelLabel: 'Gold Loan LTV',
    title: 'Gold Loan LTV Monitoring',
    team: 'TDex',
    platform: 'BYOT',
    summary: 'A gold loan LTV monitoring system for the Sales team to check daily gold prices among competitors and NBFCs.',
    oldWay: 'Checking the rates was a manual, delayed activity that depended on the Product team.',
    problem: '',
    solution: 'A BYOT tool that shows daily gold prices among competitors and NBFCs next to the IBJA rate, open to branches.',
    newWay: 'Loans are disbursed at the accurate rate, based on the IBJA rate and competitor pricing. Faster to market.',
    quote:
      'A previously manual, delayed and Product dependent activity has been transformed into an automated, branch-accessible and scalable digital experience through LLM-enabled development.',
    metrics: [],
    people: [person('Anita John', 'anita-john')],
  },
  {
    wheelLabel: 'Agent AI Insights',
    title: 'Agent AI Insights',
    team: 'EF',
    platform: 'BYOT',
    summary: 'Funnel reporting for EF: a dashboard matrix view across products and a notification chatbot for funnel insights.',
    oldWay: 'Funnel analysis, rejection tracking and root cause analysis took manual effort.',
    problem: '',
    solution: 'SQL, Python and canned reports for funnel analysis, rejection tracking and retargeting, with a chatbot for funnel insights.',
    newWay: 'Faster access to key business metrics, real-time monitoring and faster root cause analysis.',
    quote: 'By combining automation, analytics, and AI, Agent AI Insights has transformed reporting into real-time, actionable intelligence.',
    metrics: [],
    people: [person('Dharamvir Ninaniya', 'dharamvir-ninaniya')],
  },
  {
    wheelLabel: 'Partner MSA Tracker',
    title: 'Partner MSA/Legal Agreement Tracker',
    team: 'EF',
    platform: 'BYOT',
    summary: 'A tracker for partner MSAs and legal agreements, with real-time monitoring and early alerts for renewal.',
    oldWay: '',
    problem: '',
    solution: 'A BYOT tracker that holds partner MSAs and legal agreements and monitors them in real time.',
    newWay: 'Agreements are monitored in real time for RBI compliance, with an early alert when one is due for renewal.',
    quote: 'This tracker gives us real-time visibility into partner agreements, helping us stay compliant and proactively manage renewals.',
    metrics: [],
    people: [person('Sambit Sahoo', 'sambit-sahoo')],
  },
  {
    wheelLabel: 'SUD Dashboard',
    title: 'SUD Final Dashboard',
    team: 'HL',
    platform: 'BYOT',
    summary: 'A dashboard to monitor sanctioned undisbursed (SUD) cases and pinpoint the geographies where intervention is needed.',
    oldWay: 'SUD data was prepared and cut in Excel.',
    problem: '',
    solution: 'A BYOT dashboard that parses the raw SUD dump and makes the data cuts automatically, with easy sorting and data changes.',
    newWay: 'Views are changed instantly to find bottlenecks and push sales, including the Legal and Tech not initiated and LD Generated buckets.',
    quote:
      "By automating SUD analysis' data preparation, we can quickly pinpoint bottlenecks by tweaking the views instantly without excel, drive targeted sales actions, and communicate insights.",
    metrics: [{ value: '₹1,210 Cr', label: 'of SUD cases' }],
    people: [person('Divit Suchak', 'divit-suchak')],
  },
  {
    wheelLabel: 'Conversion Rate',
    title: 'Conversion Rate MVP 1',
    team: 'HL',
    platform: 'BYOT',
    summary: 'A dashboard to analyse conversion rates by Zone, Geo and Cluster and target geographies where conversion is falling.',
    oldWay: '',
    problem: '',
    solution: 'A BYOT dashboard that cuts the conversion rate dumps at Zone-Geo, Geo-Cluster and Zone-Geo-Cluster level.',
    newWay: 'The daily conversion rate MIS to sales is automated, and low-performing geographies are found faster.',
    quote: 'Mapping conversion data instantly and generating prompt insights help identify low-performing geographies faster and drive targeted clusters.',
    metrics: [
      { value: '50 to 55%', label: 'current HL team conversion rate range' },
      { value: '4%', label: 'targeted improvement' },
    ],
    people: [person('Divit Suchak', 'divit-suchak')],
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
    wheelLabel: 'Daily MIS Automator',
    title: 'Daily MIS Automator',
    team: 'HL',
    platform: 'BYOT',
    summary: 'Lets the internal Product Team instantly produce the MIS for newly launched HL product schemes and strategies.',
    oldWay: 'Making one MIS took hours.',
    problem: '',
    solution: 'A BYOT tool that builds the MIS from login, disbursal and visit dumps for Aarambh, Sahyog Connector, Near Prime and High Value.',
    newWay: 'Daily targets vs actuals are traced from the MIS, which is used to push sales and in business discussions.',
    quote:
      'This MIS gives us instant visibility into product performance, helping us track targets and make faster business decisions. What once took hours now takes just a fraction of the time.',
    metrics: [{ value: '1/6th', label: 'of the time to make one MIS' }],
    people: [person('Akanksha Sudhanshu', 'akanksha-sudhanshu')],
  },
  {
    wheelLabel: 'Agency Monitor AI',
    title: 'Agency Monitor AI',
    team: 'Collection & Strategy',
    platform: 'BYOT',
    summary: 'Validates agency allocations against active empanelled agencies and flags the ones that break policy.',
    oldWay: 'Agency allocations were validated manually.',
    problem: '',
    solution: 'A BYOT tool that catches allocations after agreement expiry, legal or hold cases sent to agencies, and missing performance reviews.',
    newWay: 'An exception dashboard and an AI email scan for review confirmations find non-compliant allocations faster.',
    quote:
      'This solution helps us automatically identify non-compliant agency allocations, improving governance while significantly reducing manual validation effort.',
    metrics: [],
    people: [person('Ushank Bhatkar', 'ushank-bhatkar')],
  },
  {
    wheelLabel: 'Policy PPT Repository',
    title: 'Policy PPT Repository',
    team: 'Credit Policy - Mortgage',
    platform: 'BYOT',
    summary: 'One repository of all RIF, PGC and MFR presentations, with AI that reads the decks and lets you chat with them.',
    oldWay: 'Finding what was shown in a forum meant opening multiple PPTs and searching manually.',
    problem: 'The forums have run for more than 4 years, so there are more than 150 PPTs to search, and more every month.',
    solution: 'A BYOT repository that keeps every forum deck in one place and uses AI to find the right PPTs.',
    newWay: 'Key presentations are quick to retrieve, with a time series view of every amendment across a product lifecycle.',
    quote:
      "By creating a centralized, AI-enabled repository of key forums and presentations, we've improved knowledge retrieval, accelerated analysis, and significantly reduced search effort.",
    metrics: [
      { value: '150+', label: 'PPTs to search across' },
      { value: '4+ years', label: 'of forum presentations in one place' },
    ],
    people: [person('Harsh Desai', 'harsh-desai')],
  },
  {
    wheelLabel: 'FCU Vendor Billing',
    title: 'FCU Vendor Billing Automation',
    team: 'Collection & Strategy',
    platform: 'BYOT',
    summary: 'AI-driven automation of FCU vendor billing that digitises verification-related payouts for the Central FCU team.',
    oldWay: 'FCU vendor billing took 12 to 15 days to complete.',
    problem: '',
    solution: 'A BYOT tool that runs vendor billing from the list of verifications triggered in LVS, the loan verification system.',
    newWay: 'Billing is done in about 3 days, with centralised workflows and better operational control.',
    quote: 'With AI-powered billing automation, we can process vendor payouts faster, with greater accuracy and significantly less manual effort.',
    metrics: [{ value: '~3 days', label: 'billing turnaround time, down from 12 to 15 days' }],
    people: [person('Rajendra Sule', 'rajendra-sule')],
  },
  {
    wheelLabel: 'Legal Payout',
    title: 'Unsecured Legal Payout',
    team: 'Collection & Strategy',
    platform: 'BYOT',
    summary: 'Automates and centralises unsecured legal vendor billing on one standard platform to streamline payouts.',
    oldWay: 'Legal vendor billing ran through fragmented processes and took 15 to 20 days.',
    problem: '',
    solution: 'A BYOT platform that works from Credgenics inputs, with controlled access for the Central Collections Legal team.',
    newWay: 'Billing takes 4 to 5 days, with less manual intervention, fewer errors and faster invoice generation.',
    quote:
      'By automating and standardizing legal vendor billing, we significantly reduced manual effort and shortened billing turnaround time from 15-20 days to 4-5 days.',
    metrics: [{ value: '4 to 5 days', label: 'billing turnaround time, down from 15 to 20 days' }],
    people: [person('Mitesh Gupta', 'mitesh-gupta')],
  },
  {
    wheelLabel: 'Sentiment Analysis',
    title: 'Customer Sentiment Analysis Agent',
    team: 'CX - Governance',
    platform: 'BYOA',
    summary: 'An agent that reads customer verbatims, classifies their sentiment and finds the top themes and sub-themes.',
    oldWay: '',
    problem: '',
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
    wheelLabel: 'Biometric Register',
    title: 'Biometric Device Register',
    team: 'Operations Strategy',
    platform: 'BYOT',
    summary: 'A central digital register of biometric devices: device ID, branch, location and ownership, with search and status.',
    oldWay: 'Biometric devices were tracked in scattered manual registers.',
    problem: '',
    solution: 'A BYOT register with search, update and status visibility that helps identify inactive, faulty and unassigned devices.',
    newWay: 'A single source of truth for device inventory, with ownership tracking and better asset governance.',
    quote:
      'The digital register has replaced scattered manual tracking with one reliable view of biometric devices. It saves time on routine updates and helps us manage device ownership more effectively.',
    metrics: [
      { value: '550+', label: 'branches live' },
      { value: '700+', label: 'users' },
      { value: '7 hrs', label: 'saved monthly per branch, on average' },
    ],
    people: [person('Pravesh Bhargava', 'pravesh-bhargava')],
  },
  {
    wheelLabel: 'VAN Management',
    title: 'VAN Management System',
    team: 'Bank Reconciliation Team',
    platform: 'BYOT',
    summary: 'A central self-service platform for VAN search, status tracking, customer mapping and payment receipt visibility.',
    oldWay: 'Stakeholders called or emailed Operations for routine VAN and payment information.',
    problem: '',
    solution: 'A BYOT platform with VAN and payment search, scheduled data refreshes and role-based access.',
    newWay: 'Stakeholders find routine VAN and payment information on their own, without depending on Operations.',
    quote:
      'The self-service platform makes VAN and payment information readily accessible without repeated calls or emails. It helps us respond faster and spend more time on meaningful operational work.',
    metrics: [
      { value: '4,635+', label: 'VAN searches recorded' },
      { value: '5,097+', label: 'payment searches recorded' },
      { value: '~5 a day', label: 'calls or emails eliminated, saving 15 to 20 min' },
    ],
    people: [person('Chirag Dodiya', 'chirag-dodiya')],
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
    wheelLabel: 'PDD Management',
    title: 'PDD Management System',
    team: 'Operations CoE',
    platform: 'BYOT',
    summary: 'An enterprise-wide platform to track post-disbursement documents (PDD), with an Action Center, reminders and audit trails.',
    oldWay: 'PDDs were monitored in a manual Excel tracker, with manual follow-ups.',
    problem: 'Visibility of pendency depended on weekly follow-ups.',
    solution: 'A BYOT platform with central tracking, an Action Center for calls, follow-ups and remarks, bulk actions and dashboards.',
    newWay: 'Live tracking of pendency, 150+ daily due alerts automated and stronger branch-level accountability.',
    quote:
      'The platform gives us live visibility of PDD pendency, actions and follow-ups in one place. It has reduced spreadsheet dependency and made accountability across teams much stronger.',
    metrics: [
      { value: '50K+', label: 'PDDs tracked' },
      { value: '500+', label: 'active users' },
      { value: '20K+', label: 'updates and actions recorded' },
    ],
    people: [person('Christie Thottam', 'christie-thottam')],
  },
  {
    wheelLabel: 'Subsequent Disbursement',
    title: 'Subsequent Disbursement Tracker',
    team: 'Operations Strategy',
    platform: 'BYOT',
    summary: 'A central tracker for subsequent-disbursement opportunities, from lead assignment to follow-up and conversion.',
    oldWay: '',
    problem: '',
    solution: 'A BYOT tracker with standard lead assignment, follow-up and disposition updates, plus conversion, ageing and pendency dashboards.',
    newWay: 'Lead ownership and follow-up sit in one place across branches, linked to disbursement outcomes and management reporting.',
    quote:
      'The tracker brings lead allocation, follow-ups and conversion outcomes together in one place. It improves ownership and helps us focus our efforts on opportunities that can convert.',
    metrics: [
      { value: '₹110+ Cr', label: 'disbursement facilitated' },
      { value: '3,630+', label: 'successful disbursements' },
      { value: '16K+', label: 'leads uploaded, 10K+ actioned' },
    ],
    people: [person('Sajal Sharma', 'sajal-sharma')],
  },
  {
    wheelLabel: 'Cashflow Report',
    title: 'Consolidated Cashflow Report',
    team: 'Operations CoE',
    platform: 'BYOT',
    summary: 'An automated monthly workflow that consolidates cashflows across 40+ deal structures and generates deal-wise outputs.',
    oldWay: 'Monthly cashflow reporting meant spreadsheet-heavy manual extraction, validation, calculations and pivot preparation.',
    problem: 'It took more than 14 hours every month.',
    solution: 'A BYOT workflow that validates payout MIS, maps deals, applies revision logic and writes the Treasury communications.',
    newWay: 'Consistent reports in under 10 minutes, so the team can focus on reviewing exceptions.',
    quote:
      'Automating cashflow consolidation and validations has transformed a time-consuming monthly activity. We can now generate consistent reports in minutes and focus on reviewing exceptions.',
    metrics: [
      { value: '14+ hrs → 10 min', label: 'monthly preparation time, now under 10 minutes' },
      { value: '40+', label: 'deal structures supported' },
      { value: '99%+', label: 'efficiency improvement on stated timings' },
    ],
    people: [person('Suraj Agrawal', 'suraj-agrawal')],
  },
  {
    wheelLabel: 'Payout Calculator',
    title: 'Partner Payout Calculator',
    team: 'EF Operations',
    platform: 'BYOT',
    summary: 'An automated, standardised process to calculate partner payouts.',
    oldWay: 'Partner payouts were prepared manually with repeated data handling, taking about 120 minutes per partner.',
    problem: '',
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
