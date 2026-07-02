// chmonitor v0.3 launch film — extracted source (animations.jsx)

const Easing = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0
    if (t === 1) return 1
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10)
    return 1 - 0.5 * Math.pow(2, -20 * t + 10)
  },
  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeOutBack: (t) => {
    const c1 = 1.70158,
      c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
  easeInBack: (t) => {
    const c1 = 1.70158,
      c3 = c1 + 1
    return c3 * t * t * t - c1 * t * t
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158,
      c2 = c1 * 1.525
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3
    if (t === 0) return 0
    if (t === 1) return 1
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0]
    if (t >= input[input.length - 1]) return output[output.length - 1]
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i]
        const local = span === 0 ? 0 : (t - input[i]) / span
        const easeFn = Array.isArray(ease) ? ease[i] || Easing.linear : ease
        const eased = easeFn(local)
        return output[i] + (output[i + 1] - output[i]) * eased
      }
    }
    return output[output.length - 1]
  }
}

function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic,
}) {
  return (t) => {
    if (t <= start) return from
    if (t >= end) return to
    const local = (t - start) / (end - start)
    return from + (to - from) * ease(local)
  }
}

const TimelineContext = React.createContext({
  time: 0,
  duration: 10,
  playing: false,
})
const useTime = () => React.useContext(TimelineContext).time
const useTimeline = () => React.useContext(TimelineContext)

const SpriteContext = React.createContext({
  localTime: 0,
  progress: 0,
  duration: 0,
})
const useSprite = () => React.useContext(SpriteContext)

function Sprite({ start = 0, end = Infinity, children, keepMounted = false }) {
  const { time } = useTimeline()
  const visible = time >= start && time <= end
  if (!visible && !keepMounted) return null
  const duration = end - start
  const localTime = Math.max(0, time - start)
  const progress =
    duration > 0 && isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0
  const value = { localTime, progress, duration, visible }
  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  )
}

