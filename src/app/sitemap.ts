import type { MetadataRoute } from "next";
import { allProjects } from "@/content/projects";
import { siteUrl } from "@/content/site";

/**
 * Served at /sitemap.xml. Project detail pages are derived from the content
 * layer, so adding a project lists it automatically. Static routes are manual —
 * if you add a page, add it here too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/works`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about-me`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/contacts`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${siteUrl}/works/${project.slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
