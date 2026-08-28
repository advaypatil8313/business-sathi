export default function CompareBars({ a, b }) {
  const max = Math.max(a.value, b.value, 1);
  const bars = [a, b];

  return (
    <div className="flex h-24 items-end gap-4">
      {bars.map((bar) => (
        <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end">
            <div
              className={`w-full rounded-t-md ${bar.highlight ? 'bg-accent' : 'bg-line'}`}
              style={{ height: `${Math.max((bar.value / max) * 100, 4)}%` }}
            />
          </div>
          <p className="text-xs text-muted">{bar.label}</p>
        </div>
      ))}
    </div>
  );
}
