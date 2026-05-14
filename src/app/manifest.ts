import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/seo/config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMetadata.applicationName,
    short_name: siteMetadata.siteName,
    description: siteMetadata.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: siteMetadata.language,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48 64x64 128x128 256x256",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Publications",
        short_name: "Papers",
        url: "/publications",
      },
      {
        name: "News",
        short_name: "News",
        url: "/news",
      },
      {
        name: "Contact",
        short_name: "Contact",
        url: "/contact",
      },
    ],
  };
}
