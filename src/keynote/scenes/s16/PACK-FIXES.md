# Pack fixes · slide 16

- `data.json → themes[]` (and `text.json` x04, x16) carry `boldPart` but no field for the BLUE ITALIC
  runs of two cards' lines. On the page (`public/keynote/pages/16.jpg`) they are:
  - card "Composite AI" (x04): `Physical AI` and `JEV` are blue italic ("ML meets GenAI · *Physical AI* · *JEV*").
  - card "Sovereign & Indic AI Enter Adolescence" (x16): `Sarvam` is blue italic.
  The scene takes them from the page (`scenes/s16/data.ts → THEMES[].blue`). Suggested pack field: `bluePart`.
