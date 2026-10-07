import { projects } from "../../data/projects";
import { ProjectCarousel } from "../ui/ProjectCarousel";

export function ProjectsSection() {
  return (
    <section className="projects-section" aria-labelledby="projects-title">
      <div className="section-intro">
        <p className="section-count">
          02 <span>/ 04</span>
        </p>
        <h2 id="projects-title" className="section-title" tabIndex={-1}>
          PROJECTS
        </h2>
        <p className="section-description">
          Selected work exploring the application of AI, backend systems and
          full-stack development to practical engineering problems.
        </p>
        <ul className="disciplines">
          <li>AI</li>
          <li>BACKEND</li>
          <li>SYSTEMS</li>
          <li>FULL STACK</li>
        </ul>
      </div>
      <ProjectCarousel projects={projects} />
    </section>
  );
}
