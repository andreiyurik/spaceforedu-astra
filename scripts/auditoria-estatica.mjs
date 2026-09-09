#!/usr/bin/env node
/**
 * Diagnostico del sitio construido. Cubre dos puntos de la checklist:
 *
 *   19. enlaces rotos  -> cada href interno de dist/ resuelve a un fichero real
 *   20. rendimiento    -> ficheros de public/ que nadie referencia y se despliegan igual
 *
 * NO se engancha al build a proposito: anadir una imagen antes de cablearla es
 * normal, y romper el build por eso seria molesto sin aportar nada. Es un
 * informe que se ejecuta a mano con `npm run auditoria`.
 *
 * Trampa que costo un falso positivo la primera vez: al recorrer el arbol
 * buscando referencias hay que excluir SOLO el `public/` de primer nivel.
 * `src/components/public/` se llama igual, y excluirlo tambien hacia que
 * UniversityLogoBar.astro quedara fuera del corpus y sus logos aparecieran
 * como huerfanos.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative } from "node:path";

const DIST = "dist";
const CODIGO = [".astro", ".ts", ".tsx", ".js", ".mjs", ".mdx", ".json", ".md", ".css", ".yml", ".webmanifest"];
// Se despliegan aunque nadie los enlace; no son huerfanos.
const SIEMPRE = new Set(["robots.txt", ".htaccess", "favicon.ico", "favicon.svg", "site.webmanifest"]);

function* recorrer(dir, saltar = () => false) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (saltar(p, e.name)) continue;
      yield* recorrer(p, saltar);
    } else yield p;
  }
}

// ---------- 1. huerfanos en public/ ----------
const saltarCodigo = (p, n) =>
  ["node_modules", "dist", ".git", ".astro"].includes(n) || p === "public";

let corpus = "";
for (const f of recorrer(".", saltarCodigo)) {
  if (CODIGO.includes(extname(f))) corpus += "\n" + readFileSync(f, "utf-8");
}
for (const f of recorrer("public")) {
  if ([".json", ".webmanifest", ".xml", ".txt", ".html"].includes(extname(f))) {
    corpus += "\n" + readFileSync(f, "utf-8");
  }
}

const huerfanos = [];
for (const f of recorrer("public")) {
  const nombre = f.split("/").pop();
  if (SIEMPRE.has(nombre)) continue;
  if (!corpus.includes(nombre)) huerfanos.push([statSync(f).size, f]);
}
huerfanos.sort((a, b) => b[0] - a[0]);

// ---------- 2. enlaces internos rotos en dist/ ----------
const rotos = [];
if (existsSync(DIST)) {
  const paginas = [...recorrer(DIST)].filter((f) => f.endsWith(".html"));
  for (const pagina of paginas) {
    const html = readFileSync(pagina, "utf-8");
    const hrefs = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)].map((m) => m[1]);
    for (const href of new Set(hrefs)) {
      const candidatos = [
        join(DIST, href),
        join(DIST, href, "index.html"),
        join(DIST, href.replace(/\/$/, "") + ".html"),
      ];
      if (!candidatos.some(existsSync)) {
        rotos.push(`${relative(DIST, pagina)}  ->  ${href}`);
      }
    }
  }
}

// ---------- informe ----------
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log("\n== Ficheros de public/ que nadie referencia ==");
if (huerfanos.length === 0) console.log("  ninguno");
else {
  let total = 0;
  for (const [sz, f] of huerfanos) {
    console.log(`  ${String(sz).padStart(8)}  ${f}`);
    total += sz;
  }
  console.log(`  -> ${huerfanos.length} ficheros, ${kb(total)} desplegados sin uso`);
}

console.log("\n== Enlaces internos rotos en dist/ ==");
if (!existsSync(DIST)) console.log("  (no hay dist/: ejecuta el build antes)");
else if (rotos.length === 0) console.log("  ninguno");
else for (const r of [...new Set(rotos)]) console.log(`  ${r}`);
console.log("");
