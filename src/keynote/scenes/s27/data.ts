/**
 * Slide 27 · the words and the geometry, copied from the pack (never retyped).
 *
 *   words     pack/27/data.json -> themes[].name / .line   (the same strings as text.json x01 ... x10,
 *             which the PDF holds as outlines: read by eye, then checked against pages/27.jpg)
 *   centre    pack/27/text.json t03 (its second line starts with the flame "Piramal.ai")
 *   cx, cy    the centre of each card on the deck's page, in --u, and `tilt` in degrees (clockwise),
 *             measured from the white card paths of pack/27/vector/slide-art.svg. Every card there is
 *             26.2u x 9.6u (the third is drawn 10.8u high; here all eight are alike).
 *   row       which beat pins the card on (top row, middle pair, bottom row)
 *   icon      the generated picture in public/keynote/gen/27/ (GEN.md has each prompt)
 */
export interface Theme {
  key: string
  name: string
  line: string
  cx: number
  cy: number
  tilt: number
  row: 0 | 1 | 2
  icon: string
  tone: 'peach' | 'ice'
}

/** text.json t03, line by line */
export const CENTRE = ["Emerging themes in", "Piramal.ai in past 12m"] as const

export const THEMES: Theme[] = [
  // x01
  { key: "value", name: "Tangible Value Delivery", line: "", cx: 19.32, cy: 21.55, tilt: -2.0, row: 0, icon: "blocks-coin.png", tone: "peach" },
  // x02
  { key: "jugalbandi", name: "Jugalbandi between Humans and AI", line: "", cx: 50.43, cy: 21.16, tilt: -1.5, row: 0, icon: "human-and-robot.png", tone: "ice" },
  // x03
  { key: "workflow", name: "Integration of AI in our workflow", line: "", cx: 81.0, cy: 22.52, tilt: 2.0, row: 0, icon: "workflow-steps.png", tone: "ice" },
  // x04 + x05
  { key: "matured", name: "Use cases have matured", line: "We have built use cases brick by brick", cx: 17.63, cy: 34.21, tilt: 2.0, row: 1, icon: "seedling.png", tone: "ice" },
  // x06
  { key: "learn", name: "Understand what doesn’t work", line: "", cx: 82.35, cy: 34.66, tilt: -1.5, row: 1, icon: "magnifier.png", tone: "peach" },
  // x07 + x08
  { key: "ecosystem", name: "AI first Business Ecosystem", line: "Business owns the problem and the outcome", cx: 17.83, cy: 46.5, tilt: -2.0, row: 2, icon: "network.png", tone: "ice" },
  // x09
  { key: "connected", name: "Increasing connectedness between GenAI & ML", line: "", cx: 50.0, cy: 46.05, tilt: 1.5, row: 2, icon: "chain-links.png", tone: "peach" },
  // x10
  { key: "native", name: "Emergence of AI Native usecases", line: "", cx: 80.25, cy: 46.44, tilt: 2.0, row: 2, icon: "phone-chat.png", tone: "peach" },
]
