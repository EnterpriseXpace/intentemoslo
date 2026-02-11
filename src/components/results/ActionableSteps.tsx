"use client"

import { Eye, MessageCircle, CalendarClock } from "lucide-react"

interface ActionableStepsProps {
    ierScore: number
}

export function ActionableSteps({ ierScore }: ActionableStepsProps) {
    // Logic for recommendations based on score severity
    const getRecs = (score: number) => {
        if (score >= 80) {
            return [
                {
                    icon: Eye,
                    title: "Qué observar esta semana",
                    text: "Fíjate en los 'intentos de conexión' sutiles de tu pareja (una broma, un comentario al pasar) y respóndelos positivamente."
                },
                {
                    icon: MessageCircle,
                    title: "Qué evitar en conversaciones",
                    text: "Evita dar por sentado que sabes lo que piensa. Pregunta '¿Qué opinas tú?' en decisiones pequeñas."
                },
                {
                    icon: CalendarClock,
                    title: "Qué revisar en 30 días",
                    text: "Programa una cita nueva, diferente a la rutina, para celebrar lo que funciona."
                }
            ]
        } else if (score >= 60) {
            return [
                {
                    icon: Eye,
                    title: "Qué observar esta semana",
                    text: "Observa en qué momentos te pones a la defensiva. ¿Es por lo que dicen o por cómo lo dicen?"
                },
                {
                    icon: MessageCircle,
                    title: "Qué evitar en conversaciones",
                    text: "Evita frases que empiecen con 'Tú siempre...' o 'Tú nunca...'. Úsalo en primera persona: 'Yo me siento...'."
                },
                {
                    icon: CalendarClock,
                    title: "Qué revisar en 30 días",
                    text: "Evalúa si han logrado tener una conversación difícil sin levantar la voz."
                }
            ]
        } else {
            return [
                {
                    icon: Eye,
                    title: "Qué observar esta semana",
                    text: "Observa los momentos de calma. ¿Cuándo NO están peleando? Intenta ampliar esos espacios."
                },
                {
                    icon: MessageCircle,
                    title: "Qué evitar en conversaciones",
                    text: "Evita el desprecio (ironía, ojos en blanco). Es el predictor número 1 de ruptura. Si sube el tono, pidan una pausa."
                },
                {
                    icon: CalendarClock,
                    title: "Qué revisar en 30 días",
                    text: "Si la dinámica no cambia, consideren buscar ayuda externa profesional o realizar la Evaluación Profunda."
                }
            ]
        }
    }

    const steps = getRecs(ierScore)

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold font-display">Tus 3 Pasos Inmediatos</h3>
            <div className="grid md:grid-cols-3 gap-6">
                {steps.map((step, i) => (
                    <div key={i} className="bg-secondary/30 p-6 rounded-2xl border border-secondary/20">
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-primary shadow-sm">
                                <step.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-2">{step.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {step.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
