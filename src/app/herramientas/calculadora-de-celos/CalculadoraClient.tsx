"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { ToolBreadcrumbs } from "@/components/tools/ToolBreadcrumbs"
import { EmailGateModal } from "@/components/tools/EmailGateModal"

const TOOL_SLUG = "calculadora-de-celos"
const TOOL_TITLE = "Calculadora de Celos"

const SLIDER_MIN = 0
const SLIDER_MAX = 5

const ETIQUETAS: Record<number, string> = {
    0: "Nunca",
    1: "Muy raro",
    2: "Ocasional",
    3: "A veces",
    4: "Frecuente",
    5: "Siempre",
}

// ─── Modelo tridimensional (Pfeiffer & Wong, 1989 — MJS) ─────────────────────

interface Pregunta {
    id: string
    label: string
    dimension: "cognitiva" | "emocional" | "conductual"
}

const PREGUNTAS: Pregunta[] = [
    // Dimensión Cognitiva — pensamientos recurrentes de sospecha
    {
        id: "cog1",
        label: "¿Con qué frecuencia sospechas de sus interacciones con otras personas?",
        dimension: "cognitiva",
    },
    {
        id: "cog2",
        label: "¿Interpretas situaciones neutras (mensajes, miradas, salidas) como señales de amenaza?",
        dimension: "cognitiva",
    },

    // Dimensión Emocional — ansiedad, miedo a pérdida
    {
        id: "emo1",
        label: "¿Sientes ansiedad o malestar cuando tu pareja tiene contacto con otras personas?",
        dimension: "emocional",
    },
    {
        id: "emo2",
        label: "¿Tienes miedo frecuente de perder a tu pareja por alguien más?",
        dimension: "emocional",
    },

    // Dimensión Conductual — vigilancia, control de interacciones
    {
        id: "con1",
        label: "¿Revisas su teléfono, redes sociales o mensajes sin su consentimiento?",
        dimension: "conductual",
    },
    {
        id: "con2",
        label: "¿Intentas controlar o restringir con quién se relaciona o dónde va?",
        dimension: "conductual",
    },
]

const DIMENSIONES_META = {
    cognitiva: { label: "Celos Cognitivos", color: "#6366f1" },
    emocional: { label: "Celos Emocionales", color: "#f59e0b" },
    conductual: { label: "Celos Conductuales", color: "#ef4444" },
}

// ─── Cálculo de resultado ─────────────────────────────────────────────────────

interface ResultadoDimension {
    key: "cognitiva" | "emocional" | "conductual"
    label: string
    score: number   // 0–10
    color: string
}

interface Resultado {
    globalScore: number
    tipo: string
    explicacion: string
    recomendacion: string
    color: string
    bgColor: string
    emoji: string
    dimensiones: ResultadoDimension[]
    dominante: ResultadoDimension
}

