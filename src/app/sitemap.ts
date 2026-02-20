import { MetadataRoute } from "next"
import { herramientasPublicadas } from "@/data/herramientas"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://intentemoslo.com"

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/herramientas`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ]

    // Genera automáticamente una entrada por cada herramienta publicada
    const toolRoutes: MetadataRoute.Sitemap = herramientasPublicadas.map((h) => ({
        url: `${baseUrl}/herramientas/${h.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
    }))

    return [...staticRoutes, ...toolRoutes]
}
