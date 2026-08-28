import { Sparkles } from 'lucide-react';
import { renderFormatted } from '../utils/formatText.jsx';
import Card, { CardHeader } from './ui/Card.jsx';
import EmptyState from './ui/EmptyState.jsx';

export default function ReportPanel({ title, content, loading, error, action }) {
  return (
    <Card>
      <CardHeader title={title} icon={Sparkles} action={action} />
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="flex gap-0.5">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: '0ms' }} />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: '150ms' }} />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: '300ms' }} />
          </span>
          Generating…
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && !content && (
        <EmptyState icon={Sparkles} title="Nothing generated yet" description="Use the button above whenever you want a fresh read on your data." />
      )}
      {!loading && content && (
        <div className="prose-chat text-sm leading-relaxed text-ink">{renderFormatted(content)}</div>
      )}
    </Card>
  );
}
