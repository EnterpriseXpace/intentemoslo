import { MetadataRoute } from "next"
import { herramientasPublicadas } from "@/data/herramientas"
import { articulosPublicados } from "@/data/blog"


const BASE_URL =
    (process.env.NEXT_PUBLIC_APP_URL || "https://www.intentemoslodenuevo.com").replace(/\/$/, "")

/**
 * SITEMAP DINÁMICO
 *
 * ─ Rutas estáticas: se mantienen aquí manualmente.
 * ─ Herramientas: se generan automáticamente desde `src/data/herramientas.ts`.
 *   Para añadir una nueva herramienta al sitemap basta con darle status: 'published'
 *   en ese archivo. No hay que tocar este archivo.
 *
 * Rutas EXCLUIDAS intencionalmente (no son páginas públicas indexables):
 *   /admin, /api/*, /checkout, /processing, /analyzing, /pre-result, /thank-you,
 *   /result, /health, /components-check
 */
export default function sitemap(): MetadataRoute.Sitemap {
    // ── 1. Páginas principales ────────────────────────────────────────────────
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/checklist`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/checklist/deep`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/herramientas`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ]

    // ── 2. Páginas legales / informativas ─────────────────────────────────────
    const legalRoutes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/politica-de-privacidad`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/politica-de-cookies`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terminos-y-condiciones`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ]

    // ── 3. Herramientas publicadas (auto-generado desde herramientas.ts) ───────
    const toolRoutes: MetadataRoute.Sitemap = herramientasPublicadas.map((h) => ({
        url: `${BASE_URL}/herramientas/${h.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }))

    // ── 4. Artículos de blog publicados (auto-generado desde blog.ts) ─────────────
    const blogRoutes: MetadataRoute.Sitemap = articulosPublicados.map((a) => ({
        url: `${BASE_URL}/blog/${a.slug}`,
        lastModified: new Date(a.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.75,
    }))

    return [...staticRoutes, ...legalRoutes, ...toolRoutes, ...blogRoutes]
}
