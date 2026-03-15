export default function Loading() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] left-1/2 h-150 w-150 -translate-x-1/2 rounded-full blur-[80px] 
        bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_12%,transparent)_0%,transparent_70%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[15%] left-1/2 h-100 w-100 -translate-x-1/2 rounded-full blur-[60px]
        bg-[radial-gradient(circle,color-mix(in_oklch,var(--secondary)_10%,transparent)_0%,transparent_70%)]"
      />

      {/* Dot texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]
        bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] 
        bg-size-[32px_32px]"
      />

      {/* Orbital */}
      <div className="relative mb-10 h-50 w-50">
        <style>{`
          @keyframes orbitOuter { from {transform:rotate(0)} to {transform:rotate(360deg)} }
          @keyframes orbitMiddle { from {transform:rotate(0)} to {transform:rotate(-360deg)} }
          @keyframes orbitInner { from {transform:rotate(0)} to {transform:rotate(360deg)} }
          @keyframes pulseCore {
            0%,100% {opacity:.5; transform:scale(1)}
            50% {opacity:1; transform:scale(1.15)}
          }
          @keyframes fadeUp { from {opacity:0; transform:translateY(12px)} to {opacity:1; transform:translateY(0)} }
          @keyframes blinkDots {
            0%,20% {content:"."}
            40% {content:".."}
            60%,100% {content:"..."}
          }
          .loading-dots::after{
            content:"...";
            animation:blinkDots 1.4s steps(1) infinite;
          }
        `}</style>

        {/* Outer ring */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full border 
          border-[color-mix(in_oklch,var(--primary)_25%,transparent)]
          animate-[orbitOuter_8s_linear_infinite]"
        >
          <div
            className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-secondary
          shadow-[0_0_12px_color-mix(in_oklch,var(--secondary)_80%,transparent)]"
          />
        </div>

        {/* Middle ring */}
        <div
          aria-hidden
          className="absolute inset-6 rounded-full border border-dashed
          border-[color-mix(in_oklch,var(--primary)_35%,transparent)]
          animate-[orbitMiddle_5s_linear_infinite]"
        >
          <div
            className="absolute -top-[3.5px] left-1/2 h-1.74 w-1.74 -translate-x-1/2 rounded-full bg-primary
          shadow-[0_0_10px_color-mix(in_oklch,var(--primary)_80%,transparent)]"
          />
        </div>

        {/* Inner ring */}
        <div
          aria-hidden
          className="absolute inset-13 rounded-full border
          border-[color-mix(in_oklch,var(--secondary)_30%,transparent)]
          animate-[orbitInner_3.5s_linear_infinite]"
        >
          <div
            className="absolute -top-0.75 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full
          bg-[color-mix(in_oklch,var(--primary)_60%,var(--secondary))]
          shadow-[0_0_8px_color-mix(in_oklch,var(--primary)_60%,transparent)]"
          />
        </div>

        {/* Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full
          bg-[color-mix(in_oklch,var(--primary)_15%,transparent)]
          animate-[pulseCore_2s_ease-in-out_infinite]"
          >
            <div
              className="h-3 w-3 rounded-full bg-primary
            shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_70%,transparent)]"
            />
          </div>
        </div>
      </div>

      {/* Wordmark */}
      <div className="text-center animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.2s_both]">
        <h3
          className="flex items-center justify-center gap-0.75
        text-[22px] font-medium tracking-[-0.01em] text-foreground"
        >
          Haruna
          <span className="mb-1 inline-block h-1.25 w-1.25 self-end rounded-full bg-secondary" />
        </h3>

        <p className="loading-dots text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
          Loading
        </p>
      </div>
    </div>
  );
}
