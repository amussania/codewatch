interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export default function NoiseOverlay({ opacity = 0.038, className = "" }: NoiseOverlayProps) {
  return (
    <svg
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${className}`}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Filter defined globally in root layout — url(#cw-noise) resolves document-wide */}
      <rect width="100%" height="100%" filter="url(#cw-noise)" />
    </svg>
  );
}
