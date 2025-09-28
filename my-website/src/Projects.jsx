import { useEffect, useState } from "react";
import './project.css'

function Projects() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();
        setRepos(data);

        // Backend varsa localStorage'ı güncelle
        localStorage.setItem("projects", JSON.stringify(data));
      } catch (err) {
        console.error("API error, backend yok, localStorage'dan alınıyor:", err);

        // Backend yoksa localStorage'dan veri çek
        const localData = localStorage.getItem("projects");
        if (localData) {
          setRepos(JSON.parse(localData));
        }
      }
    }

    fetchRepos();

    // İsteğe bağlı: Backend açıldığında otomatik güncelleme (örn: 1 dakikada bir)
    const interval = setInterval(fetchRepos, 60000);
    return () => clearInterval(interval);

  }, []);

  return (
    <section id="projects" className="projects container">
      <h2>Projects (from GitHub via backend)</h2>
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

export default Projects;
