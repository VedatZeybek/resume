import { SocialLinks } from "../ui/SocialLinks";
import { profile } from "../../data/profile";

export function ContactSection() {
  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <div className="contact-intro">
        <div className="contact-heading">
          <p className="section-count">
            04 <span>/ 04</span>
          </p>
          <p className="section-title">CONTACT</p>
        </div>
        <h2 id="contact-title" tabIndex={-1}>
          IDEAS INTO
          <br />
          <span>SYSTEMS.</span>
        </h2>
        <p className="contact-description">
          Inquiries about software engineering, technical collaboration and
          project development.
        </p>
      </div>
      <div className="contact-information">
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email} <span aria-hidden="true">↗</span>
        </a>
        <dl className="contact-details">
          <div>
            <dt>PHONE</dt>
            <dd>
              <a href={profile.phoneHref}>{profile.phone}</a>
            </dd>
          </div>
          <div>
            <dt>LOCATION</dt>
            <dd>{profile.location}</dd>
          </div>
        </dl>
        <SocialLinks />
      </div>
    </section>
  );
}
