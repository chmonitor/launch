import path from 'node:path'
import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
// MUST be 1 on this machine — concurrency ≥2 silently tiles frames 2×2.
Config.setConcurrency(1)
Config.setChromeMode('chrome-for-testing')
// WebGL for remocn shader-dithering (headless-shell has no GL).
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