function calcularResultado(valores: Record<string, number>): Resultado {
    // Puntuación por dimensión (0-10)
    function dimScore(ids: string[]) {
        const sum = ids.reduce((a, id) => a + (valores[id] ?? 0), 0)
        return Math.round((sum / (ids.length * SLIDER_MAX)) * 10)
    }

    const dim: ResultadoDimension[] = [
        { key: "cognitiva", label: "Celos Cognitivos", score: dimScore(["cog1", "cog2"]), color: "#6366f1" },
        { key: "emocional", label: "Celos Emocionales", score: dimScore(["emo1", "emo2"]), color: "#f59e0b" },
        { key: "conductual", label: "Celos Conductuales", score: dimScore(["con1", "con2"]), color: "#ef4444" },
    ]

    const allValues = Object.values(valores)
    const globalScore = Math.round(
        (allValues.reduce((a, b) => a + b, 0) / (allValues.length * SLIDER_MAX)) * 10
    )

    const dominante = [...dim].sort((a, b) => b.score - a.score)[0]

    // Explicación según dimensión dominante
    const explicacionesDominante: Record<string, string> = {
        cognitiva:
            "El patrón predominante está en el plano cognitivo: pensamientos de sospecha o interpretaciones de amenaza ante situaciones cotidianas. Este tipo de celos suelen estar vinculados a esquemas de desconfianza que no necesariamente reflejan la realidad de la relación.",
        emocional:
            "La dimensión más activa es la emocional: ansiedad ante el contacto de tu pareja con otros o miedo recurrente a la pérdida. Desde la teoría del apego, esto puede estar relacionado con patrones de apego ansioso o inseguro que generan hipersensibilidad ante señales de abandono.",
        conductual:
            "La dimensión conductual es la más marcada: revisión de dispositivos, restricción de contactos o control de movimientos. Gottman identifica estos patrones como señales de alerta en la dinámica relacional, ya que erosionan la confianza mutua.",
    }

    // Rangos globales (0–10)
    let tipo: string, color: string, bgColor: string, emoji: string, recomendacion: string

    if (globalScore <= 2) {
        tipo = "Reactividad leve"
        color = "#22c55e"
        bgColor = "#f0fdf4"
        emoji = "💚"
        recomendacion = "Los niveles detectados son bajos. Comunicar abiertamente pequeñas inseguridades puede fortalecer la confianza en la relación."
    } else if (globalScore <= 4) {
        tipo = "Inseguridad activada"
        color = "#84cc16"
        bgColor = "#f7fee7"
        emoji = "🟡"
        recomendacion = "Hay señales de inseguridad que vale explorar. Reflexionar sobre el origen de esas sensaciones puede aportar claridad antes de actuar."
    } else if (globalScore <= 6) {
        tipo = "Celos moderados"
        color = "#f59e0b"
        bgColor = "#fffbeb"
        emoji = "⚠️"
        recomendacion = "El patrón de celos está generando tensión. Explorar las creencias detrás de estos pensamientos puede ser un primer paso útil."
    } else if (globalScore <= 8) {
        tipo = "Conductas de vigilancia frecuentes"
        color = "#f97316"
        bgColor = "#fff7ed"
        emoji = "🔴"
        recomendacion = "Este patrón puede estar comprometiendo la autonomía y la confianza en la relación. Poner nombre a lo que sientes, sin actuar desde el miedo, puede marcar una diferencia."
    } else {
        tipo = "Patrón restrictivo de control"
        color = "#ef4444"
        bgColor = "#fef2f2"
        emoji = "🆘"
        recomendacion = "Los niveles de control son muy elevados. Este patrón puede constituir una dinámica de abuso emocional. Consultar con un profesional puede ser un paso importante."
    }

    return {
        globalScore,
        tipo,
        explicacion: explicacionesDominante[dominante.key],
        recomendacion,
        color,
        bgColor,
        emoji,
        dimensiones: dim,
        dominante,
    }
}

// ─── Velocímetro SVG ──────────────────────────────────────────────────────────

