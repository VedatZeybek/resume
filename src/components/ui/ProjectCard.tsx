import { memo } from "react";
import type { Project } from "../../data/projects";
import { ProjectVisual } from "./ProjectVisual";

export const ProjectCard = memo(function ProjectCard({
  project,
  active = true,
}: {
  project: Project;
  active?: boolean;
}) {
  const href =
    project.repository ??
    `mailto:vedatzeybek20@gmail.com?subject=${encodeURIComponent(`Project inquiry: ${project.name}`)}`;
  return (
    <article
      className={`project-card ${project.recognition ? "featured" : ""}`}
      inert={!active}
    >
      <div className="card-top">
        <span>{project.id}</span>
        <a
          className="project-source-link"
          href={href}
          draggable={false}
          aria-label={
            project.repository
              ? `View ${project.name} source`
              : `Ask about ${project.name}`
          }
          target={project.repository ? "_blank" : undefined}
          rel={project.repository ? "noopener noreferrer" : undefined}
        >
          ↗
        </a>
      </div>
      <ProjectVisual kind={project.kind} image={project.image} />
      <div className="project-copy">
        {project.recognition && (
          <div className="recognition">
            <span>✧</span> {project.recognition}
          </div>
        )}
        <h3>{project.name}</h3>
        <p className="project-subtitle">{project.subtitle}</p>
        <p className="project-description">{project.description}</p>
      </div>
      <ul className="tags" aria-label="Technologies">
        {project.technologies.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </article>
  );
});
