"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { RadioCard } from "@/components/ui/RadioCard"
import { DEEP_QUESTIONS, LIKERT_OPTIONS, DEEP_DIMENSIONS } from "@/data/questions"
import { DEEP_MICROCOPY } from "@/data/microcopy"
import { trackEvent } from "@/lib/instrumentation"

import { ArrowRight, Loader2, Lock, CheckCircle2 } from "lucide-react"

export default function DeepChecklistClient() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // States
    const [phase, setPhase] = useState<'intro' | 'demographics' | 'questions' | 'analyzing' | 'paywall' | 'success'>('intro')
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [demographics, setDemographics] = useState({
        ageRange: '',
        maritalStatus: '',
        relationshipDuration: '',
        isCohabiting: '',
        hasChildren: ''
    })

    const [showTransition, setShowTransition] = useState(false)
    const [isAdvancing, setIsAdvancing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Analysis State
    const [analysisProgress, setAnalysisProgress] = useState(0)
    const [analysisStageIndex, setAnalysisStageIndex] = useState(0)

    const ANALYSIS_STAGES = [
        "Revisando consistencia...",
        "Identificando patrones...",
        "Generando estrategia 360°..."
    ]

    const question = DEEP_QUESTIONS[currentStep]
    const progress = ((currentStep + 1) / DEEP_QUESTIONS.length) * 100
    const currentDimension = DEEP_DIMENSIONS.find(d => d.id === question?.dimension)
    const microcopy = DEEP_MICROCOPY[question?.id]

    // Transition Texts Map
    const TRANSITION_TEXTS: Record<string, string> = {
        comunicacion: "Evaluamos cómo fluye la información y el entendimiento entre ambos.",
        confianza: "Analizamos la seguridad y fiabilidad percibida en la relación.",
        afectividad: "Revisamos la calidad del vínculo emocional y físico.",
        conflictos: "Observamos cómo se gestionan y resuelven las diferencias.",
        compromiso: "Medimos la alineación en proyectos y visión a largo plazo."
    }

    const handleStart = () => {
        setPhase('demographics')
        trackEvent('checklist_started', { productType: 'deep' })
    }



    const handleSelect = (value: number) => {
        if (isAdvancing || isSubmitting) return

        // Track answer
        trackEvent('checklist_question_answered', {
            productType: 'deep',
            metadata: {
                questionId: question.id,
                value: value,
                dimension: question.dimension,
                step: currentStep + 1,
                totalSteps: DEEP_QUESTIONS.length
            }
        })

        setAnswers({ ...answers, [question.id]: value })
        setIsAdvancing(true)

        setTimeout(() => {
            handleNext()
            setIsAdvancing(false)
        }, 300) // Faster transition for professional feel
    }

    const handleNext = () => {
        if (currentStep < DEEP_QUESTIONS.length - 1) {
            const nextQuestion = DEEP_QUESTIONS[currentStep + 1]
            if (nextQuestion.dimension !== question.dimension) {
                setShowTransition(true)
            }
            setCurrentStep(currentStep + 1)
        } else {
            // Questions Completed -> Start Analysis
            setPhase('analyzing')
            startAnalysis()
        }
    }

    const startAnalysis = () => {
        const duration = 4000
        const intervalTime = 50
        const steps = duration / intervalTime
        const increment = 100 / steps

        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= 100) {
                current = 100
                clearInterval(timer)

                // CHECK FOR UPGRADE / ALREADY PAID STATUS
                // If session_id exists, it means they came from the Upgrade Payment Flow
                // So we skip the paywall and go straight to results
                const sessionId = searchParams.get('session_id')

                if (sessionId) {
                    setPhase('success')
                } else {
                    // New User ($27) -> Show Paywall
                    setTimeout(() => setPhase('paywall'), 800)
                }
            }
            setAnalysisProgress(current)

            // Update stage text based on progress
            const stageIndex = Math.min(
                ANALYSIS_STAGES.length - 1,
                Math.floor((current / 100) * ANALYSIS_STAGES.length)
            )
            setAnalysisStageIndex(stageIndex)

        }, intervalTime)
    }

    const handleViewResults = () => {
        const params = new URLSearchParams()

        // 1. Preserve params
        searchParams.forEach((val, key) => params.set(key, val))

        // 2. Add Answers
        Object.entries(answers).forEach(([id, val]) => {
            params.set(id, val.toString())
        })

        // 3. Add Demographics
        params.set("age", demographics.ageRange)
        params.set("status", demographics.maritalStatus)
        params.set("duration", demographics.relationshipDuration)
        params.set("cohabiting", demographics.isCohabiting)
        params.set("children", demographics.hasChildren)

        // 4. Force type to deep (so they see the full report)
        params.set("type", "deep")

        router.push(`/result?${params.toString()}`)
    }

    const handleUnlockClick = () => {
        // Prepare URL Params for persistence
        const params = new URLSearchParams()

        // 1. Preserve existing params
        searchParams.forEach((val, key) => {
            params.set(key, val)
        })

        // 2. Add DEEP answers
        Object.entries(answers).forEach(([id, val]) => {
            params.set(id, val.toString())
        })

        // 3. Add Demographics
        params.set("age", demographics.ageRange)
        params.set("status", demographics.maritalStatus)
        params.set("duration", demographics.relationshipDuration)
        params.set("cohabiting", demographics.isCohabiting)
        params.set("children", demographics.hasChildren)

        // 4. Ensure Type is Deep
        params.set("type", "deep")

        router.push(`/checkout?${params.toString()}`)
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        } else {
            setPhase('demographics')
        }
    }

    // Demographics Config
    const DEMO_QUESTIONS = [
        {
            id: 'ageRange',
            label: 'Tu rango de edad',
            options: [
                { value: '18-24', label: '18 - 24 años' },
                { value: '25-34', label: '25 - 34 años' },
                { value: '35-44', label: '35 - 44 años' },
                { value: '45-54', label: '45 - 54 años' },
                { value: '55+', label: '55 años o más' }
            ]
        },
        {
            id: 'maritalStatus',
            label: 'Estado de la relación',
            options: [
                { value: 'noviazgo', label: 'Noviazgo / Pareja' },
                { value: 'convivencia', label: 'Convivencia' },
                { value: 'casados', label: 'Casados' },
                { value: 'separados', label: 'Separados / En crisis' }
            ]
        },
        {
            id: 'relationshipDuration',
            label: 'Duración del vínculo',
            options: [
                { value: '0-1', label: 'Menos de 1 año' },
                { value: '1-3', label: '1 a 3 años' },
                { value: '3-7', label: '3 a 7 años' },
                { value: '7-15', label: '7 a 15 años' },
                { value: '15+', label: 'Más de 15 años' }
            ]
        },
        {
            id: 'isCohabiting',
            label: '¿Conviven actualmente?',
            options: [
                { value: 'Sí', label: 'Sí' },
                { value: 'No', label: 'No' }
            ]
        },
        {
            id: 'hasChildren',
            label: '¿Tienen hijos en común?',
            options: [
                { value: 'Sí', label: 'Sí' },
                { value: 'No', label: 'No' }
            ]
        }
    ]

    const [demoStep, setDemoStep] = useState(0)

    const handleDemoSelect = (value: string) => {
        const currentQuestionId = DEMO_QUESTIONS[demoStep].id
        setDemographics(prev => ({ ...prev, [currentQuestionId]: value }))

        if (demoStep < DEMO_QUESTIONS.length - 1) {
            setTimeout(() => setDemoStep(prev => prev + 1), 250)
        } else {
            setPhase('questions')
        }
    }

    const handleDemographicsBack = () => {
        if (demoStep > 0) {
            setDemoStep(prev => prev - 1)
        } else {
            setPhase('intro')
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20 font-sans text-foreground flex flex-col">
            <Header />

            <main className="flex-grow flex items-center py-12">
                <Container>
                    <div className="mx-auto max-w-3xl w-full">

                        {/* PHASE 1: INTRO */}
                        {phase === 'intro' && (
                            <div className="space-y-10 text-center animate-in fade-in zoom-in-95 duration-700">
                                <div className="space-y-6">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wide">
                                        Evaluación Profunda 360°
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display leading-tight tracking-tight">
                                        Análisis Estructural <br />
                                        <span className="text-primary">de la Relación</span>
                                    </h1>
                                    <p className="text-muted-foreground text-xl leading-relaxed max-w-lg mx-auto">
                                        Vamos a examinar el <strong>sistema operativo</strong> de tu vínculo.
                                        Necesitamos contextualizar tu perfil antes de iniciar las 22 métricas analíticas.
                                    </p>
                                </div>
                                <div className="pt-8 w-full max-w-md mx-auto space-y-4">
                                    <Button
                                        onClick={handleStart}
                                        className="w-full text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                                    >
                                        Crear Perfil Estratégico
                                    </Button>

                                    <button
                                        onClick={() => router.push("/")}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                                    >
                                        Volver al inicio
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PHASE 2: DEMOGRAPHICS */}
                        {phase === 'demographics' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                {/* Header Section: Progress & Counter */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                        <span>Perfilado Estratégico</span>
                                        <span>Paso {demoStep + 1} / {DEMO_QUESTIONS.length}</span>
                                    </div>
                                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary/30">
                                        <div
                                            className="h-full bg-primary transition-all duration-700 ease-out"
                                            style={{ width: `${((demoStep + 1) / DEMO_QUESTIONS.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display leading-tight text-center">
                                        {DEMO_QUESTIONS[demoStep].label}
                                    </h2>

                                    <div className="space-y-3 max-w-xl mx-auto">
                                        {DEMO_QUESTIONS[demoStep].options.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => handleDemoSelect(option.value)}
                                                className="transform transition-all duration-200 hover:scale-[1.01]"
                                            >
                                                <div className={`
                                                    group flex items-center justify-between px-8 h-20 rounded-xl border-2 text-lg font-medium cursor-pointer transition-all
                                                    ${demographics[DEMO_QUESTIONS[demoStep].id as keyof typeof demographics] === option.value
                                                        ? 'bg-primary/10 border-primary text-primary'
                                                        : 'bg-white border-border hover:border-primary/50 text-foreground'
                                                    }
                                                `}>
                                                    {option.label}
                                                    {demographics[DEMO_QUESTIONS[demoStep].id as keyof typeof demographics] === option.value && (
                                                        <div className="w-4 h-4 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 text-center">
                                    <button
                                        onClick={handleDemographicsBack}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        ← Volver
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PHASE 3: QUESTIONS */}
                        {phase === 'questions' && (
                            showTransition && currentDimension ? (
                                <div className="space-y-8 text-center py-8 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-bold text-primary font-display">
                                            {currentDimension.label}
                                        </h2>
                                        <p className="text-foreground text-xl leading-relaxed max-w-md mx-auto">
                                            {TRANSITION_TEXTS[currentDimension.id]}
                                        </p>
                                    </div>
                                    <div className="pt-8 w-full max-w-xs mx-auto">
                                        <Button onClick={() => setShowTransition(false)} className="w-full text-lg h-12 rounded-xl">
                                            Continuar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500 key={currentStep}">

                                    {/* Header Section: Progress & Counter */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                            <span>{currentDimension?.label} • {currentStep + 1} / {DEEP_QUESTIONS.length}</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary/30">
                                            <div
                                                className="h-full bg-primary transition-all duration-700 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Question Section */}
                                    <div className="space-y-8 text-center">
                                        <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display leading-tight">
                                            {question.text}
                                        </h2>
                                        {microcopy && (
                                            <p className="text-lg text-primary/90 font-medium italic animate-in fade-in delay-150 duration-700">
                                                "{microcopy}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Options Section - Using Standard Style */}
                                    <div className="space-y-3 max-w-xl mx-auto">
                                        {LIKERT_OPTIONS.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => handleSelect(option.value)}
                                                className="transform transition-all duration-200 hover:scale-[1.01]"
                                            >
                                                <RadioCard
                                                    label={option.label}
                                                    name={`q-${question.id}`}
                                                    checked={answers[question.id] === option.value}
                                                    readOnly
                                                    className="h-20 text-lg px-8 border-2 hover:border-primary/50"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex justify-between items-center pt-8">
                                        <button
                                            onClick={handleBack}
                                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                                            disabled={isSubmitting}
                                        >
                                            ← Volver
                                        </button>
                                        <div className="text-sm font-medium text-primary animate-pulse">
                                            {isSubmitting ? "Procesando..." : ""}
                                        </div>
                                    </div>

                                    {isSubmitting && (
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-3xl" />
                                    )}
                                </div>
                            )
                        )}

                        {/* PHASE 4: ANALYZING (Circular Style) */}
                        {phase === 'analyzing' && (
                            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-700">
                                <div className="max-w-md mx-auto text-center space-y-10">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-bold font-display text-foreground min-h-[3rem] items-center flex justify-center">
                                            {ANALYSIS_STAGES[analysisStageIndex]}
                                        </h2>
                                        <p className="text-muted-foreground animate-pulse">
                                            Por favor no cierres esta página.
                                        </p>
                                    </div>

                                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                                        <div
                                            className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                                            style={{ animationDuration: "1.5s" }}
                                        ></div>
                                        <Loader2 className="w-8 h-8 text-primary/60" />
                                    </div>

                                    <div className="space-y-2 max-w-xs mx-auto">
                                        <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            <span>Progreso</span>
                                            <span>{Math.round(analysisProgress)}%</span>
                                        </div>
                                        <ProgressBar value={analysisProgress} className="h-2" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PHASE 5: PAYWALL (Lock Card Style) */}
                        {phase === 'paywall' && (
                            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="max-w-lg text-center space-y-10">

                                    {/* Header */}
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mx-auto">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Análisis Completado
                                        </div>
                                        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                                            Tu lectura está lista
                                        </h1>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            Hemos cruzado las 5 dimensiones. Tu evaluación profunda está completa y lista para lectura.
                                        </p>
                                    </div>

                                    {/* Lock Card */}
                                    <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden group">
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

                                        {/* Abstract Background */}
                                        <div className="w-full h-full p-8 opacity-20 filter blur-sm scale-110">
                                            <div className="w-full h-full rounded-full border-[20px] border-primary/40 flex items-center justify-center">
                                                <div className="w-2/3 h-2/3 bg-secondary/80 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Action */}
                                    <div className="w-full max-w-xs mx-auto">
                                        <Button
                                            onClick={handleUnlockClick}
                                            className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[#161811] bg-[#a6f20d] hover:bg-[#95da0b]"
                                        >
                                            Ver análisis completo (US$ 27)
                                        </Button>
                                        <p className="text-xs text-center text-muted-foreground mt-4">
                                            Pago único. Acceso inmediato.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PHASE 6: SUCCESS (Upgrade Flow) */}
                        {phase === 'success' && (
                            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95 duration-700">
                                <div className="max-w-2xl mx-auto text-center space-y-12">

                                    <div className="space-y-6">
                                        <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">
                                            Gracias por tu confianza.
                                        </h1>
                                        <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
                                            Hemos analizado cuidadosamente tus respuestas. Tu informe está listo.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-md mx-auto space-y-4">
                                        <Button
                                            onClick={handleViewResults}
                                            className="w-full h-16 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all text-[#161811] bg-[#a6f20d] hover:bg-[#95da0b] flex items-center justify-center gap-2"
                                        >
                                            Ver Resultados del Diagnóstico
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                        <p className="text-sm text-muted-foreground">
                                            Acceso inmediato a tu informe personalizado
                                        </p>
                                    </div>

                                    <div className="pt-12 space-y-6">
                                        <p className="text-lg italic font-serif text-muted-foreground/80 max-w-lg mx-auto">
                                            "Sanar no es un destino, sino el valiente camino de volver a intentarlo cada día con más amor."
                                        </p>
                                        <div className="inline-block border-t-2 border-primary/30 pt-2 px-8">
                                            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                                                Equipo Intentémoslo
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </main>
        </div>
    )
}
