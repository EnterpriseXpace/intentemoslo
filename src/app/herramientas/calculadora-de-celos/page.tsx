import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { Header } from "@/components/layout/Header"
import { ToolBreadcrumbs } from "@/components/tools/ToolBreadcrumbs"
import { RelatedTools } from "@/components/tools/RelatedTools"
import CalculadoraClient from "./CalculadoraClient"

const TOOL_SLUG = "calculadora-de-celos"
const TOOL_TITLE = "Calculadora de Celos"
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://intentemoslo.com"

export const metadata: Metadata = {
    title: "Calculadora de Celos — Perfil tridimensional basado en investigación psicológica",
    description:
        "Evalúa tus celos en tres dimensiones: cognitiva, emocional y conductual. Herramienta orientativa inspirada en la Multidimensional Jealousy Scale y la teoría del apego. Resultado inmediato, gratis.",
    openGraph: {
        title: "Calculadora de Celos — Perfil tridimensional | Intentémoslo de Nuevo",
        description:
            "Descubre en qué dimensión son más intensos tus celos: cognitiva, emocional o conductual. Herramienta gratuita e inspirada en modelos psicológicos reconocidos.",
        url: `/herramientas/${TOOL_SLUG}`,
        type: "website",
    },
    alternates: {
        canonical: `/herramientas/${TOOL_SLUG}`,
    },
}

export default function CalculadoraDeCelosPage() {
    const jsonLdWebApp = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: TOOL_TITLE,
        description:
            "Herramienta orientativa para explorar patrones de celos en tres dimensiones: cognitiva, emocional y conductual. Inspirada en la Multidimensional Jealousy Scale (Pfeiffer & Wong, 1989) y la teoría del apego.",
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

                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 text-foreground/70">
                                🎯 Herramienta orientativa · 2 minutos
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
                                {TOOL_TITLE}
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                Explora el patrón de celos en tu relación a través de tres dimensiones:
                                cognitiva, emocional y conductual. Obtén un perfil personalizado basado
                                en tus respuestas.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Esta herramienta está inspirada en investigaciones psicológicas sobre celos
                                multidimensionales y dinámicas de apego. No constituye un diagnóstico clínico.
                            </p>
                        </div>

                        <CalculadoraClient />

                        <article className="prose prose-sm max-w-none text-muted-foreground space-y-4 pt-8 border-t border-secondary">
                            <h2 className="text-lg font-bold text-foreground">
                                ¿En qué se basa esta calculadora?
                            </h2>
                            <p>
                                Esta herramienta se inspira en la{" "}
                                <strong>Multidimensional Jealousy Scale</strong> desarrollada por Pfeiffer
                                y Wong (1989), que diferencia tres dimensiones independientes en los celos
                                románticos: cognitiva (pensamientos de sospecha), emocional (ansiedad y
                                miedo a pérdida) y conductual (vigilancia y control). Cada una puede estar
                                presente con diferente intensidad en una misma persona.
                            </p>

                            <h3 className="text-base font-bold text-foreground">
                                Apego e inseguridad relacional
                            </h3>
                            <p>
                                La teoría del apego de Hazan y Shaver señala que los estilos de apego
                                formados tempranamente influyen en cómo interpretamos amenazas dentro de
                                la pareja. El apego ansioso predispone a mayor activación emocional ante
                                señales de abandono o deslealtad, aunque no existan objetivamente.
                            </p>

                            <h3 className="text-base font-bold text-foreground">
                                Los celos conductuales y la dinámica de pareja
                            </h3>
                            <p>
                                John Gottman identificó los comportamientos de vigilancia y control como
                                señales de alerta que erosionan la confianza mutua. La diferencia entre
                                un celo ocasional y un patrón conductual problemático no está en la
                                emoción en sí, sino en cómo se expresa y gestiona.
                            </p>

                            <h3 className="text-base font-bold text-foreground">
                                ¿Cómo interpretar el resultado?
                            </h3>
                            <p>
                                Esta calculadora genera un perfil orientativo, no un diagnóstico clínico.
                                Puntuaciones bajas (0–4) sugieren pocas señales de alerta; moderadas
                                (5–6) invitan a la reflexión; altas (7–10) señalan patrones que conviene
                                explorar con más profundidad, idealmente con apoyo profesional.
                            </p>
                            <p>
                                La claridad sobre tus propios patrones es el primer paso para tomar
                                decisiones más conscientes en tu relación.
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
                                El diagnóstico relacional evalúa múltiples dimensiones, no solo los celos.
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
