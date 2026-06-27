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
  font = 'Inter, system-ui, sans-serif',
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
        fontFamily: 'Inter, system-ui, sans-serif',
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
        fontFamily: 'Inter, system-ui, sans-serif',
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
//  chmonitor v0.3 launch film — scenes
// ═══════════════════════════════════════════════════════════════════════════

const BG = '#09090b'
const INK = '#fafafa'
const MUT = 'rgba(250,250,250,0.62)'
const FAINT = 'rgba(250,250,250,0.40)'
const ORANGE = '#f97316'
const GREEN = '#10b981'
const SANS = "'Inter', system-ui, -apple-system, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace"

const R = (id, path) =>
  (typeof window !== 'undefined' &&
    window.__resources &&
    window.__resources[id]) ||
  path

const lerp = (a, b, t) => a + (b - a) * t
const fu = (lt, delay, dur = 0.5, dist = 16) => {
  const t = clamp((lt - delay) / dur, 0, 1)
  const e = Easing.easeOutCubic(t)
  return { opacity: t, transform: `translateY(${(1 - e) * dist}px)` }
}

function Scene({ start, end, children }) {
  const { time } = useTimeline()
  if (time < start || time > end) return null
  const lt = time - start
  const rem = end - time
  const opacity = Math.min(clamp(lt / 0.3, 0, 1), clamp(rem / 0.3, 0, 1))
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {typeof children === 'function' ? children(lt, end - start) : children}
    </div>
  )
}

