import { lazy, Suspense, useRef } from "react";
import { Navbar } from "./components/ui/Navbar";
import { SectionIndicator } from "./components/ui/SectionIndicator";
import { MeSection } from "./components/sections/MeSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { ContactSection } from "./components/sections/ContactSection";
import { useWarpTransition } from "./hooks/useWarpTransition";
import { useSectionNavigation } from "./hooks/useSectionNavigation";
import {
  sections,
  useNavigation,
  type SectionIndex,
} from "./store/navigationStore";
const SpaceScene = lazy(() => import("./three/SpaceScene"));

export default function App() {
  const content = useRef<HTMLElement>(null);
  const navigate = useWarpTransition(content);
  useSectionNavigation(navigate, content);
  const { active, target, phase } = useNavigation();
  const travelling = phase !== "idle";
  return (
    <div
      className="portfolio"
      data-phase={phase}
      data-section={sections[active].toLowerCase()}
    >
      <Suspense
        fallback={
          <div className="space-fallback">
            <span className="scene-loading" role="status">
              ENTERING THE QUIET...
            </span>
          </div>
        }
      >
        <SpaceScene />
      </Suspense>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar navigate={navigate} />
      <div className="chapter-marker" aria-hidden="true">
        <span>0{active + 1}</span>
        <small>/ 04</small>
      </div>
      <main
        id="main-content"
        tabIndex={-1}
        ref={content}
        className="section-shell"
        inert={travelling}
      >
        {active === 0 ? (
          <MeSection />
        ) : active === 1 ? (
          <ProjectsSection />
        ) : active === 2 ? (
          <ExperienceSection />
        ) : (
          <ContactSection />
        )}
      </main>
      <SectionIndicator navigate={navigate} />
      <span className="sr-only" role="status" aria-live="polite">
        {travelling
          ? `Travelling to ${sections[target]}`
          : `${sections[active]}, section ${active + 1} of 4`}
      </span>
      <footer className="journey-footer">
        <button
          onClick={() => navigate(Math.min(active + 1, 3) as SectionIndex)}
          disabled={travelling || active === 3}
          className="explore-hint"
        >
          {active === 3 ? "END OF JOURNEY" : "SCROLL OR CLICK TO EXPLORE"}{" "}
          <span>{active === 3 ? "✧" : "↓"}</span>
        </button>
      </footer>
    </div>
  );
}
