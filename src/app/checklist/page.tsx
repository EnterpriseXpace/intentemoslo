"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { RadioCard } from "@/components/ui/RadioCard"
import { RAS_QUESTIONS, LIKERT_OPTIONS } from "@/data/questions"
import { trackEvent } from "@/lib/instrumentation"

export default function ChecklistPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [showIntro, setShowIntro] = useState(true)
    const [isAdvancing, setIsAdvancing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const question = RAS_QUESTIONS[currentStep]
    const progress = ((currentStep + 1) / RAS_QUESTIONS.length) * 100

    const handleStart = () => {
        trackEvent('checklist_started', { productType: 'quick' })
        setShowIntro(false)
    }

    const handleSelect = (value: number) => {
        if (isAdvancing || isSubmitting) return

        // Track answer immediately
        trackEvent('checklist_question_answered', {
            productType: 'quick',
            metadata: {
                questionId: question.id,
                value: value,
                step: currentStep + 1,
                totalSteps: RAS_QUESTIONS.length
            }
        })

        const newAnswers = { ...answers, [question.id]: value }
        setAnswers(newAnswers)
        setIsAdvancing(true)

        setTimeout(() => {
            handleNext(newAnswers)
            setIsAdvancing(false)
        }, 350)
    }

    const handleNext = (overrideAnswers?: Record<string, number>) => {
        if (currentStep < RAS_QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            setIsSubmitting(true)
            trackEvent('checklist_completed', { productType: 'quick' })

            // Use the authoritative answers (passed or state)
            const finalAnswers = overrideAnswers || answers

            // Save results to URL parameters for the result page to process
            const params = new URLSearchParams()
            params.set("type", "quick")
            Object.entries(finalAnswers).forEach(([id, val]) => {
                params.set(id, val.toString())
            })
            router.push(`/checklist/analyzing?${params.toString()}`)
        }
    }


    const handleBack = () => {
        if (isSubmitting) return
        if (currentStep > 0) {
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
                                        Diagnóstico Rápido
                                    </span>
                                    <h1 className="text-3xl font-bold text-foreground font-display leading-tight">
                                        Revisando signos vitales de la relación
                                    </h1>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Vamos a revisar 7 indicadores fundamentales validados científicamente (RAS).
                                    </p>
                                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-sm text-muted-foreground">
                                        💡 <strong>Nota:</strong> Responde pensando en los últimos 30 días, no solo en hoy.
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button onClick={handleStart} className="w-full text-lg h-12">
                                        Comenzar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium text-muted-foreground">
                                        <span>Pregunta {currentStep + 1} de {RAS_QUESTIONS.length}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <ProgressBar value={progress} className="h-2" />
                                </div>

                                {/* Question */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-foreground font-display leading-tight min-h-[60px]">
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
        </div >
    )
}
