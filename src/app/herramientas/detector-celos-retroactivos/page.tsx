import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { Header } from "@/components/layout/Header"
import { ToolBreadcrumbs } from "@/components/tools/ToolBreadcrumbs"
import { RelatedTools } from "@/components/tools/RelatedTools"
import DetectorClient from "./DetectorClient"

const TOOL_SLUG = "detector-celos-retroactivos"
const TOOL_TITLE = "Detector de Celos Retroactivos"
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.intentemoslodenuevo.com"

export const metadata: Metadata = {
    title: "Test de Celos Retroactivos — ¿Sientes celos del pasado de tu pareja?",
    description:
        "Descubre si sufres celos retroactivos y qué los origina. Herramienta gratuita orientativa basada en investigación sobre retroactive jealousy y ansiedad relacional.",
    openGraph: {
        title: "Test de Celos Retroactivos | Intentémoslo de Nuevo",
        description:
            "Identifica si los celos por el pasado de tu pareja están afectando tu relación. Herramienta gratuita con resultado inmediato.",
        url: `/herramientas/${TOOL_SLUG}`,
        type: "website",
    },
    alternates: {
        canonical: `/herramientas/${TOOL_SLUG}`,
    },
}

export default function DetectorCelosRetroactivosPage() {
    const jsonLdWebApp = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: TOOL_TITLE,
        description:
            "Herramienta orientativa para detectar patrones de celos retroactivos. Inspirada en investigación sobre retroactive jealousy y teoría del apego.",
        url: `${BASE_URL}/herramientas/${TOOL_SLUG}`,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        inLanguage: "es",
        isAccessibleForFree: true,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
            />
            <Header />
            <main className="min-h-screen bg-background pt-28 pb-20">
                <Container>
                    <div className="max-w-2xl mx-auto space-y-8">
                        <ToolBreadcrumbs toolTitle={TOOL_TITLE} toolSlug={TOOL_SLUG} />

                        {/* Header de la herramienta */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 text-foreground/70">
                                ⏪ Herramienta orientativa · 3 minutos
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
                                {TOOL_TITLE}
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                Los celos retroactivos son pensamientos recurrentes e incómodos sobre las
                                relaciones pasadas de tu pareja. Si bien son comunes, cuando se intensifican
                                pueden generar malestar y erosionar la confianza. Este detector te ayuda
                                a identificar si ese patrón está presente y con qué intensidad.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Inspirado en investigación sobre <em>retroactive jealousy</em>, ansiedad
                                relacional y teoría del apego. No constituye un diagnóstico clínico.
                            </p>
                        </div>

                        {/* Herramienta interactiva */}
                        <DetectorClient />

                        {/* Artículo SEO educativo */}
                        <article className="prose prose-sm max-w-none text-muted-foreground space-y-4 pt-8 border-t border-secondary">
                            <h2 className="text-lg font-bold text-foreground">
                                ¿Qué son los celos retroactivos?
                            </h2>
                            <p>
                                Los <strong>celos retroactivos</strong> (o <em>retroactive jealousy</em>)
                                son un patrón de pensamientos intrusivos y recurrentes sobre las relaciones,
                                experiencias o encuentros sexuales que tu pareja tuvo antes de conocerte.
                                A diferencia de los celos convencionales —que responden a amenazas presentes—,
                                estos se dirigen hacia un pasado sobre el que no existe control posible.
                            </p>

                            <h3 className="text-base font-bold text-foreground">
                                ¿Por qué aparecen?
                            </h3>
                            <p>
                                Investigaciones sobre ansiedad relacional indican que los celos retroactivos
                                suelen estar asociados a:
                            </p>
                            <ul>
                                <li>Estilos de apego ansioso o inseguro</li>
                                <li>Baja autoestima situacional en el contexto de la relación</li>
                                <li>Experiencias previas de traición o abandono</li>
                                <li>Comparación social y necesidad de ser "el primero o la primera más importante"</li>
                            </ul>

                            <h3 className="text-base font-bold text-foreground">
                                ¿Cuándo se convierten en un problema?
                            </h3>
                            <p>
                                Sentir incomodidad ocasional es algo que muchas personas experimentan.
                                El patrón se vuelve problemático cuando los pensamientos son intrusivos,
                                frecuentes e interfieren en tu bienestar o en la dinámica de la relación:
                                cuando generan conflictos repetidos, erosionan la confianza o se convierten
                                en fuente de malestar cotidiano.
                            </p>

                            <h3 className="text-base font-bold text-foreground">
                                ¿Qué puede ayudar?
                            </h3>
                            <p>
                                El primer paso es identificar el patrón y entender su origen. Técnicas
                                como la reestructuración cognitiva, el trabajo sobre el apego y la
                                comunicación abierta con la pareja son caminos reconocidos en la
                                investigación psicológica para gestionar este tipo de ansiedad relacional.
                            </p>
                        </article>

                        {/* Interlinking: herramientas relacionadas del mismo cluster */}
                        <RelatedTools slug={TOOL_SLUG} title="También sobre celos" />

                        {/* CTA hacia diagnóstico principal */}
                        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 text-center space-y-3">
                            <p className="text-sm font-semibold text-foreground">
                                ¿Quieres una visión más completa de tu relación?
                            </p>
                            <p className="text-sm text-muted-foreground">
                                El diagnóstico relacional evalúa múltiples dimensiones de tu relación,
                                no solo los celos.
                            </p>
                            <a
                                href="/checklist"
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                            >
                                Comenzar diagnóstico completo →
                            </a>
                        </div>
                    </div>
                </Container>
            </main>
        </>
    )
}
