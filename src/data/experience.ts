export type Experience = {
  company: string;
  role: string;
  date: string;
  description: string;
  highlights: string[];
  technologies: string[];
};
// Responsibilities, dates and technologies from Vedat_Zeybek_CV.pdf.
export const experience: Experience[] = [
  {
    company: "ASELSAN",
    role: "Software Engineering Intern",
    date: "Jul 2026 — Sep 2026",
    description:
      "Development of a persistent knowledge and memory system for AI-assisted software engineering workflows.",
    highlights: [
      "Backend services combining search, LLM integrations and hybrid retrieval.",
      "Benchmark pass rate increased from 65.1% to 73.0% with persistent engineering memory.",
    ],
    technologies: ["Java", "Spring Boot", "PostgreSQL", "pgvector", "Docker"],
  },
  {
    company: "Orion Innovation",
    role: "Software Engineering Intern",
    date: "Sep 2025 — Jun 2026",
    description:
      "Contributions to backend services, internal tools, integrations and AI-assisted workflows, including work on a Nokia project.",
    highlights: [
      "Feature implementation, troubleshooting and improvements across different codebases and project requirements.",
      "Daily development and maintenance using APIs, Docker, Git and internal engineering tools.",
    ],
    technologies: ["APIs", "Docker", "Git"],
  },
];
