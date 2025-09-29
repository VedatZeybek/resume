const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;

// CORS ayarları - Frontend'den gelen isteklere izin ver
app.use(cors());
app.use(express.json());

// GitHub API'den projeleri çek ve projects.json'a kaydet
async function fetchGitHubRepos(username) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }
    
    const repos = await response.json();
    
    // Sadece gerekli bilgileri filtrele
    const filteredRepos = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      topics: repo.topics
    }));
    
    // projects.json dosyasına kaydet
    const filePath = path.join(__dirname, 'projects.json');
    await fs.writeFile(filePath, JSON.stringify(filteredRepos, null, 2));
    
    console.log(`✅ ${filteredRepos.length} proje GitHub'dan çekildi ve kaydedildi`);
    return filteredRepos;
  } catch (error) {
    console.error('❌ GitHub API hatası:', error.message);
    throw error;
  }
}

// Frontend'e projects.json'u sun
app.get('/api/projects', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'projects.json');
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('❌ projects.json okunamadı:', error.message);
    res.status(404).json({ error: 'Projeler bulunamadı' });
  }
});

// GitHub'dan projeleri yenile (manuel tetikleme için)
app.post('/api/refresh-projects', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'GitHub kullanıcı adı gerekli' });
  }
  
  try {
    const projects = await fetchGitHubRepos(username);
    res.json({ 
      message: 'Projeler başarıyla güncellendi',
      count: projects.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server başlatıldığında otomatik olarak GitHub'dan çek
async function initServer() {
  const GITHUB_USERNAME = 'VedatZeybek'; // Kendi GitHub kullanıcı adınızı buraya yazın
  
  console.log('🚀 Server başlatılıyor...');
  
  // İlk açılışta GitHub'dan projeleri çek
  try {
    await fetchGitHubRepos(GITHUB_USERNAME);
  } catch (error) {
    console.error('⚠️ İlk yüklemede hata oluştu, mevcut projects.json kullanılacak');
  }
  
  // Her 1 saatte bir otomatik güncelle (isteğe bağlı)
  setInterval(async () => {
    console.log('🔄 Projeler otomatik olarak güncelleniyor...');
    try {
      await fetchGitHubRepos(GITHUB_USERNAME);
    } catch (error) {
      console.error('⚠️ Otomatik güncelleme hatası:', error.message);
    }
  }, 3600000); // 1 saat = 3600000ms
  
  app.listen(PORT, () => {
    console.log(`✅ Server http://localhost:${PORT} adresinde çalışıyor`);
  });
}

// Server'ı başlat
initServer();