function TextSprite({
  text,
  x = 0,
  y = 0,
  size = 48,
  color = '#111',
  font = "'Space Grotesk', system-ui, sans-serif",
  weight = 600,
  entryDur = 0.45,
  exitDur = 0.35,
  entryEase = Easing.easeOutBack,
  exitEase = Easing.easeInCubic,
  align = 'left',
  letterSpacing = '-0.01em',
}) {
  const { localTime, duration } = useSprite()
  const exitStart = Math.max(0, duration - exitDur)
  let opacity = 1
  let ty = 0
  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1))
    opacity = t
    ty = (1 - t) * 16
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1))
    opacity = 1 - t
    ty = -t * 8
  }
  const translateX =
    align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0'
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${translateX}, ${ty}px)`,
        opacity,
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing,
        whiteSpace: 'pre',
        lineHeight: 1.1,
        willChange: 'transform, opacity',
      }}
    >
      {text}
    </div>
  )
}

function ImageSprite({
  src,
  x = 0,
  y = 0,
  width = 400,
  height = 300,
  entryDur = 0.6,
  exitDur = 0.4,
  kenBurns = false,
  kenBurnsScale = 1.08,
  radius = 12,
  fit = 'cover',
  placeholder = null,
}) {
  const { localTime, duration } = useSprite()
  const exitStart = Math.max(0, duration - exitDur)
  let opacity = 1
  let scale = 1
  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1))
    opacity = t
    scale = 0.96 + 0.04 * t
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1))
    opacity = 1 - t
    scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur
    const holdT = holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0
    scale = 1 + (kenBurnsScale - 1) * holdT
  }
  const content = placeholder ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
        color: '#6b6458',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 13,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {placeholder.label || 'image'}
    </div>
  ) : (
    <img
      src={src}
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: fit,
        display: 'block',
      }}
    />
  )
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        borderRadius: radius,
        overflow: 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      {content}
    </div>
  )
}

function RectSprite({
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  color = '#111',
  radius = 8,
  entryDur = 0.4,
  exitDur = 0.3,
  render,
}) {
  const spriteCtx = useSprite()
  const { localTime, duration } = spriteCtx
  const exitStart = Math.max(0, duration - exitDur)
  let opacity = 1
  let scale = 1
  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1))
    opacity = clamp(localTime / entryDur, 0, 1)
    scale = 0.4 + 0.6 * t
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1))
    opacity = 1 - t
    scale = 1 - 0.15 * t
  }
  const overrides = render ? render(spriteCtx) : {}
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        background: color,
        borderRadius: radius,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        willChange: 'transform, opacity',
        ...overrides,
      }}
    />
  )
}

function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  children,
}) {
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0')
      return isFinite(v) ? clamp(v, 0, duration) : 0
    } catch {
      return 0
    }
  })
  const [playing, setPlaying] = React.useState(autoplay)
  const [hoverTime, setHoverTime] = React.useState(null)
  const [scale, setScale] = React.useState(1)
  const stageRef = React.useRef(null)
  const canvasRef = React.useRef(null)
  const rafRef = React.useRef(null)
  const lastTsRef = React.useRef(null)

  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey + ':t', String(time))
    } catch {}
  }, [time, persistKey])

  React.useEffect(() => {
    if (!stageRef.current) return
    const el = stageRef.current
    const measure = () => {
      const barH = 44
      const s = Math.min(
        el.clientWidth / width,
        (el.clientHeight - barH) / height
      )
      setScale(Math.max(0.05, s))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [width, height])

  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null
      return
    }
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      setTime((t) => {
        let next = t + dt
        if (next >= duration) {
          if (loop) next = next % duration
          else {
            next = duration
            setPlaying(false)
          }
        }
        return next
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
  }, [playing, duration, loop])

  React.useEffect(() => {
    const onKey = (e) => {
      if (
        e.target &&
        (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
      )
        return
      if (e.code === 'Space') {
        e.preventDefault()
        setPlaying((p) => !p)
      } else if (e.code === 'ArrowLeft') {
        setTime((t) => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration))
      } else if (e.code === 'ArrowRight') {
        setTime((t) => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration))
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [duration])

  const displayTime = hoverTime != null ? hoverTime : time
  const ctxValue = React.useMemo(
    () => ({ time: displayTime, duration, playing, setTime, setPlaying }),
    [displayTime, duration, playing]
  )

  return (
    <div
      ref={stageRef}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        <div
          ref={canvasRef}
          style={{
            width,
            height,
            background,
            position: 'relative',
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            flexShrink: 0,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          <TimelineContext.Provider value={ctxValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>
      <PlaybackBar
        time={displayTime}
        actualTime={time}
        duration={duration}
        playing={playing}
        onPlayPause={() => setPlaying((p) => !p)}
        onReset={() => {
          setTime(0)
        }}
        onSeek={(t) => setTime(t)}
        onHover={(t) => setHoverTime(t)}
      />
    </div>
  )
}

function PlaybackBar({
  time,
  duration,
  playing,
  onPlayPause,
  onReset,
  onSeek,
  onHover,
}) {
  const trackRef = React.useRef(null)
  const [dragging, setDragging] = React.useState(false)
  const timeFromEvent = React.useCallback(
    (e) => {
      const rect = trackRef.current.getBoundingClientRect()
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
      return x * duration
    },
    [duration]
  )
  const onTrackMove = (e) => {
    if (!trackRef.current) return
    const t = timeFromEvent(e)
    if (dragging) {
      onSeek(t)
    } else {
      onHover(t)
    }
  }
  const onTrackLeave = () => {
    if (!dragging) onHover(null)
  }
  const onTrackDown = (e) => {
    setDragging(true)
    const t = timeFromEvent(e)
    onSeek(t)
    onHover(null)
  }
  React.useEffect(() => {
    if (!dragging) return
    const onUp = () => setDragging(false)
    const onMove = (e) => {
      if (!trackRef.current) return
      const t = timeFromEvent(e)
      onSeek(t)
    }
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mousemove', onMove)
    }
  }, [dragging, timeFromEvent, onSeek])
  const pct = duration > 0 ? (time / duration) * 100 : 0
  const fmt = (t) => {
    const total = Math.max(0, t)
    const m = Math.floor(total / 60)
    const s = Math.floor(total % 60)
    const cs = Math.floor((total * 100) % 100)
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }
  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        background: 'rgba(20,20,20,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        width: '100%',
        maxWidth: 680,
        alignSelf: 'center',
        borderRadius: 8,
        color: '#f6f4ef',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <IconButton onClick={onReset} title="Return to start (0)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 2v10M12 2L5 7l7 5V2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </IconButton>
      <IconButton onClick={onPlayPause} title="Play/pause (space)">
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor" />
            <rect x="8" y="2" width="3" height="10" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor" />
          </svg>
        )}
      </IconButton>
      <div
        style={{
          fontFamily: mono,
          fontSize: 12,
          fontVariantNumeric: 'tabular-nums',
          width: 64,
          textAlign: 'right',
          color: '#f6f4ef',
        }}
      >
        {fmt(time)}
      </div>
      <div
        ref={trackRef}
        onMouseMove={onTrackMove}
        onMouseLeave={onTrackLeave}
        onMouseDown={onTrackDown}
        style={{
          flex: 1,
          height: 22,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 4,
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: `${pct}%`,
            height: 4,
            background: 'oklch(72% 0.12 250)',
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${pct}%`,
            top: '50%',
            width: 12,
            height: 12,
            marginLeft: -6,
            marginTop: -6,
            background: '#fff',
            borderRadius: 6,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 12,
          fontVariantNumeric: 'tabular-nums',
          width: 64,
          textAlign: 'left',
          color: 'rgba(246,244,239,0.55)',
        }}
      >
        {fmt(duration)}
      </div>
    </div>
  )
}

function IconButton({ children, onClick, title }) {
  const [hover, setHover] = React.useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: '#f6f4ef',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  )
}

Object.assign(window, {
  Easing,
  interpolate,
  animate,
  clamp,
  TimelineContext,
  useTime,
  useTimeline,
  Sprite,
  SpriteContext,
  useSprite,
  TextSprite,
  ImageSprite,
  RectSprite,
  Stage,
  PlaybackBar,
})

// ═══════════════════════════════════════════════════════════════════════════
//  chmonitor v0.3 launch film — scenes  (redesign: "instrument / editorial")
// ═══════════════════════════════════════════════════════════════════════════
//
//  Design language, deliberately un-generic:
//   · flat near-black ground with a faint static engineering grid + registration
//     ticks — no breathing radial glow, no vignette.
//   · editorial system: numbered cues, a ruled kicker, tight display titles that
//     mask-reveal, flat monospace "spec" tags instead of glass pills.
//   · product chrome flattened — a single hairline window, live-refresh arc
//     instead of the traffic-light cliché.
//   · a persistent film rail (index · progress · domain) frames every cue.
//   · motion is confident, not bouncy: short travel, easeOutExpo, clip reveals.

const BG = '#0a0a0b'
const CARD = '#0e0e11'
const INK = '#f4f4f5'
const MUT = 'rgba(244,244,245,0.60)'
const FAINT = 'rgba(244,244,245,0.36)'
const GHOST = 'rgba(244,244,245,0.16)'
const LINE = 'rgba(244,244,245,0.10)'
const LINE2 = 'rgba(244,244,245,0.055)'
const AMBER = '#f97316'
const GREEN = '#10b981'
const SANS = "'Space Grotesk', system-ui, -apple-system, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace"

