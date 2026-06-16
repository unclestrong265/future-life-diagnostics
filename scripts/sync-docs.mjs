import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const docs = join(root, "docs");

await rm(docs, { recursive: true, force: true });
await mkdir(docs, { recursive: true });

const entries = [
  "index.html",
  "pay-success.html",
  "pay-failed.html",
  "dist",
  "assets",
];

for (const entry of entries) {
  await cp(join(root, entry), join(docs, entry), { recursive: true, force: true });
}

await writeFile(join(docs, ".nojekyll"), "static site\n");
