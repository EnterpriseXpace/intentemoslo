"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { getDeepResult, RAS_QUESTIONS } from "@/data/questions"
import { trackEvent } from "@/lib/instrumentation"
import { Loader2, Download, Lock } from "lucide-react"

// Types & Logic
import {
    type DimensionScore,
    calculateDeepScores,
    identifyDominantPattern,
    getDeepRecommendations,
    generateHumanSummary,
    assessTemporalRisk
} from "@/lib/deep-logic"

// Components
import { DeepSummary } from "@/components/results/deep/DeepSummary"
import { DeepDimensions } from "@/components/results/deep/DeepDimensions"
import { DeepPattern } from "@/components/results/deep/DeepPattern"
import { DeepRisk } from "@/components/results/deep/DeepRisk"
import { DeepRecommendations } from "@/components/results/deep/DeepRecommendations"
import { ResultMetric } from "@/components/results/ResultMetric"
import { TrafficLight } from "@/components/results/TrafficLight"
import { AnalysisBlock } from "@/components/results/AnalysisBlock"
import { ActionableSteps } from "@/components/results/ActionableSteps"
import { FeedbackForm } from "@/components/results/FeedbackForm"
import { ResultFAQ } from "@/components/results/ResultFAQ"
import { SubscribeBlock } from "@/components/SubscribeBlock"
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock"

type AccessStatus = 'checking' | 'authorized' | 'locked' | 'denied'

