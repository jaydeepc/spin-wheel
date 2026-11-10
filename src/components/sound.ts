'use client'

/** Tiny synthesised sound effects, so the kiosk needs no audio files. Off unless enabled in admin. */
let ctx: AudioContext | null = null

export function unlockSound() {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctor) ctx = new Ctor()
    }
    if (ctx?.state === 'suspended') void ctx.resume()
  } catch {
    ctx = null
  }
}

function blip(freq: number, at: number, length: number, gain: number, type: OscillatorType) {
  if (!ctx) return
  const t = ctx.currentTime + at
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  amp.gain.setValueAtTime(gain, t)
  amp.gain.exponentialRampToValueAtTime(0.0001, t + length)
  osc.connect(amp).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + length + 0.02)
}

export function playTick() {
  blip(1500, 0, 0.035, 0.06, 'square')
}

export function playWin() {
  blip(659, 0, 0.35, 0.12, 'sine')
  blip(880, 0.12, 0.4, 0.12, 'sine')
  blip(1319, 0.26, 0.7, 0.1, 'sine')
}
