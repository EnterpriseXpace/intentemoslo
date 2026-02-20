import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Header } from "@/components/layout/Header"
import { articulosPublicados } from "@/data/blog"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.intentemoslodenuevo.com"

export const metadata: Metadata = {
    title: "Blog — Artículos sobre relaciones de pareja y psicología relacional",
    description:
        "Artículos educativos sobre celos, apego, confianza y dinámicas de pareja. Guías basadas en investigación psicológica para entender mejor tus relaciones.",
    openGraph: {
        title: "Blog | Intentémoslo de Nuevo",
        description:
            "Artículos educativos sobre celos, apego, confianza y dinámicas de pareja.",
        url: "/blog",
        type: "website",
    },
    alternates: {
        canonical: "/blog",
    },
}

export default function BlogPage() {
    const jsonLdBlog = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Blog · Intentémoslo de Nuevo",
        description:
            "Artículos educativos sobre psicología relacional, celos, apego y dinámica de pareja.",
        url: `${BASE_URL}/blog`,
        inLanguage: "es",
        blogPost: articulosPublicados.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            description: a.description,
            url: `${BASE_URL}/blog/${a.slug}`,
            datePublished: a.publishedAt,
        })),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }}
            />
            <Header />
            <main className="min-h-screen bg-background pt-28 pb-20">
                <Container>
                    <div className="max-w-2xl mx-auto space-y-12">

                        {/* Breadcrumb */}
                        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
                            <span className="text-muted-foreground/50" aria-hidden="true">›</span>
                            <span className="text-foreground font-medium" aria-current="page">Blog</span>
                        </nav>

                        {/* Hero */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 text-foreground/70">
                                📚 Artículos educativos
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">
                                Psicología relacional, sin rodeos
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Artículos basados en investigación sobre celos, apego, confianza y
                                dinámicas de pareja. Orientados a darte claridad, no solo información.
                            </p>
                        </div>

                        {/* Lista de artículos */}
                        {articulosPublicados.length === 0 ? (
                            <div className="text-center py-16 space-y-2">
                                <p className="text-2xl">📝</p>
                                <p className="text-muted-foreground">
                                    Primeros artículos en camino. Vuelve pronto.
                                </p>
                            </div>
                        ) : (
                            <ul role="list" className="space-y-4">
                                {articulosPublicados.map((articulo) => (
                                    <li key={articulo.slug}>
                                        <Link
                                            href={`/blog/${articulo.slug}`}
                                            className="group block bg-white rounded-2xl border border-card-border shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 p-6 space-y-2"
                                        >
                                            {/* Cluster badge */}
                                            <span className="inline-flex text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded-full">
                                                {articulo.cluster}
                                            </span>

                                            {/* Título */}
                                            <h2 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                                                {articulo.title}
                                            </h2>

                                            {/* Descripción */}
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                                {articulo.description}
                                            </p>

                                            {/* Leer más */}
                                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all pt-1">
                                                Leer artículo <span aria-hidden="true">→</span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* CTA diagnóstico */}
                        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 text-center space-y-3">
                            <p className="text-sm font-semibold text-foreground">
                                ¿Quieres saber el estado real de tu relación?
                            </p>
                            <p className="text-sm text-muted-foreground">
                                El diagnóstico relacional evalúa cinco dimensiones y te da un informe personalizado.
                            </p>
                            <Link
                                href="/checklist"
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                            >
                                Comenzar diagnóstico →
                            </Link>
                        </div>

                    </div>
                </Container>
            </main>
        </>
    )
}
