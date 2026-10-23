import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Little Mahilam Preschool, Tiruppur",
    short_name: "Little Mahilam",
    description: "A School of Happiness — child-centric preschool on Kangayam Road, Tiruppur.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: BRAND.cream.base,
    theme_color: BRAND.green[800],
    lang: "en-IN",
    categories: ["education", "kids"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "Admission enquiry", url: "/admissions" },
      { name: "Contact & directions", url: "/contact" },
      { name: "Staff login", url: "/login" },
    ],
  };
}