export default function ResultClient() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const type = searchParams.get("type")
    const isDeep = type === "deep"

    // --- Hooks ---
    const [status, setStatus] = useState<AccessStatus>('checking')
    const [userName, setUserName] = useState<string | null>(null)
    const [resultId, setResultId] = useState<string | null>(null)
    const hasSavedRef = useRef(false) // Guard against double-saves
    const hasTrackedViewRef = useRef(false) // Guard against double-tracking view

    // --- LOGIC: Calculation (Always runs) ---
    // Logic for RAS (Quick)
    let rasScore = 0
    let greenFactors: string[] = []
    let yellowFactors: string[] = []
    let redFactors: string[] = []
    let ierScore = 0

    // Logic for Deep
    let deepDimensions: DimensionScore[] = []
    let dominantPattern = { title: "", description: "", translation: "", impact: [] as string[], signs: [] as string[] }
    let temporalRisk = { risk3Months: "", risk12Months: "", trajectory: { ifIntervened: "", ifIgnored: "" } }
    let deepRecommendations = { focusOn: "", avoid: "", commonError: "" }
    let humanSummary = ""

    // Calculate Scores based on Params
    if (type === "ras" || type === "quick") {
        let total = 0
        searchParams.forEach((value, key) => {
            if (key.startsWith("R")) {
                const val = parseInt(value, 10) || 0
                if (val > 0) total += val
                const q = RAS_QUESTIONS.find(q => q.id === key)
                if (q) {
                    if (val >= 4) greenFactors.push(q.text)
                    else if (val === 3) yellowFactors.push(q.text)
                    else redFactors.push(q.text)
                }
            }
        })
        rasScore = total
        ierScore = Math.max(0, Math.min(100, Math.round(((rasScore - 7) / (35 - 7)) * 100)))

    } else if (type === "deep") {
        const answers: Record<string, number> = {}
        searchParams.forEach((value, key) => {
            if (key.startsWith("D")) {
                const val = parseInt(value, 10) || 0
                if (val > 0) answers[key] = val
            }
        })

        deepDimensions = calculateDeepScores(answers)
        if (deepDimensions.length > 0) {
            ierScore = Math.round(deepDimensions.reduce((acc, curr) => acc + curr.score, 0) / deepDimensions.length)
        }

        const sortedDimensions = [...deepDimensions].sort((a, b) => a.score - b.score)
        const lowestDimension = sortedDimensions[0]

        if (lowestDimension) {
            dominantPattern = identifyDominantPattern(lowestDimension.id)
            deepRecommendations = getDeepRecommendations(lowestDimension.id)
            humanSummary = generateHumanSummary(ierScore, lowestDimension)
        }
        temporalRisk = assessTemporalRisk(ierScore)
    }

    // --- EFFECTS ---

    // 1. Get User Name
    useEffect(() => {
        const urlName = searchParams.get("name")
        const storageName = sessionStorage.getItem("customer_name")
        setUserName(urlName || storageName)
    }, [searchParams])

    // 2. CHECK ACCESS (The Critical Logic)
    useEffect(() => {
        const checkAccess = async () => {
            // Timeout Check
            const timeoutId = setTimeout(() => {
                console.warn("[RESULT] Verification timeout. Defaulting based on type.")
                if (isDeep) {
                    // Deep Paywall Logic
                    setStatus('locked')
                } else {
                    // For Quick, if timeout, show locked
                    setStatus('locked')
                }
            }, 5000)

            try {
                // Priority: 1. URL Param (from Stripe) 2. SessionStorage
                const urlEmail = searchParams.get("email")
                const storedEmail = sessionStorage.getItem("customer_email")
                const emailToCheck = urlEmail || storedEmail

                if (urlEmail) {
                    sessionStorage.setItem("customer_email", urlEmail)
                }

                if (!emailToCheck) {
                    console.log("[RESULT] No email found.")
                    clearTimeout(timeoutId)
                    // Always show lock if no email (Pre-payment flow)
                    setStatus('locked')
                    return
                }

                // Verify Access via API
                console.log("[RESULT] Verifying access for:", emailToCheck)
                const res = await fetch(`/api/access/check?email=${encodeURIComponent(emailToCheck)}`)

                if (!res.ok) throw new Error("API Error")
                const data = await res.json()
                const accessLevel = data.access // 'deep' | 'quick' | 'none'

                console.log("[RESULT] API Access Level:", accessLevel)

                clearTimeout(timeoutId)

                if (isDeep) {
                    if (accessLevel === 'deep') {
                        setStatus('authorized')
                        trackView('deep')
                    } else {
                        // Not authorized for Deep -> Show Deep Paywall
                        console.warn("[RESULT] Deep Access Denied -> Locked")
                        setStatus('locked')
                    }
                } else {
                    // Quick Flow
                    if (accessLevel === 'quick' || accessLevel === 'deep') {
                        setStatus('authorized')
                        trackView('quick')
                    } else {
                        // Not paid yet -> Show Locked (Quick Paywall)
                        setStatus('locked')
                    }
                }

            } catch (e) {
                console.error("[RESULT] Auth check error", e)
                clearTimeout(timeoutId)
                // Fail safe: Locked
                setStatus('locked')
            }
        }

        checkAccess()
    }, [isDeep, searchParams, router])

    // Helper for tracking
    const trackView = (accessLevel: string) => {
        if (!hasTrackedViewRef.current) {
            hasTrackedViewRef.current = true
            trackEvent('result_viewed', {
                productType: isDeep ? 'deep' : 'quick',
                metadata: { accessLevel }
            })
        }
    }

    // 3. Save Snapshot (Once Authorized)
    useEffect(() => {
        if (status !== 'authorized' || hasSavedRef.current) return

        const saveSnapshot = async () => {
            hasSavedRef.current = true
            try {
                const payload = {
                    sessionId: sessionStorage.getItem('antigravity_session_id'),
                    email: sessionStorage.getItem('customer_email'),
                    productType: isDeep ? "deep" : "quick",
                    ierScore,
                    globalState: ierScore < 40 ? 'critical' : ierScore < 60 ? 'fragile' : ierScore < 80 ? 'caution' : 'stable',
                    dimensions: isDeep ? deepDimensions : null,
                    dominantPattern: isDeep ? dominantPattern.title : null,
                    riskTrajectory: isDeep ? temporalRisk : null,
                    source: 'web',
                    answers_json: {
                        productType: isDeep ? "deep" : "quick",
                        answers: Object.fromEntries(searchParams.entries())
                    }
                }

                const response = await fetch('/api/result/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })

                if (response.ok) {
                    const data = await response.json()
                    setResultId(data.resultId)
                }
            } catch (err) {
                console.error("Failed to save snapshot", err)
            }
        }

        saveSnapshot()
    }, [status, isDeep, ierScore, searchParams])

    const handlePrint = () => {
        window.print()
    }

    // --- RENDER STATES ---

    if (status === 'checking') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Analizando resultados...</p>
            </div>
        )
    }

    if (status === 'locked') {
        const payType = isDeep ? 'deep' : 'quick'
        const price = isDeep ? '$27' : '$5'

        // Deep Flow: Blurred Report + Capture Form
        if (isDeep) {
            return (
                <div className="min-h-screen bg-background relative overflow-hidden">
                    {/* BLURRED BACKGROUND CONTENT */}
                    <div className="filter blur-xl opacity-40 pointer-events-none select-none h-screen overflow-hidden">
                        <Header />
                        <main className="py-12">
                            <Container>
                                <div className="text-center space-y-6 mb-12">
                                    <h1 className="text-4xl font-bold text-foreground">Análisis de Estructura Relacional</h1>
                                </div>
                                <div className="max-w-4xl mx-auto space-y-12">
                                    <div className="grid md:grid-cols-12 gap-8 items-start mb-12">
                                        <div className="md:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4 h-full">
                                            <h3 className="text-lg font-bold text-slate-900">Índice de Estabilidad</h3>
                                            <ResultMetric value={ierScore} label="" size="lg" />
                                        </div>
                                        <div className="md:col-span-8 h-full">
                                            <DeepSummary summary={humanSummary} />
                                        </div>
                                    </div>
                                    <DeepDimensions dimensions={deepDimensions} />
                                </div>
                            </Container>
                        </main>
                    </div>

                    {/* OVERLAY CARD */}
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/50 backdrop-blur-[2px]">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full border-2 border-primary/20 animate-in fade-in zoom-in-95 duration-500">
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-4xl">
                                    🔒
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground font-display">
                                        Tu Análisis está listo
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Hemos completado el estudio de las 5 dimensiones de tu relación.
                                    </p>
                                </div>

                                {/* CAPTURE FORM */}
                                <form
                                    className="space-y-4 text-left"
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        const formData = new FormData(e.currentTarget)
                                        const name = formData.get('name') as string
                                        const email = formData.get('email') as string

                                        if (name && email) {
                                            // 1. Save to session
                                            sessionStorage.setItem('customer_name', name)
                                            sessionStorage.setItem('customer_email', email)

                                            // 2. Add to params
                                            const newParams = new URLSearchParams(searchParams.toString())
                                            newParams.set('name', name)
                                            newParams.set('email', email)

                                            // 3. Redirect
                                            window.location.href = `/checkout?type=deep&${newParams.toString()}`
                                        }
                                    }}
                                >
                                    {!userName && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-foreground uppercase tracking-wider">Tu Nombre</label>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                placeholder="Ej. María"
                                                className="w-full h-12 rounded-lg border-input bg-background px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-foreground uppercase tracking-wider">Tu Correo Electrónico</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            defaultValue={sessionStorage.getItem('customer_email') || ''}
                                            placeholder="ejemplo@correo.com"
                                            className="w-full h-12 rounded-lg border-input bg-background px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full h-14 text-lg font-bold bg-[#a6f20d] text-[#161811] hover:bg-[#95da0b] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4">
                                        Desbloquear Reporte ($27)
                                    </Button>

                                    <p className="text-[10px] text-center text-muted-foreground pt-2">
                                        Pago único de $27 USD. Acceso inmediato. Garantía de satisfacción 30 días.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        const checkoutUrl = `/checkout?type=quick&${searchParams.toString()}`

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <Container className="max-w-md space-y-6">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8 text-stone-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Reporte Listo</h1>
                    <p className="text-muted-foreground">
                        Tus respuestas han sido procesadas. Desbloquea tu Diagnóstico de Estabilidad (IER) por solo $5.
                    </p>
                    <div className="pt-4">
                        <Link href={checkoutUrl}>
                            <Button className="w-full h-12 text-lg font-bold bg-[#a6f20d] text-[#161811] hover:bg-[#95da0b] animate-pulse">
                                Ver mi Reporte ({price})
                            </Button>
                        </Link>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        Acceso inmediato • Pago seguro
                    </p>
                </Container>
            </div>
        )
    }

    // Status 'denied' (Deep) redirects, but if it renders:
    if (status === 'denied') return null

    // --- AUTHORIZED CONTENT (Existing UI) ---
    return (
        <div className="min-h-screen bg-background flex flex-col print:bg-white">
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1 py-12 print:py-0 print:m-0 relative">
                <Container className="print:max-w-none print:px-8 relative z-10">
                    {/* Header Section */}
                    <div className="text-center space-y-6 mb-12 print:mb-8">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider print:hidden">
                            {type === "deep" ? "Evaluación Profunda 360°" : "Reporte Premium Confidencial"}
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display tracking-tight leading-tight">
                                {type === "deep" ? "Análisis de Estructura Relacional" : "Diagnóstico de Estabilidad Relacional"}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {userName ? `Informe personalizado para ${userName}` : "Informe de Estado Actual"}
                            </p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12 print:space-y-8">

                        {type === "deep" ? (
                            // === DEEP REPORT COMPONENTS ===
                            // === DEEP REPORT COMPONENTS ===
                            <>
                                {/* Hero Section: Score & Summary */}
                                <div className="grid md:grid-cols-12 gap-8 items-start mb-12 print:break-inside-avoid">
                                    {/* Score Card */}
                                    <div className="md:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4 h-full">
                                        <h3 className="text-lg font-bold text-slate-900 font-display">Índice de Estabilidad</h3>
                                        <ResultMetric value={ierScore} label="" size="lg" />
                                        <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
                                            Este puntaje refleja la solidez estructural actual de la relación.
                                        </p>
                                    </div>

                                    {/* Executive Summary */}
                                    <div className="md:col-span-8 h-full">
                                        <DeepSummary summary={humanSummary} />
                                    </div>
                                </div>

                                <div className="print:break-inside-avoid">
                                    <DeepDimensions dimensions={deepDimensions} />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 print:break-inside-avoid">
                                    <div className="space-y-8">
                                        <DeepPattern pattern={dominantPattern} />
                                    </div>
                                    <div className="space-y-8">
                                        <DeepRisk risk={temporalRisk} />
                                    </div>
                                </div>

                                <div className="print:break-inside-avoid pt-8">
                                    <DeepRecommendations recommendations={deepRecommendations} />
                                </div>

                                <div className="print:break-inside-avoid pt-12">
                                    <SubscribeBlock />
                                </div>
                            </>
                        ) : (
                            // === QUICK REPORT COMPONENTS ===
                            <>
                                <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 border border-border/50 shadow-sm print:shadow-none print:border-none print:p-0">
                                    <div className="order-2 md:order-1 space-y-4">
                                        <h2 className="text-2xl font-bold font-display">Índice de Estabilidad (IER)</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Este índice (0–100) refleja la estabilidad actual de tu relación.
                                        </p>
                                        <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10 text-xs text-muted-foreground space-y-1">
                                            <p className="font-bold text-primary/80">Nota importante</p>
                                            <p>El IER refleja el estado estructural actual de la relación. Un puntaje alto indica solidez funcional en este momento, no una garantía permanente.</p>
                                        </div>
                                    </div>
                                    <div className="order-1 md:order-2 flex justify-center">
                                        <ResultMetric value={ierScore} label="Estado Actual" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-8 border border-border/50 shadow-sm print:break-inside-avoid print:shadow-none print:border-black/10">
                                    <TrafficLight
                                        greenFactors={greenFactors}
                                        yellowFactors={yellowFactors}
                                        redFactors={redFactors}
                                        globalScore={ierScore}
                                    />
                                </div>

                                <div className="print:break-inside-avoid">
                                    <AnalysisBlock ierScore={ierScore} />
                                </div>

                                <div className="print:break-inside-avoid">
                                    <ActionableSteps ierScore={ierScore} />
                                </div>

                                {/* UPSELL BLOCK */}
                                <div className="bg-[#161811] text-[#f0efe9] rounded-3xl p-10 text-center space-y-6 print:hidden relative overflow-hidden my-8">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 hover:bg-primary/30 blur-[100px] transition-all duration-700 rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                    <h3 className="text-3xl font-bold font-display relative z-10">
                                        ¿Quieres entender qué está afectando exactamente tu relación?
                                    </h3>
                                    <div className="py-4 relative z-10">
                                        <div className="text-5xl font-bold text-primary mb-2">{ierScore}°</div>
                                        <div className="text-white/60 text-sm uppercase tracking-widest">Tu Temperatura Actual</div>
                                    </div>
                                    <p className="text-white/70 max-w-xl mx-auto text-lg relative z-10">
                                        La <strong>Evaluación Profunda</strong> identifica qué dimensión específica (Comunicación, Confianza, etc.) está debilitando la relación y te ofrece una hoja de ruta clara de recuperación.
                                    </p>
                                    <div className="pt-4 relative z-10">
                                        <Link href={`/checkout?type=upgrade&${searchParams.toString()}`} className="inline-block">
                                            <Button className="bg-[#a6f20d] hover:bg-[#95da0b] text-[#161811] font-bold h-16 px-10 text-xl rounded-full mx-auto shadow-xl shadow-[#a6f20d]/20 transition-transform active:scale-95 animate-pulse hover:animate-none">
                                                Actualizar ahora por solo $17
                                            </Button>
                                        </Link>
                                        <p className="mt-3 text-xs text-white/40 uppercase tracking-widest">
                                            Precio especial por haber completado el diagnóstico rápido
                                        </p>
                                    </div>
                                </div>

                                <div className="print:hidden">
                                    <LeadMagnetBlock source="result_quick" />
                                </div>

                                <div className="print:break-inside-avoid">
                                    <ResultFAQ />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Print/Download Actions */}
                    <div className="fixed bottom-8 right-8 print:hidden flex flex-col items-end gap-2">
                        <Button
                            onClick={handlePrint}
                            className="rounded-full h-14 px-6 shadow-2xl bg-foreground text-background hover:bg-foreground/90 font-bold flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Descargar Reporte PDF
                        </Button>
                    </div>

                </Container>
            </main>

            <div className="print:hidden">
                <Footer />
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 1.5cm; }
                    body { -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    .print\\:bg-white { background-color: white !important; }
                }
            `}</style>
        </div>
    )
}
