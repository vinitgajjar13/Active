export default function LineChart({ data, compact = false }) {
  const width = 620;
  const height = compact ? 182 : 262;
  const paddingX = compact ? 24 : 36;
  const paddingTop = compact ? 16 : 24;
  const paddingBottom = compact ? 40 : 44;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;

  const points = data.map((item, index) => {
    const x = paddingX + (chartWidth / (data.length - 1)) * index;
    const y = paddingTop + chartHeight - (item.value / 100) * chartHeight;
    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  const ticks = [100, 75, 50, 25, 0];

  return (
    <div className={`line-chart ${compact ? "line-chart--compact" : ""}`}>
      <svg
        className="line-chart__svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={compact ? "lineAreaCompact" : "lineArea"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(44, 99, 247, 0.22)" />
            <stop offset="100%" stopColor="rgba(44, 99, 247, 0.03)" />
          </linearGradient>
        </defs>

        {ticks.map((tick) => {
          const y = paddingTop + chartHeight - (tick / 100) * chartHeight;
          return (
            <g key={tick}>
              <line
                x1={paddingX}
                x2={width - paddingX}
                y1={y}
                y2={y}
                stroke="#edf1fa"
                strokeDasharray={tick === 0 ? "0" : "4 8"}
              />
              <text x={10} y={y + 4} className="line-chart__tick">
                {tick}%
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill={compact ? "url(#lineAreaCompact)" : "url(#lineArea)"} />
        <path d={linePath} fill="none" stroke="#2c63f7" strokeWidth="3.2" strokeLinecap="round" />

        {points.map((point) => (
          <g key={point.day}>
            <circle cx={point.x} cy={point.y} r="6.2" fill="white" stroke="#2c63f7" strokeWidth="3" />
            <text x={point.x} y={height - 12} textAnchor="middle" className="line-chart__label">
              {point.day}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

{
  points.map((point) => (
    <g key={point.day}>
      <circle cx={point.x} cy={point.y} r="5" fill="white" stroke="var(--blue-600)" strokeWidth="2.5" />
      <text x={point.x} y={height - 12} textAnchor="middle" className="line-chart__label">
        {point.day}
      </text>
    </g>
  ))
}
      </svg >
    </div >
  );
}
