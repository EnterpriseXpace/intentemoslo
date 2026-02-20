import Link from "next/link"
import { getRelatedHerramientas } from "@/data/herramientas"

interface RelatedToolsProps {
    /** Slug de la herramienta actual (se excluye del resultado) */
    slug: string
    title?: string
}

/**
 * Muestra tarjetas de herramientas relacionadas del mismo cluster.
 * Se alimenta automáticamente desde herramientas.ts → relatedSlugs.
 *
 * Uso: <RelatedTools slug="calculadora-de-celos" />
 */
export function RelatedTools({ slug, title = "Herramientas relacionadas" }: RelatedToolsProps) {
    const related = getRelatedHerramientas(slug)

    if (related.length === 0) return null

    return (
        <section aria-label={title} className="border-t border-secondary pt-10 space-y-5">
            <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    Del mismo tema
                </p>
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
            </div>

            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((h) => (
                    <li key={h.slug}>
                        <Link
                            href={`/herramientas/${h.slug}`}
                            className="group flex items-start gap-4 p-4 bg-white rounded-2xl border border-card-border shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <span
                                className="text-3xl leading-none flex-shrink-0 mt-0.5"
                                role="img"
                                aria-label={h.title}
                            >
                                {h.icon}
                            </span>
                            <div className="min-w-0">
                                <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                                    {h.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                                    {h.description}
                                </p>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-2 group-hover:gap-1.5 transition-all">
                                    Usar herramienta <span aria-hidden="true">→</span>
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
