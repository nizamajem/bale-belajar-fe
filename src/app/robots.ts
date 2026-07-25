import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/welcome", "/privacy", "/terms"],
      disallow: ["/admin", "/teacher", "/student"],
    },
    sitemap: "https://app.balebelajar.com/sitemap.xml",
  };
}
