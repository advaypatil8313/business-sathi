import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { api } from '../services/api.js';
import Logo from '../components/ui/Logo.jsx';

const BUSINESS_TYPES = ['Retail', 'Restaurant', 'Clothing', 'Salon', 'Manufacturing', 'Grocery', 'Services', 'Other'];
const GOALS = ['Increase sales', 'Get more customers', 'Improve marketing', 'Improve operations', 'Understand business performance', 'General business growth'];

const STEPS = ['name', 'type', 'location', 'products', 'customers', 'goal'];

const VALUE_PROPS = [
  { icon: ShieldCheck, text: 'Runs on your device — your business data stays local.' },
  { icon: Sparkles, text: 'AI insights from your own sales and inventory data.' },
  { icon: Clock, text: 'Weekly reports and suggestions in a couple of clicks.' },
];

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', type: '', location: '', products: '', customers: '', goal: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const field = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const update = (value) => setForm((f) => ({ ...f, [field]: value }));

  const canAdvance = () => {
    if (field === 'name') return form.name.trim().length > 0;
    if (field === 'type') return form.type.trim().length > 0;
    return true;
  };

  const next = async () => {
    if (!canAdvance()) return;
    if (!isLast) { setStep((s) => s + 1); return; }
    setSaving(true);
    setError(null);
    try {
      const business = await api.saveBusiness(form);
      onDone(business);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="relative hidden w-[42%] flex-col justify-between bg-sidebar px-10 py-10 text-white lg:flex">
        <Logo textClassName="text-white" markClassName="text-accent" />
        <div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Your AI team for everyday business.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-sidebar-text">
            A few quick questions so your AI team understands your business from day one.
          </p>
        </div>
        <ul className="space-y-4">
          {VALUE_PROPS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm text-sidebar-text">
              <Icon size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-accent" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Logo markClassName="text-accent" textClassName="text-ink" />
          </div>

          <div className="mb-6 flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-canvas'}`}
              />
            ))}
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Step {step + 1} of {STEPS.length}</p>

          {field === 'name' && (
            <StepBlock
              title="What's your business called?"
              input={<TextInput value={form.name} onChange={update} placeholder="e.g. Patil Fashion Store" autoFocus />}
            />
          )}

          {field === 'type' && (
            <StepBlock
              title="What kind of business is it?"
              input={
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => update(t)}
                      className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition ${
                        form.type === t ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink hover:border-accent/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              }
            />
          )}

          {field === 'location' && (
            <StepBlock
              title="Where is it located?"
              optional
              input={<TextInput value={form.location} onChange={update} placeholder="e.g. Nashik, Maharashtra" autoFocus />}
            />
          )}

          {field === 'products' && (
            <StepBlock
              title="What products or services do you offer?"
              optional
              input={<TextArea value={form.products} onChange={update} placeholder="e.g. Shirts, jeans, trousers and accessories" autoFocus />}
            />
          )}

          {field === 'customers' && (
            <StepBlock
              title="Who are your customers?"
              optional
              input={<TextArea value={form.customers} onChange={update} placeholder="e.g. College students and young professionals" autoFocus />}
            />
          )}

          {field === 'goal' && (
            <StepBlock
              title="What's your main goal right now?"
              optional
              input={
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => update(g)}
                      className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition ${
                        form.goal === g ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink hover:border-accent/40'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              }
            />
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="focus-ring rounded text-sm font-medium text-muted disabled:opacity-0"
            >
              Back
            </button>
            <button
              onClick={next}
              disabled={!canAdvance() || saving}
              className="focus-ring rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-40"
            >
              {saving ? 'Saving…' : isLast ? 'Meet your AI team' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepBlock({ title, input, optional }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-ink">{title}{optional && <span className="ml-2 text-sm font-normal text-muted">(optional)</span>}</h2>
      <div className="mt-4">{input}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, autoFocus }) {
  return (
    <input
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="focus-ring w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink"
    />
  );
}

function TextArea({ value, onChange, placeholder, autoFocus }) {
  return (
    <textarea
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="focus-ring w-full resize-none rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink"
    />
  );
}
