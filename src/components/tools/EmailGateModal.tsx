"use client"

import { useState, useRef } from "react"

interface EmailGateModalProps {
    toolSlug: string
    toolTitle: string
    onSuccess: () => void
}

export function EmailGateModal({ toolSlug, toolTitle, onSuccess }: EmailGateModalProps) {
    const [email, setEmail] = useState("")
    const [gdpr, setGdpr] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const submittingRef = useRef(false)

    const validateEmail = (val: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (submittingRef.current) return
        setError(null)

        if (!validateEmail(email)) {
            setError("Introduce un correo electrónico válido.")
            return
        }
        if (!gdpr) {
            setError("Debes aceptar las comunicaciones para continuar.")
            return
        }

        submittingRef.current = true
        setLoading(true)

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    source: `herramienta_${toolSlug}`,
                }),
            })

            if (!res.ok) {
                throw new Error("Error al registrar el correo.")
            }

            setSubmitted(true)
            // Pequeño delay para dar feedback visual antes de revelar resultado
            setTimeout(() => {
                onSuccess()
            }, 600)
        } catch {
            setError("Algo fue mal. Por favor inténtalo de nuevo.")
            submittingRef.current = false
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                {/* Icono */}
                <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                        🔓
                    </div>
                </div>

                {/* Título */}
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold font-display text-foreground">
                        Desbloquea tu resultado
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Ingresa tu correo para ver el resultado de la{" "}
                        <span className="font-medium">{toolTitle}</span> y continuar
                        explorando herramientas relacionadas.
                    </p>
                </div>

                {/* Formulario */}
                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label
                                htmlFor="email-gate-input"
                                className="block text-sm font-medium text-foreground mb-1.5"
                            >
                                Correo electrónico
                            </label>
                            <input
                                id="email-gate-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                autoComplete="email"
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-card-border bg-white text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-60"
                            />
                        </div>

                        {/* GDPR checkbox */}
                        <label
                            htmlFor="gdpr-checkbox"
                            className="flex items-start gap-3 cursor-pointer group"
                        >
                            <input
                                id="gdpr-checkbox"
                                type="checkbox"
                                checked={gdpr}
                                onChange={(e) => setGdpr(e.target.checked)}
                                disabled={loading}
                                className="mt-0.5 h-4 w-4 rounded border-card-border text-primary accent-primary flex-shrink-0 cursor-pointer"
                            />
                            <span className="text-xs text-muted-foreground leading-relaxed">
                                Acepto recibir comunicaciones y contenido relacionado. Puedes
                                darte de baja en cualquier momento. Ver{" "}
                                <a
                                    href="/politica-de-privacidad"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    política de privacidad
                                </a>
                                .
                            </span>
                        </label>

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                                    Procesando…
                                </>
                            ) : (
                                "Ver resultado →"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4 space-y-2">
                        <div className="text-3xl">✅</div>
                        <p className="text-sm font-medium text-foreground">¡Listo! Mostrando tu resultado…</p>
                    </div>
                )}

                {/* Privacidad footer */}
                <p className="text-center text-xs text-muted-foreground">
                    🔒 Tu correo está seguro. No compartimos datos con terceros.
                </p>
            </div>
        </div>
    )
}
