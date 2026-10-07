import minishellImage from "../assets/projects/minishell.png";
import minirtImage from "../assets/projects/minirt.png";
import webservImage from "../assets/projects/webserv.png";

export type Project = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  technologies: string[];
  kind: "memory" | "assistant" | "community" | "webserv" | "minirt" | "minishell";
  recognition?: string;
  initiallyActive?: boolean;
  repository?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};
export const projects: Project[] = [
  {
    id: "01",
    name: "Minishell",
    subtitle: "Unix Shell in C",
    description:
      "A Unix shell with command parsing, environment variables, built-in commands, external programs, pipes and redirections.",
    technologies: ["C", "Unix", "Processes", "Pipes", "Redirections"],
    kind: "minishell",
    image: {
      src: minishellImage,
      alt: "Minishell terminal showing command execution, pipes and output redirection.",
      width: 1106,
      height: 575,
    },
    repository: "https://github.com/VedatZeybek/42-minishell",
  },
  {
    id: "02",
    name: "Usta",
    subtitle: "Engineering Memory for Coding Agents",
    description:
      "A persistent engineering memory service that helps coding agents retrieve and store project knowledge.",
    technologies: [
      "Spring Boot",
      "PostgreSQL",
      "pgvector",
      "LLM",
      "BM25",
      "RAG",
    ],
    kind: "memory",
    repository: "https://github.com/VedatZeybek/usta",
  },
  {
    id: "03",
    name: "VitrA Press AI Assistant",
    initiallyActive: true,
    subtitle: "Knowledge that keeps things moving.",
    recognition: "1st Place — Eczacıbaşı EnGenius’25",
    description:
      "RAG-based AI assistant for press machine fault diagnosis, helping engineers find solutions faster using internal documentation.",
    technologies: ["RAG", "LLM", "AI Assistant", "Knowledge Base"],
    kind: "assistant",
    repository: "https://github.com/VedatZeybek/press-assistant",
  },
  {
    id: "04",
    name: "Community Management System",
    subtitle: "Member Requests & Role Management",
    description:
      "A backend-oriented system for membership requests, permissions and administration, with testing built in.",
    technologies: ["Spring Boot", "PostgreSQL", "Docker", "Testing"],
    kind: "community",
    repository: "https://github.com/42-Istanbul-Community/community-management-system",
  },
  {
    id: "05",
    name: "Webserv",
    subtitle: "HTTP/1.1 Server in C++",
    description:
      "A configurable HTTP server with non-blocking I/O, concurrent connections through poll, static file serving and CGI execution.",
    technologies: ["C++", "HTTP/1.1", "Sockets", "poll", "CGI"],
    kind: "webserv",
    image: {
      src: webservImage,
      alt: "Webserv architecture: HTTP requests, sockets and poll, non-blocking I/O, configuration, static files and CGI responses.",
      width: 1672,
      height: 941,
    },
    repository: "https://github.com/CilginSinek/webserv",
  },
  {
    id: "06",
    name: "miniRT",
    subtitle: "Ray Tracing & Scene Rendering",
    description:
      "A ray tracer in C that parses .rt scenes, calculates ray–object intersections and renders cameras, lights and geometry through MiniLibX.",
    technologies: ["C", "Ray Tracing", "MiniLibX", "Vector Math"],
    kind: "minirt",
    image: {
      src: minirtImage,
      alt: "miniRT render of colored spheres and cylinders with lighting and cast shadows.",
      width: 1550,
      height: 1021,
    },
    repository: "https://github.com/CilginSinek/miniRT",
  },
];
