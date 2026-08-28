// Formats a SQLite UTC timestamp ("YYYY-MM-DD HH:MM:SS") into a short relative label.
export function timeAgo(sqliteTimestamp) {
  if (!sqliteTimestamp) return '';
  const iso = sqliteTimestamp.includes('T') ? sqliteTimestamp : `${sqliteTimestamp.replace(' ', 'T')}Z`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
