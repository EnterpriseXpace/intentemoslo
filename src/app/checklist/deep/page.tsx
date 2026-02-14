"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { RadioCard } from "@/components/ui/RadioCard"
import { DEEP_QUESTIONS, LIKERT_OPTIONS, DEEP_DIMENSIONS } from "@/data/questions"
import { trackEvent } from "@/lib/instrumentation"

export default function DeepChecklistPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [showIntro, setShowIntro] = useState(true)
    const [showTransition, setShowTransition] = useState(true)
    const [isAdvancing, setIsAdvancing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const question = DEEP_QUESTIONS[currentStep]
    const progress = ((currentStep + 1) / DEEP_QUESTIONS.length) * 100

    // Get current dimension info
    const currentDimension = DEEP_DIMENSIONS.find(d => d.id === question.dimension)

    // Transition Texts Map
    const TRANSITION_TEXTS: Record<string, string> = {
        comunicacion: "Evaluamos cómo fluye la información y el entendimiento entre ambos.",
        confianza: "Analizamos la seguridad y fiabilidad percibida en la relación.",
        afectividad: "Revisamos la calidad del vínculo emocional y físico.",
        conflictos: "Observamos cómo se gestionan y resuelven las diferencias.",
        compromiso: "Medimos la alineación en proyectos y visión a largo plazo."
    }

    const handleStart = () => {
        trackEvent('checklist_started', { productType: 'deep' })
        setShowIntro(false)
    }

    const handleSelect = (value: number) => {
        if (isAdvancing || isSubmitting) return

        // Track answer immediately
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
        }, 350)
    }

    const handleNext = () => {
        if (currentStep < DEEP_QUESTIONS.length - 1) {
            const nextQuestion = DEEP_QUESTIONS[currentStep + 1]
            if (nextQuestion.dimension !== question.dimension) {
                setShowTransition(true)
            }
            setCurrentStep(currentStep + 1)
        } else {
            setIsSubmitting(true)
            trackEvent('checklist_completed', { productType: 'deep' })

            // Save results to URL parameters for the result page to process
            const params = new URLSearchParams()

            // 1. Preserve ALL existing params (including R scores from Quick)
            searchParams.forEach((val, key) => {
                params.set(key, val)
            })

            // 2. Add/Overwrite DEEP answers
            params.set("type", "deep")
            Object.entries(answers).forEach(([id, val]) => {
                params.set(id, val.toString())
            })

            router.push(`/thank-you?${params.toString()}`)
        }
    }


    const handleBack = () => {
        if (currentStep > 0) {
            const prevQuestion = DEEP_QUESTIONS[currentStep - 1]
            if (prevQuestion.dimension !== question.dimension) {
                // If backtracking to previous dimension, we might want to skip transition going backwards or show it
                // For simplicity/UX flow, usually we just go back to questions. 
                // But for Consistency, let's just go back to question.
            }
            setCurrentStep(currentStep - 1)
        } else {
            router.push("/")
        }
    }

    const isOptionSelected = !!answers[question.id]

    return (
        <div className="min-h-screen bg-background pb-20">
            <Header />

            <main className="py-12">
                <Container>
                    <div className="mx-auto max-w-lg space-y-8">
                        {showIntro ? (
                            <div className="space-y-6 text-center py-8 animate-in fade-in duration-500">
                                <div className="space-y-4">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                        Evaluación Profunda
                                    </span>
                                    <h1 className="text-3xl font-bold text-foreground font-display leading-tight">
                                        Explorando capas más profundas de tu relación
                                    </h1>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Vamos a analizar varias dimensiones de tu relación con mayor detalle.
                                        Esta evaluación te ayuda a identificar patrones, tensiones y áreas de estabilidad, sin juicios y sin presión para decidir nada ahora.
                                    </p>
                                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-sm text-muted-foreground">
                                        💡 <strong>Nota:</strong> Responde con calma, pensando en cómo ha sido tu relación en las últimas semanas. No hay respuestas correctas o incorrectas.
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button onClick={handleStart} className="w-full text-lg h-12">
                                        Comenzar evaluación
                                    </Button>
                                    <div className="pt-4 text-center">
                                        <Button variant="ghost" onClick={() => router.push("/")} className="text-muted-foreground hover:text-foreground">
                                            Volver
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : showTransition && currentDimension ? (
                            <div className="space-y-6 text-center py-12 animate-in fade-in duration-500">
                                <div className="space-y-4">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wide">
                                        Siguiente Bloque
                                    </span>
                                    <h2 className="text-3xl font-bold text-foreground font-display leading-tight">
                                        {currentDimension.label}
                                    </h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">
                                        {TRANSITION_TEXTS[currentDimension.id] || "Analizando esta dimensión..."}
                                    </p>
                                </div>
                                <div className="pt-8 flex justify-center">
                                    <Button onClick={() => setShowTransition(false)} className="w-full max-w-xs h-12 text-base">
                                        Continuar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium text-muted-foreground">
                                        <span>Pregunta {currentStep + 1} de {DEEP_QUESTIONS.length}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <ProgressBar value={progress} className="h-2" />
                                </div>

                                {/* Dimension Badge */}
                                {currentDimension && (
                                    <div className="flex justify-center">
                                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                            {currentDimension.label}
                                        </span>
                                    </div>
                                )}

                                {/* Question */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-foreground font-display leading-tight min-h-[60px] text-center">
                                        {question.text}
                                    </h2>

                                    <div className="space-y-2" key={question.id}>
                                        {LIKERT_OPTIONS.map((option) => (
                                            <div key={option.value} onClick={() => handleSelect(option.value)}>
                                                <RadioCard
                                                    label={option.label}
                                                    name={`q-${question.id}`}
                                                    checked={answers[question.id] === option.value}
                                                    readOnly
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between pt-4">
                                    <Button variant="ghost" onClick={handleBack} className="px-0" disabled={isSubmitting}>
                                        ← Anterior
                                    </Button>
                                    <div className="text-sm text-muted-foreground animate-pulse">
                                        {isSubmitting && "Analizando respuestas..."}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Container>
            </main>
        </div>
    )
}
