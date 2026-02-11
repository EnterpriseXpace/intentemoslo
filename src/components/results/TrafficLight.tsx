"use client"

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { getDiagnosticState } from "@/lib/diagnostic-state"
import { cn } from "@/lib/utils"

interface TrafficLightProps {
    greenFactors: string[]
    yellowFactors: string[]
    redFactors: string[]
    globalScore: number
}

export function TrafficLight({ greenFactors, yellowFactors, redFactors, globalScore }: TrafficLightProps) {
    if (greenFactors.length === 0 && yellowFactors.length === 0 && redFactors.length === 0) return null

    const state = getDiagnosticState(globalScore)

    // VISUAL SHIELDING: Strict Color Mapping
    const colorMap: Record<string, { text: string; bg: string; dot: string }> = {
        emerald: { text: "text-emerald-600", bg: "bg-emerald-500", dot: "bg-emerald-500" },
        amber: { text: "text-amber-600", bg: "bg-amber-500", dot: "bg-amber-500" },
        orange: { text: "text-orange-600", bg: "bg-orange-500", dot: "bg-orange-500" },
        red: { text: "text-rose-600", bg: "bg-rose-500", dot: "bg-rose-500" },
    }

    const theme = colorMap[state.semanticColor] || colorMap.red

    // Helper logic to synthesize "Patterns" from count/type instead of listing raw answers.
    const getGreenInterpretation = (count: number) => {
        if (count >= 5) return ["Existe una base sólida de satisfacción y seguridad emocional.", "La conexión afectiva actúa como un amortiguador eficaz."]
        if (count >= 3) return ["Hay pilares funcionales que sostienen la relación.", "Se identifican recursos valiosos para construir soluciones."]
        return ["Existen puntos de luz, aunque requieren ser fortalecidos.", "La intención de conectar sigue presente."]
    }

    const getYellowInterpretation = (count: number) => {
        if (count >= 4) return ["Múltiples áreas muestran señales de fatiga o rutina.", "La incertidumbre está empezando a ganar terreno a la seguridad."]
        if (count >= 1) return ["Zonas específicas de fricción que generan distancia intermitente.", "Ciertos temas se evitan para mantener la paz."]
        return []
    }

    const getRedInterpretation = (count: number) => {
        if (count >= 4) return ["Patrones de desconexión profunda y riesgo estructural.", "La comunicación actual puede estar generando más heridas."]
        if (count >= 1) return ["Indicadores de alerta que requieren atención inmediata.", "Desgaste acumulado en áreas críticas del vínculo."]
        return []
    }

    const greenPatterns = getGreenInterpretation(greenFactors.length)
    const yellowPatterns = getYellowInterpretation(yellowFactors.length)
    const redPatterns = getRedInterpretation(redFactors.length)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 mb-2">
                <div>
                    <h3 className="text-xl font-bold font-display text-foreground">Patrones Relacionales Detectados</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        Este bloque describe las dinámicas específicas que están operando.
                        La gravedad global se muestra en el índice superior.
                    </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    {/* Global Severity Badge */}
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border",
                        state.bg, state.borderColor, state.color
                    )}>
                        <span className={cn("w-2 h-2 rounded-full", theme.dot)} />
                        Gravedad Global: {state.level === "SOLIDO" ? "Baja / Estable" : state.label}
                    </div>

                    {/* Dominant Pattern Badge based on priority */}
                    {redFactors.length > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-rose-50 border-rose-200 text-rose-700">
                            <AlertTriangle className="w-3 h-3" />
                            Foco: Riesgos Estructurales
                        </div>
                    ) : yellowFactors.length > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-amber-50 border-amber-200 text-amber-700">
                            <AlertTriangle className="w-3 h-3" />
                            Foco: Zonas de Fricción
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 border-emerald-200 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Foco: Fortalezas
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-4">
                {/* Red Zone (Critical) */}
                {redFactors.length > 0 && (
                    <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-1.5 bg-rose-100 rounded-full text-rose-600">
                                <XCircle className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-rose-900">Riesgos detectados</h4>
                        </div>
                        <ul className="space-y-2 pl-2">
                            {redPatterns.map((pattern, i) => (
                                <li key={i} className="text-sm text-rose-800 flex items-start gap-2 leading-relaxed">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                                    {pattern}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Yellow Zone (Caution) */}
                {yellowFactors.length > 0 && (
                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-1.5 bg-amber-100 rounded-full text-amber-600">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-amber-900">Zonas de fricción</h4>
                        </div>
                        <ul className="space-y-2 pl-2">
                            {yellowPatterns.map((pattern, i) => (
                                <li key={i} className="text-sm text-amber-800 flex items-start gap-2 leading-relaxed">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                    {pattern}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Green Zone (Good) */}
                {greenFactors.length > 0 && (
                    <div className={cn("rounded-2xl p-5 border",
                        // If state is not SOLID, don't use full emerald theme for this box
                        state.level !== "SOLIDO"
                            ? "bg-stone-50/50 border-stone-200"
                            : "bg-emerald-50/50 border-emerald-100"
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={cn("p-1.5 rounded-full",
                                state.level !== "SOLIDO"
                                    ? "bg-stone-100 text-stone-600"
                                    : "bg-emerald-100 text-emerald-600"
                            )}>
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <h4 className={cn("font-bold",
                                state.level !== "SOLIDO" ? "text-stone-700" : "text-emerald-900"
                            )}>
                                {state.positiveBoxTitle}
                            </h4>
                        </div>
                        <ul className="space-y-2 pl-2">
                            {greenPatterns.map((pattern, i) => (
                                <li key={i} className={cn("text-sm flex items-start gap-2 leading-relaxed",
                                    state.level !== "SOLIDO" ? "text-stone-600" : "text-emerald-800"
                                )}>
                                    <span className={cn("mt-1.5 w-1 h-1 rounded-full shrink-0",
                                        state.level !== "SOLIDO" ? "bg-stone-400" : "bg-emerald-400"
                                    )} />
                                    {pattern}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div >
    )
}

