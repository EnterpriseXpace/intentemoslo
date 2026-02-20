import { MetadataRoute } from "next"

const BASE_URL =
    (process.env.NEXT_PUBLIC_APP_URL || "https://www.intentemoslodenuevo.com").replace(/\/$/, "")

/**
 * ROBOTS.TXT DINÁMICO
 *
 * Permite indexar todas las páginas públicas del sitio.
 * Bloquea rutas internas, de API y del panel admin.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/api/",
                    "/checkout/",
                    "/processing/",
                    "/analyzing/",
                    "/pre-result/",
                    "/thank-you/",
                    "/result/",
                    "/health/",
                    "/components-check/",
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
