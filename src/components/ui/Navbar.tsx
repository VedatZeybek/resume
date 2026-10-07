import { useEffect, useState } from "react";
import { profile } from "../../data/profile";
import {
  sections,
  type SectionIndex,
  useNavigation,
} from "../../store/navigationStore";

export function Navbar({
  navigate,
}: {
  navigate: (index: SectionIndex) => void;
}) {
  const { active, phase } = useNavigation();
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Istanbul",
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <header className={`navbar ${phase !== "idle" ? "is-travelling" : ""}`}>
      <button
        className="brand"
        onClick={() => navigate(0)}
        disabled={phase !== "idle"}
        aria-label="Vedat Zeybek, home"
      >
        VZ<span>.</span>
      </button>
      <nav aria-label="Main navigation">
        {sections.map((section, i) => (
          <button
            key={section}
            onClick={() => navigate(i as SectionIndex)}
            disabled={phase !== "idle"}
            aria-current={active === i ? "page" : undefined}
            className={active === i ? "active" : ""}
          >
            {section}
          </button>
        ))}
      </nav>
      <div className="navbar-actions">
        <div className="local-time">
          <span className="status-dot" /> IST <time>{time}</time>
        </div>
        {profile.resume && (
          <a
            className="resume-download"
            href={profile.resume}
            download="Vedat-Zeybek-CV.pdf"
            aria-label="Download Vedat Zeybek's CV"
          >
            CV <span aria-hidden="true">↓</span>
          </a>
        )}
      </div>
    </header>
  );
}
