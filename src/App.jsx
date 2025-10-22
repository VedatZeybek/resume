// Place this file as: src/App.jsx
// Also create src/main.jsx as shown in the comment below and a basic index.html from Vite

import React from 'react'
import Projects from './Projects';

import soft1 from './assets/soft1.jpeg';


// Simple CSS (create src/styles.css and import it in main.jsx)
// You can replace with Tailwind later if you like.
function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        <a className="brand" href="#">Vedat Zeybek</a>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="menu-toggle" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </header>
  );
}



function Hero() {
  return (
    <section
      id="home"
      className="hero animated-gradient"
    >
      <div className="container hero-flex">
        <div className="hero-image">
          <img src="/me.jpeg" alt="Vedat Zeybek" className="profile-image" />
        </div>
        <div className="hero-text">
          <h1 className="text-5xl font-extrabold mb-6">
            Hi, I'm <span className="accent-text">Vedat </span>
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Full Stack Web & Mobile Developer passionate about building modern,
            scalable, and responsive applications 
          </p>
          <a
            href="#projects"
            className="cta-button"
          >
            See my work
          </a>
        </div>
      </div>
    </section>
  );
}


function About() {
  return (
    <section id="about" className="about container">
      <h2>About Me</h2>
      <div className="about-grid">
        <div className="about-image">
          <img src={soft1} alt="Vedat profile" />
        </div>

        <div className="about-text">
          <p>
            Full Stack Web & Mobile Developer with experience in{" "}
            <strong>Flutter, React, and Node.js</strong>. Passionate about building 
            responsive web apps, cross-platform mobile apps, and delivering 
            scalable solutions.
          </p>

          <ul>
            <li> Frontend: React, Flutter</li>
            <li> Backend: Node.js, Express</li>
            <li> Database: PostgreSQL, MongoDB</li>
          </ul>

          <a href="#contact" className="btn">Let’s Connect</a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact container">
      <h2>Contact</h2>
      <p>If you'd like to work together or have feedback, email: <a href="mailto:vedatzeybek20@gmail.com">vedatzeybek20@gmail.com</a></p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">© {new Date().getFullYear()} Vedat — Built with React + Vite</div>
    </footer>
  )
}

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
