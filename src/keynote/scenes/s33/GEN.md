# Generated pictures of slides 33 to 35 (the pit lane)

All files are in `public/keynote/gen/33/`. Nothing of the deck was sent anywhere: the one
generated picture was made from a text prompt alone, and the shadows were cut locally from the
alpha of the deck's own cut-outs.

## pit-ground.jpg (3840 x 1576, JPEG quality 88): GENERATED

The ground of the lane. It replaces the deck's `illus-pit-lane.jpg`, whose painted lines and pit
box are baked in at the deck's full-bleed layout and so cannot follow the car once the slide is
refitted inside the safe area. The lines and the pit box are drawn as vector over this ground
(`index.tsx → .s33-paint`), in the deck's arrangement.

Tool: `generate_image`, model `gpt_image_2_5`, variant `sunburst`, quality `high`, resolution
`2k`, aspect ratio `21:9`, no reference picture. Prompt, exact:

> Drone photograph from fifteen metres straight above, perfectly orthographic, of a brand new, immaculately clean motorsport pit lane apron: very light silver-grey smooth sealed asphalt-concrete, fine uniform micro grain, almost flawless, only two or three barely visible hairline joints running across, extremely subtle soft tonal variation, a faint pair of pale tyre traces running left to right, bright soft morning daylight, gentle light falloff toward the corners, cool light grey with a touch of warmth, high key, minimal, elegant. No stains, no cracks, no dirt, no painted lines, no markings, no objects, no vehicles, no people, no text, no letters, no logos. Ultra sharp, premium automotive advertising photography.

Afterwards, locally (PIL): cropped to the lane's proportions (100 : 41.05), resized from 2688 to
3840 px wide, a fine grain added so that it stays crisp at that size, toned a little deeper and
cooler (x 0.878 / 0.887 / 0.906) with a soft falloff to the edges.

A first attempt was dropped (too rough and stained for this deck). Its prompt, for the record:

> Top-down aerial photograph, camera pointing straight down, orthographic, of an empty motorsport pit lane floor: smooth pale grey concrete laid in very large slabs with a few fine hairline expansion joints, faint tyre scuffs and soft rubber marks, light speckle and trowel texture, soft even overcast daylight, a slightly brighter area in the middle and gentle darkening toward the edges, cool neutral light grey with a hint of warmth. Completely empty: no painted lines, no markings, no objects, no vehicles, no people, no text, no letters, no logos. Ultra detailed, sharp, clean, premium editorial photography.

## shadow-*.png: NOT generated (made locally from the deck's cut-outs)

`shadow-chassis`, `shadow-shell`, `shadow-rear-wing`, `shadow-front-wing`, `shadow-tyre`,
`shadow-helmet`, `shadow-stack`, `shadow-stack-mini`: the alpha of the deck's own cut-out
(`public/keynote/src/33/…`, `…/34/…`), with 40 px of room, blurred twice (a tight contact shadow
and a wide soft one) and filled with a deep navy. They stand in for the blurred shadow pictures
PowerPoint had written into the deck (`images.json → decorations`). No outside service.
