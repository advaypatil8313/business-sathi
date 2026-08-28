import { parse } from 'csv-parse/sync';

// Maps the columns real business owners actually use onto our canonical fields.
const HEADER_ALIASES = {
  product: ['product', 'item', 'product_name', 'name'],
  category: ['category', 'type', 'product_category'],
  quantity: ['quantity', 'qty', 'units', 'units_sold'],
  revenue: ['revenue', 'sales', 'amount', 'total', 'total_sales'],
  price: ['price', 'unit_price', 'rate'],
  stock: ['stock', 'stock_qty', 'inventory', 'stock_level', 'quantity_in_stock'],
  date: ['date', 'order_date', 'sale_date'],
};

function resolveHeaderMap(headers) {
  const lowerHeaders = headers.map((h) => h.trim().toLowerCase());
  const map = {};

  for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
    const idx = lowerHeaders.findIndex((h) => aliases.includes(h));

    if (idx !== -1) {
      map[canonical] = headers[idx];
    }
  }

  return map;
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null;

  const n = Number(String(value).replace(/[₹$,\s]/g, ''));

  return Number.isFinite(n) ? n : null;
}

// Parses a CSV buffer into normalized business-data rows.
// Throws a user-readable Error on unrecoverable problems (bad file, no product column, no data).
// Returns { rows, warnings, columnsDetected } on success.
export function parseBusinessCsv(buffer) {
  let records;

  try {
    records = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });
  } catch (err) {
    throw new Error(`Could not read this file as CSV: ${err.message}`);
  }

  if (!records.length) {
    throw new Error('The CSV file has no data rows.');
  }

  const headers = Object.keys(records[0]);
  const columnsDetected = resolveHeaderMap(headers);

  if (!columnsDetected.product) {
    throw new Error(
      'Could not find a product column. Expected a column named something like "product", "item", or "product_name".'
    );
  }

  const rows = [];
  const warnings = [];

  records.forEach((record, i) => {
    const rowNum = i + 2; // account for header row

    const product = String(
      record[columnsDetected.product] || ''
    ).trim();

    if (!product) {
      warnings.push(`Row ${rowNum}: skipped — missing product name.`);
      return;
    }

    const quantity = columnsDetected.quantity
      ? toNumber(record[columnsDetected.quantity])
      : null;

    const price = columnsDetected.price
      ? toNumber(record[columnsDetected.price])
      : null;

    // When both quantity and price are available,
    // always calculate revenue from quantity × price.
    // This prevents a "sales" column containing unit counts
    // from being incorrectly treated as monetary revenue.
    let revenue = null;

    if (quantity !== null && price !== null) {
      revenue = quantity * price;
    } else if (columnsDetected.revenue) {
      revenue = toNumber(record[columnsDetected.revenue]);
    }

    const stock = columnsDetected.stock
      ? toNumber(record[columnsDetected.stock])
      : null;

    const category = columnsDetected.category
      ? String(record[columnsDetected.category] || '').trim() || null
      : null;

    const date = columnsDetected.date
      ? String(record[columnsDetected.date] || '').trim() || null
      : null;

    if (revenue === null && quantity === null && stock === null) {
      warnings.push(
        `Row ${rowNum} ("${product}"): no quantity, revenue, or stock value found — row kept but contributes nothing to totals.`
      );
    }

    rows.push({
      product,
      category,
      quantity,
      revenue,
      price,
      stock,
      date,
    });
  });

  if (!rows.length) {
    throw new Error(
      'No valid rows were found after validation. Every row was missing a product name.'
    );
  }

  return {
    rows,
    warnings,
    columnsDetected,
  };
}