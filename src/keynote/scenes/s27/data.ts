/**
 * Slide 27 · the words and the geometry, copied from the pack (never retyped).
 *
 *   words     pack/27/data.json -> themes[].name / .line   (the same strings as text.json x01 ... x10,
 *             which the PDF holds as outlines: read by eye, then checked against pages/27.jpg)
 *   centre    pack/27/text.json t03 (its second line starts with the flame "Piramal.ai")
 *   cx, cy    the centre of each card on the deck's page, in --u, and `tilt` in degrees (clockwise),
 *             measured from the white card paths of pack/27/vector/slide-art.svg. Every card there is
 *             26.2u x 9.6u (the third is drawn 10.8u high; here all eight are alike).
 *   order     the owner's order and subtexts of the fifth round (each picture travels with its title;
 *             the places, tilts and the order of arrival stay the board's)
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
  /** the card's height in --u when it is not the usual 9.6 */
  h?: number
}

/** text.json t03, line by line */
export const CENTRE = ["Emerging themes in", "Piramal.ai in past 12m"] as const

export const THEMES: Theme[] = [
  // top left
  { key: "value", name: "Tangible Value Delivery", line: "Improve Productivity, reduce risk and costs", cx: 19.32, cy: 21.55, tilt: -2.0, row: 0, icon: "blocks-coin.png", tone: "peach" },
  // top middle
  { key: "jugalbandi", name: "Jugalbandi between Humans and AI", line: "People lead, AI helps get things done", cx: 50.43, cy: 21.16, tilt: -1.5, row: 0, icon: "human-and-robot.png", tone: "ice" },
  // top right: three lines of name and two of subtext, so this one card is 11.2u high (the deck drew
  // its top-right card taller too); its lower edge is where the 9.6u card's was (cy 22.52), it grows upward
  { key: "connected", name: "Increasing connectedness between GenAI & ML", line: "Combine predictions and context for better decisions", cx: 81.0, cy: 21.72, tilt: 2.0, row: 0, icon: "chain-links.png", tone: "peach", h: 11.2 },
  // middle left
  { key: "matured", name: "Use cases have matured", line: "Built brick by brick, entering maturity now", cx: 17.63, cy: 34.21, tilt: 2.0, row: 1, icon: "seedling.png", tone: "ice" },
  // middle right ("Learn , Reassess" is the owner's spacing; the space before the comma does not break)
  { key: "learn", name: "Understand what doesn’t work", line: "Learn\u00a0, Reassess and Rebuild what fails", cx: 82.35, cy: 34.66, tilt: -1.5, row: 1, icon: "magnifier.png", tone: "peach" },
  // bottom left
  { key: "ecosystem", name: "AI first Business Ecosystem", line: "Business teams own problems and solutions", cx: 17.83, cy: 46.5, tilt: -2.0, row: 2, icon: "network.png", tone: "ice" },
  // bottom middle
  { key: "workflow", name: "Integration of AI in our workflow", line: "Make AI part of people’s workflow", cx: 50.0, cy: 46.05, tilt: 1.5, row: 2, icon: "workflow-steps.png", tone: "ice" },
  // bottom right
  { key: "native", name: "Emergence of AI Native usecases", line: "Products and ways of working not possible in Non AI world at all!", cx: 80.25, cy: 46.44, tilt: 2.0, row: 2, icon: "phone-chat.png", tone: "peach" },
]
