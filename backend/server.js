// ...existing code...

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());

// Endpoint to update projects.json from GitHub
app.post("/api/update-projects", async (req, res) => {
  try {
    const gh = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos`);
    const repos = await gh.json();
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(repos, null, 2));
    res.json({ message: 'projects.json updated', count: repos.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update projects.json' });
  }
});
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import https from "https";
import { fileURLToPath } from 'url';

// ...existing code...

// projects.json dosyasının yolu
const PROJECTS_FILE = path.join(__dirname, 'projects.json');

// Projects.json dosyasını okuma fonksiyonu
async function readProjectsFile() {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Projects.json dosyası bulunamadı, boş array döndürülüyor');
    return [];
  }
}

// Projects.json dosyasına yazma fonksiyonu
async function writeProjectsFile(projects) {
  try {
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error('Projects.json dosyasına yazma hatası:', error);
    return false;
  }
}

// GitHub'dan repos çekme (mevcut fonksiyon)
app.get("/api/projects", async (req, res) => {
  try {
    const gh = await fetch("https://api.github.com/users/VedatZeybek/repos");
    const repos = await gh.json();

    const reposWithReadme = await Promise.all(
      repos.filter(r => !r.fork).map(async (repo) => {
        try {
          const readmeRes = await fetch(`https://raw.githubusercontent.com/VedatZeybek/${repo.name}/${repo.default_branch}/README.md`);
          const readmeText = await readmeRes.text();
          return { ...repo, readme: readmeText };
        } catch {
          return { ...repo, readme: "" };
        }
      })
    );

    res.json(reposWithReadme);
  } catch (error) {
    res.status(500).json({ error: 'GitHub repos çekilemedi' });
  }
});

// Local projects.json'dan projeleri getirme
app.get("/api/local-projects", async (req, res) => {
  try {
    const projects = await readProjectsFile();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Local projeler okunamadı' });
  }
});

// Yeni proje ekleme
app.post("/api/projects", async (req, res) => {
  try {
    const { name, description, html_url } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name ve description gerekli' });
    }

    const projects = await readProjectsFile();
    
    // Yeni ID oluşturma
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    
    const newProject = {
      id: newId,
      name,
      description,
      html_url: html_url || `https://github.com/VedatZeybek/${name}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    projects.push(newProject);
    
    const success = await writeProjectsFile(projects);
    
    if (success) {
      res.status(201).json(newProject);
    } else {
      res.status(500).json({ error: 'Proje kaydedilemedi' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Proje eklenirken hata oluştu' });
  }
});

// Proje güncelleme
const GITHUB_USER = 'VedatZeybek'; // Change to your GitHub username if needed
app.put("/api/projects/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { name, description, html_url } = req.body;
    const projects = await readProjectsFile();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Proje bulunamadı' });
    }
    // Güncelleme
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(html_url && { html_url }),
      updated_at: new Date().toISOString()
    };
    const success = await writeProjectsFile(projects);
    if (success) {
      res.json(projects[projectIndex]);
    } else {
      res.status(500).json({ error: 'Proje güncellenemedi' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Proje güncellenirken hata oluştu' });
  }
});

// Proje silme
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const projects = await readProjectsFile();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    
    if (projects.length === filteredProjects.length) {
      return res.status(404).json({ error: 'Proje bulunamadı' });
    }

    const success = await writeProjectsFile(filteredProjects);
    
    if (success) {
      res.json({ message: 'Proje silindi', deletedId: projectId });
    } else {
      res.status(500).json({ error: 'Proje silinemedi' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Proje silinirken hata oluştu' });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));