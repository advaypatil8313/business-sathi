import { AlertTriangle } from 'lucide-react';
import { useOllamaStatus } from '../hooks/useOllamaStatus.js';

export default function OllamaStatusBanner() {
  const { status, ready } = useOllamaStatus();

  if (!status || ready) return null;

  const message = !status.ok
    ? `Ollama isn't reachable. Make sure Ollama is running and try again. (${status.reason || ''})`
    : `Ollama is running, but the model "${status.model}" wasn't found. Run "ollama pull ${status.model}" and try again.`;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
