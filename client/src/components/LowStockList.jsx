import { AlertTriangle, PackageCheck } from 'lucide-react';
import Card, { CardHeader } from './ui/Card.jsx';
import Badge from './ui/Badge.jsx';

export default function LowStockList({ items, threshold }) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardHeader title="Low Stock" icon={PackageCheck} />
        <p className="text-sm text-muted">Nothing below your threshold of {threshold} units.</p>
      </Card>
    );
  }
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle size={16} className="text-amber-700" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-900">
          Low Stock ({items.length} below {threshold})
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.product} className="flex items-center justify-between text-sm text-amber-900">
            <span>{item.product}</span>
            <Badge tone="warning">{item.stock} left</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
