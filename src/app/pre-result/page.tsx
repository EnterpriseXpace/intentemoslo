"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Lock, CheckCircle2 } from "lucide-react"
import { trackEvent } from "@/lib/instrumentation"

function PreResultContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const type = searchParams.get("type")
    const isDeep = type === "deep"

    // Pricing Logic
    const quickPrice = Number(process.env.NEXT_PUBLIC_PRICE_QUICK)
    const deepPrice = Number(process.env.NEXT_PUBLIC_PRICE_DEEP)

    if (!quickPrice || !deepPrice || isNaN(quickPrice) || isNaN(deepPrice)) {
        throw new Error("Invalid pricing configuration")
    }

    const price = isDeep ? deepPrice : quickPrice
    const productType = isDeep ? 'deep' : 'quick'

    useEffect(() => {
        trackEvent('pre_result_viewed', { productType })
    }, [productType])

    const handleUnlock = () => {
        trackEvent('checkout_clicked', { productType })
        const params = new URLSearchParams(searchParams.toString())
        router.push(`/checkout?${params.toString()}`)
    }

    // Bypass logic: Check if user already has access (e.g. from Upgrade)
    useEffect(() => {
        const checkAccess = async () => {
            try {
                // If we are in Deep flow, check if we already have deep access
                if (isDeep) {
                    // Priority: 1. URL Param (from Stripe) 2. SessionStorage
                    const urlEmail = searchParams.get("email")
                    const storedEmail = sessionStorage.getItem("customer_email")
                    const emailToCheck = urlEmail || storedEmail

                    if (urlEmail) {
                        sessionStorage.setItem("customer_email", urlEmail)
                    }

                    if (!emailToCheck) {
                        console.log("No email found for access check")
                        return
                    }

                    const res = await fetch(`/api/access/check?email=${encodeURIComponent(emailToCheck)}`)
                    const data = await res.json()

                    if (data.access === 'deep') {
                        // Already paid! Redirect to result with params
                        const params = new URLSearchParams(searchParams.toString())
                        router.replace(`/result?${params.toString()}`)
                    }
                }
            } catch (e) {
                console.error("Auth check failed", e)
            }
        }
        checkAccess()
    }, [isDeep, searchParams, router])

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
                <Container className="max-w-lg text-center space-y-10">

                    {/* Header */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Análisis Completado
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                            Tu lectura está lista
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {isDeep
                                ? "Hemos cruzado las 5 dimensiones. Tu evaluación profunda está completa y lista para lectura."
                                : "Hemos revisado tus respuestas. Tu diagnóstico rápido está listo para ser desbloqueado."
                            }
                        </p>
                    </div>

                    {/* Visual Teaser (Blurred) */}
                    <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden group">
                        {/* Blur Overlay */}
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 transition-all duration-500 group-hover:backdrop-blur-sm">
                            <div className="p-4 bg-white rounded-full shadow-sm">
                                <Lock className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-foreground">Resultado Bloqueado</p>
                                <p className="text-sm text-muted-foreground px-4">
                                    El informe contiene datos sensibles sobre tu situación actual.
                                </p>
                            </div>
                        </div>

                        {/* Abstract / Blurred Content Underneath */}
                        <div className="w-full h-full p-8 opacity-20 filter blur-sm scale-110">
                            {/* Fake Chart / Gauge */}
                            <div className="w-full h-full rounded-full border-[20px] border-primary/40 flex items-center justify-center">
                                <div className="w-2/3 h-2/3 bg-secondary/80 rounded-full"></div>
                            </div>
                            {/* Fake text lines */}
                            <div className="absolute bottom-10 left-0 right-0 px-10 space-y-2">
                                <div className="h-4 bg-foreground/20 rounded-full w-3/4 mx-auto"></div>
                                <div className="h-4 bg-foreground/20 rounded-full w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                            <Button
                                onClick={handleUnlock}
                                className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                            >
                                <span className="font-bold text-lg">
                                    Ver análisis completo (US$ {price})
                                </span>
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Pago único · Acceso inmediato
                            </p>
                        </div>
                    </div>

                </Container>
            </main>
        </div>
    )
}

export default function PreResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <PreResultContent />
        </Suspense>
    )
}
