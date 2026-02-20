import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Header } from "@/components/layout/Header"
import { getArticuloBySlug } from "@/data/blog"

const ARTICULO_SLUG = "que-son-los-celos-en-pareja"
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.intentemoslodenuevo.com"

export const metadata: Metadata = {
    title: "Qué son los celos en pareja y cuándo son un problema — Guía psicológica",
    description:
        "Los celos en pareja son normales hasta cierto punto. Aprende qué los causa, cómo identificarlos y cuándo se convierten en un patrón problemático.",
    openGraph: {
        title: "Qué son los celos en pareja y cuándo son un problema | Intentémoslo de Nuevo",
        description:
            "Los celos en pareja son normales hasta cierto punto. Aprende qué los causa y cuándo se vuelven problemáticos.",
        url: `/blog/${ARTICULO_SLUG}`,
        type: "article",
    },
    alternates: {
        canonical: `/blog/${ARTICULO_SLUG}`,
    },
}

export default function ArticuloCelosPage() {
    const articulo = getArticuloBySlug(ARTICULO_SLUG)

    const jsonLdArticle = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Qué son los celos en una relación de pareja y cuándo se vuelven un problema",
        description: articulo?.description,
        url: `${BASE_URL}/blog/${ARTICULO_SLUG}`,
        datePublished: articulo?.publishedAt,
        inLanguage: "es",
        author: {
            "@type": "Organization",
            name: "Intentémoslo de Nuevo",
        },
        publisher: {
            "@type": "Organization",
            name: "Intentémoslo de Nuevo",
            url: BASE_URL,
        },
    }

    const jsonLdBreadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
            {
                "@type": "ListItem",
                position: 3,
                name: "Qué son los celos en pareja",
                item: `${BASE_URL}/blog/${ARTICULO_SLUG}`,
            },
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

            <Header />
            <main className="min-h-screen bg-background pt-28 pb-20">
                <Container>
                    <div className="max-w-2xl mx-auto space-y-10">

                        {/* Breadcrumbs */}
                        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
                            <span className="text-muted-foreground/50" aria-hidden="true">›</span>
                            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                            <span className="text-muted-foreground/50" aria-hidden="true">›</span>
                            <span className="text-foreground font-medium" aria-current="page">Celos en pareja</span>
                        </nav>

                        {/* Cabecera */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 text-foreground/70">
                                💡 Artículo educativo · Cluster: Celos
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
                                Qué son los celos en una relación de pareja y cuándo se vuelven un problema
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Los celos son una respuesta emocional universal. Pero cuando se intensifican
                                o se vuelven irracionales, pueden convertirse en una fuente de malestar y deterioro
                                relacional. Aprende a distinguirlos, entender su origen y saber cuándo actuar.
                            </p>
                        </div>

                        {/* Artículo principal */}
                        <article className="prose prose-sm md:prose max-w-none text-foreground/80 space-y-6">

                            <h2>¿Qué son los celos exactamente?</h2>
                            <p>
                                Los <strong>celos</strong> son una respuesta emocional que surge cuando percibimos
                                una amenaza real o imaginada sobre un vínculo que valoramos. En el contexto romántico,
                                aparecen cuando sentimos que nuestra relación —o nuestro lugar en ella— está en riesgo.
                            </p>
                            <p>
                                Desde la psicología, los celos no son una emoción simple sino un estado complejo
                                que combina miedo (a perder a la persona), rabia (hacia la amenaza percibida)
                                y tristeza (por la posible pérdida). La investigación de Pfeiffer y Wong (1989)
                                distingue tres dimensiones:
                            </p>
                            <ul>
                                <li><strong>Cognitivos:</strong> pensamientos recurrentes de sospecha o desconfianza.</li>
                                <li><strong>Emocionales:</strong> ansiedad, miedo a la pérdida, inseguridad.</li>
                                <li><strong>Conductuales:</strong> revisión de dispositivos, control de movimientos, restricciones.</li>
                            </ul>

                            <h2>¿Son los celos normales?</h2>
                            <p>
                                Sí, en cierta medida. Sentir una puntada de incomodidad cuando tu pareja recibe
                                atención de alguien atractivo es una respuesta emocional reconocida y documentada
                                en prácticamente todas las culturas. No es señal de debilidad ni de un problema grave.
                            </p>
                            <p>
                                El problema comienza cuando esa respuesta se <em>amplifica, se vuelve persistente</em>
                                o empieza a <em>dictar comportamientos</em>: revisar el teléfono, exigir explicaciones
                                constantes, restringir amistades o interpretando sistemáticamente situaciones neutras
                                como señales de traición.
                            </p>

                            {/* CTA herramienta — interlinking interno */}
                            <div className="not-prose bg-primary/5 border border-primary/15 rounded-2xl p-5 space-y-3 my-6">
                                <p className="text-sm font-semibold text-foreground">
                                    🎯 ¿No sabes en qué punto estás?
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    La Calculadora de Celos evalúa tu nivel en tres dimensiones:
                                    cognitiva, emocional y conductual.
                                </p>
                                <Link
                                    href="/herramientas/calculadora-de-celos"
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Ir a la Calculadora de Celos →
                                </Link>
                            </div>

                            <h2>¿Cuándo se convierten en un problema?</h2>
                            <p>
                                Los celos pasan a ser problemáticos cuando:
                            </p>
                            <ul>
                                <li>Interferieren en tu bienestar cotidiano de forma recurrente.</li>
                                <li>Generan conflictos frecuentes o sistemáticos en la relación.</li>
                                <li>Te llevan a conductas de control o vigilancia sobre tu pareja.</li>
                                <li>Se basan en interpretaciones de situaciones objetivamente neutras.</li>
                                <li>La otra persona se siente fiscalizada, juzgada o asfixiada.</li>
                            </ul>
                            <p>
                                John Gottman, uno de los investigadores más reconocidos en dinámica de pareja,
                                identificó que los comportamientos de control y vigilancia —que a menudo surgen
                                de los celos— son uno de los principales erosionadores de la confianza mutua
                                a largo plazo.
                            </p>

                            <h2>¿Qué hay detrás de los celos intensos?</h2>
                            <p>
                                La investigación sobre ansiedad relacional indica que los celos intensos
                                suelen estar conectados con:
                            </p>
                            <ul>
                                <li><strong>Estilo de apego ansioso:</strong> hipersensibilidad a señales de abandono.</li>
                                <li><strong>Experiencias previas de traición:</strong> que generalizan la desconfianza.</li>
                                <li><strong>Baja autoestima situcional:</strong> la sensación de "no ser suficiente".</li>
                                <li><strong>Inseguridad relacional:</strong> percibir la relación como frágil o inestable.</li>
                            </ul>

                            {/* CTA segunda herramienta */}
                            <div className="not-prose bg-secondary/40 border border-secondary rounded-2xl p-5 space-y-3 my-6">
                                <p className="text-sm font-semibold text-foreground">
                                    ⏪ ¿Sientes celos del pasado de tu pareja?
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Los celos retroactivos son un patrón diferente: se dirigen
                                    hacia el pasado, no el presente. Tenemos una herramienta específica.
                                </p>
                                <Link
                                    href="/herramientas/detector-celos-retroactivos"
                                    className="inline-flex items-center gap-2 bg-foreground hover:opacity-80 text-background font-semibold px-4 py-2 rounded-lg text-sm transition-opacity"
                                >
                                    Detector de Celos Retroactivos →
                                </Link>
                            </div>

                            <h2>¿Qué se puede hacer?</h2>
                            <p>
                                El primer paso es siempre el reconocimiento: identificar que los celos
                                están presentes y entender su origen. A partir de ahí, algunos caminos
                                reconocidos en la investigación:
                            </p>
                            <ul>
                                <li>
                                    <strong>Reestructuración cognitiva:</strong> cuestionar activamente
                                    si la interpretación de las situaciones es objetiva o está distorsionada.
                                </li>
                                <li>
                                    <strong>Trabajo sobre el apego:</strong> explorar qué necesidades de
                                    seguridad o reconocimiento activan la respuesta celosa.
                                </li>
                                <li>
                                    <strong>Comunicación abierta en pareja:</strong> expresar las inseguridades
                                    sin culpar ni controlar.
                                </li>
                                <li>
                                    <strong>Apoyo profesional:</strong> cuando el patrón interfiere
                                    significativamente en la calidad de vida o la relación.
                                </li>
                            </ul>
                        </article>

                        {/* CTA diagnóstico principal */}
                        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 text-center space-y-3">
                            <p className="text-sm font-semibold text-foreground">
                                ¿Quieres una visión completa del estado de tu relación?
                            </p>
                            <p className="text-sm text-muted-foreground">
                                El diagnóstico relacional evalúa cinco dimensiones, no solo los celos.
                            </p>
                            <Link
                                href="/checklist"
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                            >
                                Comenzar diagnóstico completo →
                            </Link>
                        </div>

                    </div>
                </Container>
            </main>
        </>
    )
}