function Velocimetro({ globalScore }: { globalScore: number }) {
    const cx = 100, cy = 108, r = 68
    const GAP = 3

    function pt(deg: number, radius = r) {
        const rad = (deg * Math.PI) / 180
        return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
    }

    function arc(startDeg: number, endDeg: number, radius = r) {
        const s = pt(startDeg, radius)
        const e = pt(endDeg, radius)
        const large = endDeg - startDeg > 180 ? 1 : 0
        return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
    }

    const segments = [
        { color: "#22c55e", from: 180 + GAP, to: 216 - GAP },
        { color: "#84cc16", from: 216 + GAP, to: 252 - GAP },
        { color: "#facc15", from: 252 + GAP, to: 288 - GAP },
        { color: "#f97316", from: 288 + GAP, to: 324 - GAP },
        { color: "#ef4444", from: 324 + GAP, to: 360 - GAP },
    ]

    const needleDeg = 180 + (globalScore / 10) * 180
    const tip = pt(needleDeg, 58)
    const base1 = pt(needleDeg + 90, 7)
    const base2 = pt(needleDeg - 90, 7)

    return (
        <svg viewBox="0 0 200 120" className="w-full max-w-[280px] mx-auto overflow-visible" aria-hidden="true">
            <path d={arc(182, 358)} fill="none" stroke="#e8e7df" strokeWidth={14} strokeLinecap="round" />
            {segments.map((seg, i) => (
                <path key={i} d={arc(seg.from, seg.to)} fill="none" stroke={seg.color} strokeWidth={14} strokeLinecap="round" />
            ))}
            <text x="22" y={cy + 6} fontSize="9" fill="#4f5446" textAnchor="middle" fontFamily="system-ui">0</text>
            <text x="178" y={cy + 6} fontSize="9" fill="#4f5446" textAnchor="middle" fontFamily="system-ui">10</text>
            <polygon
                points={`${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${base1.x.toFixed(1)},${base1.y.toFixed(1)} ${base2.x.toFixed(1)},${base2.y.toFixed(1)}`}
                fill="#1e293b"
                style={{ transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)" }}
            />
            <circle cx={cx} cy={cy} r="8" fill="#1e293b" />
            <circle cx={cx} cy={cy} r="4" fill="#ffffff" opacity="0.6" />
        </svg>
    )
}

// ─── SliderItem ───────────────────────────────────────────────────────────────

interface SliderItemProps {
    pregunta: Pregunta
    value: number
    onChange: (id: string, val: number) => void
    disabled?: boolean
}

function SliderItem({ pregunta, value, onChange, disabled = false }: SliderItemProps) {
    const [showTooltip, setShowTooltip] = useState(false)
    const pct = ((value - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100
    const etiqueta = ETIQUETAS[value]

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (disabled) return
            onChange(pregunta.id, Number(e.target.value))
        },
        [pregunta.id, onChange, disabled]
    )

    return (
        <div className={cn("space-y-1.5", disabled && "opacity-60 cursor-not-allowed")}>
            <p className="text-sm font-medium text-foreground leading-snug">{pregunta.label}</p>
            <div className="relative flex items-center" style={{ paddingTop: "26px" }}>
                {showTooltip && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-0 flex flex-col items-center"
                        style={{ left: `calc(${pct}% + 64px)`, transform: "translateX(-50%)" }}
                    >
                        <div className="bg-foreground text-white text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md">
                            {etiqueta} ({value})
                        </div>
                        <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #161811" }} />
                    </div>
                )}
                <span className="text-xs text-muted-foreground w-16 text-right flex-shrink-0 pr-3">{ETIQUETAS[SLIDER_MIN]}</span>
                <div className="flex-1">
                    <input
                        type="range"
                        min={SLIDER_MIN}
                        max={SLIDER_MAX}
                        step={1}
                        value={value}
                        aria-label={pregunta.label}
                        aria-valuetext={`${etiqueta} (${value})`}
                        onChange={handleChange}
                        onMouseDown={() => !disabled && setShowTooltip(true)}
                        onMouseUp={() => setShowTooltip(false)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onTouchStart={() => !disabled && setShowTooltip(true)}
                        onTouchEnd={() => setShowTooltip(false)}
                        disabled={disabled}
                        className={cn(
                            "tool-slider w-full focus:outline-none",
                            disabled ? "pointer-events-none" : "focus-visible:ring-2 focus-visible:ring-primary/60"
                        )}
                        style={{
                            background: pct === 0
                                ? "#e8e7df"
                                : `linear-gradient(to right, #22c55e 0%, #84cc16 ${pct * 0.3}%, #facc15 ${pct * 0.55}%, #f97316 ${pct * 0.8}%, #ef4444 ${pct}%, #e8e7df ${pct}%)`,
                        }}
                    />
                </div>
                <span className="text-xs text-muted-foreground w-16 flex-shrink-0 pl-3">{ETIQUETAS[SLIDER_MAX]}</span>
            </div>
            <p className="text-xs text-right pr-[4.5rem]">
                <span className="font-medium text-foreground/60">{etiqueta}</span>
            </p>
        </div>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────

const GRUPOS: { key: "cognitiva" | "emocional" | "conductual"; desc: string }[] = [
    { key: "cognitiva", desc: "Pensamientos recurrentes de sospecha e interpretación de amenaza" },
    { key: "emocional", desc: "Ansiedad, miedo a pérdida e inseguridad relacional" },
    { key: "conductual", desc: "Vigilancia, revisión de dispositivos y control de interacciones" },
]

export default function CalculadoraDeCelosClient() {
    const initialValues = Object.fromEntries(PREGUNTAS.map((p) => [p.id, 0]))
    const [valores, setValores] = useState<Record<string, number>>(initialValues)
    const [showGate, setShowGate] = useState(false)
    const [showResult, setShowResult] = useState(false)

    const resultado = useMemo(() => calcularResultado(valores), [valores])

    const handleChange = useCallback((id: string, val: number) => {
        setValores((prev) => ({ ...prev, [id]: val }))
    }, [])

    function handleCalcular() { setShowGate(true) }

    function handleEmailSuccess() {
        setShowGate(false)
        setShowResult(true)
        setTimeout(() => {
            document.getElementById("resultado-herramienta")?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
    }

    return (
        <div className="space-y-8">
            {/* Panel de gauge */}
            <div className="bg-white rounded-2xl border border-card-border shadow-sm p-6 space-y-6">
                <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Nivel estimado en tiempo real
                    </p>
                    <Velocimetro globalScore={resultado.globalScore} />
                    <p className="text-2xl font-bold text-foreground" aria-live="polite">
                        {resultado.globalScore}/10
                    </p>
                    <p className="text-sm font-medium" style={{ color: resultado.color }}>
                        {resultado.tipo}
                    </p>
                </div>

                {/* Barras de dimensión en tiempo real */}
                <div className="grid grid-cols-3 gap-3">
                    {resultado.dimensiones.map((d) => (
                        <div key={d.key} className="text-center space-y-1">
                            <p className="text-xs text-muted-foreground leading-tight">{d.label}</p>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${d.score * 10}%`, backgroundColor: d.color }}
                                />
                            </div>
                            <p className="text-xs font-semibold" style={{ color: d.color }}>{d.score}/10</p>
                        </div>
                    ))}
                </div>

                {/* Grupos de preguntas por dimensión */}
                <div className="space-y-8 pt-2 border-t border-secondary">
                    {GRUPOS.map((grupo) => {
                        const pregs = PREGUNTAS.filter((p) => p.dimension === grupo.key)
                        const meta = DIMENSIONES_META[grupo.key]
                        return (
                            <div key={grupo.key} className="space-y-4">
                                <div className="flex items-start gap-2">
                                    <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: meta.color }} />
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{meta.label}</p>
                                        <p className="text-xs text-muted-foreground">{grupo.desc}</p>
                                    </div>
                                </div>
                                {pregs.map((p) => (
                                    <SliderItem key={p.id} pregunta={p} value={valores[p.id]} onChange={handleChange} disabled={showResult} />
                                ))}
                            </div>
                        )
                    })}
                </div>

                <button
                    onClick={handleCalcular}
                    disabled={showResult}
                    className="w-full mt-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {showResult ? "✅ Resultado revelado" : "Calcular resultado →"}
                </button>
            </div>

            {showGate && (
                <EmailGateModal toolSlug={TOOL_SLUG} toolTitle={TOOL_TITLE} onSuccess={handleEmailSuccess} />
            )}

            {/* Resultado tridimensional */}
            {showResult && (
                <div
                    id="resultado-herramienta"
                    className="rounded-2xl border-2 p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ borderColor: resultado.color, backgroundColor: resultado.bgColor }}
                    role="region"
                    aria-label="Resultado de la calculadora"
                >
                    {/* Cabecera */}
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">{resultado.emoji}</span>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: resultado.color }}>
                                {resultado.globalScore}/10
                            </p>
                            <p className="font-semibold text-foreground">{resultado.tipo}</p>
                        </div>
                    </div>

                    {/* Dimensión dominante */}
                    <div className="bg-white/60 rounded-xl p-4 space-y-1 border border-white/80">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            Dimensión predominante
                        </p>
                        <p className="text-sm font-bold" style={{ color: resultado.dominante.color }}>
                            {resultado.dominante.label} — {resultado.dominante.score}/10
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {resultado.explicacion}
                        </p>
                    </div>

                    {/* Scores por dimensión */}
                    <div className="grid grid-cols-3 gap-3">
                        {resultado.dimensiones.map((d) => (
                            <div key={d.key} className="bg-white/60 rounded-lg p-3 text-center border border-white/80">
                                <p className="text-xs text-muted-foreground leading-tight mb-1">{d.label}</p>
                                <p className="text-lg font-bold" style={{ color: d.color }}>{d.score}/10</p>
                            </div>
                        ))}
                    </div>

                    {/* Recomendación reflexiva */}
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Reflexión</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{resultado.recomendacion}</p>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-muted-foreground border-t border-black/5 pt-3">
                        Esta herramienta es orientativa y no constituye un diagnóstico clínico. Está inspirada en modelos de investigación psicológica sobre celos y apego en relaciones de pareja.
                    </p>
                </div>
            )}
        </div>
    )
}
