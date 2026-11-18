import type { CSSProperties, ReactNode } from 'react'

/* ------------------------------------------------------------------ words */

type Tone = 'flame' | 'azure' | null

interface Seg {
  text: string
  /** The segment is coloured (flame or azure). */
  flame: boolean
  tone: Tone
  bold: boolean
}

const markAll = (text: string, phrases: string[], put: (k: number) => void) => {
  for (const phrase of phrases) {
    if (!phrase) continue
    let from = 0
    for (;;) {
      const i = text.indexOf(phrase, from)
      if (i < 0) break
      for (let k = i; k < i + phrase.length; k++) put(k)
      from = i + phrase.length
    }
  }
}

/**
 * Cuts a sentence into words; a word is cut again where a marked phrase begins or ends inside it
 * ("one." → "one" + "."). Each piece knows its own tone by its POSITION in the sentence, so a
 * flame word that also occurs inside an azure phrase stays flame.
 */
export function cutWords(text: string, flame: string[] = [], azure: string[] = [], bold: string[] = []): Seg[][] {
  const tone = new Array<Tone>(text.length).fill(null)
  const heavy = new Array<boolean>(text.length).fill(false)
  markAll(text, flame, (k) => (tone[k] = 'flame'))
  markAll(text, azure, (k) => (tone[k] = 'azure'))
  markAll(text, bold, (k) => (heavy[k] = true))
  const words: Seg[][] = []
  let i = 0
  while (i < text.length) {
    if (text[i] === ' ') {
      i++
      continue
    }
    let j = i
    while (j < text.length && text[j] !== ' ') j++
    const segs: Seg[] = []
    let k = i
    while (k < j) {
      let m = k
      while (m < j && tone[m] === tone[k] && heavy[m] === heavy[k]) m++
      segs.push({ text: text.slice(k, m), flame: tone[k] !== null, tone: tone[k], bold: heavy[k] })
      k = m
    }
    words.push(segs)
    i = j
  }
  return words
}

export interface WordsProps {
  /** The sentence, exact. */
  text: string
  /** Phrases of it to set in the flame colour (exact substrings, every occurrence). */
  flame?: string[]
  /** Phrases to set in the clear blue instead. */
  azure?: string[]
  /** Phrases to set in Bold inside a lighter sentence ("see no impact on profit"). */
  bold?: string[]
}

/**
 * A sentence as words, each inside its own mask, so that `anim.words()` can raise them one by
 * one. The flame-coloured words of the deck are kept by naming them in `flame`.
 */
export function Words({ text, flame = [], azure = [], bold = [] }: WordsProps) {
  const words = cutWords(text, flame, azure, bold)
  return (
    <>
      {words.map((segs, i) => (
        <span key={i}>
          <span className="kn-w">
            <span className="kn-wi">
              {segs.map((s, k) => {
                const inner = s.bold ? <b key={k}>{s.text}</b> : s.text
                return s.tone ? (
                  <em key={k} className={s.tone === 'azure' ? 'kn-azure' : 'kn-flame'}>
                    {inner}
                  </em>
                ) : (
                  inner
                )
              })}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  )
}

export interface HeadlineProps extends WordsProps {
  /** 'l' the slide's headline (default), 'xl' a title page, 'm' a sub-headline. */
  size?: 'm' | 'l' | 'xl'
  className?: string
  style?: CSSProperties
}

/**
 * THE HEADLINE of a slide: it arrives word by word, and the deck's flame-coloured words stay
 * flame-coloured.
 *
 *   <Headline text={slide.title} flame={['6 in 100']} />
 *   …
 *   a.words('.kn-h', 0.1)        // in build(): const a = anim(ctx, tl)
 *
 * By default it stands at the top left of the safe area and may run to two lines (86u wide).
 * Give it a className to place it yourself.
 */
export function Headline({ text, flame, azure, bold, size = 'l', className = '', style }: HeadlineProps) {
  return (
    <h1 className={`kn-h kn-h--${size} ${className}`} style={style}>
      <Words text={text} flame={flame} azure={azure} bold={bold} />
    </h1>
  )
}

/**
 * Small spaced capitals: the deck's kickers ("WHAT THE SIX DO DIFFERENTLY", "IN NUMBERS").
 * The slide's breadcrumb itself is drawn by the chrome, from deck.ts: do not repeat it.
 *
 *   <Kicker tone="flame">Why enterprises switch</Kicker>
 *   <Kicker block>Held in his head</Kicker>          // on a line of its own (stacked in a card)
 */
export function Kicker({
  children,
  tone = 'muted',
  block = false,
  className = '',
}: {
  children: ReactNode
  tone?: 'muted' | 'flame' | 'azure' | 'navy'
  /** On a line of its own. */
  block?: boolean
  className?: string
}) {
  return <span className={`kn-kicker kn-kicker--${tone} ${block ? 'kn-kicker--block' : ''} ${className}`}>{children}</span>
}

/* ----------------------------------------------------------------- number */

export interface CountProps {
  /** The number it ends on. */
  to: number
  /** Where it starts counting. Default 0. */
  from?: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** 'in' groups digits the Indian way (1,11,440), 'en' the Western way, 'none' not at all. Default 'en'. */
  group?: 'in' | 'en' | 'none'
  className?: string
}

export function formatCount(v: number, decimals = 0, group: CountProps['group'] = 'en'): string {
  if (group === 'none') return v.toFixed(decimals)
  return v.toLocaleString(group === 'in' ? 'en-IN' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

/**
 * A number that counts up. It is drawn with its final value (so the layout is the final one);
 * `a.count(el, at)` in build() sets it back to `from` and counts.
 *
 *   <Count className="s17-big" to={63} suffix="%" />
 *   <Count to={111440} group="in" prefix="₹" />
 *   …
 *   a.count('.s17-big', 0.8)
 */
export function Count({ to, from = 0, decimals = 0, prefix = '', suffix = '', group = 'en', className = '' }: CountProps) {
  return (
    <span
      className={`kn-count-n ${className}`}
      data-to={to}
      data-from={from}
      data-decimals={decimals}
      data-prefix={prefix}
      data-suffix={suffix}
      data-group={group}
    >
      {prefix}
      {formatCount(to, decimals, group)}
      {suffix}
    </span>
  )
}
