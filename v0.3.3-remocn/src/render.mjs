#!/usr/bin/env node
// 4K export without touching the main film:
//   1. Remotion-render Close only (GitHub Stars + end card)
//   2. Reuse out/source-4k.mp4 — never re-encode the 36s main video
//   3. Concat video (-c copy), replace ALL audio with the Monume bed,
//      1s fade-out at the end

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(root, 'out')
const filmOut = path.resolve(root, '..', 'chmonitor-v033-remocn-4k-launch.mp4')
const source = path.resolve(root, '..', 'chmonitor-v0.3-audio.mp4')
const source4k = path.join(outDir, 'source-4k.mp4')
const music = path.resolve(root, '..', 'monume-product-launch-review-519253.mp3')

mkdirSync(outDir, { recursive: true })

const remotion = path.join(root, 'node_modules', '.bin', 'remotion')

function run(cmd, args, label) {
  console.log(`\n▸ ${label}\n  ${cmd} ${args.join(' ')}\n`)
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' })
  if (r.status !== 0) {
    process.exit(r.status ?? 1)
  }
}

function runOut(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' })
  if (r.status !== 0) {
    process.stderr.write(r.stderr || '')
    process.exit(r.status ?? 1)
  }
  return r.stdout
}

run(remotion, ['render', 'src/index.ts', 'Close', 'out/close.mp4'], 'render Close 4K (GitHub Stars → chmonitor.dev)')

function normalizeCard(input, output) {
  run(
    'ffmpeg',
    [
      '-y',
      '-i',
      input,
      '-f',
      'lavfi',
      '-i',
      'anullsrc=channel_layout=stereo:sample_rate=44100',
      '-map',
      '0:v:0',
      '-map',
      '1:a:0',
      '-c:v',
      'libx264',
      '-profile:v',
      'high',
      '-preset',
      'veryfast',
      '-crf',
      '16',
      '-pix_fmt',
      'yuv420p',
      '-r',
      '60',
      '-video_track_timescale',
      '57600',
      '-colorspace',
      'bt709',
      '-color_primaries',
      'bt709',
      '-color_trc',
      'bt709',
      '-c:a',
      'aac',
      '-ar',
      '44100',
      '-ac',
      '2',
      '-b:a',
      '192k',
      '-shortest',
      '-movflags',
      '+faststart',
      output,
    ],
    `normalize ${path.basename(input)} → ${path.basename(output)}`,
  )
}

normalizeCard(path.join(outDir, 'close.mp4'), path.join(outDir, 'close-4k.mp4'))

if (!existsSync(source4k)) {
  run(
    'ffmpeg',
    [
      '-y',
      '-i',
      source,
      '-vf',
      'pad=3840:2160:80:0:black',
      '-c:v',
      'libx264',
      '-profile:v',
      'high',
      '-preset',
      'slow',
      '-crf',
      '16',
      '-pix_fmt',
      'yuv420p',
      '-r',
      '60',
      '-video_track_timescale',
      '57600',
      '-colorspace',
      'bt709',
      '-color_primaries',
      'bt709',
      '-color_trc',
      'bt709',
      '-an',
      '-movflags',
      '+faststart',
      source4k,
    ],
    'pad source to 3840×2160 (video only, no original audio)',
  )
} else {
  console.log('\n▸ reuse existing source-4k.mp4 (video only; original audio discarded)\n')
}

const listPath = path.join(outDir, 'concat-4k.txt')
const silentPath = path.join(outDir, 'video-silent.mp4')
writeFileSync(
  listPath,
  [`file '${source4k}'`, `file '${path.join(outDir, 'close-4k.mp4')}'`, ''].join('\n'),
)

run(
  'ffmpeg',
  ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c:v', 'copy', '-an', silentPath],
  'concat video, drop original audio',
)

const durStr = runOut('ffprobe', [
  '-v',
  'error',
  '-show_entries',
  'format=duration',
  '-of',
  'default=noprint_wrappers=1:nokey=1',
  silentPath,
]).trim()
const duration = Number.parseFloat(durStr)
const fadeStart = Math.max(0, duration - 1)

run(
  'ffmpeg',
  [
    '-y',
    '-i',
    silentPath,
    '-i',
    music,
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-ar',
    '44100',
    '-ac',
    '2',
    '-b:a',
    '192k',
    '-af',
    `afade=t=out:st=${fadeStart.toFixed(3)}:d=1`,
    '-t',
    String(duration),
    '-movflags',
    '+faststart',
    filmOut,
  ],
  `lay Monume bed + 1s fade-out at ${fadeStart.toFixed(2)}s (video copy)`,
)

const probe = runOut('ffprobe', [
  '-v',
  'error',
  '-show_entries',
  'stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels,bit_rate,nb_frames',
  '-show_entries',
  'format=duration,size',
  '-of',
  'compact',
  filmOut,
])
console.log('\n▸ output')
console.log(probe)
console.log(`wrote ${filmOut}`)
