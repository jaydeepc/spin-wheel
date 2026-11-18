/**
 * Slide 32: what is taken from the pack (exports/_rig/keynote-src/pack/32) and from deck.ts.
 *
 * The diagram itself (the five outcomes' words, the shapes) is the same as slide 8's and lives in
 * ../_shared/outcomes/data.ts.
 */

/** text.json t02: the second line of the title, "Piramal.ai", is the deck's orange (#fe6e00). */
export const TITLE_FLAME = ['Piramal.ai']

/**
 * THE STORIES OF SECTION E, one tag in each petal: slide 32 as the contents of what follows.
 *
 * THESE FIVE NAMES ARE NOT PRINTED ON SLIDE 32. They are the deck's own names of the stories that
 * come next, each taken from the headline of its slide (deck.ts), and each put with the outcome
 * that the story's own breadcrumb names:
 *
 *   ABCD       33 to 39   "ABCD is Sushil’s pit crew …", "ABCD Banking Agent, …"; breadcrumb of 36 to 39: UNDERWRITE BETTER
 *   Nivaaran   40, 41     "Nivaaran captures what the customer tells us …"; breadcrumb: UNDERWRITE BETTER. + ENHANCE PRODUCTIVITY.
 *   Arya       42, 43     "With Arya, our sales manager …"; breadcrumb: DRIVE GROWTH
 *   PIA        44         "PIA is doing 100cr+ cross-sell, …"; breadcrumb: DRIVE GROWTH + IMPROVE CX
 *   AIDLC      45 to 49   "In AIDLC, AI agents do the heavy lifting …"; breadcrumb: AI IN SOFTWARE DEVELOPMENT
 *
 * The first four pairings are the deck's (its breadcrumbs). The fifth is READ INTO IT: no
 * breadcrumb says "Integrate & Build More"; slide 48's headline ("… we build more of our own
 * software …") is the reason AIDLC stands there. The stories then come in exactly the order of
 * the petals, left to right.
 *
 * ONE SWITCH: set SHOW_STORIES to false and the petals only light in turn, with no names.
 */
export const SHOW_STORIES = false

export const STORIES: string[] = ['ABCD', 'Nivaaran', 'Arya', 'PIA', 'AIDLC']
