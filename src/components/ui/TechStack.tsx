import { techStack } from "../../data/techStack";

export function TechStack() {
  return (
    <section className="tech-stack" aria-labelledby="tech-stack-title">
      <h2 id="tech-stack-title">TECH STACK</h2>
      <p id="tech-stack-help" className="sr-only">
        Hover over or focus the technology strip to pause its movement.
      </p>
      <div
        className="tech-stack-viewport"
        tabIndex={0}
        role="region"
        aria-label="Technologies"
        aria-describedby="tech-stack-help"
      >
        <div className="tech-stack-track">
          {[false, true].map((duplicate) => (
            <ul
              key={String(duplicate)}
              className={`tech-stack-list${duplicate ? " tech-stack-copy" : ""}`}
              role="list"
              aria-hidden={duplicate || undefined}
              inert={duplicate}
            >
              {techStack.map((tech) => (
                <li key={tech.name} className="tech-stack-item" title={tech.name}>
                  <img
                    src={tech.icon}
                    alt=""
                    width={26}
                    height={26}
                    decoding="async"
                    draggable={false}
                    className={
                      tech.name === "GitHub" || tech.name === "Linux"
                        ? "tech-icon-light"
                        : undefined
                    }
                  />
                  <span>{tech.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
