import type { APIRoute, GetStaticPaths } from "astro";
import { getAllBlogPosts } from "@/lib/blog";
import { generateOgPng } from "@/lib/og-image";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    params: { slug: `${post.data.locale}-${post.data.slug}` },
    props: {
      title: post.data.title,
      description: post.data.description,
      locale: post.data.locale,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, locale } = props as {
    title: string;
    description: string;
    locale: string;
  };
  const png = await generateOgPng(title, description, locale);

  return new Response(Buffer.from(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
