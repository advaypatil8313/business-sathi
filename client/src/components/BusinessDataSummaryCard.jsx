import { Link } from 'react-router-dom';
import { ArrowRight, Database, AlertTriangle } from 'lucide-react';
import Card, { CardHeader } from './ui/Card.jsx';
import EmptyState from './ui/EmptyState.jsx';

// Renders a compact preview of the latest business-data summary on the Dashboard.
// The summary itself is fetched once by the Dashboard page and passed down, so this
// card and the KPI strip never issue duplicate requests.
export default function BusinessDataSummaryCard({ summary }) {
  return (
    <Card>
      <CardHeader
        title="Business Data"
        icon={Database}
        action={
          <Link to="/business-data" className="focus-ring flex items-center gap-1 rounded text-sm font-medium text-accent">
            Open <ArrowRight size={14} />
          </Link>
        }
      />

      {summary === undefined && <p className="text-sm text-muted">Loading…</p>}

      {summary === null && (
        <EmptyState
          icon={Database}
          title="No data uploaded yet"
          description="Upload a CSV to see revenue, best sellers, and stock levels."
        />
      )}

      {summary && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Total Revenue</p>
              <p className="text-lg font-semibold text-ink">₹{summary.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Units Sold</p>
              <p className="text-lg font-semibold text-ink">{summary.totalQuantity}</p>
            </div>
          </div>

          {summary.bestSellers.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">Top seller</p>
              <p className="text-sm text-ink">{summary.bestSellers[0].product}</p>
            </div>
          )}

          {summary.lowStockItems.length > 0 ? (
            <div className="flex items-center gap-1.5 text-sm font-medium text-amber-700">
              <AlertTriangle size={14} />
              {summary.lowStockItems.length} item{summary.lowStockItems.length > 1 ? 's' : ''} low on stock
            </div>
          ) : (
            <p className="text-sm text-muted">Stock levels look fine.</p>
          )}
        </div>
      )}
    </Card>
  );
}
