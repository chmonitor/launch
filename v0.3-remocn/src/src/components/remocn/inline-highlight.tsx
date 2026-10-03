"use client";

import {
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface InlineHighlightProps {
  before: string;
  highlight: string;
  after?: string;
  baseColor?: string;
  highlightColor?: string;
  fontSize?: number;
  fontWeight?: number;
  speed?: number;
  /** This scene's own TransitionSeries.Sequence duration — the highlight
   * sweep paces off this, not the root composition length (see
   * number-wheel.tsx for the same fix). Falls back to the root duration
   * for standalone/non-TransitionSeries usage. */
  durationInFrames?: number;
  className?: string;
}

export function InlineHighlight({
  before,
  highlight,
  after = "",
  baseColor = "#171717",
  highlightColor = "#ff5e3a",
  fontSize = 48,
  fontWeight = 600,
  speed = 1,
  durationInFrames,
  className,
}: InlineHighlightProps) {
  const frame = useCurrentFrame() * speed;
  const { durationInFrames: rootDurationInFrames } = useVideoConfig();
  const localDuration = durationInFrames ?? rootDurationInFrames;

  const progress = interpolate(
    frame,
    [localDuration * 0.2, localDuration * 0.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const color = interpolateColors(
    progress,
    [0, 1],
    [baseColor, highlightColor],
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <span
        className={className}
        style={{
          fontSize,
          fontWeight,
          color: baseColor,
          letterSpacing: "-0.03em",
          fontFamily:
            "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {before}
        <span style={{ color }}>{highlight}</span>
        {after}
      </span>
    </div>
  );
}
