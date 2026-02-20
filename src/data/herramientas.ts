/**
 * REGISTRO CENTRAL DE HERRAMIENTAS
 *
 * Este es el ÚNICO archivo que debes editar para agregar una nueva herramienta.
 * Todo lo demás (índice /herramientas, footer, sitemap) se genera automáticamente.
 *
 * Para agregar una herramienta:
 * 1. Añade un objeto al array `herramientas`
 * 2. Crea la carpeta `src/app/herramientas/[slug]/page.tsx`
 * 3. Cambia `status` a 'published' cuando esté lista
 */

export interface Herramienta {
    title: string
    slug: string
    description: string
    icon: string          // Emoji o nombre Lucide icon
    status: 'published' | 'draft'
    metaTitle: string
    metaDescription: string
}

export const herramientas: Herramienta[] = [
    {
        title: 'Calculadora de Celos',
        slug: 'calculadora-de-celos',
        description: 'Evalúa el nivel de celos en tu relación y descubre si están en un rango saludable o problemático.',
        icon: '🎯',
        status: 'published',
        metaTitle: 'Calculadora de Celos — ¿Cuántos celos hay en tu relación?',
        metaDescription: 'Descubre en 2 minutos el nivel de celos en tu relación. Herramienta gratuita basada en patrones relacionales reales.',
    },
    // Próximas herramientas (draft):
    // {
    //   title: 'Detector de Relación Tóxica',
    //   slug: 'detector-relacion-toxica',
    //   description: 'Identifica patrones de toxicidad en tu relación.',
    //   icon: '⚠️',
    //   status: 'draft',
    //   metaTitle: 'Detector de Relación Tóxica...',
    //   metaDescription: '...',
    // },
    // {
    //   title: '¿Amor o Costumbre?',
    //   slug: 'amor-o-costumbre',
    //   description: 'Distingue si estás en una relación por amor genuino o por inercia.',
    //   icon: '❤️',
    //   status: 'draft',
    //   metaTitle: '¿Amor o Costumbre?...',
    //   metaDescription: '...',
    // },
]

/** Solo las herramientas publicadas (para índice, footer, sitemap) */
export const herramientasPublicadas = herramientas.filter(
    (h) => h.status === 'published'
)

/** Busca una herramienta por slug */
export function getHerramientaBySlug(slug: string): Herramienta | undefined {
    return herramientas.find((h) => h.slug === slug)
}
