const TONES = {
  neutral: 'bg-canvas text-muted border border-line',
  positive: 'bg-accent-soft text-accent-dark border border-accent/20',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  dark: 'bg-ink text-white border border-ink',
};

export default function Badge({ children, tone = 'neutral', icon: Icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone] || TONES.neutral} ${className}`}
    >
      {Icon && <Icon size={12} strokeWidth={2.25} />}
      {children}
    </span>
  );
}
