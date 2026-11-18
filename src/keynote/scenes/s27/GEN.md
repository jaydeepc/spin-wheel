# Slide 27 · generated pictures

Eight objects for the eight theme cards, one family, each showing what the deck's flat icon on that
card showed. Text prompts only; no deck picture was used as a reference; nothing of the deck was sent.

Tool: `generate_image`, model `gpt_image_2_5`, variant `sunburst`, quality `high`, resolution `2k`,
aspect ratio `1:1`, background `transparent`. Each came back 2048 x 2048 RGBA and was kept at the
first attempt. Then, with PIL: cropped to the object's own box (alpha over 24), centred on a square
with 3% margin, resized to 704 x 704, saved as PNG in `public/keynote/gen/27/`.

Every prompt ends with the same sentences (the STYLE):

> Soft matte material with subtle glossy highlights, rounded friendly geometry, soft studio light from the upper left, slight three-quarter front view, centered with generous margin, isolated on a fully transparent background, no ground plane. Clean, premium, editorial. No text, no letters, no numbers, no logos.

| File | Card | Prompt (before the STYLE) |
| --- | --- | --- |
| `blocks-coin.png` | Tangible Value Delivery | Premium 3D icon render of a single object group: a small pyramid of six rounded cubes stacked three, two, one, in clear blue #2f6bff, flame orange-red #ED4224 and deep navy #071a50, with one thick polished gold coin with a completely plain blank face resting on the top cube. (STYLE, with "no symbols" added to its last sentence) |
| `human-and-robot.png` | Jugalbandi between Humans and AI | Premium 3D icon render of two small figures standing side by side like game pieces: on the left an abstract human figure made of a smooth flame orange-red #ED4224 sphere head above a rounded bust, completely featureless with no face; on the right a small friendly robot bust in deep navy #071a50 with a rounded square head, two glowing clear blue #2f6bff dot eyes and a short antenna tipped with a small golden ball; one tiny golden four-point sparkle floating between them. (STYLE, with "no human face" added to its last sentence) |
| `workflow-steps.png` | Integration of AI in our workflow | Premium 3D icon render of a workflow: three rounded square tiles in a horizontal row joined by short thick connector rods, the first tile deep navy #071a50 with a white dot, the second flame orange-red #ED4224 with a white four-point sparkle, the third clear blue #2f6bff with a bold white check mark; just below them one horizontal rounded progress bar with a white track and a flame orange-red fill two thirds of the way along. |
| `seedling.png` | Use cases have matured | Premium 3D icon render of a young seedling with a short stem and two fresh rounded green leaves growing out of a small neat mound of dark navy #071a50 soil that sits on three small stacked bricks in flame orange-red #ED4224 and clear blue #2f6bff; one small golden sphere floating at the upper left like a sun. |
| `magnifier.png` | Understand what doesn't work | Premium 3D icon render of a magnifying glass with a thick deep navy #071a50 rim and a sturdy navy handle pointing to the lower right, a clear pale glass lens, and inside the lens a bold rounded flame orange-red #ED4224 X cross mark. |
| `network.png` | AI first Business Ecosystem | Premium 3D icon render of a network: one larger flame orange-red #ED4224 sphere in the centre carrying a small white four-point sparkle, connected by slim deep navy #071a50 rods to five smaller spheres arranged around it, three in clear blue #2f6bff and two in deep navy. |
| `chain-links.png` | Increasing connectedness between GenAI & ML | Premium 3D icon render of two thick interlocked chain links lying diagonally, one flame orange-red #ED4224 and one clear blue #2f6bff, smooth and rounded, with two tiny golden four-point sparkles beside them. |
| `phone-chat.png` | Emergence of AI Native usecases | Premium 3D icon render of a modern smartphone standing upright and turned slightly, deep navy #071a50 body, clean white screen showing three plain rounded chat bubbles as blank bars with nothing written in them: clear blue #2f6bff on the left, flame orange-red #ED4224 on the right, clear blue on the left; one small golden four-point sparkle floating at the top right corner. |

Notes: the seedling keeps green leaves and the coin, the sun and the sparkles are gold, as small
pictorial accents (the deck's own icons have both). The coin carries no rupee sign: a generated
picture carries no symbol or letter.
