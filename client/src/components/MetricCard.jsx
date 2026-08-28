import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './ui/Card.jsx';

const HINT_TONES = {
  positive: 'text-accent-dark',
  negative: 'text-red-600',
  neutral: 'text-muted',
};

export default function MetricCard({ icon: Icon, label, value, hint, hintTone = 'neutral' }) {
  const TrendIcon = hintTone === 'positive' ? TrendingUp : hintTone === 'negative' ? TrendingDown : null;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Icon size={16} strokeWidth={1.9} />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {hint && (
        <p className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${HINT_TONES[hintTone] || HINT_TONES.neutral}`}>
          {TrendIcon && <TrendIcon size={13} strokeWidth={2.25} />}
          {hint}
        </p>
      )}
    </Card>
  );
}
