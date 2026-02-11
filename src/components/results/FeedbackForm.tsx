"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { trackEvent } from "@/lib/instrumentation"
import { cn } from "@/lib/utils"
import { Check, Send } from "lucide-react"

interface FeedbackFormProps {
    ierScore: number
    productType: 'quick' | 'deep'
    resultId: string | null
}

export function FeedbackForm({ ierScore, productType, resultId }: FeedbackFormProps) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1) // 4 = Completed
    const [emotion, setEmotion] = useState("")
    const [usefulness, setUsefulness] = useState("")
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Derived Logic
    const isCritical = ierScore < 40
    const globalState = isCritical ? 'critical' : ierScore < 60 ? 'fragile' : ierScore < 80 ? 'caution' : 'stable'

    // Adaptive Copy
    const copy = {
        title: isCritical
            ? "¿Cómo te sientes con este resultado?"
            : "¿Qué te ha parecido este diagnóstico?",
        subtitle: isCritical
            ? "Sabemos que este resultado puede remover emociones. Tu opinión es anónima y nos ayuda a mejorar."
            : "Tu respuesta es 100% anónima y nos ayuda a mejorar la experiencia.",
        emotionQuestion: "Después de leer tu resultado, ¿qué es lo que más sentiste?",
        usefulnessQuestion: "¿Qué tan útil te resultó para entender tu situación?",
        commentPlaceholder: "Si quieres, cuéntanos en una frase qué fue lo más valioso (o lo que faltó)...",
        footerPrivacy: "Tu respuesta es anónima y se usa solo con fines estadísticos."
    }

    const emotions = [
        "Me dio claridad",
        "Me removió emocionalmente",
        "Confirmó lo que intuía",
        "Me dejó confundido/a",
        "No era lo que esperaba"
    ]

    const usefulnessOptions = [
        "Muy útil",
        "Útil",
        "Neutral",
        "Poco útil"
    ]

    const handleNext = (val: string, type: 'emotion' | 'usefulness') => {
        if (type === 'emotion') setEmotion(val)
        if (type === 'usefulness') setUsefulness(val)
        setStep(prev => (prev + 1) as any)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        // Flag for high emotional engagement (Red score + long comment)
        const highEngagement = isCritical && comment.length > 50

        try {
            // 1. Submit to new specific feedback table (Quantitative + Qualitative)
            // Implicit consent is TRUE by default as per requirements since it's anonymous/statistical.
            await fetch('/api/feedback/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resultId,
                    // If resultId is missing (rare race condition), we still send context
                    ierScore,
                    globalState,
                    productType,
                    emotion,
                    usefulness,
                    comment,
                    consent: true // Implicit consent
                })
            })

            // 2. Keep legacy tracking for quick analytics (Volume)
            await trackEvent('feedback_submitted', {
                productType,
                metadata: {
                    ier_score: ierScore,
                    global_state: globalState,
                    emotion,
                    usefulness,
                    comment,
                    high_emotional_engagement: highEngagement
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            setIsSubmitting(false)
            setStep(4)
        }
    }

    if (step === 4) {
        return (
            <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in duration-500">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Gracias por compartirlo</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Tu respuesta nos ayuda a hacer este diagnóstico más claro y humano para todos.
                </p>
            </div>
        )
    }

    return (
        <section className="max-w-xl mx-auto my-12 bg-white/50 border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all duration-500">
            <header className="text-center mb-8 space-y-2">
                <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70 mb-2">
                    Opcional · Anónimo · 30 segundos
                </div>
                <h3 className="text-lg md:text-xl font-bold font-display text-foreground">
                    {copy.title}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    {copy.subtitle}
                </p>
            </header>

            <div className="min-h-[200px]">
                {/* Step 1: Emotion */}
                <div className={cn("space-y-4 transition-all duration-300", step === 1 ? "block opacity-100 translate-x-0" : "hidden opacity-0 -translate-x-10")}>
                    <label className="block text-sm font-medium text-foreground text-center mb-6">
                        {copy.emotionQuestion}
                    </label>
                    <div className="grid gap-3">
                        {emotions.map((em) => (
                            <button
                                key={em}
                                onClick={() => handleNext(em, 'emotion')}
                                className="w-full p-4 text-left bg-white hover:bg-primary/5 border border-border hover:border-primary/30 rounded-xl transition-all text-sm font-medium text-foreground/80 hover:text-foreground flex items-center justify-between group"
                            >
                                {em}
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">➜</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Usefulness */}
                <div className={cn("space-y-4 transition-all duration-300", step === 2 ? "block opacity-100 translate-x-0" : "hidden opacity-0 -translate-x-10")}>
                    <label className="block text-sm font-medium text-foreground text-center mb-6">
                        {copy.usefulnessQuestion}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {usefulnessOptions.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleNext(opt, 'usefulness')}
                                className="w-full p-4 text-center bg-white hover:bg-primary/5 border border-border hover:border-primary/30 rounded-xl transition-all text-sm font-medium text-foreground/80 hover:text-foreground active:scale-95"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Comment (Optional) */}
                <div className={cn("space-y-6 transition-all duration-300", step === 3 ? "block opacity-100 translate-x-0" : "hidden opacity-0 -translate-x-10")}>
                    <label className="block text-sm font-medium text-foreground text-center">
                        ¿Algo más que quieras añadir? <span className="text-muted-foreground font-normal">(Opcional)</span>
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={copy.commentPlaceholder}
                        className="w-full p-4 min-h-[100px] bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none resize-none text-sm font-sans"
                    />
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={handleSubmit} // Skip acts as submit without comment
                            className="flex-1 text-muted-foreground hover:text-foreground"
                        >
                            Saltar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                        >
                            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
                            {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress Dots */}
            {step < 4 && (
                <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={cn("w-1.5 h-1.5 rounded-full transition-colors",
                                    s === step ? "bg-primary" : "bg-border"
                                )}
                            />
                        ))}
                    </div>
                    {/* Privacy Microcopy */}
                    <div className="text-[10px] text-muted-foreground/50">
                        {copy.footerPrivacy}
                    </div>
                </div>
            )}
        </section>
    )
}
