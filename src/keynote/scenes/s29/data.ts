/**
 * Slide 29 · every word on the slide, copied from exports/_rig/keynote-src/pack/29/text.json
 * (the block id is beside each). Blocks with role `hidden` (t16, t26, t31, t38, t46, t52, t58,
 * t65, t69, t75) and the authors' note (t01) are NOT here and are never shown.
 *
 * `name` is the Bold navy run of a pill, `note` the grey Regular run after it, `star` the flame
 * star the deck prints in front of some agents. The deck gives it no legend: LEGEND is the
 * presenter's own, asked for after the build, and so is the star on EVERYDAY AI.
 */

/** The words after the star in the legend (the presenter's, exactly). */
export const LEGEND = 'marked cases will be covered in Tracks'

export interface Agent {
  name: string
  note?: string
  star?: boolean
  /** A long name the deck itself sets a little smaller (t37). */
  tight?: boolean
}

export interface LendingFn {
  id: string
  /** The label chip, line by line. */
  label: string[]
  /** The italic flame line. */
  line: string
  /** images.json → pictures[].name (643 x 1024, kind: illustration). */
  picture: string
  /** Where the white panel begins, as a fraction of the picture's height (images.json → uncoveredPart). */
  panelTop: number
  /** The pills, row by row as the deck lays them out. */
  rows: Agent[][]
}

export const LENDING: LendingFn[] = [
  {
    id: 'sales',
    label: ['SALES'], // t04
    line: 'AI drives sales and productivity.', // t09
    picture: 'scene-sales.jpg',
    panelTop: 0.345,
    rows: [
      [{ star: true, name: 'Distribution Intelligence' }], // t10
      [{ star: true, name: 'Sales Nurturing Agent' }], // t11
      [{ name: 'Sales Incentive Agent' }], // t12
      [{ star: true, name: 'Document Intelligence' }], // t13
      [{ star: true, name: 'Xsell Agent' }, { name: 'Xsell Copilot' }], // t14, t15
      [{ name: 'Jumanji', note: 'contest manager' }], // t17
      [{ star: true, name: 'ARYA', note: 'assistant, coach, buddy' }], // t18
    ],
  },
  {
    id: 'credit',
    label: ['CREDIT'], // t05
    line: 'AI reads the documents and assesses the case.', // t19
    picture: 'scene-credit.jpg',
    panelTop: 0.39,
    rows: [
      [{ star: true, name: 'ABCD', note: 'AI credit decisioning' }], // t20
      [{ star: true, name: 'Aalok', note: 'bank statement analyser' }], // t21
      [{ name: 'CAM Copilot' }, { name: 'Credit Vishwas' }], // t22, t23
      [{ name: 'FI Agent' }, { name: 'Leo', note: 'fraud detection' }], // t24, t25
      [{ star: true, name: 'AI Sampling' }], // t27
      [{ star: true, name: 'Commercial Bureau Agent' }], // t28
    ],
  },
  {
    id: 'operations',
    label: ['OPERATIONS'], // t06
    line: 'AI cuts manual checks and moves loans faster.', // t29
    picture: 'scene-operations.jpg',
    panelTop: 0.585,
    rows: [
      [{ star: true, name: 'Direct to Disbursement' }], // t30
      [{ name: 'No Document Checklist' }], // t32
      [{ star: true, name: 'Partner Payout Calculator' }], // t33
    ],
  },
  {
    id: 'experience',
    label: ['CUSTOMER', 'EXPERIENCE'], // t07
    line: 'AI answers customers in their own language.', // t34
    picture: 'scene-customer-experience.jpg',
    panelTop: 0.452,
    rows: [
      [{ star: true, name: 'PIA', note: 'internal assistant' }], // t35
      [{ star: true, name: 'WhatsApp Service Bot' }], // t36
      [{ name: 'Omni Channel AI Sales Accelerator', tight: true }], // t37
      [{ name: 'AI Orchestrator' }], // t39
      [{ name: 'AI Field Scaled Leadership Clone', tight: true }], // t40
    ],
  },
  {
    id: 'collections',
    label: ['COLLECTIONS'], // t08
    line: 'AI guides every collection conversation.', // t41
    picture: 'scene-collections.jpg',
    panelTop: 0.39,
    rows: [
      [{ star: true, name: 'STT Collection', note: 'speech to text' }], // t42
      [{ star: true, name: 'Collection Copilot' }], // t43
      [{ star: true, name: 'Nivaaran' }], // t44
      [{ name: 'Collection Incentives' }], // t45
      [{ name: 'RL Channel Allocation' }], // t47
      [{ star: true, name: 'Arya for Collection' }], // t48
    ],
  },
]

export interface SupportFn {
  label: string
  /** images.json → pictures[].name (101 x 101, shown in a circle). */
  picture: string
  rows: Agent[][]
}

export const SUPPORT: SupportFn[] = [
  {
    label: 'PEOPLE & HR', // t49
    picture: 'thumb-people-hr.jpg',
    rows: [
      [{ name: 'AI Hiring Agent' }, { name: 'Arya for HR Policies' }], // t50, t51
      [{ name: 'Attrition Management Agent' }], // t53
      [{ name: 'TARA', note: 'AI employee listener' }], // t54
    ],
  },
  {
    label: 'ENGINEERING & ANALYTICS', // t55
    picture: 'thumb-engineering-analytics.jpg',
    rows: [
      [{ name: 'Context Lakehouse' }, { name: 'Sage', note: 'AI analyst' }], // t56, t57
      [{ name: 'Analytics Central' }, { name: 'KPI Compass' }], // t59, t60
      [{ name: 'DRS', note: 'reviews AI decisions' }], // t61
    ],
  },
  {
    label: 'LEGAL & AUDIT', // t62
    picture: 'thumb-legal-audit.jpg',
    rows: [
      [{ name: 'AI Lawyer' }, { name: 'Legal Sphere' }], // t63, t64
      [{ name: 'Doc.AI', note: 'AI-enabled audit' }], // t66
      [{ name: 'Exception Handler', note: 'control monitoring' }], // t67
    ],
  },
]

/** The peach box at the end of the bottom row: two small headings, each with its pills. */
export const BASE: { label: string; star?: boolean; rows: Agent[][] }[] = [
  {
    label: 'EVERYDAY AI', // t68
    star: true, // the presenter's: Everyday AI is covered in Tracks too
    rows: [
      [{ name: 'ARYA' }, { name: 'Piramal Mind' }, { name: 'Prastuti' }, { name: 'BYOT' }], // t70 to t73
      [{ name: 'BYOA' }], // t74
    ],
  },
  {
    label: 'AI INFRASTRUCTURE', // t76
    rows: [[{ name: 'SLMs' }, { name: 'GPU' }, { name: 'Unified AI Gateway' }]], // t77 to t79
  },
]
