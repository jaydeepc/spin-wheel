/**
 * Slide 28 · the words, copied from the pack (never retyped).
 *
 * The slide itself prints only the four names and "and many more….". What each agent DOES and the
 * lending function it works in are not on slide 28: they are the deck's own words about the same
 * agent on later slides (29, 41, 43, 44), copied from those packs. Each row says where from.
 *
 *   picture   pack/28/images.json: the agent's portrait in public/keynote/src/28/ and its pixels.
 *             Nivaaran has none on the slide (data.json: "no portrait on the slide"): the scene
 *             draws an emblem for it (emblem.tsx), after the flame disc with an "N" of slide 41.
 */
export interface Agent {
  key: string
  /** the name, as slide 28 prints it */
  name: string
  /** file in public/keynote/src/28/ (or a path from the site's root, beginning with "/"), or null: no portrait in the deck */
  picture: string | null
  px: [number, number] | null
  /** the lending function, as slide 29 heads the column that lists the agent */
  fn: string
  /** what it does, in the deck's words */
  does: string
}

/**
 * THE OWNER'S CALL, in one place. Slide 28 itself prints only the names. `true` also shows, for each
 * agent, the lending function (slide 29's column heads: t04 SALES, t05 CREDIT, t07 CUSTOMER EXPERIENCE
 * on two lines there, t08 COLLECTIONS) and what it does (the deck's words on 29, 41, 43, 44). `false`
 * shows the portrait and the name only, on stage and in the final row, as the deck's slide has it.
 */
export const SHOW_ROLES = true

export const AGENTS: Agent[] = [
  // name 28 t02 · function 29 t07 (the column that lists "PIA") · does 44 t19, after "PIA · "
  { key: "pia", name: "PIA", picture: "agent-pia.png", px: [476, 476], fn: "CUSTOMER EXPERIENCE", does: "Voice AI, with the customer all the way through" },
  // name 28 t03 · function 29 t04 (the column that lists "ARYA") · does 43 t04
  { key: "arya", name: "Arya", picture: "agent-arya.png", px: [477, 483], fn: "SALES", does: "Employee digital assistant, coach and work friend" },
  // name 28 t04 · function 29 t05 · does 29 t20, after "★ ABCD "
  // picture: the owner's ABCD logo (public/keynote/brand/, a path from the site's root), in place of the deck's robot render agent-abcd.jpg
  { key: "abcd", name: "ABCD", picture: "/keynote/brand/abcd-agent.png", px: [1024, 1024], fn: "CREDIT", does: "AI credit decisioning" },
  // name 28 t05 · function 29 t08 (the column that lists "Nivaaran") · does 41 t05
  { key: "nivaaran", name: "Nivaaran", picture: null, px: null, fn: "COLLECTIONS", does: "AI-powered collections" },
]

/** 28 t06 (an ellipsis character and a full stop, as the deck has it) */
export const TAIL = "and many more…."
