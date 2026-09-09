#!/usr/bin/env node
/**
 * Comprueba que toda variable PUBLIC_ usada en el codigo llegue a produccion.
 *
 * El fallo original de este proyecto fue justamente este: GtmHead.astro leia
 * PUBLIC_GTM_ID, el secreto existia, pero el paso Build de deploy.yml no se lo
 * pasaba. El sitio se desplegaba en verde y sin analitica, y nadie lo noto.
 *
 * Una variable que el codigo lee y el workflow no pasa es un fallo SILENCIOSO:
 * no rompe el build, solo desactiva la funcion en produccion. Por eso conviene
 * comprobarlo en vez de confiar en recordarlo.
 *
 * Se ejecuta con `npm run env:check`. No se engancha al build: anadir una
 * variable antes de configurar su secreto es normal.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const EXT = [".astro", ".ts", ".tsx", ".mjs", ".js"];

function* recorrer(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* recorrer(p);
    else yield p;
  }
}

const usadas = new Set();
for (const f of recorrer("src")) {
  if (!EXT.includes(extname(f))) continue;
  for (const m of readFileSync(f, "utf-8").matchAll(/import\.meta\.env\.(PUBLIC_[A-Z0-9_]+)/g)) {
    usadas.add(m[1]);
  }
}

const ejemplo = new Set(
  [...readFileSync(".env.example", "utf-8").matchAll(/^(PUBLIC_[A-Z0-9_]+)=/gm)].map((m) => m[1]),
);
const workflow = new Set(
  [...readFileSync(".github/workflows/deploy.yml", "utf-8").matchAll(/(PUBLIC_[A-Z0-9_]+):/g)].map(
    (m) => m[1],
  ),
);

const sinDocumentar = [...usadas].filter((v) => !ejemplo.has(v)).sort();
const sinPasar = [...usadas].filter((v) => !workflow.has(v)).sort();

console.log(`\nVariables PUBLIC_ usadas en src/: ${usadas.size}`);

console.log("\n== Sin documentar en .env.example ==");
console.log(sinDocumentar.length ? sinDocumentar.map((v) => `  - ${v}`).join("\n") : "  ninguna");

console.log("\n== Usadas por el codigo pero NO pasadas en deploy.yml ==");
if (sinPasar.length) {
  console.log(sinPasar.map((v) => `  - ${v}`).join("\n"));
  console.log("\n  Estas quedarian vacias en produccion aunque el secreto exista.");
} else {
  console.log("  ninguna");
}
console.log("");

process.exit(sinDocumentar.length || sinPasar.length ? 1 : 0);
