import { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.js';
import Card from './ui/Card.jsx';

export default function CsvUploadCard({ onUploaded, lastUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setWarnings([]);
    try {
      const result = await api.uploadBusinessData(file);
      setWarnings(result.warnings || []);
      onUploaded(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card padding="p-0" className="overflow-hidden">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`border-b border-dashed p-6 text-center transition ${
          dragActive ? 'border-accent bg-accent-soft' : 'border-line'
        }`}
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
          <UploadCloud size={20} strokeWidth={1.75} />
        </div>
        <p className="mt-3 text-sm font-medium text-ink">Drag &amp; drop your CSV file here</p>
        <p className="mt-1 text-xs text-muted">Product, category, quantity, price, stock, date — in any order</p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring mt-4 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-40"
        >
          {uploading ? 'Uploading…' : 'Choose CSV file'}
        </button>
        <p className="mt-2 text-xs text-muted">Supports .csv files up to 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {warnings.length > 0 && (
          <div className="mt-3 rounded-lg bg-amber-50 p-3 text-left text-xs text-amber-900">
            <p className="font-medium">Uploaded with {warnings.length} note(s):</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {warnings.slice(0, 5).map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
      </div>

      {lastUpload && (
        <div className="flex items-center gap-2 px-5 py-3 text-xs text-muted">
          <CheckCircle2 size={14} className="shrink-0 text-accent" />
          <FileText size={14} className="shrink-0" />
          <span className="truncate">Last upload: {lastUpload.filename}</span>
        </div>
      )}
    </Card>
  );
}
