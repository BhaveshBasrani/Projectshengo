'use client';

export default function PaperOverlay() {
  return (
    <>
      {/* Dense Zine Noise Grain Overlay */}
      <div
        aria-hidden="true"
        className="paper-texture-overlay select-none"
      />
      {/* Subtle CRT Monitor Scanline Texture */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[998] opacity-[0.03] select-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_3px]"
      />
      {/* Edge Vignette Darkening */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[997] select-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </>
  );
}
