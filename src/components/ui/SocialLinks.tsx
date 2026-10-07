import { profile } from "../../data/profile";

export function SocialLinks() {
  const links = [
    {
      label: "EMAIL",
      href: `mailto:${profile.email}`,
      detail: "Project inquiries",
      external: false,
    },
    {
      label: "GITHUB",
      href: profile.github,
      detail: "Source repositories",
      external: true,
    },
    {
      label: "LINKEDIN",
      href: profile.linkedin,
      detail: profile.linkedin ? "Professional profile" : "Coming soon",
      external: true,
    },
    {
      label: "RESUME",
      href:
        profile.resume || `mailto:${profile.email}?subject=Resume%20request`,
      detail: profile.resume ? "Download CV · PDF" : "Request a copy",
      external: false,
      download: profile.resume ? "Vedat-Zeybek-CV.pdf" : undefined,
    },
  ];
  return (
    <div className="social-links">
      {links.map((link) =>
        link.href ? (
          <a
            key={link.label}
            href={link.href}
            download={link.download}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            <span className="social-label">
              {link.label}
              <span aria-hidden="true">↗</span>
            </span>
            <span className="social-detail">{link.detail}</span>
          </a>
        ) : (
          <div
            key={link.label}
            className="social-unavailable"
            aria-disabled="true"
          >
            <span className="social-label">
              {link.label}
              <span aria-hidden="true">—</span>
            </span>
            <span className="social-detail">{link.detail}</span>
          </div>
        ),
      )}
    </div>
  );
}
