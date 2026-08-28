import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import AssistantCard from '../components/AssistantCard.jsx';
import QuickActionPill from '../components/QuickActionPill.jsx';
import BusinessSnapshot from '../components/BusinessSnapshot.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';
import BusinessDataSummaryCard from '../components/BusinessDataSummaryCard.jsx';
import MetricCard from '../components/MetricCard.jsx';
import Badge from '../components/ui/Badge.jsx';
import { AlertTriangle, Wallet, Package, BarChart3, Megaphone, MessageCircle, Compass } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Create Social Post', assistant: 'marketing-sathi', prompt: 'Create an Instagram post for my business.', icon: Megaphone },
  { label: 'Analyze My Business', assistant: 'business-analyst', prompt: 'Analyze my business.', icon: BarChart3 },
  { label: 'Reply to Customer', assistant: 'customer-sathi', prompt: 'Help me reply to a customer.', icon: MessageCircle },
  { label: 'Generate Promotion', assistant: 'marketing-sathi', prompt: 'Give me 5 promotion ideas.', icon: Megaphone },
  { label: "Today's Priorities", assistant: 'business-advisor', prompt: 'What should I focus on today?', icon: Compass },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({ business }) {
  const [assistants, setAssistants] = useState([]);
  const [summary, setSummary] = useState(undefined); // undefined = loading, null = none yet
  const navigate = useNavigate();

  useEffect(() => {
    api.getAssistants().then(setAssistants).catch(() => setAssistants([]));
    api.getBusinessDataSummary().then(setSummary).catch(() => setSummary(null));
  }, []);

  const runQuickAction = (action) => {
    navigate(`/assistant/${action.assistant}`, { state: { initialPrompt: action.prompt } });
  };

  const lowStockCount = summary?.lowStockItems?.length || 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {lowStockCount > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on stock.</span>
          <button onClick={() => navigate('/business-data')} className="focus-ring ml-auto rounded font-medium underline">
            View
          </button>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{greeting()}</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{business.name}</h1>
            <Badge tone="neutral">{business.type}</Badge>
          </div>
        </div>
      </div>

      {summary && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            icon={Wallet}
            label="Total Revenue"
            value={`₹${summary.totalRevenue.toLocaleString('en-IN')}`}
            hint={summary.trend ? `${summary.trend.changePct > 0 ? '+' : ''}${summary.trend.changePct}% vs earlier period` : undefined}
            hintTone={summary.trend ? (summary.trend.changePct >= 0 ? 'positive' : 'negative') : 'neutral'}
          />
          <MetricCard icon={Package} label="Units Sold" value={summary.totalQuantity} />
          <MetricCard
            icon={AlertTriangle}
            label="Low Stock Items"
            value={lowStockCount}
            hint={lowStockCount > 0 ? 'Needs attention' : 'All stocked'}
            hintTone={lowStockCount > 0 ? 'negative' : 'positive'}
          />
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Quick Actions</h2>
      <div className="mb-10 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionPill key={action.label} label={action.label} icon={action.icon} onClick={() => runQuickAction(action)} />
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Your AI Team</h2>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {assistants.map((a) => <AssistantCard key={a.key} assistant={a} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BusinessSnapshot business={business} />
        <BusinessDataSummaryCard summary={summary} />
        <ActivityFeed />
      </div>
    </div>
  );
}
