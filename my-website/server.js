import express from "express";
import fetch from "node-fetch";
import cors from "cors";  // <- ekle

const app = express();
app.use(cors()); // <- frontend’den gelen isteklere izin verir

app.get("/api/projects", async (req, res) => {
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
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
