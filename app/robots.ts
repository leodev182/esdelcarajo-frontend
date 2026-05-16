import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/auth/",
          "/checkout/",
          "/perfil/",
          "/favoritos/",
          "/order/",
          "/sentry-example-page/",
        ],
      },
    ],
    sitemap: "https://esdelcarajo.com/sitemap.xml",
  };
}
