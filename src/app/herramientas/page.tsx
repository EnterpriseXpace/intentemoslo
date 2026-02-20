import type { Metadata } from "next"
import Link from "next/link"
import { herramientasPublicadas } from "@/data/herramientas"
import { Container } from "@/components/layout/Container"
import { Header } from "@/components/layout/Header"

export const metadata: Metadata = {
    title: "Herramientas gratuitas para entender tu relación",
    description:
        "Utilidades rápidas para obtener claridad emocional y detectar patrones relacionales antes de tomar decisiones importantes.",
    openGraph: {
        title: "Herramientas gratuitas para entender tu relación | Intentémoslo de Nuevo",
        description:
            "Utilidades rápidas para obtener claridad emocional y detectar patrones relacionales antes de tomar decisiones importantes.",
        url: "/herramientas",
        type: "website",
    },
    alternates: {
        canonical: "/herramientas",
    },
}

export default function HerramientasPage() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://intentemoslo.com"

    // JSON-LD ItemList
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Herramientas gratuitas para entender tu relación",
        description:
            "Utilidades rápidas para obtener claridad emocional y detectar patrones relacionales.",
        url: `${baseUrl}/herramientas`,
        numberOfItems: herramientasPublicadas.length,
        itemListElement: herramientasPublicadas.map((h, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${baseUrl}/herramientas/${h.slug}`,
            name: h.title,
            description: h.description,
        })),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <main className="min-h-screen bg-background pt-28 pb-20">
                <Container>
                    {/* Hero */}
                    <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-foreground/80 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20">
                            🛠 Herramientas gratuitas
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">
                            Herramientas gratuitas para entender tu relación
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Utilidades rápidas para obtener claridad emocional y detectar
                            patrones relacionales antes de tomar decisiones importantes.
                        </p>
                    </div>

                    {/* Grid de herramientas */}
                    {herramientasPublicadas.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            Próximamente…
                        </p>
                    ) : (
                        <ul
                            role="list"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {herramientasPublicadas.map((herramienta) => (
                                <li key={herramienta.slug}>
                                    <Link
                                        href={`/herramientas/${herramienta.slug}`}
                                        className="group block h-full bg-white rounded-2xl border border-card-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Cabecera de la card */}
                                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 px-6 pt-7 pb-5 flex items-start gap-4">
                                            <span
                                                className="text-4xl leading-none flex-shrink-0"
                                                role="img"
                                                aria-label={herramienta.title}
                                            >
                                                {herramienta.icon}
                                            </span>
                                            <h2 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                                                {herramienta.title}
                                            </h2>
                                        </div>

                                        {/* Cuerpo */}
                                        <div className="px-6 py-5 flex flex-col justify-between gap-5">
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {herramienta.description}
                                            </p>
                                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                                                Usar herramienta
                                                <span aria-hidden="true">→</span>
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Nota de próximas herramientas */}
                    <div className="mt-16 text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Más herramientas en camino. Suscríbete para ser el primero en probarlas.
                        </p>
                    </div>
                </Container>
            </main>
        </>
    )
}
