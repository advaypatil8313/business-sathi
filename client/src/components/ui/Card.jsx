export default function Card({ children, className = '', padding = 'p-5', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface shadow-card ${padding} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, icon: Icon, action, className = '' }) {
  return (
    <div className={`mb-4 flex items-center justify-between gap-3 ${className}`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
        {Icon && <Icon size={15} strokeWidth={2} className="text-accent" />}
        {title}
      </h3>
      {action}
    </div>
  );
}
