/**
 * REGISTRO CENTRAL DE HERRAMIENTAS
 *
 * Este es el ÚNICO archivo que debes editar para agregar una nueva herramienta.
 * Todo lo demás (índice /herramientas, footer, sitemap, RelatedTools) se genera automáticamente.
 *
 * Para agregar una herramienta:
 * 1. Añade un objeto al array `herramientas`
 * 2. Crea la carpeta `src/app/herramientas/[slug]/page.tsx`
 * 3. Cambia `status` a 'published' cuando esté lista
 *
 * Clusters disponibles: 'celos' | 'confianza' | 'apego' | 'comunicacion' | 'ruptura'
 */

export interface Herramienta {
    title: string
    slug: string
    description: string
    icon: string                          // Emoji
    status: 'published' | 'draft'
    cluster: string                       // Cluster temático al que pertenece
    isPillar?: boolean                    // true = herramienta principal del cluster
    relatedSlugs?: string[]               // Slugs de herramientas relacionadas (mismo cluster)
    metaTitle: string
    metaDescription: string
}

export const herramientas: Herramienta[] = [

    // ─── CLUSTER: CELOS ──────────────────────────────────────────────────────────
    {
        title: 'Calculadora de Celos',
        slug: 'calculadora-de-celos',
        description: 'Evalúa el nivel de celos en tu relación en tres dimensiones: cognitiva, emocional y conductual. Obtén un perfil personalizado basado en modelos psicológicos validados.',
        icon: '🎯',
        status: 'published',
        cluster: 'celos',
        isPillar: true,
        relatedSlugs: ['detector-celos-retroactivos'],
        metaTitle: 'Calculadora de Celos — Perfil tridimensional basado en investigación psicológica',
        metaDescription: 'Evalúa tus celos en dimensión cognitiva, emocional y conductual. Herramienta orientativa inspirada en la Multidimensional Jealousy Scale. Resultado inmediato, gratis.',
    },
    {
        title: 'Detector de Celos Retroactivos',
        slug: 'detector-celos-retroactivos',
        description: 'Identifica si experimentas celos retroactivos hacia el pasado de tu pareja y comprende el origen de ese patrón emocional.',
        icon: '⏪',
        status: 'published',
        cluster: 'celos',
        isPillar: false,
        relatedSlugs: ['calculadora-de-celos'],
        metaTitle: 'Test de Celos Retroactivos — ¿Sientes celos del pasado de tu pareja?',
        metaDescription: 'Descubre si sufres celos retroactivos y qué los origina. Herramienta gratuita basada en investigación sobre retroactive jealousy y ansiedad relacional.',
    },

    // ─── CLUSTER: APEGO (draft — arquitectura preparada) ─────────────────────────
    {
        title: 'Test de Estilo de Apego',
        slug: 'test-apego-romantico',
        description: 'Descubre tu estilo de apego en las relaciones románticas: seguro, ansioso, evitativo o desorganizado.',
        icon: '🔗',
        status: 'draft',
        cluster: 'apego',
        isPillar: true,
        relatedSlugs: ['detector-apego-ansioso'],
        metaTitle: 'Test de Apego Romántico — ¿Cuál es tu estilo de apego en pareja?',
        metaDescription: 'Descubre tu estilo de apego romántico gratis. Basado en la teoría del apego de Bowlby y Ainsworth. Resultado inmediato.',
    },
    {
        title: 'Detector de Apego Ansioso',
        slug: 'detector-apego-ansioso',
        description: 'Identifica si tu patrón de apego ansioso está afectando tu relación actual.',
        icon: '😰',
        status: 'draft',
        cluster: 'apego',
        isPillar: false,
        relatedSlugs: ['test-apego-romantico'],
        metaTitle: 'Detector de Apego Ansioso — Test gratuito',
        metaDescription: 'Identifica si tienes apego ansioso y cómo afecta a tu relación. Herramienta orientativa gratuita.',
    },

    // ─── CLUSTER: CONFIANZA (draft — arquitectura preparada) ─────────────────────
    {
        title: 'Test de Confianza en Pareja',
        slug: 'test-confianza-pareja',
        description: 'Evalúa el nivel de confianza real en tu relación y detecta las áreas donde se está erosionando.',
        icon: '🤝',
        status: 'draft',
        cluster: 'confianza',
        isPillar: true,
        relatedSlugs: ['perfil-comunicacion-pareja'],
        metaTitle: 'Test de Confianza en Pareja — ¿Cuánta confianza hay en tu relación?',
        metaDescription: 'Evalúa la confianza en tu pareja con esta herramienta orientativa gratuita. Detecta patrones de desconfianza y áreas de mejora.',
    },
    {
        title: 'Perfil de Comunicación en Pareja',
        slug: 'perfil-comunicacion-pareja',
        description: 'Descubre el estilo de comunicación predominante en tu relación y sus puntos de tensión.',
        icon: '💬',
        status: 'draft',
        cluster: 'confianza',
        isPillar: false,
        relatedSlugs: ['test-confianza-pareja'],
        metaTitle: 'Perfil de Comunicación en Pareja — Test gratuito',
        metaDescription: 'Identifica el estilo de comunicación de tu relación y sus puntos débiles. Herramienta gratuita.',
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Solo las herramientas publicadas (para índice, footer, sitemap) */
export const herramientasPublicadas = herramientas.filter(
    (h) => h.status === 'published'
)

/** Busca una herramienta por slug */
export function getHerramientaBySlug(slug: string): Herramienta | undefined {
    return herramientas.find((h) => h.slug === slug)
}

/** Herramientas publicadas de un cluster específico */
export function getHerramientasByCluster(cluster: string): Herramienta[] {
    return herramientas.filter((h) => h.cluster === cluster && h.status === 'published')
}

/** Herramientas relacionadas a un slug dado (publicadas) */
export function getRelatedHerramientas(slug: string): Herramienta[] {
    const h = getHerramientaBySlug(slug)
    if (!h?.relatedSlugs?.length) return []
    return h.relatedSlugs
        .map((s) => getHerramientaBySlug(s))
        .filter((r): r is Herramienta => r !== undefined && r.status === 'published')
}

/** Pillar del cluster al que pertenece un slug */
export function getClusterPillar(cluster: string): Herramienta | undefined {
    return herramientas.find((h) => h.cluster === cluster && h.isPillar && h.status === 'published')
}
