export default function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.percent, 0);
  const gradient = data
    .filter((item) => item.percent > 0)
    .map((item, index, list) => {
      const start = list
        .slice(0, index)
        .reduce((sum, entry) => sum + entry.percent, 0);
      const end = start + item.percent;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  const primary = data[0];

  return (
    <div className="donut-chart">
      <div className="donut-chart__visual">
        <div
          className="donut-chart__ring"
          style={{
            background: `conic-gradient(${gradient}, #eef2fb ${total}% 100%)`,
          }}
        >
          <div className="donut-chart__center">
            <strong>{primary.percent}%</strong>
            <span>{primary.label}</span>
          </div>
        </div>
      </div>

      <div className="donut-chart__legend">
        {data.map((item) => (
          <div key={item.label} className="legend-item">
            <div className="legend-item__meta">
              <span className="legend-item__dot" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
            <strong>
              {item.value} ({item.percent}%)
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