function Backdrop() {
  const time = useTime()
  const dx = Math.sin(time * 0.18) * 60
  const dy = Math.cos(time * 0.14) * 50
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: BG,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -200,
          background: `radial-gradient(680px 520px at ${78 + dx / 18}% ${14 + dy / 30}%, rgba(249,115,22,0.16), transparent 60%),
                     radial-gradient(720px 560px at ${16 - dx / 22}% ${88 - dy / 26}%, rgba(16,185,129,0.12), transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)',
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
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      style={{ display: 'block' }}
    >
      {bars.map((b, i) => {
        const g = grow(i)
        const bottom = b.y + b.h
        return (
          <rect
            key={i}
            x={b.x}
            width={3.8}
            rx={0.7}
            y={bottom - b.h * g}
            height={b.h * g}
            fill={ORANGE}
          />
        )
      })}
      {(() => {
        const g = grow(5)
        const bottom = cap.y + cap.h
        return (
          <rect
            x={cap.x}
            width={3.8}
            rx={0.7}
            y={bottom - cap.h * g}
            height={cap.h * g}
            fill={GREEN}
          />
        )
      })()}
    </svg>
  )
}

const LAND = {
  portrait: false,
  W: 1920,
  H: 1080,
  panel: { left: 116, width: 560, vcenter: true },
  frame: { x: 712, y: 150, w: 1108 },
  labelSize: 18,
  titleSize: 70,
  lineSize: 25,
  lineMax: 520,
  chipSize: 18,
}
const PORT = {
  portrait: true,
  W: 1080,
  H: 1920,
  panel: { left: 80, top: 150, width: 920 },
  frame: { x: 40, y: 1000, w: 1000 },
  labelSize: 24,
  titleSize: 104,
  lineSize: 38,
  lineMax: 900,
  chipSize: 26,
}

function ShotImg({ src }) {
  return (
    <img
      src={src}
      alt=""
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center top',
        display: 'block',
      }}
    />
  )
}

function Frame({ lt, L, url, url2, src, src2, swapAt }) {
  const { x, y, w } = L.frame
  const [aspect, setAspect] = React.useState(1.78)
  const ent = Easing.easeOutCubic(clamp(lt / 0.4, 0, 1))
  const wY = lerp(22, 0, ent)
  const barH = 48
  const contentH = w / aspect
  const winH = contentH + barH
  const top = L.portrait ? y : Math.round((L.H - winH) / 2)
  const swap = swapAt != null ? swapAt : null
  const bOpacity = swap != null ? clamp((lt - (swap - 0.3)) / 0.55, 0, 1) : 0
  const shownUrl = url2 && swap != null && lt > swap ? url2 : url
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        width: w,
        height: winH,
        transform: `translateY(${wY}px)`,
        opacity: ent,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#0f0f11',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow:
          '0 54px 140px -30px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.03)',
      }}
    >
      <div
        style={{
          height: barH,
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '0 20px',
          background: 'linear-gradient(#1a1a1d,#161618)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#ff5f57',
          }}
        />
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#febc2e',
          }}
        />
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#28c840',
          }}
        />
        <div
          style={{
            marginLeft: 16,
            height: 30,
            flex: 1,
            maxWidth: 520,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '0 14px',
            fontFamily: MONO,
            fontSize: 14,
            color: 'rgba(250,250,250,0.6)',
          }}
        >
          <span
            style={{ width: 6, height: 6, borderRadius: 3, background: GREEN }}
          />
          {shownUrl}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: barH,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        <img
          src={src}
          alt=""
          onLoad={(e) => {
            const a = e.target.naturalWidth / e.target.naturalHeight
            if (a) setAspect(a)
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
        {src2 && (
          <div style={{ position: 'absolute', inset: 0, opacity: bOpacity }}>
            <ShotImg src={src2} />
          </div>
        )}
      </div>
    </div>
  )
}

// Like Frame, but plays a recorded clip whose currentTime is driven by the
// scene clock (deterministic, seek-safe). videoTime = trim + lt * speed.
function VideoFrame({ lt, L, url, src, trim = 0, speed = 1 }) {
  const { x, y, w } = L.frame
  const vref = React.useRef(null)
  const [aspect, setAspect] = React.useState(1.78)
  const ent = Easing.easeOutCubic(clamp(lt / 0.4, 0, 1))
  const wY = lerp(22, 0, ent)
  const barH = 48
  const contentH = w / aspect
  const winH = contentH + barH
  const top = L.portrait ? y : Math.round((L.H - winH) / 2)
  const target = Math.max(0, trim + lt * speed)
  React.useLayoutEffect(() => {
    const v = vref.current
    if (!v || !isFinite(target)) return
    const dur = v.duration || 0
    const tt = dur ? Math.min(target, dur - 0.04) : target
    if (Math.abs((v.currentTime || 0) - tt) > 0.004) {
      try {
        v.currentTime = tt
      } catch {}
    }
  })
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        width: w,
        height: winH,
        transform: `translateY(${wY}px)`,
        opacity: ent,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#0f0f11',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow:
          '0 54px 140px -30px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.03)',
      }}
    >
      <div
        style={{
          height: barH,
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '0 20px',
          background: 'linear-gradient(#1a1a1d,#161618)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#ff5f57',
          }}
        />
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#febc2e',
          }}
        />
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#28c840',
          }}
        />
        <div
          style={{
            marginLeft: 16,
            height: 30,
            flex: 1,
            maxWidth: 520,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '0 14px',
            fontFamily: MONO,
            fontSize: 14,
            color: 'rgba(250,250,250,0.6)',
          }}
        >
          <span
            style={{ width: 6, height: 6, borderRadius: 3, background: GREEN }}
          />
          {url}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: barH,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        <video
          ref={vref}
          src={src}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const a = e.target.videoWidth / e.target.videoHeight
            if (a) setAspect(a)
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}

function Pill({ text, color, size = 18, style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        padding: `${Math.round(size * 0.5)}px ${Math.round(size * 0.85)}px`,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.045)',
        border: '1px solid rgba(255,255,255,0.10)',
        fontFamily: SANS,
        fontSize: size,
        fontWeight: 500,
        color: INK,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: 99,
          background: color || ORANGE,
        }}
      />
      {text}
    </span>
  )
}

function CaptionPanel({ lt, L, label, title, line, chips }) {
  const p = L.panel
  const container = p.vcenter
    ? {
        position: 'absolute',
        left: p.left,
        top: 0,
        bottom: 0,
        width: p.width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }
    : {
        position: 'absolute',
        left: p.left,
        top: p.top,
        width: p.width,
        display: 'flex',
        flexDirection: 'column',
      }
  return (
    <div style={container}>
      <div
        style={{
          ...fu(lt, 0.05, 0.5),
          fontFamily: MONO,
          fontSize: L.labelSize,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: ORANGE,
          marginBottom: L.portrait ? 26 : 22,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...fu(lt, 0.16, 0.55),
          fontFamily: SANS,
          fontSize: L.titleSize,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: '-0.03em',
          color: INK,
          textWrap: 'balance',
        }}
      >
        {title}
      </div>
      <div
        style={{
          ...fu(lt, 0.3, 0.55),
          fontFamily: SANS,
          fontSize: L.lineSize,
          fontWeight: 400,
          lineHeight: 1.42,
          color: MUT,
          marginTop: L.portrait ? 30 : 26,
          maxWidth: L.lineMax,
          textWrap: 'pretty',
        }}
      >
        {line}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: L.portrait ? 16 : 13,
          marginTop: L.portrait ? 44 : 36,
        }}
      >
        {chips.map((c, i) => (
          <div key={i} style={fu(lt, 0.5 + i * 0.12, 0.45, 10)}>
            <Pill text={c.text} color={c.color} size={L.chipSize} />
          </div>
        ))}
      </div>
    </div>
  )
}

function IntroScene({ lt, L }) {
  const t = clamp(lt / 1.25, 0, 1)
  const por = L.portrait
  const mark = por ? 168 : 150
  const word = por ? 150 : 130
  const tag = por ? 34 : 26
  const stats = [
    { n: '8', l: 'features', c: ORANGE },
    { n: '70+', l: 'fixes', c: GREEN },
    { n: '13', l: 'perf wins', c: ORANGE },
    { n: '3', l: 'breaking', c: GREEN },
  ]
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 60px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: por ? 'column' : 'row',
          alignItems: 'center',
          gap: por ? 28 : 26,
        }}
      >
        <LogoBars size={mark} t={t} />
        <div
          style={{
            ...fu(lt, 0.55, 0.6, 18),
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: word,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: INK,
              lineHeight: 1,
            }}
          >
            chmonitor
          </span>
          <span
            style={{
              marginTop: por ? 6 : 8,
              fontFamily: MONO,
              fontSize: por ? 28 : 24,
              fontWeight: 500,
              color: '#fff',
              background: ORANGE,
              padding: '8px 15px',
              borderRadius: 11,
              letterSpacing: '0.01em',
            }}
          >
            v0.3
          </span>
        </div>
      </div>
      <div
        style={{
          ...fu(lt, 0.78, 0.5),
          marginTop: por ? 38 : 32,
          fontFamily: SANS,
          fontSize: tag,
          fontWeight: 400,
          color: MUT,
          letterSpacing: '-0.01em',
        }}
      >
        A full rebuild — here's what landed.
      </div>
      <div
        style={{
          ...fu(lt, 1.12, 0.5),
          display: 'flex',
          alignItems: 'center',
          marginTop: por ? 58 : 48,
        }}
      >
        {stats.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div
                style={{
                  width: 1,
                  height: por ? 58 : 50,
                  background: 'rgba(255,255,255,0.13)',
                  margin: por ? '0 38px' : '0 44px',
                }}
              />
            )}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: por ? 74 : 62,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: s.c,
                  lineHeight: 1,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: por ? 17 : 15,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: FAINT,
                  marginTop: 11,
                }}
              >
                {s.l}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function Glyph({ kind, color, size = 44 }) {
  const c = color
  if (kind === 'hex')
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <path
          d="M20 3l14.7 8.5v17L20 37 5.3 28.5v-17z"
          fill="none"
          stroke={c}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>
    )
  if (kind === 'square')
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect
          x="5"
          y="5"
          width="30"
          height="30"
          rx="5"
          fill="none"
          stroke={c}
          strokeWidth="2.4"
        />
      </svg>
    )
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15" fill="none" stroke={c} strokeWidth="2.4" />
    </svg>
  )
}

function HostScene({ lt, L }) {
  const por = L.portrait
  const plats = [
    {
      name: 'Cloudflare Workers',
      sub: 'deploy to the edge',
      icon: R('iconCF', 'https://cdn.simpleicons.org/cloudflareworkers/F38020'),
      color: ORANGE,
    },
    {
      name: 'Docker',
      sub: 'one image · docker run',
      icon: R('iconDocker', 'https://cdn.simpleicons.org/docker/2496ED'),
      color: '#2496ED',
    },
    {
      name: 'Kubernetes',
      sub: 'scale on your cluster',
      icon: R('iconK8s', 'https://cdn.simpleicons.org/kubernetes/326CE5'),
      color: '#326CE5',
    },
  ]
  const sz = por ? 56 : 46
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 60px',
      }}
    >
      <div
        style={{
          ...fu(lt, 0.05, 0.5),
          fontFamily: MONO,
          fontSize: por ? 22 : 18,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: ORANGE,
          marginBottom: 16,
        }}
      >
        SELF-HOST ANYWHERE
      </div>
      <div
        style={{
          ...fu(lt, 0.14, 0.55),
          fontFamily: SANS,
          fontSize: por ? 80 : 64,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: INK,
          marginBottom: por ? 30 : 24,
          textAlign: 'center',
        }}
      >
        Runs where you run.
      </div>
      <div
        style={{
          ...fu(lt, 0.28, 0.5),
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          marginBottom: por ? 44 : 38,
        }}
      >
        <LogoBars size={por ? 34 : 30} t={1} />
        <span
          style={{
            fontFamily: SANS,
            fontSize: por ? 26 : 23,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: INK,
          }}
        >
          chmonitor
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: por ? 18 : 15,
            color: FAINT,
            marginLeft: 6,
            whiteSpace: 'nowrap',
          }}
        >
          deploys to ↓
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: por ? 'column' : 'row',
          gap: por ? 24 : 30,
        }}
      >
        {plats.map((p, i) => {
          const e = clamp(
            Easing.easeOutBack(clamp((lt - (0.5 + i * 0.13)) / 0.55, 0, 1)),
            0,
            1
          )
          return (
            <div
              key={i}
              style={{
                width: por ? 820 : 350,
                height: por ? 152 : 218,
                borderRadius: 20,
                padding: por ? '0 40px' : '34px',
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.10)',
                display: 'flex',
                flexDirection: por ? 'row' : 'column',
                alignItems: por ? 'center' : 'flex-start',
                justifyContent: por ? 'flex-start' : 'space-between',
                gap: por ? 32 : 0,
                opacity: e,
                transform: `scale(${lerp(0.9, 1, e)}) translateY(${(1 - e) * 14}px)`,
                boxShadow: '0 30px 70px -30px rgba(0,0,0,0.7)',
              }}
            >
              <div
                style={{
                  width: sz + 22,
                  height: sz + 22,
                  borderRadius: 14,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <img
                  src={p.icon}
                  alt={p.name}
                  width={sz}
                  height={sz}
                  style={{ display: 'block' }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: por ? 36 : 28,
                    fontWeight: 600,
                    color: INK,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: por ? 20 : 15,
                    color: FAINT,
                    marginTop: 9,
                  }}
                >
                  {p.sub}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div
        style={{
          ...fu(lt, 1.0, 0.5),
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 15,
          marginTop: por ? 56 : 48,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: por ? 20 : 16,
            color: FAINT,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          CONFIGURABLE AUTH
        </span>
        <Pill text="none" color={FAINT} size={por ? 20 : 16} />
        <Pill text="Clerk" color={GREEN} size={por ? 20 : 16} />
        <Pill text="proxy" color={ORANGE} size={por ? 20 : 16} />
      </div>
    </div>
  )
}

function EndScene({ lt, L }) {
  const por = L.portrait
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 60px',
      }}
    >
      <div
        style={{
          ...fu(lt, 0.05, 0.55),
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 32,
        }}
      >
        <LogoBars size={por ? 64 : 56} t={1} />
        <span
          style={{
            fontFamily: SANS,
            fontSize: por ? 56 : 50,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: INK,
          }}
        >
          chmonitor
        </span>
      </div>
      <div
        style={{
          ...fu(lt, 0.22, 0.6),
          fontFamily: SANS,
          fontSize: por ? 96 : 116,
          fontWeight: 700,
          letterSpacing: '-0.045em',
          color: INK,
          lineHeight: 1,
        }}
      >
        chmonitor.dev
      </div>
      <div
        style={{
          ...fu(lt, 0.42, 0.55),
          marginTop: 34,
          display: 'flex',
          flexDirection: por ? 'column' : 'row',
          alignItems: 'center',
          gap: por ? 22 : 18,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: por ? 22 : 18,
            fontWeight: 600,
            color: '#062f22',
            background: GREEN,
            padding: '10px 18px',
            borderRadius: 999,
          }}
        >
          v0.3 — out now
        </span>
        <span style={{ fontFamily: MONO, fontSize: por ? 21 : 18, color: MUT }}>
          github.com/duyet/clickhouse-monitoring
        </span>
      </div>
    </div>
  )
}

function ScreenClock() {
  const tl = useTimeline()
  React.useEffect(() => {
    window.__seek = (t) => {
      tl.setPlaying(false)
      tl.setTime(t)
    }
    window.__play = () => tl.setPlaying(true)
  }, [tl])
  return (
    <div
      data-screen-label={`t=${Math.floor(tl.time)}s`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  )
}

function MontageFrame({ lt, L, shots }) {
  const { x, y, w } = L.frame
  const ent = Easing.easeOutCubic(clamp(lt / 0.4, 0, 1))
  const wY = lerp(22, 0, ent)
  const barH = 48
  const aspect = 1.85
  const contentH = w / aspect
  const winH = contentH + barH
  const top = L.portrait ? y : Math.round((L.H - winH) / 2)
  const per = 0.5
  const idx = clamp(Math.floor((lt - 0.25) / per), 0, shots.length - 1)
  const cur = shots[idx]
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        width: w,
        height: winH,
        transform: `translateY(${wY}px)`,
        opacity: ent,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#0f0f11',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow:
          '0 54px 140px -30px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.03)',
      }}
    >
      <div
        style={{
          height: barH,
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '0 20px',
          background: 'linear-gradient(#1a1a1d,#161618)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#ff5f57',
          }}
        />
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#febc2e',
          }}
        />
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: 7,
            background: '#28c840',
          }}
        />
        <div
          style={{
            marginLeft: 16,
            height: 30,
            flex: 1,
            maxWidth: 520,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '0 14px',
            fontFamily: MONO,
            fontSize: 14,
            color: 'rgba(250,250,250,0.6)',
          }}
        >
          <span
            style={{ width: 6, height: 6, borderRadius: 3, background: GREEN }}
          />
          {cur.url}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: barH,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        <img
          key={idx}
          src={cur.src}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            opacity: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {shots.map((sh, i) => (
            <img key={i} src={sh.src} alt="" />
          ))}
        </div>
      </div>
    </div>
  )
}

function MontageScene({ lt, L }) {
  const shots = [
    {
      src: R('gMetrics', 'shots/g-metrics.png'),
      url: 'dash.chmonitor.dev/metrics',
    },
    {
      src: R('gExpensive', 'shots/g-expensive.png'),
      url: 'dash.chmonitor.dev/queries/expensive',
    },
    {
      src: R('gExplain', 'shots/g-explain.png'),
      url: 'dash.chmonitor.dev/queries/explain',
    },
    {
      src: R('mcpServer', 'shots/mcp-server.png'),
      url: 'dash.chmonitor.dev/operations/mcp-server',
    },
    {
      src: R('healthAudit', 'shots/health-audit.png'),
      url: 'dash.chmonitor.dev/health/audit',
    },
  ]
  return (
    <>
      <CaptionPanel
        lt={lt}
        L={L}
        label="AND A LOT MORE"
        title="15+ pages. 71 charts."
        line="Metrics, expensive & slow queries, EXPLAIN, the MCP server, backups and page-view analytics."
        chips={[
          { text: 'PeerDB', color: ORANGE },
          { text: 'Replication', color: GREEN },
          { text: 'Disk & storage', color: ORANGE },
        ]}
      />
      <MontageFrame lt={lt} L={L} shots={shots} />
    </>
  )
}

function Video({ orientation }) {
  const L = orientation === 'portrait' ? PORT : LAND
  return (
    <Stage
      width={L.W}
      height={L.H}
      duration={20}
      background={BG}
      persistKey={'chmv03_' + (L.portrait ? 'p' : 'l')}
    >
      <Backdrop />
      <ScreenClock />

      <Scene start={0} end={3.0}>
        {(lt) => <IntroScene lt={lt} L={L} />}
      </Scene>

      <Scene start={2.85} end={5.0}>
        {(lt) => (
          <>
            <CaptionPanel
              lt={lt}
              L={L}
              label="THE DASHBOARD"
              title="Rebuilt on TanStack Start."
              line="71 charts, instant. Warm loads straight from cache — no more spinner tax."
              chips={[
                { text: 'TanStack Start', color: ORANGE },
                { text: 'Edge-cached', color: GREEN },
                { text: '71 live charts', color: ORANGE },
              ]}
            />
            <VideoFrame
              lt={lt}
              L={L}
              url="dash.chmonitor.dev/overview"
              src="clips/overview-insights.mp4"
              trim={0}
              speed={1}
            />
          </>
        )}
      </Scene>

      <Scene start={4.85} end={7.3}>
        {(lt) => (
          <>
            <CaptionPanel
              lt={lt}
              L={L}
              label="AI AGENT · NEW"
              title="Ask your cluster anything."
              line="Analyze, optimize and surface insights in plain English — over MCP, with any model you bring."
              chips={[
                { text: 'Analyze', color: ORANGE },
                { text: 'Optimize', color: GREEN },
                { text: 'Any LLM provider', color: ORANGE },
              ]}
            />
            <Frame
              lt={lt}
              L={L}
              url="dash.chmonitor.dev/ai-agent"
              src={R('agentChat', 'shots/agent-chat.png')}
            />
          </>
        )}
      </Scene>

      <Scene start={7.15} end={9.2}>
        {(lt) => (
          <>
            <CaptionPanel
              lt={lt}
              L={L}
              label="QUERY MONITORING"
              title="Watch every query, live."
              line="Running, slow and failed queries — memory, rows and progress, auto-refreshing every 5 seconds."
              chips={[
                { text: 'Live · 5s refresh', color: GREEN },
                { text: 'Kill & EXPLAIN', color: ORANGE },
                { text: 'Per-user', color: GREEN },
              ]}
            />
            <Frame
              lt={lt}
              L={L}
              url="dash.chmonitor.dev/queries/running"
              src={R('queriesRunning', 'shots/queries-running.png')}
            />
          </>
        )}
      </Scene>

      <Scene start={9.05} end={11.4}>
        {(lt) => (
          <>
            <CaptionPanel
              lt={lt}
              L={L}
              label="DATA QUERY EXPLORER"
              title="Explore your data, directly."
              line="A BI-style SQL console with results in milliseconds — plus a live map of table dependencies."
              chips={[
                { text: 'SQL console', color: ORANGE },
                { text: 'Dependency graph', color: GREEN },
                { text: 'Readonly-safe', color: ORANGE },
              ]}
            />
            <Frame
              lt={lt}
              L={L}
              url="dash.chmonitor.dev/tables/data-explorer"
              url2="dash.chmonitor.dev/tables/dependencies"
              src={R('dxQuery', 'shots/data-explorer-query.png')}
              src2={R('dxGraph', 'shots/data-explorer-graph.png')}
              swapAt={1.15}
            />
          </>
        )}
      </Scene>

      <Scene start={11.25} end={13.8}>
        {(lt) => (
          <>
            <CaptionPanel
              lt={lt}
              L={L}
              label="TOPOLOGY & HEALTH"
              title="See the whole cluster."
              line="Topology, Keeper quorum, replication lag and disk usage — visualized, then summarized at a glance."
              chips={[
                { text: 'Quorum healthy', color: GREEN },
                { text: 'Replication lag', color: ORANGE },
                { text: 'Disk 74%', color: GREEN },
              ]}
            />
            <Frame
              lt={lt}
              L={L}
              url="dash.chmonitor.dev/cluster/topology"
              url2="dash.chmonitor.dev/health"
              src={R('heroTopology', 'shots/hero-topology.png')}
              src2={R('heroHealth', 'shots/hero-health.png')}
              swapAt={1.3}
            />
          </>
        )}
      </Scene>

      <Scene start={13.65} end={16.6}>
        {(lt) => <MontageScene lt={lt} L={L} />}
      </Scene>

      <Scene start={16.45} end={18.6}>
        {(lt) => <HostScene lt={lt} L={L} />}
      </Scene>

      <Scene start={18.45} end={20}>
        {(lt) => <EndScene lt={lt} L={L} />}
      </Scene>
    </Stage>
  )
}

window.Video = Video
