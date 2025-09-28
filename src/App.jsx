// Place this file as: src/App.jsx
// Also create src/main.jsx as shown in the comment below and a basic index.html from Vite

import React from 'react'


// Simple CSS (create src/styles.css and import it in main.jsx)
// You can replace with Tailwind later if you like.

function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / Brand */}
        <a className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors" href="#">
          Vedat
        </a>

        {/* Menü */}
        <nav className="space-x-6 hidden md:flex">
          <a href="#about" className="text-gray-700 hover:text-indigo-600 transition-colors">About</a>
          <a href="#projects" className="text-gray-700 hover:text-indigo-600 transition-colors">Projects</a>
          <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors">Contact</a>
        </nav>

        {/* Hamburger Menü (mobil için) */}
        <div className="md:hidden">
          <button className="text-gray-700 hover:text-indigo-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}


function Hero() {
  return (
    <section
      id="home"
      className="hero flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white"
    >
      <div className="container text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          Hi, I'm <span className="text-yellow-300">Vedat 👋</span>
        </h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Full Stack Web & Mobile Developer passionate about building modern,
          scalable, and responsive applications 🚀
        </p>
        <a
          href="#projects"
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:scale-110 transform transition duration-300"
        >
          See my work
        </a>
      </div>
    </section>
  )
}


function About() {
  return (
    <section id="about" className="about container">
      <h2>About Me</h2>
      <div className="about-grid">
        {/* Profil resmi */}
        <div className="about-image">
          <img src="/me.jpg" alt="Vedat profile" />
        </div>

        {/* Yazı kısmı */}
        <div className="about-text">
          <h3>I'm Vedat 👨‍💻</h3>
          <p>
            Full Stack Web & Mobile Developer with experience in{" "}
            <strong>Flutter, React, and Node.js</strong>. Passionate about building 
            responsive web apps, cross-platform mobile apps, and delivering 
            scalable solutions.
          </p>

          <ul>
            <li>⚡ Frontend: React, Flutter</li>
            <li>⚡ Backend: Node.js, Express</li>
            <li>⚡ Database: PostgreSQL, MongoDB</li>
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
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
