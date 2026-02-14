"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Loader2, Mail, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function SubscribeBlock({
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
                body: JSON.stringify({ email, source })
            })

            const data = await res.json()

            if (data.success) {
                setIsSuccess(true)
                setEmail("")
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
            <div className={cn("bg-brand-navy/5 border border-brand-navy/10 rounded-2xl p-8 text-center space-y-4 animate-in fade-in zoom-in duration-500", className)}>
                <div className="flex justify-center text-green-500 mb-2">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-navy">¡Gracias!</h3>
                <p className="text-muted-foreground">
                    Revisa tu correo en los próximos días para recibir tus herramientas.
                </p>
            </div>
        )
    }

    return (
        <div className={cn("bg-white rounded-3xl p-8 border border-border/50 shadow-sm relative overflow-hidden", className)}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">

                {/* Text Content */}
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-brand-navy/60 mb-2">
                        <Mail className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Newsletter</span>
                    </div>
                    <h3 className="text-2xl font-bold font-display text-brand-navy">
                        Recibe claridad relacional
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Reflexiones prácticas y herramientas para entender mejor tu relación. Sin spam, solo valor real.
                    </p>
                </div>

                {/* Form */}
                <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)} className="flex flex-col gap-3">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full bg-gray-50 border border-gray-200 text-brand-navy placeholder:text-gray-400 text-lg px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                        />
                    </div>

                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || !email}
                        className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold text-lg h-12 rounded-xl"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Suscribiendo...
                            </span>
                        ) : (
                            "Recibir tips gratuitos"
                        )}
                    </Button>

                    {error && (
                        <p className="text-red-500 text-xs text-center animate-pulse">{error}</p>
                    )}

                    <p className="text-xs text-center text-gray-400 mt-2">
                        Puedes darte de baja en cualquier momento.
                    </p>
                </div>

            </div>
        </div>
    )
}
