import { TechStack } from "../ui/TechStack";

export function MeSection() {
  return (
    <section className="me-section" aria-labelledby="me-title">
      <h1 id="me-title" tabIndex={-1}>
        VEDAT
        <br />
        <span>ZEYBEK</span>
      </h1>
      <p className="role">SOFTWARE ENGINEER</p>
      <p className="intro">
        Software engineering at the intersection of intelligent systems,
        <br className="desktop-break" /> scalable backends and digital
        experiences.
      </p>
      <p className="expertise">
        AI <span>·</span> BACKEND <span>·</span> SYSTEMS <span>·</span> PROBLEM
        SOLVING
      </p>
      <TechStack />
    </section>
  );
}
