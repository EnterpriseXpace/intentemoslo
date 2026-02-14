"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { RadioCard } from "@/components/ui/RadioCard"
import { RAS_QUESTIONS, LIKERT_OPTIONS } from "@/data/questions"
import { QUICK_MICROCOPY } from "@/data/microcopy"
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
    const microcopy = QUICK_MICROCOPY[question.id]

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
        }, 400) // Slightly longer for the fade effect feel
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

    return (
        <div className="min-h-screen bg-background pb-20 flex flex-col">
            <Header />

            <main className="flex-grow flex items-center py-12">
                <Container>
                    <div className="mx-auto max-w-2xl w-full"> {/* Increased max-w for more breathing room */}
                        {showIntro ? (
                            <div className="space-y-10 text-center py-8 animate-in fade-in zoom-in-95 duration-500">
                                <div className="space-y-6">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wide">
                                        Diagnóstico Rápido
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display leading-tight tracking-tight">
                                        Revisando los <span className="text-primary">látidos</span> de tu relación
                                    </h1>
                                    <p className="text-muted-foreground text-xl leading-relaxed max-w-lg mx-auto">
                                        7 preguntas clave para entender dónde están parados hoy. Sin rodeos.
                                    </p>
                                </div>
                                <div className="pt-8 w-full max-w-md mx-auto">
                                    <Button onClick={handleStart} className="w-full text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                                        Comenzar ahora
                                    </Button>
                                    <p className="mt-4 text-sm text-muted-foreground/80">
                                        Toma menos de 2 minutos
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 key={currentStep}"> {/* Re-render animation on step change using key */}

                                {/* Header Section: Progress & Counter */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                        <span>Pregunta {currentStep + 1} / {RAS_QUESTIONS.length}</span>
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

                                {/* Options Section */}
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
                                                className="h-20 text-lg px-8 border-2 hover:border-primary/50" // Larger touch targets
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-between items-center pt-8">
                                    <Button
                                        variant="ghost"
                                        onClick={handleBack}
                                        className="text-muted-foreground hover:text-foreground -ml-4"
                                        disabled={isSubmitting}
                                    >
                                        ← Volver
                                    </Button>
                                    <div className="text-sm font-medium text-primary animate-pulse">
                                        {isSubmitting ? "Calculando resultados..." : ""}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </main>
        </div >
    )
}
