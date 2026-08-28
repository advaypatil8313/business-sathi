import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { api } from '../services/api.js';
import { assistantIcons } from '../assistants/assistantsMeta.js';
import { timeAgo } from '../utils/time.js';
import Card, { CardHeader } from './ui/Card.jsx';
import EmptyState from './ui/EmptyState.jsx';

const nameByKey = {
  'business-analyst': 'Business Analyst',
  'marketing-sathi': 'Marketing Sathi',
  'customer-sathi': 'Customer Sathi',
  'business-advisor': 'Business Advisor',
};

export default function ActivityFeed() {
  const [items, setItems] = useState(undefined);

  useEffect(() => {
    api.getActivity().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <Card>
      <CardHeader title="Recent Activity" icon={Clock} />
      {items === undefined && <p className="text-sm text-muted">Loading…</p>}
      {items && items.length === 0 && (
        <EmptyState
          icon={Clock}
          title="No activity yet"
          description="Questions you ask your AI team will show up here."
        />
      )}
      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => {
            const Icon = assistantIcons[item.assistant_key];
            return (
              <li key={item.id} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
                  {Icon && <Icon size={13} strokeWidth={2} />}
                </div>
                <div className="min-w-0">
                  <p className="text-ink">
                    <span className="font-medium">{nameByKey[item.assistant_key] || item.assistant_key}</span>
                    {' — '}
                    <span className="text-muted">{item.action}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{timeAgo(item.created_at)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
