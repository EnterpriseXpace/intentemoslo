"use client"

import { useState, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"
import { EmailGateModal } from "@/components/tools/EmailGateModal"

const TOOL_SLUG = "detector-celos-retroactivos"
const TOOL_TITLE = "Detector de Celos Retroactivos"

// ─── Preguntas ────────────────────────────────────────────────────────────────

interface Pregunta {
    id: string
    label: string
    categoria: "frecuencia" | "intensidad" | "impacto"
}

const PREGUNTAS: Pregunta[] = [
    // Frecuencia
    {
        id: "fr1",
        label: "¿Piensas con frecuencia en las relaciones que tu pareja tuvo antes de conocerte?",
        categoria: "frecuencia",
    },
    {
        id: "fr2",
        label: "¿Investigas o preguntas sobre el pasado sentimental de tu pareja de forma recurrente?",
        categoria: "frecuencia",
    },
    // Intensidad emocional
    {
        id: "in1",
        label: "¿Sientes malestar o angustia cuando piensas en sus exparejas o experiencias pasadas?",
        categoria: "intensidad",
    },
    {
        id: "in2",
        label: "¿Los pensamientos sobre el pasado de tu pareja interfieren en tu bienestar cotidiano?",
        categoria: "intensidad",
    },
    // Impacto relacional
    {
        id: "im1",
        label: "¿Has tenido conflictos con tu pareja por su pasado sentimental?",
        categoria: "impacto",
    },
    {
        id: "im2",
        label: "¿Sientes que el pasado de tu pareja afecta la confianza que tienes en la relación actual?",
        categoria: "impacto",
    },
]

const OPCIONES = [
    { value: 0, label: "Nunca" },
    { value: 1, label: "Rara vez" },
    { value: 2, label: "A veces" },
    { value: 3, label: "Con frecuencia" },
    { value: 4, label: "Siempre" },
]

// ─── Cálculo ──────────────────────────────────────────────────────────────────

interface Resultado {
    score: number        // 0–10
    tipo: string
    descripcion: string
    recomendacion: string
    color: string
    bgColor: string
    emoji: string
}

function calcularResultado(valores: Record<string, number>): Resultado {
    const vals = Object.values(valores)
    const total = vals.reduce((a, b) => a + b, 0)
    const max = PREGUNTAS.length * 4
    const score = Math.round((total / max) * 10)

    if (score <= 2) {
        return {
            score,
            tipo: "Sin señales significativas",
            descripcion: "No se detectan patrones de celos retroactivos relevantes. Los pensamientos sobre el pasado de tu pareja parecen no generar malestar sostenido.",
            recomendacion: "Mantener la comunicación abierta y la confianza como pilares de la relación.",
            color: "#22c55e",
            bgColor: "#f0fdf4",
            emoji: "💚",
        }
    } else if (score <= 4) {
        return {
            score,
            tipo: "Incomodidad ocasional",
            descripcion: "Hay algunos pensamientos sobre el pasado de tu pareja que generan incomodidad puntual, pero no parecen dominar tu estado emocional ni la relación.",
            recomendacion: "Explorar el origen de esas incomodidades puede ayudarte a distinguir si responden a algo real o a patrones de inseguridad.",
            color: "#84cc16",
            bgColor: "#f7fee7",
            emoji: "🟡",
        }
    } else if (score <= 6) {
        return {
            score,
            tipo: "Patrón de celos retroactivos moderado",
            descripcion: "Los pensamientos sobre el pasado de tu pareja aparecen con relativa frecuencia y generan malestar emocional. Este patrón puede estar afectando la dinámica de la relación.",
            recomendacion: "Reflexionar sobre qué necesidades de seguridad o confianza están detrás de estos pensamientos puede ser un punto de partida útil.",
            color: "#f59e0b",
            bgColor: "#fffbeb",
            emoji: "⚠️",
        }
    } else if (score <= 8) {
        return {
            score,
            tipo: "Patrón intenso de celos retroactivos",
            descripcion: "Los celos retroactivos aparecen con alta frecuencia e intensidad, afectando tu bienestar y probablemente generando tensión en la relación. Suele estar asociado a ansiedad de apego o baja autoestima situacional.",
            recomendacion: "Poner foco en lo que este patrón te dice sobre tus propias necesidades, y considerar apoyo profesional si interfiere significativamente en tu vida.",
            color: "#f97316",
            bgColor: "#fff7ed",
            emoji: "🔴",
        }
    } else {
        return {
            score,
            tipo: "Patrón muy elevado",
            descripcion: "Los celos retroactivos tienen un impacto muy alto en tu bienestar y en la relación. Este nivel de intensidad suele estar vinculado a patrones de ansiedad, apego inseguro o experiencias previas no resueltas.",
            recomendacion: "Este patrón merece atención. Hablar con un profesional puede ayudarte a entender su origen y a trabajar en herramientas para gestionarlo.",
            color: "#ef4444",
            bgColor: "#fef2f2",
            emoji: "🆘",
        }
    }
}

// ─── RadioItem ────────────────────────────────────────────────────────────────

function RadioGroup({
    pregunta,
    value,
    onChange,
    disabled,
}: {
    pregunta: Pregunta
    value: number | undefined
    onChange: (id: string, val: number) => void
    disabled: boolean
}) {
    return (
        <div className={cn("space-y-2", disabled && "opacity-60")}>
            <p className="text-sm font-medium text-foreground leading-snug">{pregunta.label}</p>
            <div className="flex flex-wrap gap-2">
                {OPCIONES.map((op) => (
                    <button
                        key={op.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && onChange(pregunta.id, op.value)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                            value === op.value
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-white text-muted-foreground border-card-border hover:border-primary/40 hover:text-foreground"
                        )}
                        aria-pressed={value === op.value}
                    >
                        {op.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function DetectorCelosRetroactivosClient() {
    const [valores, setValores] = useState<Record<string, number | undefined>>({})
    const [showGate, setShowGate] = useState(false)
    const [showResult, setShowResult] = useState(false)

    const allAnswered = PREGUNTAS.every((p) => valores[p.id] !== undefined)
    const resultado = useMemo(
        () => (allAnswered ? calcularResultado(valores as Record<string, number>) : null),
        [valores, allAnswered]
    )

    const handleChange = useCallback((id: string, val: number) => {
        setValores((prev) => ({ ...prev, [id]: val }))
    }, [])

    function handleCalcular() {
        if (!allAnswered) return
        setShowGate(true)
    }

    function handleEmailSuccess() {
        setShowGate(false)
        setShowResult(true)
        setTimeout(() => {
            document.getElementById("resultado-celos-retroactivos")?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
    }

    // Progreso visual
    const answered = PREGUNTAS.filter((p) => valores[p.id] !== undefined).length
    const progress = Math.round((answered / PREGUNTAS.length) * 100)

    const CATEGORIAS = [
        { key: "frecuencia", label: "Frecuencia de pensamientos" },
        { key: "intensidad", label: "Intensidad emocional" },
        { key: "impacto", label: "Impacto en la relación" },
    ] as const

    return (
        <div className="space-y-8">
            {/* Panel principal */}
            <div className="bg-white rounded-2xl border border-card-border shadow-sm p-6 space-y-7">

                {/* Barra de progreso */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{answered} de {PREGUNTAS.length} respondidas</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Grupos por categoría */}
                {CATEGORIAS.map((cat) => (
                    <div key={cat.key} className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 border-b border-secondary pb-1">
                            {cat.label}
                        </h3>
                        {PREGUNTAS.filter((p) => p.categoria === cat.key).map((p) => (
                            <RadioGroup
                                key={p.id}
                                pregunta={p}
                                value={valores[p.id]}
                                onChange={handleChange}
                                disabled={showResult}
                            />
                        ))}
                    </div>
                ))}

                {/* Botón */}
                <button
                    onClick={handleCalcular}
                    disabled={!allAnswered || showResult}
                    className="w-full mt-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {showResult
                        ? "✅ Resultado revelado"
                        : allAnswered
                            ? "Ver mi resultado →"
                            : `Responde todas las preguntas (${answered}/${PREGUNTAS.length})`}
                </button>
            </div>

            {/* Modal email gate */}
            {showGate && (
                <EmailGateModal
                    toolSlug={TOOL_SLUG}
                    toolTitle={TOOL_TITLE}
                    onSuccess={handleEmailSuccess}
                />
            )}

            {/* Resultado */}
            {showResult && resultado && (
                <div
                    id="resultado-celos-retroactivos"
                    className="rounded-2xl border-2 p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ borderColor: resultado.color, backgroundColor: resultado.bgColor }}
                    role="region"
                    aria-label="Resultado del detector"
                >
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">{resultado.emoji}</span>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: resultado.color }}>
                                {resultado.score}/10
                            </p>
                            <p className="font-semibold text-foreground">{resultado.tipo}</p>
                        </div>
                    </div>

                    <div className="bg-white/60 rounded-xl p-4 space-y-2 border border-white/80">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            Qué indica este resultado
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {resultado.descripcion}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            Orientación
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {resultado.recomendacion}
                        </p>
                    </div>

                    <p className="text-xs text-muted-foreground border-t border-black/5 pt-3">
                        Esta herramienta es orientativa y no constituye un diagnóstico clínico.
                        Está inspirada en investigación sobre retroactive jealousy, ansiedad relacional y teoría del apego.
                    </p>
                </div>
            )}
        </div>
    )
}
