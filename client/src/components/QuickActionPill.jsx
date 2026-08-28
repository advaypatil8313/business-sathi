export default function QuickActionPill({ label, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="focus-ring flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-card transition hover:border-accent/40 hover:bg-accent-soft"
    >
      {Icon && <Icon size={15} strokeWidth={2} className="text-accent" />}
      {label}
    </button>
  );
}
