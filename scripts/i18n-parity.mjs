#!/usr/bin/env node
/**
 * i18n parity guard.
 *
 * Why this exists: `Messages = typeof es` in src/lib/i18n/index.ts looks like it
 * makes TypeScript enforce that en.json and ru.json carry the same keys as
 * es.json. It does not. Both are loaded through a cast:
 *
 *     const bundles = { es, en: en as Messages, ru: ru as Messages }
 *
 * A cast asserts, it does not check. A key present in es.json and missing in
 * ru.json compiles cleanly, ships, and then `makeT` returns the key itself —
 * so a Russian visitor reads `public.bachillerato.hero_title` instead of a
 * heading. `astro check` never sees it.
 *
 * This script closes that hole. It runs before `astro check` in `npm run build`,
 * so a missing translation fails the build instead of reaching production.
 *
 * It checks three things:
 *   1. Key parity across the three bundles, in both directions.
 *   2. Empty or whitespace-only strings.
 *   3. FAQ run integrity — `countFaq()` counts consecutive faq_N_q/faq_N_a pairs
 *      and STOPS at the first gap. A missing faq_3_a silently removes question 3
 *      and every question after it, from the rendered page AND from the FAQPage
 *      JSON-LD. A gap in one language only is the nastiest version: the Spanish
 *      page shows seven questions and the Russian one shows two, with no error.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/lib/i18n");
const LOCALES = ["es", "en", "ru"];
const REFERENCE = "es"; // the bundle that defines the Messages type

const read = (l) => JSON.parse(readFileSync(join(DIR, `${l}.json`), "utf8"));

/** Flatten to dot-notation, the same shape `lookup()` walks. */
function flatten(obj, prefix = "", out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out.set(key, v);
  }
  return out;
}

const bundles = Object.fromEntries(LOCALES.map((l) => [l, flatten(read(l))]));
const problems = [];

// --- 1. Key parity, both directions -----------------------------------------
const refKeys = new Set(bundles[REFERENCE].keys());
for (const locale of LOCALES.filter((l) => l !== REFERENCE)) {
  const keys = new Set(bundles[locale].keys());
  const missing = [...refKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !refKeys.has(k));
  for (const k of missing) problems.push(`${locale}.json  FALTA la clave  ${k}`);
  for (const k of extra) problems.push(`${locale}.json  clave HUERFANA (no esta en ${REFERENCE}.json)  ${k}`);
}

// --- 2. Values empty in SOME locales but not others -------------------------
// A key deliberately left blank everywhere is a design decision (e.g. the `meta`
// slot on the home service cards). A key with text in Spanish and blank in
// Russian is a missing translation that renders as a hole on the page. Only the
// second is a problem, so compare across locales instead of flagging every blank.
for (const key of refKeys) {
  const filled = LOCALES.filter((l) => {
    const v = bundles[l].get(key);
    return typeof v === "string" && v.trim() !== "";
  });
  if (filled.length > 0 && filled.length < LOCALES.length) {
    const blank = LOCALES.filter((l) => !filled.includes(l));
    problems.push(
      `TRADUCCION VACIA en ${blank.join("/")} (con texto en ${filled.join("/")})  ${key}`,
    );
  }
}

// --- 3. FAQ run integrity ---------------------------------------------------
// Collect every prefix that has at least one faq_N_q, then walk 1..N per locale.
const faqPrefixes = new Set();
for (const k of refKeys) {
  const m = /^(.*)\.faq_(\d+)_[qa]$/.exec(k);
  if (m) faqPrefixes.add(m[1]);
}
for (const prefix of [...faqPrefixes].sort()) {
  const counts = {};
  for (const locale of LOCALES) {
    const b = bundles[locale];
    let n = 0;
    while (b.has(`${prefix}.faq_${n + 1}_q`) && b.has(`${prefix}.faq_${n + 1}_a`)) n++;
    counts[locale] = n;
    // A pair that exists beyond the consecutive run is dead weight: it will never render.
    let highest = 0;
    for (const k of b.keys()) {
      const m = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.faq_(\\d+)_[qa]$`).exec(k);
      if (m) highest = Math.max(highest, Number(m[1]));
    }
    if (highest > n) {
      problems.push(
        `${locale}.json  HUECO en la serie FAQ de ${prefix}: countFaq() para en ${n} pero existe faq_${highest}. ` +
          `Las preguntas ${n + 1}..${highest} no se renderizaran ni saldran en el JSON-LD.`,
      );
    }
  }
  const values = [...new Set(Object.values(counts))];
  if (values.length > 1) {
    problems.push(
      `DESAJUSTE de FAQ en ${prefix}: ` +
        LOCALES.map((l) => `${l}=${counts[l]}`).join(", ") +
        ". Cada idioma mostraria un numero distinto de preguntas.",
    );
  }
}

// --- Report -----------------------------------------------------------------
const total = bundles[REFERENCE].size;
if (problems.length === 0) {
  console.log(`i18n: OK — ${total} claves con paridad en ${LOCALES.join("/")}, series FAQ integras.`);
  process.exit(0);
}
console.error(`\ni18n: ${problems.length} problema(s). El build se detiene.\n`);
for (const p of problems) console.error(`  · ${p}`);
console.error(
  `\nRecuerda: TypeScript NO detecta esto. en.json y ru.json entran con un cast\n` +
    `\`as Messages\`, asi que una clave que falte compila y llega a produccion,\n` +
    `donde makeT() devuelve el nombre de la clave en vez del texto.\n`,
);
process.exit(1);
