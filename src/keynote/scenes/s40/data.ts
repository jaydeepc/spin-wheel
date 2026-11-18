/**
 * Slides 40 and 41: every word, copied from pack/40 and pack/41 (text.json block ids / data.json
 * fields in the comments). Nothing here is retyped from the page picture.
 */

/** The flame phrases of the two headlines (text.json t02 spans, #f36d43). */
export const FLAME_40 = ['starts fresh', 'one fixed outcome', 'a fixed calendar']
export const FLAME_41 = ['Nivaaran', 'what the customer tells us', 'the next collection decision']

/* ---------------------------------------------------------------- slide 40 */
export const WHO_40 = {
  name: 'Sagar Bhingardeve', // 40 t03
  role: 'Branch Collections Manager, Pune - Pimpri', // 40 t04
  photo: 'photo-sagar-bhingardeve.jpg', // images.json, 97 x 97, a real photograph
  photoPx: 97,
  caption: 'One customer visit, as his agents run it today', // 40 t05
}

export const STAGES = [
  {
    key: 'before',
    label: 'BEFORE THE VISIT', // 40 t06 = 41 t07
    title40: 'The agent gathers customer information', // 40 t07
    title41: 'The agent gets enriched customer insights', // 41 t08
    object: 'folder.png',
    ratio: [531, 720],
  },
  {
    key: 'during',
    label: 'DURING THE VISIT', // 40 t08 = 41 t09
    title40: 'The agent selects a disposition', // 40 t09
    title41: 'The agent records the customer’s feedback', // 41 t10
    object: 'phone.png',
    ratio: [259, 720],
  },
  {
    key: 'after',
    label: 'AFTER THE VISIT', // 40 t10 = 41 t11
    title40: 'Manual and fixed allocation', // 40 t11
    title41: 'Feedback decides the collection strategy', // 41 t12
    object: 'calendar.png',
    ratio: [720, 645],
  },
] as const

export const BEFORE_40 = {
  label: 'WHAT THE AGENT HAS IN HAND', // 40 t12
  pills: ['Name', 'Address', 'Demographics'], // 40 t13, t14, t15
  empty: ['?', '?', '?'], // 40 t16, t17, t19
  note: 'Only the readily available information', // 40 t18
  calloutBold: 'His own notes', // 40 t20 (the bold run)
  callout: 'His own notes from earlier visits, insights from internal teams – Policy, underwriting', // 40 t20
  footer: 'Every visit is a fresh start.', // 40 t21
}

export const DURING_40 = {
  bubble: ['The conversation', 'is not captured'], // 40 t23 (two lines)
  dropdown: 'Disposition', // 40 t24
  options: ['Promise to pay', 'Paid', 'Not available', 'Refused to pay'], // 40 t25 … t28
  recordedLabel: 'RECORDED', // 40 t29
  recorded: 'Promise to pay', // 40 t30
  note: 'Only the outcome the agent concluded', // 40 t31
  footer: 'The nuance of the conversation is lost.', // 40 t32
}

export const AFTER_40 = {
  byHand: 'ALLOCATED BY HAND', // 40 t33
  everyMonth: 'EVERY MONTH', // 40 t34
  ways: ['Call', 'Field'], // 40 t35, t36
  legend: ['The fixed allocation date', 'The days different customers get paid'], // 40 t37, t38
  footer: 'A fixed date, whatever the income cycle.', // 40 t39
  /**
   * The month grid as the deck draws it (vector/slide-art.svg): rows of 7, 7, 7, 7 and 3 cells;
   * the navy square is the 4th cell of row 3; the orange dots are cells 3 and 7 of row 1, cell 5
   * of row 4 and cell 2 of row 5. Counted as days of a month: 18, and 3, 7, 26, 30.
   */
  days: 31,
  fixed: 18,
  paid: [3, 7, 26, 30],
}

/* ---------------------------------------------------------------- slide 41 */
export const WHO_41 = {
  initial: 'N', // 41 t03
  name: 'Nivaaran', // 41 t04
  role: 'AI-powered collections', // 41 t05
  caption: 'The same visit, with Nivaaran', // 41 t06
}

export const BEFORE_41 = {
  insights: [
    { badge: '₹', title: 'He pays his other lenders', line: 'His payments to them are regular.' }, // 41 t13, t14, t15
    { badge: '7', title: 'Salary arrives on the 7th', line: 'His bank statement shows the credit.' }, // 41 t16, t17, t18
    { badge: '“', title: 'What he told us earlier', line: 'He told another agent he will pay.' }, // 41 t19, t20; t21 reworded by the presenter (round md5)
  ],
  footerBadge: '7', // 41 t22
  footer: 'Visit on the 7th', // 41 t23
}

export const DURING_41 = {
  /** data.json → stages[1].body.transcript (normalised Unicode). Set in var(--kn-font-indic); never cut into letters. */
  transcript:
    'Customer पर अभी बहुत ज़्यादा कर्ज है, इसलिए वह केवल कुछ ही लोन चुका पा रहा है। आज उसे अपनी सैलरी मिली है, जिसकी वजह से वह हमें EMI का चेक दे पाया।',
  label: 'WHAT NIVAARAN TAKES FROM IT', // 41 t25
  pills: ['Overleveraged', 'Can pay ₹10,000 a month EMI'], // 41 t26, t27
}

export const AFTER_41 = {
  label: 'WHAT WE NOW KNOW', // 41 t28
  pills: ['Salary on the 7th', '₹10,000 a month'], // 41 t29, t30
  strategyLabel: 'STRATEGY FOR THIS CUSTOMER', // 41 t31
  strategy: 'Set up NACH on the 7th', // 41 t32
  strategyLine: 'the day he gets his salary', // 41 t33
  badge: '7', // 41 t34
  waysLabel: 'THREE WAYS TO COLLECT', // 41 t35
  ways: ['Call', 'Field', 'Handsfree collection'], // 41 t36, t37, t38 (the last is the selected one)
}

/** The recording's waveform on 41: bar heights (0 … 1) and which bars are flame. Drawn by hand after the deck's picture (navy bars, every third or so flame); not data. */
export const WAVE = [0.3, 0.55, 0.38, 0.9, 0.62, 0.3, 0.72, 1, 0.42, 0.34, 0.78, 0.46, 1, 0.5, 0.26, 0.6, 0.88, 0.4, 0.66, 0.34, 0.5, 0.3]
export const WAVE_FLAME = [0, 2, 5, 9, 11, 14, 17, 20]