const R = (id, path) =>
  (typeof window !== 'undefined' &&
    window.__resources &&
    window.__resources[id]) ||
  path

const lerp = (a, b, t) => a + (b - a) * t

// fade-up
const fu = (lt, delay, dur = 0.5, dist = 14) => {
  const t = clamp((lt - delay) / dur, 0, 1)
  const e = Easing.easeOutCubic(t)
  return { opacity: t, transform: `translateY(${(1 - e) * dist}px)` }
}
const enter = (lt, dur = 0.5) => Easing.easeOutExpo(clamp(lt / dur, 0, 1))

function Scene({ start, end, children }) {
  const { time } = useTimeline()
  if (time < start || time > end) return null
  const lt = time - start
  const rem = end - time
  const opacity = Math.min(clamp(lt / 0.28, 0, 1), clamp(rem / 0.28, 0, 1))
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {typeof children === 'function' ? children(lt, end - start) : children}
    </div>
  )
}

// ── ground: flat, with a faint static measurement grid + corner ticks ────────
function Backdrop() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            `linear-gradient(${LINE2} 1px, transparent 1px),` +
            `linear-gradient(90deg, ${LINE2} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(130% 120% at 50% 46%, #000 42%, transparent 92%)',
          WebkitMaskImage:
            'radial-gradient(130% 120% at 50% 46%, #000 42%, transparent 92%)',
        }}
      />
      {/* one restrained warm wash, low + flat (not a glowing orb) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(1200px 520px at 50% -8%, rgba(249,115,22,0.06), transparent 60%)',
        }}
      />
    </div>
  )
}

function LogoBars({ size = 64, t = 1 }) {
  const bars = [
    { x: 9.3, y: 19.05, h: 15.45 },
    { x: 14.7, y: 9.5, h: 25 },
    { x: 20.1, y: 19.25, h: 15.25 },
    { x: 25.5, y: 12.25, h: 22.25 },
    { x: 30.9, y: 22.8, h: 11.7 },
  ]
  const cap = { x: 9.3, y: 15.75, h: 3.3 }
  const grow = (i) => Easing.easeOutCubic(clamp((t - i * 0.07) / 0.55, 0, 1))
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" style={{ display: 'block' }}>
      {bars.map((b, i) => {
        const g = grow(i)
        const bottom = b.y + b.h
        return (
          <rect key={i} x={b.x} width={3.8} rx={0.7} y={bottom - b.h * g} height={b.h * g} fill={AMBER} />
        )
      })}
      {(() => {
        const g = grow(5)
        const bottom = cap.y + cap.h
        return <rect x={cap.x} width={3.8} rx={0.7} y={bottom - cap.h * g} height={cap.h * g} fill={GREEN} />
      })()}
    </svg>
  )
}

const LAND = {
  portrait: false,
  W: 1920,
  H: 1080,
  panel: { left: 120, width: 600, vcenter: true },
  frame: { x: 772, y: 150, w: 1028 },
  labelSize: 19,
  titleSize: 84,
  lineSize: 28,
  lineMax: 560,
  chipSize: 15,
}
const PORT = {
  portrait: true,
  W: 1080,
  H: 1920,
  panel: { left: 88, top: 168, width: 904 },
  frame: { x: 52, y: 1010, w: 976 },
  labelSize: 22,
  titleSize: 100,
  lineSize: 36,
  lineMax: 860,
  chipSize: 20,
}

// ── flat monospace "spec" tag — replaces the glass pill ──────────────────────
function Tag({ text, color = AMBER, size = 15 }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.6),
        padding: `${Math.round(size * 0.5)}px ${Math.round(size * 0.78)}px`,
        borderRadius: 7,
        border: `1px solid ${LINE}`,
        background: 'rgba(244,244,245,0.02)',
        fontFamily: MONO,
        fontSize: size,
        fontWeight: 500,
        letterSpacing: '0.02em',
        color: INK,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: size * 0.44, height: size * 0.44, borderRadius: 2, background: color }} />
      {text}
    </span>
  )
}

// ── masked line reveal (title slides up from a clip) ─────────────────────────
function Reveal({ lt, delay = 0, dur = 0.6, children, style }) {
  const t = Easing.easeOutExpo(clamp((lt - delay) / dur, 0, 1))
  return (
    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em' }}>
      <span
        style={{
          display: 'block',
          transform: `translateY(${(1 - t) * 100}%)`,
          opacity: clamp(t * 1.4, 0, 1),
          ...style,
        }}
      >
        {children}
      </span>
    </span>
  )
}

function CaptionPanel({ lt, L, index, label, title, line, chips }) {
  const p = L.panel
  const container = p.vcenter
    ? { position: 'absolute', left: p.left, top: 0, bottom: 0, width: p.width, display: 'flex', flexDirection: 'column', justifyContent: 'center' }
    : { position: 'absolute', left: p.left, top: p.top, width: p.width, display: 'flex', flexDirection: 'column' }
  return (
    <div style={container}>
      {/* ruled kicker: index · rule · label */}
      <div style={{ ...fu(lt, 0.04, 0.5), display: 'flex', alignItems: 'center', gap: 14, marginBottom: L.portrait ? 30 : 26 }}>
        {index != null && (
          <span style={{ fontFamily: MONO, fontSize: L.labelSize, color: FAINT, letterSpacing: '0.05em' }}>
            {String(index).padStart(2, '0')}
          </span>
        )}
        <span style={{ width: 30, height: 2, background: AMBER, borderRadius: 2 }} />
        <span style={{ fontFamily: MONO, fontSize: L.labelSize, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER }}>
          {label}
        </span>
      </div>

      <div style={{ fontFamily: SANS, fontSize: L.titleSize, fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.035em', color: INK }}>
        {(Array.isArray(title) ? title : [title]).map((ln, i) => (
          <Reveal key={i} lt={lt} delay={0.14 + i * 0.08} dur={0.62}>{ln}</Reveal>
        ))}
      </div>

      <div style={{ ...fu(lt, 0.34, 0.55), fontFamily: SANS, fontSize: L.lineSize, fontWeight: 400, lineHeight: 1.46, color: MUT, marginTop: L.portrait ? 30 : 26, maxWidth: L.lineMax, textWrap: 'pretty' }}>
        {line}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.portrait ? 14 : 11, marginTop: L.portrait ? 44 : 34 }}>
        {chips.map((c, i) => (
          <div key={i} style={fu(lt, 0.52 + i * 0.1, 0.45, 8)}>
            <Tag text={c.text} color={c.color} size={L.chipSize} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── refresh arc — deterministic "live" motion in the window chrome ───────────
function RefreshArc({ time, size = 15, color = GREEN }) {
  const a = (time * 150) % 360
  const r = size / 2 - 1.5
  const c = size / 2
  const rad = (deg) => (deg * Math.PI) / 180
  const x0 = c + r * Math.cos(rad(a))
  const y0 = c + r * Math.sin(rad(a))
  const x1 = c + r * Math.cos(rad(a + 250))
  const y1 = c + r * Math.sin(rad(a + 250))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <path d={`M ${x0} ${y0} A ${r} ${r} 0 1 1 ${x1} ${y1}`} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// ── shared flat window chrome (hairline, no traffic-light dots) ──────────────
function Window({ lt, L, url, winH, top, right, children }) {
  const { x, w } = L.frame
  const e = enter(lt, 0.5)
  const barH = 44
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        width: w,
        height: winH,
        transform: `translateY(${(1 - e) * 26}px) scale(${lerp(0.985, 1, e)})`,
        transformOrigin: '50% 60%',
        opacity: clamp(e * 1.3, 0, 1),
        borderRadius: 14,
        overflow: 'hidden',
        background: CARD,
        border: `1px solid ${LINE}`,
        boxShadow: '0 44px 100px -46px rgba(0,0,0,0.92)',
      }}
    >
      <div style={{ height: barH, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', background: '#141417', borderBottom: `1px solid ${LINE2}` }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: GREEN, boxShadow: `0 0 0 3px rgba(16,185,129,0.14)` }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
            <rect x="5" y="11" width="14" height="9" rx="2" stroke={INK} strokeWidth="1.8" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={INK} strokeWidth="1.8" />
          </svg>
          <span style={{ fontFamily: MONO, fontSize: 14, color: 'rgba(244,244,245,0.62)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {url}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {right}
        </div>
      </div>
      <div style={{ position: 'absolute', top: barH, left: 0, right: 0, bottom: 0, overflow: 'hidden', background: '#fff' }}>
        {children}
      </div>
    </div>
  )
}

function Frame({ lt, L, url, url2, src, src2, swapAt }) {
  const { w } = L.frame
  const [aspect, setAspect] = React.useState(1.86)
  const barH = 44
  const winH = w / aspect + barH
  const top = L.portrait ? L.frame.y : Math.round((L.H - winH) / 2)
  const bOpacity = swapAt != null ? clamp((lt - (swapAt - 0.3)) / 0.5, 0, 1) : 0
  const shownUrl = url2 && swapAt != null && lt > swapAt ? url2 : url
  return (
    <Window
      lt={lt}
      L={L}
      url={shownUrl}
      winH={winH}
      top={top}
      right={<span style={{ fontFamily: MONO, fontSize: 12, color: FAINT, letterSpacing: '0.08em' }}>LIVE</span>}
    >
      <img
        src={src}
        alt=""
        onLoad={(e) => { const a = e.target.naturalWidth / e.target.naturalHeight; if (a) setAspect(a) }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center top', display: 'block' }}
      />
      {src2 && (
        <div style={{ position: 'absolute', inset: 0, opacity: bOpacity }}>
          <img src={src2} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center top', display: 'block' }} />
        </div>
      )}
    </Window>
  )
}

// plays a recorded clip; currentTime driven by scene clock (deterministic)
function VideoFrame({ lt, L, url, src, trim = 0, speed = 1 }) {
  const { w } = L.frame
  const vref = React.useRef(null)
  const [aspect, setAspect] = React.useState(1.78)
  const barH = 44
  const winH = w / aspect + barH
  const top = L.portrait ? L.frame.y : Math.round((L.H - winH) / 2)
  const target = Math.max(0, trim + lt * speed)
  React.useLayoutEffect(() => {
    const v = vref.current
    if (!v || !isFinite(target)) return
    const dur = v.duration || 0
    const tt = dur ? Math.min(target, dur - 0.04) : target
    if (Math.abs((v.currentTime || 0) - tt) > 0.004) {
      try { v.currentTime = tt } catch {}
    }
  })
  return (
    <Window
      lt={lt}
      L={L}
      url={url}
      winH={winH}
      top={top}
      right={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <RefreshArc time={lt} />
          <span style={{ fontFamily: MONO, fontSize: 12, color: FAINT, letterSpacing: '0.06em' }}>5s</span>
        </span>
      }
    >
      <video
        ref={vref}
        src={src}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => { const a = e.target.videoWidth / e.target.videoHeight; if (a) setAspect(a) }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center top', display: 'block' }}
      />
    </Window>
  )
}

// ── Alerts scene: rendered OS notifications (no screenshot needed) ───────────
function NotifCard({ lt, delay, title, body, sev }) {
  const e = Easing.easeOutExpo(clamp((lt - delay) / 0.6, 0, 1))
  const col = sev === 'crit' ? AMBER : GREEN
  return (
    <div
      style={{
        width: '100%',
        transform: `translateX(${(1 - e) * 46}px)`,
        opacity: clamp(e * 1.3, 0, 1),
        marginBottom: 18,
        display: 'flex',
        gap: 16,
        padding: '20px 22px',
        borderRadius: 18,
        background: 'rgba(20,20,23,0.86)',
        border: `1px solid ${LINE}`,
        backdropFilter: 'blur(6px)',
        boxShadow: '0 26px 60px -30px rgba(0,0,0,0.85)',
      }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 11, flexShrink: 0, background: 'rgba(249,115,22,0.12)', border: `1px solid ${LINE}`, display: 'grid', placeItems: 'center' }}>
        <LogoBars size={26} t={1} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: col }} />
          <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: FAINT }}>chmonitor</span>
          <span style={{ fontFamily: MONO, fontSize: 13, color: GHOST, marginLeft: 'auto' }}>now</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 600, color: INK, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontFamily: MONO, fontSize: 16, color: MUT, marginTop: 7 }}>{body}</div>
      </div>
    </div>
  )
}

function AlertsFrame({ lt, L }) {
  const { x, w } = L.frame
  const width = L.portrait ? w : 560
  const left = L.portrait ? x + (w - width) / 2 : x + 110
  return (
    <div style={{ position: 'absolute', left, top: 0, bottom: 0, width, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <NotifCard lt={lt} delay={0.35} sev="crit" title="High memory on clickhouse-1" body="mem 92% · threshold 85% · sustained 4m" />
      <NotifCard lt={lt} delay={0.62} sev="warn" title="Replication delay cleared" body="replica-2 · lag 0s · back in sync" />
    </div>
  )
}

// ── Intro ────────────────────────────────────────────────────────────────────
function countUp(lt, delay, target, dur = 1.0) {
  const t = Easing.easeOutExpo(clamp((lt - delay) / dur, 0, 1))
  return Math.round(target * t)
}

function IntroScene({ lt, L }) {
  const por = L.portrait
  const mark = por ? 176 : 150
  const word = por ? 150 : 132
  const t = clamp(lt / 1.2, 0, 1)
  const rule = Easing.easeInOutCubic(clamp((lt - 0.5) / 0.7, 0, 1))
  const stats = [
    { n: 20, suf: '', l: 'features', c: AMBER },
    { n: 120, suf: '+', l: 'fixes', c: INK },
    { n: 15, suf: '+', l: 'perf wins', c: INK },
    { n: 3, suf: '', l: 'breaking', c: INK },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 60px' }}>
      <div style={{ display: 'flex', flexDirection: por ? 'column' : 'row', alignItems: 'center', gap: por ? 26 : 30 }}>
        <LogoBars size={mark} t={t} />
        <div style={{ ...fu(lt, 0.5, 0.6, 16), display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <span style={{ fontFamily: SANS, fontSize: word, fontWeight: 700, letterSpacing: '-0.045em', color: INK, lineHeight: 1 }}>chmonitor</span>
          <span style={{ marginTop: por ? 6 : 8, fontFamily: MONO, fontSize: por ? 30 : 26, fontWeight: 500, color: AMBER, border: `1px solid rgba(249,115,22,0.4)`, background: 'rgba(249,115,22,0.08)', padding: '8px 15px', borderRadius: 9, letterSpacing: '0.02em' }}>v0.3</span>
        </div>
      </div>

      {/* drawn rule */}
      <div style={{ marginTop: por ? 40 : 34, width: por ? 460 : 520, height: 2, background: LINE, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${rule * 100}%`, background: AMBER }} />
      </div>

      <div style={{ ...fu(lt, 0.86, 0.5), marginTop: por ? 34 : 28, fontFamily: SANS, fontSize: por ? 40 : 34, fontWeight: 400, color: MUT, letterSpacing: '-0.01em' }}>
        A full rebuild. Here's what shipped.
      </div>

      <div style={{ ...fu(lt, 1.18, 0.5), display: 'flex', alignItems: 'flex-start', marginTop: por ? 60 : 50 }}>
        {stats.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, height: por ? 60 : 54, background: LINE, margin: por ? '0 36px' : '0 46px' }} />}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: SANS, fontSize: por ? 86 : 76, fontWeight: 700, letterSpacing: '-0.03em', color: s.c, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {countUp(lt, 1.2 + i * 0.05, s.n)}{s.suf}
              </div>
              <div style={{ fontFamily: MONO, fontSize: por ? 18 : 15, letterSpacing: '0.16em', textTransform: 'uppercase', color: FAINT, marginTop: 14 }}>{s.l}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ── Self-host ─────────────────────────────────────────────────────────────────
