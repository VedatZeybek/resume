// Projects.jsx
import { useEffect, useState } from "react";
import './project.css';

export default function Projects() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    async function fetchRepos() {
      try {
        // Önce backend API'ye bağlanmayı dene
        const res = await fetch("http://localhost:5000/api/projects");
        if (!res.ok) throw new Error("Backend not available");
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        console.warn("Backend çalışmıyor, projects.json'dan yükleniyor:", err);
        try {
          // fallback: public klasöründeki JSON'dan oku
          const res = await fetch("backend/projects.json");
          const data = await res.json();
          setRepos(data);
        } catch (jsonErr) {
          console.error("Fallback JSON da yüklenemedi:", jsonErr);
        }
      }
    }
    fetchRepos();
  }, []);

  return (
    <section id="projects" className="projects container">
      <h2>Projects</h2>
      <div className="grid">
        {repos.map(repo => (
          <article key={repo.id} className="card">
            <h3>{repo.name}</h3>
            <p>{repo.description || "No description"}</p>
            <a href={repo.html_url} target="_blank" rel="noreferrer">View on GitHub</a>
          </article>
        ))}
      </div>
    </section>
  );
}
