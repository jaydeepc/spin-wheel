# Pack fixes: slides 36 to 39

The pack (`exports/_rig/keynote-src/pack/36` … `39`: notes, text, data, images) is SUPERSEDED for
these four slides by the owner's four updated slide pictures of 18 Nov. The scene is built from
those pictures only; nothing of the pack's old story is shown, and no picture of
`public/keynote/src/36..39` is used (no statement, no customer photograph, no chart screenshot,
no robot render).

- Headlines (deck.ts rows 36 to 39) are the new ones; `check_deck.mjs` will report these four
  rows as differing from the pack. That is expected until the pack is rebuilt.
- Breadcrumb unchanged: PIRAMAL.AI | UNDERWRITE BETTER.
- `public/keynote/pages/36..39.jpg` and their thumbs (overview grid, `Slide.page` / `Slide.thumb`)
  still show the retired slides: they need re-shooting by whoever owns those pictures.
- Chart values of 38 / 39 are read from the picture by eye (it prints none): see data.ts → CHART.values.
