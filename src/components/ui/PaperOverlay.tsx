'use client';

export default function PaperOverlay() {
  return (
    <>
      {/* Dense Zine Noise Grain Overlay */}
      <div
        aria-hidden="true"
        className="paper-texture-overlay select-none"
      />
      {/* Subtle CRT Monitor Scanline Texture - Dark mode only */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[998] opacity-[0.03] select-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_3px] hidden dark:block"
      />
      {/* Edge Vignette Darkening - Dark mode only */}
      <div
        aria-hidden="true"
        className="edge-vignette fixed inset-0 pointer-events-none z-[997] select-none hidden dark:block"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </>
  );
}
