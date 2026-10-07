import { useId, type CSSProperties } from "react";
import type { Project } from "../../data/projects";
import { useProjectCarousel } from "../../hooks/useProjectCarousel";
import { ProjectCard } from "./ProjectCard";

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const instructionId = useId();
  const preferredIndex = projects.findIndex((project) => project.initiallyActive);
  const { activeIndex, isDragging, width, viewport, select, step, pointerHandlers } =
    useProjectCarousel(
      projects.length,
      preferredIndex >= 0 ? preferredIndex : Math.floor(projects.length / 2),
    );
  const mobile = width < 560;
  const rawCardWidth = mobile
    ? Math.max(220, Math.min(350, width * 0.86))
    : Math.max(310, Math.min(380, width * 0.43));
  const cardWidth = Math.round(rawCardWidth / 2) * 2;
  // Account for the neighbor's perspective and scale, leaving a small visible gap.
  const spacing = cardWidth * 0.97 + 12;
  if (projects.length === 0)
    return <p className="carousel-empty">Projects will appear here.</p>;
  return (
    <div
      className="project-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      data-active-index={activeIndex}
      data-project-count={projects.length}
    >
      <p id={instructionId} className="sr-only">
        Drag horizontally, scroll over the cards, or use the left and right
        arrow keys to change projects. Scroll outside the cards or use the main
        navigation to change sections.
      </p>
      <div
        ref={viewport}
        className={`carousel-viewport ${isDragging ? "is-dragging" : ""}`}
        data-project-carousel
        tabIndex={0}
        aria-describedby={instructionId}
        {...pointerHandlers}
      >
        <div
          className="carousel-stage"
          style={{ "--card-width": `${cardWidth}px` } as CSSProperties}
        >
          {projects.map((project, index) => {
            const offset = index - activeIndex;
            const distance = Math.abs(offset);
            const active = distance === 0;
            const visible = distance <= 2;
            const style: CSSProperties = {
              transform: `translateX(calc(${offset * spacing}px + var(--drag-x, 0px))) translateZ(${active ? 40 : distance === 1 ? -55 : -110}px) rotateY(${active ? 0 : -Math.sign(offset) * (distance === 1 ? 4 : 5)}deg) scale(${active ? 1 : distance === 1 ? 0.88 : 0.79})`,
              opacity: active
                ? 1
                : distance === 1
                  ? 0.5
                  : distance === 2
                    ? 0.16
                    : 0,
              zIndex: projects.length + 1 - distance,
              visibility: distance > 3 ? "hidden" : "visible",
              pointerEvents: visible ? "auto" : "none",
            };
            return (
              <div
                key={project.id}
                className={`carousel-slide ${active ? "is-active" : ""}`}
                style={style}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${projects.length}: ${project.name}`}
                aria-hidden={!active}
              >
                <ProjectCard project={project} active={active} />
                {!active && visible && (
                  <button
                    type="button"
                    className="carousel-select"
                    tabIndex={-1}
                    aria-label={`Select ${project.name}`}
                    onClick={() => select(index)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => step(-1)}
          disabled={activeIndex === 0}
          aria-label="Previous project"
        >
          ←
        </button>
        <span className="carousel-counter" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")}{" "}
          <span>/ {String(projects.length).padStart(2, "0")}</span>
        </span>
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => step(1)}
          disabled={activeIndex === projects.length - 1}
          aria-label="Next project"
        >
          →
        </button>
      </div>
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Project {activeIndex + 1} of {projects.length}:{" "}
        {projects[activeIndex].name}
      </p>
    </div>
  );
}
