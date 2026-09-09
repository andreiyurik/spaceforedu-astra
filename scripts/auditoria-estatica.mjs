#!/usr/bin/env node
/**
 * Diagnostico del sitio construido. Cubre dos puntos de la checklist:
 *
 *   17. accesibilidad  -> lang, alt, jerarquia de encabezados, nombre accesible,
 *                        etiquetado de inputs, zoom y tabindex
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

// ---------- 3. accesibilidad ----------
//
// Falso positivo que costo una pasada: un <input> tambien queda etiquetado si va
// ENVUELTO en un <label>, sin id ni aria-label. Comprobar solo aria-label/for
// marcaba los 55 checkboxes del banner de cookies, que son correctos.
const a11y = [];
for (const f of (existsSync(DIST) ? [...recorrer(DIST)] : []).filter((x) => x.endsWith(".html"))) {
  const html = readFileSync(f, "utf-8");
  const rel = relative(DIST, f);
  // La raiz es una redireccion meta-refresh con noindex: no es pagina de contenido.
  const esRedireccion = /http-equiv="refresh"/.test(html);
  const aviso = (m) => a11y.push(`${rel}  ${m}`);

  if (!/<html[^>]*\slang="[a-z-]+"/.test(html)) aviso("<html> sin lang");
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!m[0].includes(" alt=")) aviso(`img sin alt: ${m[0].slice(0, 70)}`);
  }
  if (/user-scalable=no|maximum-scale=1/.test(html)) aviso("viewport bloquea el zoom");
  if (/tabindex="[1-9]/.test(html)) aviso("tabindex positivo");

  const niveles = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  if (!esRedireccion && !niveles.includes(1)) aviso("sin h1");
  if (niveles.filter((n) => n === 1).length > 1) aviso("mas de un h1");

  const labelsFor = new Set([...html.matchAll(/<label[^>]*\sfor="([^"]+)"/g)].map((m) => m[1]));
  const envueltos = new Set();
  for (const l of html.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/g)) {
    for (const i of l[1].matchAll(/<input\b[^>]*>/g)) envueltos.add(i[0]);
  }
  for (const m of html.matchAll(/<input\b[^>]*>/g)) {
    const t = m[0];
    if (/type="(hidden|submit|button)"/.test(t)) continue;
    if (t.includes("aria-label")) continue;
    const id = t.match(/\sid="([^"]+)"/)?.[1];
    if (id && labelsFor.has(id)) continue;
    if (envueltos.has(t)) continue;
    aviso(`input sin etiqueta: ${t.slice(0, 70)}`);
  }
  for (const m of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) {
    const texto = m[1].replace(/<[^>]+>/g, "").trim();
    if (!texto && !/aria-label|aria-labelledby/.test(m[0])) {
      aviso(`enlace sin nombre accesible: ${m[0].slice(0, 70)}`);
    }
  }
  for (const m of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    const texto = m[1].replace(/<[^>]+>/g, "").trim();
    if (!texto && !/aria-label|aria-labelledby/.test(m[0])) {
      aviso(`boton sin nombre accesible: ${m[0].slice(0, 70)}`);
    }
  }
  // La excepcion que habia aqui para 404.html ya no hace falta: al darle
  // destinos utiles, la pagina gano un h2 propio y la jerarquia quedo
  // h1 -> h2 -> h3. Un guardarrail con excepciones que sobran acaba tapando
  // fallos reales, asi que se retira en cuanto deja de ser necesaria.
  let previo = null;
  for (const n of niveles) {
    if (previo !== null && n > previo + 1) {
      aviso(`salto de nivel h${previo} -> h${n}`);
    }
    previo = n;
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

console.log("\n== Accesibilidad ==");
if (!existsSync(DIST)) console.log("  (no hay dist/: ejecuta el build antes)");
else if (a11y.length === 0) console.log("  sin hallazgos");
else for (const x of a11y) console.log(`  ${x}`);

console.log("\n== Enlaces internos rotos en dist/ ==");
if (!existsSync(DIST)) console.log("  (no hay dist/: ejecuta el build antes)");
else if (rotos.length === 0) console.log("  ninguno");
else for (const r of [...new Set(rotos)]) console.log(`  ${r}`);
console.log("");
