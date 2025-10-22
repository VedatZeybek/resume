import { useEffect, useState } from 'react';

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
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">My Projects</h2>
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">My Projects</h2>
          <div className="error">
            <p>❌ Error: {error}</p>
            <button className="btn" onClick={fetchProjects}>Try Again</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">My Projects ({projects.length})</h2>
        <div className="grid">
          {projects.map((project) => (
            <div key={project.id} className="card">
              <div>
                <h3>{project.name}</h3>
                {project.language && (
                  <div className="meta">
                    <span className="chip">{project.language}</span>
                  </div>
                )}
                <p>{project.description || 'No description available'}</p>
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