# Slide 22: generated pictures

Three cut-out sprites in `public/keynote/gen/22/`, made from TEXT PROMPTS ONLY (no deck picture
was used as a reference, no names). Model `gpt_image_2_5`, variant `sunburst`, quality `high`,
resolution `2k`, `background: transparent`. Each was looked at, its faint alpha haze was cut
(alpha under 28 of 255 set to 0, the rest rescaled), cropped to its object and resized with PIL.

The deck's own picture of this slide (`illus-chips-and-socket.png`) is ONE flat illustration; its
chip, lead, plug and socket are rebuilt here so that they can move. The pylon is the deck's
photograph (`public/keynote/src/22/photo-pylon.jpg`), untouched.

## chip.png (840 x 840, aspect 1:1)

Used five times: four waiting chips (faded by opacity only) and the one that lights (its glowing
core is CSS laid over the chip's own raised plate).

> A single square computer processor chip seen exactly from directly above, perfectly centred and perfectly symmetrical, orthographic top view, product render. Rounded-square body in deep navy blue (#071a50) satin ceramic with a fine bevelled edge and a slightly lighter navy raised rounded-square plate in its centre. Seven short brushed-gold contact pins on each of the four sides, evenly spaced, sticking straight out. Soft even studio light from the upper left, gentle highlights, clean, premium, editorial 3D render. Isolated object on a transparent background, no shadow on the ground, no text, no letters, no logos, no markings.

## socket.png (560 x 560, aspect 1:1)

> A single wall power outlet faceplate seen exactly from the front, perfectly centred and perfectly symmetrical, orthographic front view, product render. Rounded-square plate in glossy warm white with a fine bevelled edge; in its centre a shallow circular recessed well, slightly cooler pale grey-blue inside, with two small dark round pin holes side by side. Soft even studio light from the upper left, gentle highlights, clean, premium, editorial 3D render. Isolated object on a transparent background, no shadow on the ground, no screws, no switch, no text, no letters, no logos, no markings.

## plug.png (720 x 351, aspect 3:2)

> A single electrical power plug lying flat, seen exactly from directly above, orthographic top view, pointing to the right, product render. Compact rounded body in deep navy blue (#071a50) satin plastic with a soft bevelled edge and a short ribbed strain-relief collar on its left end. Two straight parallel polished brass round pins stick out of its right face, pointing right, both fully visible side by side. No cable attached. Soft even studio light from the upper left, gentle highlights, clean, premium, editorial 3D render. Isolated object centred on a transparent background, no shadow on the ground, no text, no letters, no logos, no markings.
