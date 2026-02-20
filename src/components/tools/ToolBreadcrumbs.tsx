import Link from "next/link"

interface Crumb {
    label: string
    href?: string
}

interface ToolBreadcrumbsProps {
    toolTitle: string
    toolSlug: string
}

/**
 * Breadcrumbs visuales + JSON-LD BreadcrumbList para SEO.
 * Uso: <ToolBreadcrumbs toolTitle="Calculadora de Celos" toolSlug="calculadora-de-celos" />
 */
export function ToolBreadcrumbs({ toolTitle, toolSlug }: ToolBreadcrumbsProps) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://intentemoslo.com"

    const crumbs: Crumb[] = [
        { label: "Inicio", href: "/" },
        { label: "Herramientas", href: "/herramientas" },
        { label: toolTitle },
    ]

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            ...(crumb.href
                ? { item: `${baseUrl}${crumb.href}` }
                : { item: `${baseUrl}/herramientas/${toolSlug}` }),
        })),
    }

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Visual breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {crumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-1.5">
                        {index > 0 && (
                            <span className="text-muted-foreground/50" aria-hidden="true">›</span>
                        )}
                        {crumb.href ? (
                            <Link
                                href={crumb.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-medium" aria-current="page">
                                {crumb.label}
                            </span>
                        )}
                    </span>
                ))}
            </nav>
        </>
    )
}
