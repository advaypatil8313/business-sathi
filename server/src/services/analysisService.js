function sum(values) {
  return values.reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);
}

function round(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function groupSum(rows, keyFn) {
  const out = {};
  rows.forEach((row) => {
    const key = keyFn(row);
    if (!key) return;
    if (!out[key]) out[key] = { revenue: 0, quantity: 0 };
    if (Number.isFinite(row.revenue)) out[key].revenue += row.revenue;
    if (Number.isFinite(row.quantity)) out[key].quantity += row.quantity;
  });
  return out;
}

// Computes real, deterministic metrics from parsed CSV rows.
// This never touches the LLM — it's plain arithmetic so numbers are always trustworthy.
export function analyzeBusinessData(rows, { lowStockThreshold = 5 } = {}) {
  const totalRevenue = round(sum(rows.map((r) => r.revenue)));
  const totalQuantity = round(sum(rows.map((r) => r.quantity)));

  const byProduct = groupSum(rows, (r) => r.product);
  const bestSellers = Object.entries(byProduct)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([product, v]) => ({ product, revenue: round(v.revenue), quantity: round(v.quantity) }));

  const byCategory = groupSum(rows.filter((r) => r.category), (r) => r.category);
  const salesByCategory = Object.entries(byCategory)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .map(([category, v]) => ({ category, revenue: round(v.revenue), quantity: round(v.quantity) }));

  // Latest stock reading per product (last row for that product wins).
  const latestStockByProduct = {};
  rows.forEach((r) => {
    if (r.stock !== null && r.stock !== undefined) latestStockByProduct[r.product] = r.stock;
  });
  const lowStockItems = Object.entries(latestStockByProduct)
    .filter(([, stock]) => stock < lowStockThreshold)
    .map(([product, stock]) => ({ product, stock }))
    .sort((a, b) => a.stock - b.stock);

  // Basic trend: split dated rows chronologically in half and compare revenue.
  const dated = rows.filter((r) => r.date && !Number.isNaN(new Date(r.date).getTime()))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let trend = null;
  if (dated.length >= 4) {
    const mid = Math.floor(dated.length / 2);
    const firstHalfRevenue = sum(dated.slice(0, mid).map((r) => r.revenue));
    const secondHalfRevenue = sum(dated.slice(mid).map((r) => r.revenue));
    if (firstHalfRevenue > 0) {
      trend = {
        firstHalfRevenue: round(firstHalfRevenue),
        secondHalfRevenue: round(secondHalfRevenue),
        changePct: round(((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100),
      };
    }
  }

  return {
    rowCount: rows.length,
    totalRevenue,
    totalQuantity,
    bestSellers,
    salesByCategory,
    lowStockItems,
    trend,
    lowStockThreshold,
  };
}
