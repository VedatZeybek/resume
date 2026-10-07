import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const git = (args, cwd = root, capture = false) =>
  execFileSync("git", ["-c", "gc.auto=0", ...args], {
    cwd,
    stdio: capture ? "pipe" : "inherit",
    encoding: "utf8",
  });

if (!existsSync(join(dist, "index.html"))) {
  throw new Error("Missing production build. Run npm run deploy to build and publish.");
}

// Keep source files and the current branch intact. Only replace the generated site.
git(["fetch", "origin", "gh-pages"]);
const source = git(["rev-parse", "--short", "HEAD"], root, true).trim();
const directory = mkdtempSync(join(tmpdir(), "resume-pages-"));
const checkout = join(directory, "site");
git(["worktree", "add", "--detach", checkout, "origin/gh-pages"]);

try {
  git(["rm", "-r", "--quiet", "--ignore-unmatch", "."], checkout);
  for (const entry of readdirSync(dist)) {
    cpSync(join(dist, entry), join(checkout, entry), { recursive: true });
  }
  writeFileSync(join(checkout, ".nojekyll"), "");
  git(["add", "--all"], checkout);
  const changed = git(["diff", "--cached", "--name-only"], checkout, true).trim();
  if (changed) {
    git(["commit", "-m", `deploy: publish portfolio from ${source}`], checkout, true);
    // A normal push preserves history and rejects concurrent remote updates.
    git(["push", "origin", "HEAD:gh-pages"], checkout);
    console.log("Published build to gh-pages. GitHub Pages will update shortly.");
  } else {
    console.log("The gh-pages branch already contains this build.");
  }
  git(["worktree", "remove", checkout]);
  rmSync(directory, { recursive: true });
} catch (error) {
  console.error(`Deployment stopped. The temporary checkout is preserved at ${checkout}`);
  throw error;
}
