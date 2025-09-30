import { useEffect, useState } from 'react';
import './project.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Public klasöründeki projects.json'dan veri çek
      const response = await fetch('projects.json');
      
      if (!response.ok) {
        throw new Error('Projeler yüklenemedi');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Proje yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="projects">
        <h2>My Projects</h2>
        <div className="loading">
          <div className="spinner"></div>
          <p>Projects Updating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects">
        <h2>My Projects</h2>
        <div className="error">
          <p>❌ Hata: {error}</p>
          <button onClick={fetchProjects}>Tekrar Dene</button>
        </div>
      </div>
    );
  }

  return (
    <section id="projects">
    <div className="projects">
      <h2>My Projects ({projects.length})</h2>
      <div className="grid">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <div>
              <h3>{project.name}</h3>
              <p>{project.description || 'Açıklama yok'}</p>
            </div>
            <a 
              href={project.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default Projects;