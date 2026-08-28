// Pure-SVG donut chart — no charting library needed for a single, simple visualization.
// `data` = [{ label, value, color }], values are plotted proportionally to their sum.
export default function DonutChart({ data, size = 140, thickness = 20 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let offset = 0;
  const segments = data.map((d) => {
    const fraction = total > 0 ? d.value / total : 0;
    const length = fraction * circumference;
    const dashArray = `${length} ${circumference - length}`;
    const dashOffset = -offset;
    offset += length;
    return { ...d, dashArray, dashOffset };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Sales by category donut chart">
      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#EEF0EC" strokeWidth={thickness} />
        {segments.map((s, i) => (
          <circle
            key={s.label ?? i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={s.dashArray}
            strokeDashoffset={s.dashOffset}
            strokeLinecap="butt"
          />
        ))}
      </g>
    </svg>
  );
}
