import SectionCard from "../components/SectionCard";
import { messageTemplates } from "../data/dashboardData";

export default function MessageTemplatePage() {
  return (
    <div className="page-stack">
      <div className="template-grid">
        {messageTemplates.map((template) => (
          <SectionCard
            key={template.title}
            title={template.title}
            action={<span className="badge badge--soft">{template.tag}</span>}
          >
            <p className="template-card__body">{template.content}</p>
            <div className="template-card__actions">
              <button className="btn-primary">Edit Template</button>
              <button className="btn-secondary">Preview</button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
