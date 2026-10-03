import path from 'node:path'
import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
// MUST be 1. Concurrency 4 timed out opening tabs ("Visited .../index.html
// but got no response"). Concurrency 2 ran without erroring but silently
// corrupted output: every screenshot came back as a 2x2 tiled composite of
// itself (4 copies of the same content, cropped, tiled into one frame) —
// caught by extracting frames from the actual rendered mp4, not `remotion
// still` (still uses a single page and always rendered correctly). This is
// a `--headless=new` + multiple-concurrent-Chrome-for-Testing-pages bug on
// this machine: 2 or more pages open at once corrupts CDP screenshots.
// Reproduced on a 21-frame range (`--frames=1055-1075`) with concurrency 2,
// confirmed clean at concurrency 1 on the same range before committing to a
// full re-render. Slower (~15min vs ~8min for the full video) but correct.
Config.setConcurrency(1)
// The stripped-down "headless shell" build has no WebGL support at all
// (canvasElement.getContext("webgl2") returns null), which breaks every
// shader-based remocn transition (swirl/dither/ripple/warp/smoke/perlin/
// grain/wave-wipe — all built on @paper-design/shaders-react). The full
// Chrome-for-Testing build at the same cached version does support WebGL
// via software rendering — switched to it, plus swangle (SwiftShader-on-
// ANGLE) as the most broadly-compatible headless GL backend.
Config.setBrowserExecutable(
  '/Users/duet/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
)
// CRITICAL: chromeMode defaults to 'headless-shell', which makes Remotion
// launch the browser with the legacy `--headless=old` flag — regardless of
// which executable setBrowserExecutable points at. Old headless mode is
// buggy on the full Chrome-for-Testing build: every frame came out as a
// 2x2 tiled/repeated composite of itself (caught by extracting frames from
// the actual rendered mp4, not just `remotion still`). Declaring the mode
// explicitly makes Remotion use `--headless=new` for this binary instead.
Config.setChromeMode('chrome-for-testing')
Config.setChromiumOpenGlRenderer('swangle')

Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
  }
})
