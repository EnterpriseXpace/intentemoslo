"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Loader2, CheckCircle2, FileText, Download, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function LeadMagnetBlock({
    source = "unknown",
    className
}: {
    source?: string,
    className?: string
}) {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'lead_magnet' })
            })

            const data = await res.json()

            if (data.success) {
                setIsSuccess(true)
                setEmail("")
                // Immediate download in new tab
                window.open('/escala-termica-relacional.pdf', '_blank')
            } else {
                setError("Algo salió mal. Por favor intenta de nuevo.")
            }
        } catch (err) {
            setError("Error de conexión.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className={cn("bg-secondary/10 border border-primary/20 rounded-3xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500", className)}>
                <div className="flex justify-center text-primary mb-2">
                    <CheckCircle2 className="w-16 h-16" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-display text-brand-navy">
                        🎁 Guía descargada correctamente
                    </h3>
                    <p className="text-muted-foreground">
                        Se ha abierto en una nueva pestaña. También te la enviamos por correo.
                    </p>
                </div>

                {/* Contextual CTA based on source */}
                {source.includes('landing') && (
                    <div className="pt-4 border-t border-primary/10 flex flex-col items-center">
                        <p className="font-bold text-brand-navy mb-4">
                            ¿Quieres saber en qué rango estás realmente?
                        </p>
                        <Link href="/checklist">
                            <Button className="w-full md:w-auto px-8 py-6 h-auto text-lg rounded-full shadow-lg animate-pulse hover:animate-none">
                                Comenzar diagnóstico por $5 <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* If not landing (e.g. result page), maybe just show a simple success or nothing extra */}
                {!source.includes('landing') && (
                    <Button variant="outline" className="mt-2 gap-2" onClick={() => window.open('/guia-escala-termica.pdf', '_blank')}>
                        <Download className="w-4 h-4" /> Abrir de nuevo
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className={cn("bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500", className)}>

            {/* Visual Anchor: PDF Icon */}
            <div className="absolute -top-12 -right-12 text-primary/5 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                <FileText className="w-64 h-64" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">

                {/* Text Content */}
                <div className="space-y-8 text-center md:text-left">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 text-brand-navy text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm border border-white/40">
                            <Download className="w-3 h-3 text-primary" />
                            <span>Recurso Gratuito</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold font-display text-brand-navy leading-tight">
                            🎁 Descarga gratuita: <br className="hidden md:block" />
                            <span className="text-primary-dark">La Escala Térmica Relacional</span>
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Descubre qué revela realmente cada rango y cómo saber si tu relación se está fortaleciendo… o enfriando.
                        </p>
                    </div>

                    <ul className="space-y-3 inline-block text-left bg-white/40 p-6 rounded-2xl border border-white/50 backdrop-blur-sm">
                        {[
                            "Entiende tu rango actual",
                            "Detecta señales silenciosas",
                            "Toma decisiones con claridad"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-base font-medium text-brand-navy/80">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-3xl shadow-lg shadow-brand-navy/5 border border-brand-navy/5 relative">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                        <div className="text-center md:text-left mb-2">
                            <p className="font-bold text-brand-navy text-sm">
                                ¿A dónde te enviamos la guía?
                            </p>
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full bg-gray-50 border border-gray-200 text-brand-navy placeholder:text-gray-400 text-lg px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold text-lg h-14 rounded-xl shadow-lg transition-transform active:scale-95"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Enviando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Descargar guía gratuita
                                </span>
                            )}
                        </Button>

                        {error && (
                            <p className="text-red-500 text-xs text-center animate-pulse">{error}</p>
                        )}

                        <p className="text-[10px] text-center text-gray-400 mt-2">
                            Tu correo está seguro. Sin spam.
                        </p>
                    </form>
                </div>

            </div>
        </div>
    )
}
