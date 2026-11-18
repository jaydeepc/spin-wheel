/** Slide 55: a section divider. See ../_shared/divider.tsx. */
import { divider } from '../_shared/divider'

// the deck sets "Tech" in white and "People" in blue, the rest in flame
export default divider(55, { sub: { text: 'The Tech & People behind our AI', flame: ['The', '&', 'behind our AI'], azure: ['People'] } })
