import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { assistantIcons } from '../assistants/assistantsMeta.js';

export default function AssistantCard({ assistant }) {
  const Icon = assistantIcons[assistant.key];
  return (
    <Link
      to={`/assistant/${assistant.key}`}
      className="focus-ring group flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-pop"
    >
      <div>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          {Icon && <Icon size={21} strokeWidth={1.75} />}
        </div>
        <h3 className="text-base font-semibold text-ink">{assistant.name}</h3>
        <p className="mt-1 text-sm leading-snug text-muted">{assistant.description}</p>
      </div>
      <div className="mt-5 flex items-center gap-1 text-sm font-medium text-accent">
        Chat now
        <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
