// Original, deterministic music bed for the chmonitor v0.3 launch film.
// Minimal / driving electronic — a steady "monitor pulse" kick, warm plucked
// bass, an arp and a soft pad over an Am–F–C–G loop. No samples, no AI: every
// sample is computed here, so the track is reproducible byte-for-byte.
//
//   node scripts/synth-music.mjs [out.wav]     # default: ./music.wav
//
// Encode to the shipped music.mp3 with (see .github/workflows/render.yml):
//   ffmpeg -y -i music.wav \
//     -af "highpass=f=30,lowpass=f=15800,alimiter=limit=0.97:level=false" \
//     -c:a libmp3lame -b:a 192k music.mp3
import fs from 'fs'

const OUT = process.argv[2] || 'music.wav'
const SR = 44100
const DUR = 32.0                 // a touch longer than the film so ffmpeg can trim
const N = Math.floor(SR * DUR)
const beat = 0.5                 // 120 BPM
const bar = beat * 4             // 2s

// deterministic RNG (LCG) for hats
let seed = 1337
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// chord loop (Am F C G) — mid octave tones + bass root (one/two octaves down)
const CH = [
  { tones: [220.0, 261.63, 329.63], bass: 110.0 },  // Am
  { tones: [174.61, 220.0, 261.63], bass: 87.31 },   // F
  { tones: [261.63, 329.63, 392.0], bass: 130.81 },  // C
  { tones: [196.0, 246.94, 293.66], bass: 98.0 },    // G
]
const chordAt = (t) => CH[Math.floor(t / bar) % CH.length]

// section levels (fade layers in/out for structure)
const seg = (t, a, b, ramp = 0.6) =>
  Math.max(0, Math.min(1, Math.min((t - a) / ramp, (b - t) / ramp, 1)))
const lvlPad = (t) => Math.min(1, seg(t, -1, 30.6, 1.2) * 0.9 + 0.1)
const lvlKick = (t) => seg(t, 2.6, 27.4, 0.8)
const lvlBass = (t) => seg(t, 2.2, 30.4, 0.8)
const lvlArp = (t) => seg(t, 5.8, 26.6, 1.0)
const lvlHat = (t) => seg(t, 7.6, 25.8, 1.0)

const env = (ph, dur, atk, dec) => {
  if (ph < 0 || ph > dur) return 0
  const a = atk > 0 ? Math.min(1, ph / atk) : 1
  const d = Math.exp(-Math.max(0, ph) * dec)
  return a * d
}

const L = new Float64Array(N)
const R = new Float64Array(N)
let prevNoise = 0

for (let i = 0; i < N; i++) {
  const t = i / SR
  const ch = chordAt(t)
  const barPh = t % bar
  let l = 0, r = 0

  // pad: detuned sines per chord tone, gentle per-bar swell
  {
    const swell = env(barPh, bar, 0.35, 0.35)
    const lv = lvlPad(t) * 0.16 * (0.7 + 0.3 * swell)
    const vib = 1 + 0.004 * Math.sin(2 * Math.PI * 5 * t)
    for (let k = 0; k < ch.tones.length; k++) {
      const f = ch.tones[k] * vib
      const s = 0.5 * (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * 1.004 * t))
      const pan = 0.5 + (k - 1) * 0.16
      l += s * lv * (1 - pan)
      r += s * lv * pan
    }
  }

  // bass: plucked root on beats 1 & 3
  {
    const ph = t % (beat * 2)
    const e = env(ph, beat * 2, 0.006, 5.2)
    if (e > 1e-4) {
      const f = ch.bass
      let s = 0
      for (let h = 1; h <= 5; h++) s += (1 / h) * Math.sin(2 * Math.PI * f * h * ph)
      s *= 0.5
      const v = s * e * lvlBass(t) * 0.5
      l += v; r += v
    }
  }

  // kick: round sine thump on every beat (the "pulse")
  {
    const ph = t % beat
    const body = Math.sin(2 * Math.PI * 52 * ph) * Math.exp(-ph * 9)
    const click = Math.sin(2 * Math.PI * 130 * ph) * Math.exp(-ph * 70) * 0.5
    const v = (body + click) * lvlKick(t) * 0.55
    l += v; r += v
  }

  // arp: 8th-note plucks cycling chord tones (up an octave)
  {
    const step = 0.25
    const idx = Math.floor(t / step)
    const ph = t - idx * step
    const tone = ch.tones[idx % ch.tones.length] * 2
    const s = (Math.sin(2 * Math.PI * tone * ph) + 0.3 * Math.sin(2 * Math.PI * tone * 2 * ph)) *
      Math.exp(-ph * 13)
    const pan = idx % 2 === 0 ? 0.34 : 0.66
    const v = s * lvlArp(t) * 0.16
    l += v * (1 - pan) * 2
    r += v * pan * 2
  }

  // hats: filtered-noise ticks on off-beats
  {
    const off = (t + beat / 2) % beat
    const ph = off
    const e = Math.exp(-ph * 46)
    const nz = rnd() * 2 - 1
    const hp = nz - prevNoise           // crude high-pass (differentiator)
    prevNoise = nz
    const v = hp * e * lvlHat(t) * 0.10
    l += v * 0.9; r += v * 1.1
  }

  // soft-clip master
  L[i] = Math.tanh(l * 1.05)
  R[i] = Math.tanh(r * 1.05)
}

// normalize to -1.5 dBFS
let peak = 0
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
const g = Math.pow(10, -1.5 / 20) / (peak || 1)

// write 16-bit stereo WAV
const buf = Buffer.alloc(44 + N * 4)
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8)
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20)
buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28)
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34)
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40)
let o = 44
for (let i = 0; i < N; i++) {
  buf.writeInt16LE((clamp(L[i] * g, -1, 1) * 32767) | 0, o); o += 2
  buf.writeInt16LE((clamp(R[i] * g, -1, 1) * 32767) | 0, o); o += 2
}
fs.writeFileSync(OUT, buf)
console.log('wrote', OUT, (buf.length / 1e6).toFixed(2), 'MB  peak=', peak.toFixed(3), 'gain=', g.toFixed(3))
