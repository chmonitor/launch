// Source file is 3680×2160. Export canvas is standard 4K UHD 3840×2160.
// The recording is centered (80px pillarbox) — never cropped or stretched.
export const SOURCE_W = 3680
export const SOURCE_H = 2160
export const WIDTH = 3840
export const HEIGHT = 2160
export const FPS = 60

export const VIDEO_SRC = 'chmonitor-v0.3-audio.mp4'
export const VIDEO_FRAMES = 2161

// remocn SoftBlurIn is authored at 30fps (≈40f for "chmonitor.dev").
// speed=0.5 at 60fps keeps the same wall-clock feel.
export const BLUR_SPEED = 0.5

// Scene lengths @ 60fps
export const INTRO_FRAMES = 240 // 4.0s — domain, hold, matrix-decode v0.3
export const VERSION_AT = 140 // ~2.3s — after blur-in (~1.3s) + hold (~1s)
export const STARS_FRAMES = 72 // 1.2s — GitHubStars, rushed
export const END_FRAMES = 180 // 3.0s — SoftBlurIn "chmonitor.dev"

export const T_FADE = 18 // 0.3s crossfade into/out of the main video
export const T_DITHER = 24 // dither-dissolve stars → end card

export const OPEN_DURATION = INTRO_FRAMES
export const CLOSE_DURATION = STARS_FRAMES + END_FRAMES - T_DITHER
export const PREVIEW_DURATION = 36 + 90 - 12
export const TOTAL_DURATION = VIDEO_FRAMES + STARS_FRAMES + END_FRAMES - T_FADE - T_DITHER
