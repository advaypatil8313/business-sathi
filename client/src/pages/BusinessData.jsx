import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Package, TrendingUp, TrendingDown, Minus, Mail, Sliders, Trophy, Database } from 'lucide-react';
import { api } from '../services/api.js';
import CsvUploadCard from '../components/CsvUploadCard.jsx';
import MetricCard from '../components/MetricCard.jsx';
import LowStockList from '../components/LowStockList.jsx';
import ReportPanel from '../components/ReportPanel.jsx';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import DonutChart from '../components/charts/DonutChart.jsx';
import CompareBars from '../components/charts/CompareBars.jsx';

const CATEGORY_COLORS = ['#0E9F6E', '#2563EB', '#7C3AED', '#F59E0B', '#EF4444', '#0F766E', '#64748B'];

export default function BusinessData() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(undefined); // undefined = loading, null = none yet
  const [settings, setSettings] = useState(null);
  const [thresholdInput, setThresholdInput] = useState('');
  const [savingThreshold, setSavingThreshold] = useState(false);
  const [thresholdSaved, setThresholdSaved] = useState(false);

  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  const [suggestions, setSuggestions] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);

  const loadSummary = () => api.getBusinessDataSummary().then(setSummary).catch(() => setSummary(null));
  const loadSettings = () => api.getSettings().then((s) => { setSettings(s); setThresholdInput(String(s.lowStockThreshold)); }).catch(() => {});

  useEffect(() => { loadSummary(); loadSettings(); }, []);

  const saveThreshold = async () => {
    const n = Number(thresholdInput);
    if (!Number.isFinite(n) || n < 0) return;
    setSavingThreshold(true);
    setThresholdSaved(false);
    try {
      await api.updateSettings({ lowStockThreshold: n });
      await Promise.all([loadSettings(), loadSummary()]);
      setThresholdSaved(true);
      setTimeout(() => setThresholdSaved(false), 2000);
    } finally {
      setSavingThreshold(false);
    }
  };

  const runReport = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const res = await api.generateWeeklyReport();
      setReport(res.content);
    } catch (err) {
      setReportError(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  const runSuggestions = async () => {
    setSuggestionsLoading(true);
    setSuggestionsError(null);
    try {
      const res = await api.generateSuggestions();
      setSuggestions(res.content);
    } catch (err) {
      setSuggestionsError(err.message);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const trendIcon = !summary?.trend ? Minus : summary.trend.changePct >= 0 ? TrendingUp : TrendingDown;
  const trendTone = !summary?.trend ? 'neutral' : summary.trend.changePct >= 0 ? 'positive' : 'negative';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <button onClick={() => navigate('/dashboard')} className="focus-ring mb-6 flex items-center gap-1 rounded text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> Dashboard
      </button>

      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-ink">Business Data</h1>
      <p className="mb-6 text-sm text-muted">Upload sales/inventory data to unlock real numbers, reports, and suggestions.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <CsvUploadCard onUploaded={() => { loadSummary(); }} lastUpload={summary || undefined} />

          <Card>
            <CardHeader title="Low-Stock Threshold" icon={Sliders} />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                className="focus-ring w-24 rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink"
              />
              <button
                onClick={saveThreshold}
                disabled={savingThreshold}
                className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark disabled:opacity-40"
              >
                {savingThreshold ? 'Saving…' : thresholdSaved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
            <p className="mt-3 text-xs text-muted">
              You'll be alerted when any product's stock falls below this number.
            </p>
          </Card>

          <Card>
            <CardHeader title="Email Alerts" icon={Mail} />
            {settings?.emailConfigured ? (
              <div className="space-y-2">
                <Badge tone="positive">Configured</Badge>
                <p className="text-xs text-muted">Low-stock alerts are emailed to {settings.alertEmailTo}.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge tone="neutral">Not configured</Badge>
                <p className="text-xs text-muted">Set SMTP_* and ALERT_EMAIL_TO in server/.env to enable email alerts.</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {summary === undefined && <p className="text-sm text-muted">Loading…</p>}

          {summary === null && (
            <EmptyState
              icon={Database}
              title="No business data uploaded yet"
              description="Upload a CSV on the left to see real revenue, best sellers, categories, and stock levels here."
            />
          )}

          {summary && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard icon={Wallet} label="Total Revenue" value={`₹${summary.totalRevenue.toLocaleString('en-IN')}`} />
                <MetricCard icon={Package} label="Units Sold" value={summary.totalQuantity} />
                <MetricCard
                  icon={trendIcon}
                  label="Trend"
                  value={summary.trend ? `${summary.trend.changePct > 0 ? '+' : ''}${summary.trend.changePct}%` : '—'}
                  hint={summary.trend ? 'vs earlier period' : 'Not enough dated rows'}
                  hintTone={trendTone}
                />
              </div>

              {summary.trend && (
                <Card>
                  <CardHeader title="Earlier vs. Recent Revenue" />
                  <CompareBars
                    a={{ label: 'Earlier period', value: summary.trend.firstHalfRevenue }}
                    b={{ label: 'Recent period', value: summary.trend.secondHalfRevenue, highlight: true }}
                  />
                </Card>
              )}

              <Card>
                <CardHeader title="Best Sellers" icon={Trophy} />
                {summary.bestSellers.length === 0 ? (
                  <p className="text-sm text-muted">No sales data found.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {summary.bestSellers.map((p, i) => (
                      <li key={p.product} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-muted">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-ink">{p.product}</span>
                        <span className="shrink-0 text-sm text-muted">₹{p.revenue.toLocaleString('en-IN')} · {p.quantity} units</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              {summary.salesByCategory.length > 0 && (
                <Card>
                  <CardHeader title="Sales by Category" />
                  <div className="flex flex-col items-center gap-6 sm:flex-row">
                    <DonutChart
                      data={summary.salesByCategory.map((c, i) => ({
                        label: c.category,
                        value: c.revenue,
                        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                      }))}
                    />
                    <ul className="w-full flex-1 space-y-2">
                      {summary.salesByCategory.map((c, i) => {
                        const total = summary.salesByCategory.reduce((sum, x) => sum + x.revenue, 0);
                        const pct = total > 0 ? Math.round((c.revenue / total) * 100) : 0;
                        return (
                          <li key={c.category} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-ink">
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                              />
                              {c.category}
                            </span>
                            <span className="text-muted">{pct}% · ₹{c.revenue.toLocaleString('en-IN')}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Card>
              )}

              <LowStockList items={summary.lowStockItems} threshold={summary.lowStockThreshold} />

              <ReportPanel
                title="Weekly AI Report"
                content={report}
                loading={reportLoading}
                error={reportError}
                action={
                  <button onClick={runReport} disabled={reportLoading} className="focus-ring rounded text-sm font-medium text-accent disabled:opacity-40">
                    {report ? 'Regenerate' : 'Generate'}
                  </button>
                }
              />

              <ReportPanel
                title="AI Suggestions"
                content={suggestions}
                loading={suggestionsLoading}
                error={suggestionsError}
                action={
                  <button onClick={runSuggestions} disabled={suggestionsLoading} className="focus-ring rounded text-sm font-medium text-accent disabled:opacity-40">
                    {suggestions ? 'Regenerate' : 'Generate'}
                  </button>
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
