import puppeteer from 'puppeteer-core'

const CHROME = '/Users/duet/.cache/puppeteer/chrome/mac_arm-149.0.7827.22/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
const URL = 'file://' + process.cwd() + '/index.html'
const FPS = 30
const DURATION = 20
const FRAMES = FPS * DURATION // 600 → t = 0 .. 19.9667

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

// pre-warm: seek through every scene midpoint once so all <img> decode into cache
const warm = [1.5, 4.0, 6.0, 8.2, 10.2, 12.5, 13.9, 14.4, 14.9, 15.4, 15.9, 17.5, 19.2]
for (const t of warm) {
  await page.evaluate((tt) => window.__seek(tt), t)
  await new Promise((r) => setTimeout(r, 180))
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
  await new Promise((r) => setTimeout(r, 70))
  await page.screenshot({ path: `frames/f${pad(i)}.png`, clip, optimizeForSpeed: true })
  if (i % 30 === 0) {
    const el = ((Date.now() - t0) / 1000).toFixed(0)
    console.log(`frame ${i}/${FRAMES}  t=${t.toFixed(2)}s  elapsed=${el}s`)
  }
}
console.log('DONE capture', FRAMES, 'frames; errors:', errors.slice(0, 5))
await browser.close()
