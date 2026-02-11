"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Lock, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { trackEvent } from "@/lib/instrumentation"
// ... imports ...

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // ... existing logic ...
    const [loading, setLoading] = useState(false)
    const [customerName, setCustomerName] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const type = searchParams.get("type")
    const isDeep = type === "deep"
    const isUpgrade = type === "upgrade" // Handle upgrade UI if needed

    // Determine visuals and price
    const quickPrice = Number(process.env.NEXT_PUBLIC_PRICE_QUICK)
    const deepPrice = Number(process.env.NEXT_PUBLIC_PRICE_DEEP)
    const upgradePrice = Number(process.env.NEXT_PUBLIC_PRICE_UPGRADE)

    const price = isDeep ? deepPrice : isUpgrade ? upgradePrice : quickPrice
    const productName = isDeep ? "Evaluación Profunda 360°" : isUpgrade ? "Actualización a Profunda" : "Diagnóstico Rápido"
    const productType = isDeep ? 'deep' : isUpgrade ? 'upgrade' : 'quick'

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productType,
                    customerName,
                    email,
                    currentUrlParams: searchParams.toString()
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al iniciar el pago')
            }

            if (data.url) {
                trackEvent('payment_initiated', { productType, metadata: { price } })
                window.location.href = data.url
            }

        } catch (err: any) {
            console.error(err)
            setError("Hubo un problema al conectar con el proveedor de pagos. Por favor intenta de nuevo.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">

            <main className="py-12 lg:py-20">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                        {/* Left Column: Value Prop */}
                        <div className="space-y-8">
                            <span className="inline-block px-3 py-1 bg-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                                {isDeep ? "Acceso Completo" : isUpgrade ? "Upgrade" : "Acceso Rápido"}
                            </span>

                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-[1.1]">
                                    {isUpgrade ? "Completa tu análisis" : "Accede a tu"}
                                    {isDeep ? <span className="text-primary"> Evaluación Profunda</span> : isUpgrade ? <span className="text-primary"> Evaluación Profunda</span> : <span className="text-primary"> Diagnóstico Rápido</span>}
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                                    {isDeep || isUpgrade
                                        ? "Un análisis detallado de 5 dimensiones clave para entender la raíz de tus dudas y trazar un mapa claro."
                                        : "Un análisis basado en modelos psicológicos validados (RAS) para entender el estado real de tu relación."
                                    }
                                </p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <ul className="space-y-3">
                                    {(isDeep || isUpgrade ? [
                                        "Análisis de 5 Dimensiones (Comunicación, Confianza, etc.)",
                                        "Identificación de Patrón Dominante",
                                        "Evaluación de Riesgo Temporal",
                                        "Recomendaciones Estratégicas",
                                        "Informe Extenso PDF"
                                    ] : [
                                        "Índice de Estabilidad Relacional (0–100)",
                                        "Semáforo relacional personalizado",
                                        "Análisis escrito de tu situación",
                                        "Recomendaciones prácticas inmediatas",
                                        "Descarga en PDF"
                                    ]).map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                                            <div className="p-1 bg-primary/20 rounded-full text-primary-foreground">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Trust Badge / Neutral Social Proof */}
                            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 mt-8">
                                <div className="flex gap-4 items-center">
                                    <div className="p-3 bg-muted text-muted-foreground rounded-full">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Herramienta de Orientación</h4>
                                        <p className="text-sm font-medium text-foreground">
                                            Utilizado por personas que buscan claridad antes de decidir.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Payment Form */}
                        <div className="bg-card p-8 md:p-10 rounded-[2rem] shadow-xl border border-border/40 sticky top-24">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold font-display text-foreground">Detalles del pago</h2>
                                <p className="text-muted-foreground">Serás redirigido a Stripe para un pago seguro.</p>
                            </div>

                            <div className="flex items-baseline justify-between mb-8 pb-8 border-b border-border/50">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total a pagar</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-4xl font-bold font-display">${price}</span>
                                    <span className="text-sm font-medium text-muted-foreground">USD</span>
                                </div>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nombre (Opcional)</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Para personalizar el informe"
                                        className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email (Requerido)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="tu@email.com"
                                        className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Te enviaremos el recibo a este correo.</p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg shadow-primary/20 mt-4"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Iniciando pago...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-5 h-5 opacity-80" />
                                            <span>Proceder al Pago Seguro</span>
                                        </div>
                                    )}
                                </Button>

                                <div className="flex justify-center gap-2 pt-4 opacity-50 grayscale">
                                    <span className="text-xs font-bold tracking-widest uppercase">Powered by Stripe</span>
                                </div>
                            </form>
                        </div>
                    </div>
                </Container >
            </main >
        </div >
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
