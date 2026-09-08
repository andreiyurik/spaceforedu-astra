#!/usr/bin/env node
/**
 * Rendered-key guard. Runs AFTER `astro build`, over the generated dist/.
 *
 * Why a second script, and why post-build: `makeT` returns the key itself when
 * a key is missing, so a broken reference does not throw — it renders. The
 * visitor reads `public.consulta.pin_final_title` where a heading should be.
 *
 * The pre-build parity guard cannot see this. It compares the three bundles
 * against each other, so a key that is *used by a component* and *defined
 * nowhere* is consistent across all three and passes. `astro check` cannot see
 * it either: template literals like t(`${prefix}.pin_final_title`) are just
 * strings to TypeScript.
 *
 * Scanning the built HTML catches every case regardless of how the key was
 * referenced — literal, template, or assembled at runtime — because whatever
 * reached the page is what the visitor sees. This is not a heuristic; it is
 * the output itself.
 *
 * Found the hard way: a page shipped with nine raw keys visible on screen and
 * a completely green build.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

// Top-level namespaces in the i18n bundles. A dotted token starting with one of
// these that survives into the HTML is an unresolved key.
const NAMESPACES = ["public", "nav", "footer", "a11y", "lp"];
const KEY_RE = new RegExp(`\\b(?:${NAMESPACES.join("|")})(?:\\.[a-z0-9_]+){2,}\\b`, "g");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error("i18n-rendered: no existe dist/. Ejecuta `astro build` antes.");
  process.exit(1);
}

const findings = new Map(); // key -> Set<page>
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const match of html.match(KEY_RE) ?? []) {
    if (!findings.has(match)) findings.set(match, new Set());
    findings.get(match).add(relative(DIST, file));
  }
}

if (findings.size === 0) {
  console.log(`i18n-rendered: OK — ${files.length} paginas, ninguna clave sin resolver.`);
  process.exit(0);
}

console.error(`\ni18n-rendered: ${findings.size} clave(s) sin resolver en el HTML generado.\n`);
for (const [key, pages] of [...findings].sort()) {
  const list = [...pages].sort();
  const shown = list.slice(0, 3).join(", ");
  const rest = list.length > 3 ? ` (+${list.length - 3} paginas mas)` : "";
  console.error(`  · ${key}\n      en ${shown}${rest}`);
}
console.error(
  `\nEl visitante ve ese texto literal en pantalla. Causas habituales:\n` +
    `  - La clave no existe en es.json.\n` +
    `  - El componente la lee con otro prefijo del que creias: PinFinalCta usa\n` +
    `    \`\${prefix}.pin_final_*\`, no \`\${prefix}.final_*\`.\n` +
    `  - Una serie faq_N con un hueco: countFaq() corta ahi y el resto no se pinta.\n`,
);
process.exit(1);
