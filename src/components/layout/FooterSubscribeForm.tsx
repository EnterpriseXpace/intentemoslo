"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react"

export function FooterSubscribeForm() {
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
                body: JSON.stringify({ email, source: 'newsletter' })
            })

            const data = await res.json()

            if (data.success) {
                setIsSuccess(true)
                setEmail("")
            } else {
                setError("Algo salió mal.")
            }
        } catch (err) {
            setError("Error de conexión.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-xl border border-green-400/20">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">¡Suscrito correctamente!</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2" onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
                <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                />
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !email}
                    className="bg-primary hover:bg-primary/90 text-brand-navy font-bold rounded-xl px-4"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </span>
                    ) : (
                        <span className="font-bold">Suscribirme</span>
                    )}
                </Button>
            </div>
            {error && (
                <p className="text-red-400 text-xs pl-1">{error}</p>
            )}
            <p className="text-[10px] text-gray-500 pl-1">
                Puedes darte de baja cuando quieras.
            </p>
        </div>
    )
}
