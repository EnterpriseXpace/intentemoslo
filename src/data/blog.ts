/**
 * REGISTRO CENTRAL DE ARTÍCULOS DE BLOG
 *
 * Este es el ÚNICO archivo que debes editar para agregar un nuevo artículo.
 * Todo lo demás (sitemap, índice /blog, RelatedArticles) se genera automáticamente.
 *
 * Para agregar un artículo:
 * 1. Añade un objeto al array `articulos`
 * 2. Crea la carpeta `src/app/blog/[slug]/page.tsx`
 * 3. Cambia `status` a 'published' cuando esté listo
 */

export interface Articulo {
    title: string
    slug: string
    description: string               // Meta description + resumen de la card
    cluster: string                   // Cluster temático
    status: 'published' | 'draft'
    relatedToolSlugs?: string[]       // Herramientas a enlazar desde el artículo
    relatedArticleSlugs?: string[]    // Artículos relacionados del mismo cluster
    publishedAt: string               // ISO date string (para sitemap lastModified)
    metaTitle: string
    metaDescription: string
}

export const articulos: Articulo[] = [

    // ─── CLUSTER: CELOS ──────────────────────────────────────────────────────────
    {
        title: 'Qué son los celos en una relación de pareja y cuándo se vuelven un problema',
        slug: 'que-son-los-celos-en-pareja',
        description: 'Los celos son una respuesta emocional normal, pero cuando se intensifican o se vuelven irracionales, pueden dañar la relación. Aprende a distinguirlos y a entender su origen.',
        cluster: 'celos',
        status: 'published',
        relatedToolSlugs: ['calculadora-de-celos', 'detector-celos-retroactivos'],
        relatedArticleSlugs: ['celos-sanos-vs-toxicos'],
        publishedAt: '2026-02-21',
        metaTitle: 'Qué son los celos en pareja y cuándo son un problema — Guía psicológica',
        metaDescription: 'Los celos en pareja son normales hasta cierto punto. Aprende qué los causa, cómo identificarlos y cuándo se convierten en un patrón problemático.',
    },
    {
        title: 'Celos sanos vs. celos tóxicos: cómo diferenciarlos en tu relación',
        slug: 'celos-sanos-vs-toxicos',
        description: 'No todos los celos son iguales. Existen señales claras que separan una reacción emocional normal de un patrón de control. Aquí aprenderás a distinguirlos.',
        cluster: 'celos',
        status: 'draft',
        relatedToolSlugs: ['calculadora-de-celos'],
        relatedArticleSlugs: ['que-son-los-celos-en-pareja'],
        publishedAt: '2026-02-21',
        metaTitle: 'Celos sanos vs. celos tóxicos — ¿Cuál es la diferencia?',
        metaDescription: 'Aprende a diferencias los celos sanos de los tóxicos en una relación de pareja. Señales claras y orientación psicológica.',
    },

    // ─── CLUSTER: APEGO (draft — arquitectura preparada) ─────────────────────────
    {
        title: 'Estilos de apego en las relaciones: cuál es el tuyo y cómo te afecta',
        slug: 'estilos-de-apego-en-pareja',
        description: 'El apego seguro, ansioso, evitativo o desorganizado determina cómo te relacionas con tu pareja. Descubre tu estilo y cómo influye en tu vida amorosa.',
        cluster: 'apego',
        status: 'draft',
        relatedToolSlugs: ['test-apego-romantico'],
        relatedArticleSlugs: ['inseguridad-en-el-amor'],
        publishedAt: '2026-02-21',
        metaTitle: 'Estilos de apego en pareja — Cuál es el tuyo y cómo te afecta',
        metaDescription: 'Aprende sobre los 4 estilos de apego romántico y cómo influyen en tus relaciones. Guía basada en la teoría del apego de Bowlby.',
    },

    // ─── CLUSTER: CONFIANZA (draft — arquitectura preparada) ─────────────────────
    {
        title: 'Cómo reconstruir la confianza en pareja después de una traición',
        slug: 'como-reconstruir-confianza-pareja',
        description: 'Reconstruir la confianza tras una traición es posible, pero requiere un proceso consciente. Aquí encontrarás los pasos clave que la investigación identifica como efectivos.',
        cluster: 'confianza',
        status: 'draft',
        relatedToolSlugs: ['test-confianza-pareja'],
        relatedArticleSlugs: [],
        publishedAt: '2026-02-21',
        metaTitle: 'Cómo reconstruir la confianza en pareja — Guía paso a paso',
        metaDescription: 'Pasos concretos para recuperar la confianza en tu relación después de una traición o infidelidad emocional. Basado en investigación psicológica.',
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Solo artículos publicados */
export const articulosPublicados = articulos.filter((a) => a.status === 'published')

/** Busca un artículo por slug */
export function getArticuloBySlug(slug: string): Articulo | undefined {
    return articulos.find((a) => a.slug === slug)
}

/** Artículos publicados de un cluster */
export function getArticulosByCluster(cluster: string): Articulo[] {
    return articulos.filter((a) => a.cluster === cluster && a.status === 'published')
}

/** Artículos relacionados de un artículo dado */
export function getRelatedArticulos(slug: string): Articulo[] {
    const a = getArticuloBySlug(slug)
    if (!a?.relatedArticleSlugs?.length) return []
    return a.relatedArticleSlugs
        .map((s) => getArticuloBySlug(s))
        .filter((r): r is Articulo => r !== undefined && r.status === 'published')
}
