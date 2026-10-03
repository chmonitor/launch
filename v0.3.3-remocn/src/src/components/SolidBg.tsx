// Backdrop's object-fill path ({type:'color', value}) silently fails to
// paint in this bundle (isValidElement is false for it as expected, yet no
// background renders and no console error surfaces either) — a real but
// unresolved bug in the vendored component. The ReactNode-fill path is
// proven working (LogoBumper's DynamicGrid), so route every solid-color
// scene background through a plain node instead of the object form.
export function SolidBg({ color }: { color: string }) {
  return <div style={{ position: 'absolute', inset: 0, background: color }} />
}
