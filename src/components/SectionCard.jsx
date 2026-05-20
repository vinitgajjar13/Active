export default function SectionCard({ title, action, children, className = "" }) {
  return (
    <section className={`section-card ${className}`.trim()}>
      {(title || action) && (
        <div className="section-card__header">
          {title ? <h3>{title}</h3> : <span />}
          {action ? <div className="section-card__action">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
