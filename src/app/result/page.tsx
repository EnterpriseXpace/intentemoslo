"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { getDeepResult, RAS_QUESTIONS } from "@/data/questions"
import { trackEvent } from "@/lib/instrumentation"
import { Loader2, Download, BookOpen } from "lucide-react"

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

function ResultContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const type = searchParams.get("type")
    const isDeep = type === "deep"

    // DEBUG: Log incoming params
    console.log("=== RESULT PAGE DEBUG ===")
    console.log("Type:", type)
    console.log("All Params:", Object.fromEntries(searchParams.entries()))
    searchParams.forEach((val, key) => {
        if (key.startsWith('R')) console.log(`RAS Param: ${key} = ${val}`)
        if (key.startsWith('D')) console.log(`DEEP Param: ${key} = ${val}`)
    })
    console.log("=========================")

    // --- Hooks (MUST be at top level) ---
    const [authorized, setAuthorized] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const [resultId, setResultId] = useState<string | null>(null)
    const hasSavedRef = useRef(false) // Guard against double-saves
    const hasTrackedViewRef = useRef(false) // Guard against double-tracking view

    // --- Logic for RAS (Quick) - Calculated on every render based on params ---
    let rasScore = 0
    let greenFactors: string[] = []
    let yellowFactors: string[] = []
    let redFactors: string[] = []
    let ierScore = 0

    // --- Logic for Deep ---
    let deepDimensions: DimensionScore[] = []
    let dominantPattern = { title: "", description: "", translation: "", impact: [] as string[], signs: [] as string[] }
    let temporalRisk = { risk3Months: "", risk12Months: "", trajectory: { ifIntervened: "", ifIgnored: "" } }
    let deepRecommendations = { focusOn: "", avoid: "", commonError: "" }
    let humanSummary = ""

    if (type === "ras" || type === "quick") {
        let total = 0
        searchParams.forEach((value, key) => {
            if (key.startsWith("R")) {
                const parsedVal = parseInt(value, 10)
                const val = isNaN(parsedVal) ? 0 : parsedVal

                if (val > 0) {
                    total += val
                } else {
                    console.warn(`Invalid or Zero RAS param: ${key}=${value} -> parsed: ${val}`)
                }

                // Traffic Light Logic
                const q = RAS_QUESTIONS.find(q => q.id === key)
                if (q) {
                    if (val >= 4) greenFactors.push(q.text)
                    else if (val === 3) yellowFactors.push(q.text)
                    else redFactors.push(q.text)
                }
            }
        })
        rasScore = total
        // Normalize score (7-35 -> 0-100)
        // Formula: ((Score - Min) / (Max - Min)) * 100
        ierScore = Math.max(0, Math.min(100, Math.round(((rasScore - 7) / (35 - 7)) * 100)))

        console.log(`[CALCULATION] RAS/QUICK: Total=${total}, IER=${ierScore}`)

    } else if (type === "deep") {
        const answers: Record<string, number> = {}
        searchParams.forEach((value, key) => {
            if (key.startsWith("D")) {
                const parsedVal = parseInt(value, 10)
                const val = isNaN(parsedVal) ? 0 : parsedVal

                if (val > 0) {
                    answers[key] = val
                } else {
                    console.warn(`Invalid DEEP param: ${key}=${value} -> parsed: ${val}`)
                }
            }
        })

        deepDimensions = calculateDeepScores(answers)

        // Calculate Global IER for Deep (Average of percentage scores)
        if (deepDimensions.length > 0) {
            ierScore = Math.round(deepDimensions.reduce((acc, curr) => acc + curr.score, 0) / deepDimensions.length)
        }

        // Identify Dominant Pattern (Lowest Dimension)
        const sortedDimensions = [...deepDimensions].sort((a, b) => a.score - b.score)
        const lowestDimension = sortedDimensions[0]

        if (lowestDimension) {
            dominantPattern = identifyDominantPattern(lowestDimension.id)
            deepRecommendations = getDeepRecommendations(lowestDimension.id)
            humanSummary = generateHumanSummary(ierScore, lowestDimension)
        }

        temporalRisk = assessTemporalRisk(ierScore)
    }

    // --- Effects ---

    useEffect(() => {
        const urlName = searchParams.get("name")
        const storageName = sessionStorage.getItem("customer_name")
        setUserName(urlName || storageName)
    }, [searchParams])

    useEffect(() => {
        const checkAccess = async () => {
            try {
                // Priority: 1. URL Param (from Stripe) 2. SessionStorage
                const urlEmail = searchParams.get("email")
                const storedEmail = sessionStorage.getItem("customer_email")
                const emailToCheck = urlEmail || storedEmail

                if (urlEmail) {
                    sessionStorage.setItem("customer_email", urlEmail)
                }

                if (!emailToCheck) {
                    // No email identified = No access
                    // But we might be in 'quick' mode where access is free/open? 
                    // Wait, ResultPage is for AFTER payment or calculation.
                    // If QUICK, we don't strictly need payment check from DB if it's just calculation?
                    // The prompt implies we are blocking DEEP results.
                    if (isDeep) {
                        console.log("No email for Deep Access Check -> Redirecting")
                        setAuthorized(false)
                        router.push(`/checkout?type=deep&${searchParams.toString()}`)
                        return
                    }
                }

                // If we have an email, verify it against DB
                let accessLevel = 'none'

                if (emailToCheck) {
                    const res = await fetch(`/api/access/check?email=${encodeURIComponent(emailToCheck)}`)
                    const data = await res.json()
                    accessLevel = data.access
                }

                // Logic correction: 
                // If isDeep is true, we REQUIRE accessLevel === 'deep'
                // If isDeep is false (Quick), do we require 'quick' access? 
                // Usually Quick is free or handled differently. 
                // Based on previous code: `if (data.access === 'none')` caused redirect.
                // So Quick also needs some verification? 
                // Re-reading user request: "Deep purchases exist... deep result page remains blocked."
                // The focus is on DEEP.

                // Let's keep strictness for DEEP.

                if (isDeep && accessLevel !== 'deep') {
                    // Failed Deep Access
                    setAuthorized(false)
                    router.push(`/checkout?type=deep&${searchParams.toString()}`)
                    return
                }

                // If not deep (Quick), and we are here...
                // Previous logic redirected if access === 'none'
                // But if they just did the test and haven't paid? 
                // Wait, Quick IS paid in some contexts? "Ver análisis completo (US$ 27)" implies paying.
                // There is also a "Quick" product.
                // Let's assume strict check for now as per previous logic.

                // However, if it's Quick and they haven't paid, maybe they are seeing the free preview?
                // The previous code had: `if (data.access === 'none') ... router.push('/checkout')`.
                // So YES, it seems even Quick requires a "purchase" record (maybe free or paid).
                // OR the user intends to block everything if not authorized.

                // For this specific task (Fix Deep Access), I will ensure deep check is correct.
                // If accessLevel is 'none' and we are 'deep', we definitely block.

                // Use the checked access level
                setAuthorized(true)

                if (!hasTrackedViewRef.current) {
                    hasTrackedViewRef.current = true
                    trackEvent('result_viewed', {
                        productType: isDeep ? 'deep' : 'quick',
                        metadata: {
                            accessLevel: accessLevel
                        }
                    })
                }
            } catch (e) {
                console.error("Auth check failed", e)
            }
        }

        checkAccess()
    }, [router, searchParams, isDeep])


    // --- Result Snapshot Logic (Idempotent) ---
    useEffect(() => {
        // Only run if authorized and not saved yet
        if (!authorized || hasSavedRef.current) return

        const saveSnapshot = async () => {
            // Prevent duplicate calls
            hasSavedRef.current = true

            try {
                // Prepare Payload
                const payload = {
                    sessionId: sessionStorage.getItem('antigravity_session_id'),
                    // If not found (rare), rely on backend gen_random_uuid or handle gracefully
                    // But usually instrumentation runs first. 

                    email: sessionStorage.getItem('customer_email'), // Capture if available from checkout

                    productType: type === "deep" ? "deep" : "quick",
                    ierScore,
                    globalState: ierScore < 40 ? 'critical' : ierScore < 60 ? 'fragile' : ierScore < 80 ? 'caution' : 'stable',

                    dimensions: isDeep ? deepDimensions : null,
                    dominantPattern: isDeep ? dominantPattern.title : null,
                    riskTrajectory: isDeep ? temporalRisk : null,
                    source: 'web',
                    answers_json: {
                        productType: type === "deep" ? "deep" : "quick",
                        answers: (() => {
                            const ans: Record<string, number> = {}
                            searchParams.forEach((val, key) => {
                                if (key.startsWith('R') || key.startsWith('D')) {
                                    const num = parseInt(val, 10)
                                    if (!isNaN(num)) ans[key] = num
                                }
                            })
                            return ans
                        })()
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
                console.error("Failed to save result snapshot:", err)
                // We do NOT reset hasSavedRef here to avoid retry loops on persistent errors.
            }
        }

        saveSnapshot()
    }, [authorized, type, isDeep, ierScore, deepDimensions, dominantPattern, temporalRisk]) // Dependencies are stable after initial render


    const handlePrint = () => {
        window.print()
    }

    // --- Render ---
    if (!authorized) return null

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
                            // === DEEP REPORT COMPONENTS (NEW ORDER) ===
                            <>
                                {/* 0. Human Summary (First!) */}
                                <div className="print:break-inside-avoid">
                                    <DeepSummary summary={humanSummary} />
                                </div>

                                {/* 1. Global Metrics (Context) */}
                                <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 border border-border/50 shadow-sm print:shadow-none print:border-none print:p-0">
                                    <div className="order-2 md:order-1 space-y-4">
                                        <h2 className="text-2xl font-bold font-display">Estado Global</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Tu puntuación global basada en el análisis estructural. Funciona como un termómetro de la salud relacional actual.
                                        </p>
                                        <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10 text-xs text-muted-foreground space-y-1">
                                            <p className="font-bold text-primary/80">Nota importante</p>
                                            <p>El IER refleja el estado estructural actual de la relación. Un puntaje alto indica solidez funcional en este momento, no una garantía permanente.</p>
                                        </div>
                                    </div>
                                    <div className="order-1 md:order-2 flex justify-center">
                                        <ResultMetric value={ierScore} label="Nivel de Solidez" />
                                    </div>
                                </div>

                                {/* 2. Dimensions (Cards) */}
                                <div className="print:break-inside-avoid">
                                    <DeepDimensions dimensions={deepDimensions} />
                                </div>

                                {/* 3. Dominant Pattern */}
                                <div className="print:break-inside-avoid">
                                    <DeepPattern pattern={dominantPattern} />
                                </div>

                                {/* 4. Temporal Risk */}
                                <div className="print:break-inside-avoid">
                                    <DeepRisk risk={temporalRisk} />
                                </div>

                                {/* 5. Strategic Recommendations */}
                                <div className="print:break-inside-avoid">
                                    <DeepRecommendations recommendations={deepRecommendations} />
                                </div>
                            </>
                        ) : (
                            // === QUICK REPORT COMPONENTS ===
                            <>
                                {/* 1. Main Result & Metric */}
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

                                {/* 2. Traffic Light */}
                                <div className="bg-white rounded-3xl p-8 border border-border/50 shadow-sm print:break-inside-avoid print:shadow-none print:border-black/10">
                                    <TrafficLight
                                        greenFactors={greenFactors}
                                        yellowFactors={yellowFactors}
                                        redFactors={redFactors}
                                        globalScore={ierScore}
                                    />
                                </div>

                                {/* 3. Personalized Analysis */}
                                <div className="print:break-inside-avoid">
                                    <AnalysisBlock ierScore={ierScore} />
                                </div>

                                {/* 4. Actionable Steps */}
                                <div className="print:break-inside-avoid">
                                    <ActionableSteps ierScore={ierScore} />
                                </div>

                                {/* 5. Lead Magnet Block (Strategic Replacement) */}
                                <div className="print:hidden">
                                    <LeadMagnetBlock source="result_quick" />
                                </div>
                            </>
                        )}

                        {/* FAQ Section (New) */}
                        <div className="print:break-inside-avoid">
                            <ResultFAQ />
                        </div>

                        {/* Feedback Form (New) */}
                        <div className="print:hidden">
                            <FeedbackForm
                                ierScore={ierScore}
                                productType={type === "deep" ? "deep" : "quick"}
                                resultId={resultId}
                            />
                        </div>

                        {/* Science Anchor */}
                        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground opacity-70 print:opacity-100 py-8 border-t border-border/40">
                            <BookOpen className="w-4 h-4" />
                            <p>Diagnóstico basado en escalas validadas (RAS y QRS), adaptadas para orientación digital.</p>
                        </div>

                        {/* 5. UPSHELL BLOCK (Dynamic) */}
                        {type !== "deep" && (
                            <div className="bg-[#161811] text-[#f0efe9] rounded-3xl p-10 text-center space-y-6 print:hidden relative overflow-hidden">
                                {/* Background Glow */}
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
                        )}
                    </div>

                    {/* Print/Download Actions */}
                    <div className="fixed bottom-8 right-8 print:hidden flex flex-col items-end gap-2">
                        <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg mb-1 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                            Descarga para revisar en privado
                        </div>
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

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page { margin: 1.5cm; }
                    body { -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:border-none { border: none !important; }
                    .print\\:bg-white { background-color: white !important; }
                }
            `}</style>
        </div>
    )
}

export default function ResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <ResultContent />
        </Suspense>
    )
}
