import { MapPin, Package, Users, Target, Store } from 'lucide-react';
import Card, { CardHeader } from './ui/Card.jsx';

export default function BusinessSnapshot({ business }) {
  const rows = [
    { label: 'Type', value: business.type, icon: Store },
    { label: 'Location', value: business.location || '—', icon: MapPin },
    { label: 'Products / Services', value: business.products || '—', icon: Package },
    { label: 'Target customers', value: business.customers || '—', icon: Users },
    { label: 'Main goal', value: business.goal || '—', icon: Target },
  ];
  return (
    <Card>
      <CardHeader title="Business Snapshot" />
      <dl className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3">
            <row.icon size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-muted" />
            <div className="min-w-0">
              <dt className="text-xs text-muted">{row.label}</dt>
              <dd className="truncate text-sm text-ink">{row.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </Card>
  );
}
