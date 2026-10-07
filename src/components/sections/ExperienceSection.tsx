import { experience } from "../../data/experience";
import { ExperienceCard } from "../ui/ExperienceCard";

export function ExperienceSection() {
  return (
    <section className="experience-section" aria-labelledby="experience-title">
      <div className="section-intro">
        <p className="section-count">
          03 <span>/ 04</span>
        </p>
        <h2 id="experience-title" className="section-title" tabIndex={-1}>
          EXPERIENCE
        </h2>
        <p className="section-description">
          Practical experience in software development and engineering teams.
        </p>
        <p className="experience-caption">A CONTINUING JOURNEY</p>
      </div>
      <div className="experience-grid">
        {experience.map((item, i) => (
          <ExperienceCard key={item.company} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
