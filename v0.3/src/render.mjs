// Deterministic frame capturer for the launch film.
// Drives the film's own clock via window.__seek(t) and screenshots every frame
// in headless Chrome, then ffmpeg encodes the PNG sequence + music (see README).
//
// The film is fully self-contained: React / Babel / Lottie-free runtime and the
// fonts are vendored under ./vendor and ./fonts, so the render needs no network.
//
//   CHROME=/path/to/chrome node render.mjs
//
// CHROME defaults to a Chrome-for-Testing install; point it at any Chromium.
import puppeteer from 'puppeteer-core'

const CHROME =
  process.env.CHROME ||
  '/Users/duet/.cache/puppeteer/chrome/mac_arm-149.0.7827.22/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
const URL = 'file://' + process.cwd() + '/index.html'
const FPS = 30

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb', '--hide-scrollbars', '--font-render-hinting=none'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1920, height: 1124, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })

// wait for film runtime
for (let i = 0; i < 40; i++) {
  if (await page.evaluate(() => typeof window.__seek === 'function')) break
  await new Promise((r) => setTimeout(r, 500))
}
await page.evaluate(() => document.fonts.ready)

const DURATION = await page.evaluate(() => window.__duration || 31.1)
const FRAMES = Math.round(FPS * DURATION)
console.log('duration', DURATION, 's ->', FRAMES, 'frames')

// pre-warm: seek across the whole timeline so every <img>/<video> decodes to cache
for (let t = 0.5; t < DURATION; t += 1.4) {
  await page.evaluate((tt) => window.__seek(tt), t)
  await new Promise((r) => setTimeout(r, 160))
}
await new Promise((r) => setTimeout(r, 600))

const clip = { x: 0, y: 0, width: 1920, height: 1080 }
const pad = (n) => String(n).padStart(5, '0')
const t0 = Date.now()
for (let i = 0; i < FRAMES; i++) {
  const t = i / FPS
  await page.evaluate((tt) => window.__seek(tt), t)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
  // wait for any <video> to finish decoding the seeked frame
  await page.evaluate(() => Promise.all([...document.querySelectorAll('video')].map((v) => new Promise((res) => {
    let n = 0
    const ok = () => v.readyState >= 2 && !v.seeking
    if (ok()) return res()
    const iv = setInterval(() => { if (ok() || ++n > 90) { clearInterval(iv); res() } }, 16)
  }))))
  await new Promise((r) => setTimeout(r, 60))
  await page.screenshot({ path: `frames/f${pad(i)}.png`, clip, optimizeForSpeed: true })
  if (i % 30 === 0) {
    const el = ((Date.now() - t0) / 1000).toFixed(0)
    console.log(`frame ${i}/${FRAMES}  t=${t.toFixed(2)}s  elapsed=${el}s`)
  }
}
console.log('DONE capture', FRAMES, 'frames; errors:', errors.slice(0, 5))
await browser.close()
