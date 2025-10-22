import { useState } from "react";


import me from './assets/me.jpeg';


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <div className="brand-container">
          <img src={me} alt="Vedat Zeybek" className="brand-image" />
          <a className="brand" href="#">Vedat</a>
        </div>

        {/* Hamburger menü butonu */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <nav className={isOpen ? "nav-links open" : "nav-links"}>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
