import {
  CheckIcon,
  ClockIcon,
  CloseIcon,
  FacultyIcon,
} from "./icons";

function StatIcon({ icon, color }) {
  const iconMap = {
    faculty: FacultyIcon,
    present: CheckIcon,
    absent: CloseIcon,
    pending: ClockIcon,
  };
  const Icon = iconMap[icon] || FacultyIcon;

  return (
    <div className={`stat-card__icon stat-card__icon--${color}`}>
      <Icon className="icon icon--lg" />
    </div>
  );
}

export default function StatCard({ title, value, detailLabel, detailValue, color, icon, compact = false }) {
  return (
    <article className={`stat-card ${compact ? "stat-card--compact" : ""}`}>
      <div className="stat-card__main">
        <StatIcon icon={icon} color={color} />
        <div>
          <p className="stat-card__title">{title}</p>
          <h4 className="stat-card__value">{value}</h4>
        </div>
      </div>
      <div className={`stat-card__footer stat-card__footer--${color}`}>
        <span>{detailLabel || detailValue}</span>
        {detailLabel ? <strong>{detailValue}</strong> : null}
      </div>
    </article>
  );
}
