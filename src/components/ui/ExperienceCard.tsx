import type { Experience } from "../../data/experience";

export function ExperienceCard({
  item,
  index,
}: {
  item: Experience;
  index: number;
}) {
  return (
    <article className="experience-card">
      <div className="experience-date">
        <span className="timeline-node" />
        <time>{item.date}</time>
      </div>
      <div className="experience-body">
        <div className="experience-card-top">
          <span>0{index + 1}</span>
          <span>ENGINEERING EXPERIENCE</span>
        </div>
        <h3>{item.company}</h3>
        <p className="experience-role">{item.role}</p>
        <div className="experience-rule" />
        <p className="experience-description">{item.description}</p>
        <ul className="experience-highlights">
          {item.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        {item.technologies.length > 0 && (
          <ul className="tags" aria-label="Technologies">
            {item.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}
        <span className="experience-type">
          INTERNSHIP <span>↗</span>
        </span>
      </div>
    </article>
  );
}
