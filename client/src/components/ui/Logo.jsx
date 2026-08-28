export default function Logo({ className = '', markClassName = '', textClassName = '', showText = true }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className={`h-7 w-7 shrink-0 ${markClassName}`}
        fill="none"
        aria-hidden="true"
      >
        <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.55" />
        <rect x="10" y="7" width="4" height="14" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="17" y="2" width="4" height="19" rx="1" fill="currentColor" />
      </svg>
      {showText && (
        <span className={`text-base font-semibold tracking-tight ${textClassName}`}>
          Business <span className="font-bold">Sathi</span>
        </span>
      )}
    </div>
  );
}