function PlatMark({ kind, size = 44 }) {
  const s = size
  if (kind === 'cf')
    return (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <path d="M32 30H13a6 6 0 0 1-.6-11.97A9 9 0 0 1 30 16.5a7 7 0 0 1 2 13.5z" stroke={AMBER} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M32 30l3.4 6" stroke={AMBER} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    )
  if (kind === 'docker')
    return (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {[0, 1, 2].map((c) => (
          <rect key={'a' + c} x={12 + c * 8} y={26} width="6.4" height="6.4" rx="1" stroke={INK} strokeWidth="2" />
        ))}
        {[0, 1, 2].map((c) => (
          <rect key={'b' + c} x={12 + c * 8} y={18} width="6.4" height="6.4" rx="1" stroke={INK} strokeWidth="2" />
        ))}
        <rect x={20} y={10} width="6.4" height="6.4" rx="1" stroke={INK} strokeWidth="2" />
        <path d="M9 33c3 2.4 8 2.6 12 1.2 6-2 8-6.4 8.6-9.2" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M24 7l14 6.6L41 29l-10 12.4H17L7 29l3-15.4z" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="4.4" stroke={INK} strokeWidth="2.4" />
      {[0, 72, 144, 216, 288].map((a) => {
        const r0 = 8.4, r1 = 13.5
        const rad = (a - 90) * Math.PI / 180
        return <line key={a} x1={24 + r0 * Math.cos(rad)} y1={24 + r0 * Math.sin(rad)} x2={24 + r1 * Math.cos(rad)} y2={24 + r1 * Math.sin(rad)} stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      })}
    </svg>
  )
}

function HostScene({ lt, L }) {
  const por = L.portrait
  const plats = [
    { name: 'Cloudflare Workers', sub: 'deploy to the edge', kind: 'cf' },
    { name: 'Docker', sub: 'one image · docker run', kind: 'docker' },
    { name: 'Kubernetes', sub: 'scale on your cluster', kind: 'k8s' },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 60px' }}>
      <div style={{ ...fu(lt, 0.04, 0.5), display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <span style={{ width: 30, height: 2, background: AMBER, borderRadius: 2 }} />
        <span style={{ fontFamily: MONO, fontSize: por ? 22 : 18, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER }}>Deploy anywhere</span>
        <span style={{ width: 30, height: 2, background: AMBER, borderRadius: 2 }} />
      </div>
      <div style={{ ...fu(lt, 0.14, 0.55), fontFamily: SANS, fontSize: por ? 82 : 66, fontWeight: 700, letterSpacing: '-0.035em', color: INK, marginBottom: por ? 40 : 34, textAlign: 'center' }}>
        Runs where you run.
      </div>
      <div style={{ display: 'flex', flexDirection: por ? 'column' : 'row', gap: por ? 22 : 26 }}>
        {plats.map((p, i) => {
          const e = enter(lt - (0.34 + i * 0.12), 0.5)
          return (
            <div
              key={i}
              style={{
                width: por ? 812 : 356,
                height: por ? 150 : 210,
                borderRadius: 16,
                padding: por ? '0 38px' : '32px',
                background: CARD,
                border: `1px solid ${LINE}`,
                display: 'flex',
                flexDirection: por ? 'row' : 'column',
                alignItems: por ? 'center' : 'flex-start',
                justifyContent: por ? 'flex-start' : 'space-between',
                gap: por ? 30 : 0,
                opacity: clamp(e * 1.3, 0, 1),
                transform: `translateY(${(1 - e) * 16}px)`,
              }}
            >
              <div style={{ width: por ? 68 : 72, height: por ? 68 : 72, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'rgba(244,244,245,0.03)', border: `1px solid ${LINE}` }}>
                <PlatMark kind={p.kind} size={por ? 42 : 46} />
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontSize: por ? 34 : 27, fontWeight: 600, color: INK, letterSpacing: '-0.02em' }}>{p.name}</div>
                <div style={{ fontFamily: MONO, fontSize: por ? 19 : 15, color: FAINT, marginTop: 9 }}>{p.sub}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ ...fu(lt, 0.9, 0.5), display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 13, marginTop: por ? 52 : 44 }}>
        <span style={{ fontFamily: MONO, fontSize: por ? 19 : 15, color: FAINT, letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>PLUGGABLE AUTH</span>
        <Tag text="none" color={FAINT} size={por ? 19 : 15} />
        <Tag text="Clerk" color={GREEN} size={por ? 19 : 15} />
        <Tag text="trusted proxy" color={AMBER} size={por ? 19 : 15} />
      </div>
    </div>
  )
}

function EndScene({ lt, L }) {
  const por = L.portrait
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 60px' }}>
      <div style={{ ...fu(lt, 0.04, 0.55), display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32 }}>
        <LogoBars size={por ? 68 : 58} t={1} />
        <span style={{ fontFamily: SANS, fontSize: por ? 58 : 54, fontWeight: 700, letterSpacing: '-0.035em', color: INK }}>chmonitor</span>
      </div>
      <div style={{ ...fu(lt, 0.2, 0.6), fontFamily: SANS, fontSize: por ? 94 : 112, fontWeight: 700, letterSpacing: '-0.05em', color: INK, lineHeight: 1 }}>
        chmonitor.dev
      </div>
      <div style={{ ...fu(lt, 0.4, 0.55), marginTop: 36, display: 'flex', flexDirection: por ? 'column' : 'row', alignItems: 'center', gap: por ? 20 : 18 }}>
        <span style={{ fontFamily: MONO, fontSize: por ? 20 : 17, fontWeight: 500, color: GREEN, border: `1px solid rgba(16,185,129,0.4)`, background: 'rgba(16,185,129,0.08)', padding: '9px 16px', borderRadius: 999, letterSpacing: '0.02em' }}>
          v0.3 — out now
        </span>
        <span style={{ fontFamily: MONO, fontSize: por ? 20 : 17, color: MUT }}>github.com/chmonitor/chmonitor</span>
      </div>
    </div>
  )
}

// ── montage: cycles screenshots inside the same window chrome ────────────────
function MontageScene({ lt, L, index }) {
  const { w } = L.frame
  const shots = [
    { src: R('gExpensive', 'shots/g-expensive.png'), url: 'dash.chmonitor.dev/queries/expensive' },
    { src: R('mcpServer', 'shots/mcp-server.png'), url: 'dash.chmonitor.dev/operations/mcp-server' },
    { src: R('gRunning', 'shots/g-running.png'), url: 'dash.chmonitor.dev/overview' },
    { src: R('heroHealth', 'shots/hero-health.png'), url: 'dash.chmonitor.dev/health' },
    { src: R('dxQuery', 'shots/data-explorer-query.png'), url: 'dash.chmonitor.dev/tables/data-explorer' },
  ]
  const per = 0.46
  const idx = clamp(Math.floor((lt - 0.2) / per), 0, shots.length - 1)
  const cur = shots[idx]
  const barH = 44
  const winH = w / 1.86 + barH
  const top = L.portrait ? L.frame.y : Math.round((L.H - winH) / 2)
  return (
    <>
      <CaptionPanel
        lt={lt}
        L={L}
        index={index}
        label="And a lot more"
        title={['15+ pages.', '71 charts.']}
        line="Expensive & slow queries, the MCP server, backups, storage, replication and page-view analytics."
        chips={[{ text: 'Expensive queries', color: AMBER }, { text: 'Replication', color: GREEN }, { text: 'Storage', color: AMBER }]}
      />
      <Window lt={lt} L={L} url={cur.url} winH={winH} top={top} right={<span style={{ fontFamily: MONO, fontSize: 12, color: FAINT, letterSpacing: '0.08em' }}>LIVE</span>}>
        <img key={idx} src={cur.src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center top', display: 'block' }} />
        <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {shots.map((sh, i) => <img key={i} src={sh.src} alt="" />)}
        </div>
      </Window>
    </>
  )
}

// ── render contract ───────────────────────────────────────────────────────────
function ScreenClock() {
  const tl = useTimeline()
  React.useEffect(() => {
    window.__seek = (t) => { tl.setPlaying(false); tl.setTime(t) }
    window.__play = () => tl.setPlaying(true)
  }, [tl])
  return <div data-screen-label={`t=${Math.floor(tl.time)}s`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
}

// ── persistent film rail (index · progress · domain) ─────────────────────────
function FilmRail({ total, cues }) {
  const time = useTime()
  const idx = cues.filter((c) => time >= c.start).length
  const featureIdx = cues.filter((c) => c.numbered && time >= c.start).length
  const featureTotal = cues.filter((c) => c.numbered).length
  const cur = cues[Math.max(0, idx - 1)]
  const showBrand = cur && cur.kind !== 'intro' && cur.kind !== 'end'
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* top-left brand */}
      <div style={{ position: 'absolute', left: 60, top: 46, display: 'flex', alignItems: 'center', gap: 12, opacity: showBrand ? 1 : 0, transition: 'opacity 0.3s' }}>
        <LogoBars size={26} t={1} />
        <span style={{ fontFamily: SANS, fontSize: 21, fontWeight: 700, letterSpacing: '-0.03em', color: INK }}>chmonitor</span>
        <span style={{ fontFamily: MONO, fontSize: 13, color: FAINT, letterSpacing: '0.06em', marginTop: 2 }}>v0.3</span>
      </div>
      {/* top-right cue counter */}
      <div style={{ position: 'absolute', right: 60, top: 48, fontFamily: MONO, fontSize: 15, letterSpacing: '0.1em', color: showBrand ? FAINT : 'transparent', transition: 'color 0.3s' }}>
        {String(Math.max(1, featureIdx)).padStart(2, '0')} / {String(featureTotal).padStart(2, '0')}
      </div>
      {/* bottom rail */}
      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 44, display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontFamily: MONO, fontSize: 13, color: FAINT, letterSpacing: '0.06em' }}>chmonitor.dev</span>
        <div style={{ flex: 1, height: 2, background: LINE, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${clamp(time / total, 0, 1) * 100}%`, background: AMBER }} />
        </div>
        <span style={{ fontFamily: MONO, fontSize: 13, color: FAINT, letterSpacing: '0.06em' }}>the clickhouse dashboard</span>
      </div>
    </div>
  )
}

// ── timeline (data-driven) ────────────────────────────────────────────────────
function buildCues(L) {
  // each: { dur, kind, numbered, render(lt, index) }
  const defs = [
    { dur: 3.0, kind: 'intro', render: (lt) => <IntroScene lt={lt} L={L} /> },
    {
      dur: 2.35, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="The dashboard" title={['Rebuilt on', 'TanStack Start.']} line="71 charts, instant. Warm loads come straight from the edge cache — no more spinner tax." chips={[{ text: 'TanStack Start', color: AMBER }, { text: 'Edge-cached', color: GREEN }, { text: '71 live charts', color: AMBER }]} />
        <VideoFrame lt={lt} L={L} url="dash.chmonitor.dev/overview" src="clips/overview.mp4" trim={0} speed={1} />
      </>),
    },
    {
      dur: 2.25, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="AI agent · new" title="Ask your cluster anything." line="Analyze, optimize and surface insight in plain English — over MCP, with any model you bring." chips={[{ text: 'Analyze', color: AMBER }, { text: 'Optimize', color: GREEN }, { text: 'Any LLM', color: AMBER }]} />
        <Frame lt={lt} L={L} url="dash.chmonitor.dev/ai-agent" src={R('agentChat', 'shots/agent-chat.png')} />
      </>),
    },
    {
      dur: 2.35, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="Query monitoring" title="Watch every query, live." line="Running, slow and failed queries — memory, rows and progress, refreshing every 5 seconds." chips={[{ text: 'Live · 5s', color: GREEN }, { text: 'Kill & EXPLAIN', color: AMBER }, { text: 'Per-user', color: GREEN }]} />
        <VideoFrame lt={lt} L={L} url="dash.chmonitor.dev/queries/running" src="clips/queries.mp4" trim={0} speed={1} />
      </>),
    },
    {
      dur: 2.35, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="SQL console · new" title="Query your data, directly." line="Multi-statement results, a database tree and a live dependency map — read-only safe, results in milliseconds." chips={[{ text: 'Multi-query', color: AMBER }, { text: 'DB tree', color: GREEN }, { text: 'Dependency graph', color: AMBER }]} />
        <VideoFrame lt={lt} L={L} url="dash.chmonitor.dev/tables/data-explorer" src="clips/explorer.mp4" trim={0} speed={1} />
      </>),
    },
    {
      dur: 2.2, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="AI insights · new" title="Issues, surfaced for you." line="Anomalies, slow patterns and regressions — detected automatically and ranked by severity." chips={[{ text: 'Anomaly detection', color: AMBER }, { text: 'Severity-ranked', color: GREEN }, { text: 'Auto-refresh', color: AMBER }]} />
        <Frame lt={lt} L={L} url="dash.chmonitor.dev/insights" src={R('gInsights', 'shots/g-insights.png')} />
      </>),
    },
    {
      dur: 2.25, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="Alerts · new" title="Know before it breaks." line="Threshold alerts land as browser notifications — on out of the box, no webhook wiring required." chips={[{ text: 'Browser push', color: AMBER }, { text: 'On by default', color: GREEN }, { text: 'Opt-out', color: AMBER }]} />
        <AlertsFrame lt={lt} L={L} />
      </>),
    },
    {
      dur: 2.1, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="Metrics & profiler" title="Every server metric." line="CPU, memory and IO with ClickHouse profiler events — charted over time, down to the function." chips={[{ text: 'CPU · mem · IO', color: AMBER }, { text: 'Profiler events', color: GREEN }, { text: 'Time-series', color: AMBER }]} />
        <Frame lt={lt} L={L} url="dash.chmonitor.dev/metrics" src={R('gMetrics', 'shots/g-metrics.png')} />
      </>),
    },
    {
      dur: 2.1, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="Query EXPLAIN" title="See the query plan." line="Visualize EXPLAIN as a tree — spot full scans, missing indexes and where the time goes." chips={[{ text: 'EXPLAIN tree', color: AMBER }, { text: 'Spot full scans', color: GREEN }, { text: 'One click', color: AMBER }]} />
        <Frame lt={lt} L={L} url="dash.chmonitor.dev/queries/explain" src={R('gExplain', 'shots/g-explain.png')} />
      </>),
    },
    {
      dur: 2.1, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="Cluster topology" title="See the whole cluster." line="Nodes, shards, replicas and the Keeper quorum — live, with health on every link." chips={[{ text: 'Keeper quorum', color: GREEN }, { text: 'Replication', color: AMBER }, { text: 'Per-node health', color: GREEN }]} />
        <Frame lt={lt} L={L} url="dash.chmonitor.dev/cluster/topology" src={R('heroTopology', 'shots/hero-topology.png')} />
      </>),
    },
    {
      dur: 2.3, kind: 'scene', numbered: true,
      render: (lt, i) => (<>
        <CaptionPanel lt={lt} L={L} index={i} label="Health & audit" title="Catch issues early." line="Color-coded health across the cluster — then hand a ready-made audit prompt to your agent." chips={[{ text: 'Color-coded', color: GREEN }, { text: 'Thresholds', color: AMBER }, { text: 'Agent-ready', color: GREEN }]} />
        <Frame lt={lt} L={L} url="dash.chmonitor.dev/health" url2="dash.chmonitor.dev/health/audit" src={R('healthSummary', 'shots/health-summary.png')} src2={R('healthAudit', 'shots/health-audit.png')} swapAt={1.2} />
      </>),
    },
    { dur: 2.4, kind: 'scene', numbered: true, render: (lt, i) => <MontageScene lt={lt} L={L} index={i} /> },
    { dur: 2.4, kind: 'host', render: (lt) => <HostScene lt={lt} L={L} /> },
    { dur: 2.9, kind: 'end', render: (lt) => <EndScene lt={lt} L={L} /> },
  ]
  const OVERLAP = 0.15
  let cursor = 0
  let n = 0
  const cues = defs.map((d) => {
    const start = cursor
    const end = start + d.dur
    cursor = end - OVERLAP
    const numbered = !!d.numbered
    const index = numbered ? ++n : null
    return { ...d, start, end, numbered, index }
  })
  const total = cues[cues.length - 1].end
  return { cues, total }
}

function Video({ orientation }) {
  const L = orientation === 'portrait' ? PORT : LAND
  const { cues, total } = React.useMemo(() => buildCues(L), [orientation])
  React.useEffect(() => { window.__duration = total }, [total])
  return (
    <Stage width={L.W} height={L.H} duration={total} background={BG} persistKey={'chmv03_' + (L.portrait ? 'p' : 'l')}>
      <Backdrop />
      <ScreenClock />
      {cues.map((c, i) => (
        <Scene key={i} start={c.start} end={c.end}>
          {(lt) => c.render(lt, c.index)}
        </Scene>
      ))}
      <FilmRail total={total} cues={cues} />
    </Stage>
  )
}

window.Video = Video

const __root = ReactDOM.createRoot(document.getElementById('app'));
__root.render(React.createElement(window.Video, { orientation: 'landscape' }));
