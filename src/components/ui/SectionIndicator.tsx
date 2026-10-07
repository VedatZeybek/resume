import {
  sections,
  type SectionIndex,
  useNavigation,
} from "../../store/navigationStore";

export function SectionIndicator({
  navigate,
}: {
  navigate: (index: SectionIndex) => void;
}) {
  const { active, phase } = useNavigation();
  return (
    <nav className="section-indicator" aria-label="Journey stops">
      {sections.map((name, i) => (
        <button
          key={name}
          onClick={() => navigate(i as SectionIndex)}
          disabled={phase !== "idle"}
          aria-label={`Go to ${name}`}
          aria-current={i === active ? "step" : undefined}
          className={active === i ? "active" : ""}
        >
          <span>0{i + 1}</span>
          <i />
        </button>
      ))}
    </nav>
  );
}
