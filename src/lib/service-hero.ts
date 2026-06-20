import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

/**
 * Generate the responsive AVIF + WebP variants for a service-page hero from a
 * single imported asset. Shared by every service page so the getImage()
 * boilerplate (formats, widths, quality) lives in one place.
 */
export async function setupServiceHero(heroSrc: ImageMetadata) {
  const widths = [480, 768, 1024, 1280];
  const heroAvif = await getImage({ src: heroSrc, format: "avif", width: 1280, widths, quality: 70 });
  const heroWebp = await getImage({ src: heroSrc, format: "webp", width: 1280, widths, quality: 80 });
  return { heroAvif, heroWebp };
}
