"use client"

import { getDiagnosticState } from "@/lib/diagnostic-state"

interface AnalysisBlockProps {
    ierScore: number
}

export function AnalysisBlock({ ierScore }: AnalysisBlockProps) {
    const state = getDiagnosticState(ierScore)
    let p1 = ""
    let p2 = ""

    // We can use state.level or state.keyMessage.
    // However, the paragraphs are specific. We can map them by level.

    // VISUAL SHIELDING: Strict Color Mapping
    const colorMap: Record<string, { text: string; bg: string; border: string }> = {
        emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
        amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
        orange: { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
        red: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
    }

    const theme = colorMap[state.semanticColor] || colorMap.red

    if (state.level === "SOLIDO") {
        p1 = "Tu relación muestra una 'Estabilidad Activa'. Las respuestas indican que existe una base de seguridad que permite a ambos ser vulnerables sin miedo. Un puntaje alto como este indica una estructura relacional sólida y funcional en el momento actual. Esto no implica ausencia de retos, sino una base estable que, con atención consciente, puede sostenerse y profundizarse en el tiempo."
        p2 = "Sin embargo, el bienestar puede generar 'ceguera de mantenimiento'. La oportunidad aquí no es reparar, sino expandir. Si se deja de invertir activamente, incluso esta solidez puede erosionarse silenciosamente por la rutina. No es momento de relajarse, sino de capitalizar esta seguridad para profundizar."
    } else if (state.level === "PRECAUCION" || state.level === "FRAGIL") {
        p1 = "El diagnóstico refleja un estado de 'Funcionalidad con Fricción'. La estructura de la relación se sostiene y cumple las expectativas básicas, pero se detecta un patrón de evitación o rumiación en temas clave. Es probable que ambos estén 'soportando' ciertas dinámicas en lugar de resolverlas para no alterar la paz."
        p2 = "No es una crisis inminente, pero sí un punto de inflexión claro. El riesgo real aquí es la resignación: acostumbrarse a una desconexión moderada. Si estas fricciones no se nombran y atienden ahora, la distancia emocional comenzará a solidificarse, haciendo mucho más difícil el retorno a la intimidad."
    } else { // CRITICO
        p1 = "Los indicadores señalan un estado de 'Vulnerabilidad Estructural'. Más allá de las discusiones puntuales, el patrón subyacente sugiere que la seguridad emocional del vínculo está comprometida. Es posible que uno o ambos se sientan solos incluso estando acompañados, interpretando las acciones del otro desde la defensa o la desesperanza."
        p2 = "Esto requiere una intervención consciente. El riesgo no es solo el conflicto, sino el desapego: cuando se deja de luchar por ser comprendido. La oportunidad inmediata es detener la hemorragia emocional cambiando la dinámica de 'ataque-defensa' por una de 'necesidad-expresión'. Es un momento crítico que exige coraje para cambiar el rumbo."
    }

    return (
        <div className="space-y-4">
            <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold font-display">Análisis Personalizado</h3>
                <span className={`text-sm font-medium px-3 py-1 rounded-full border ${theme.bg} ${theme.border} ${theme.text}`}>
                    Estado: {state.label}
                </span>
            </div>

            <div className="bg-white/50 border border-border/50 rounded-2xl p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg">
                    {p1}
                </p>
                <div className="w-16 h-px bg-border/60" /> {/* Visual separator */}
                <p className="text-muted-foreground leading-relaxed text-lg font-medium text-foreground/80">
                    <span className="text-primary mr-2">➜</span>
                    {p2}
                </p>
            </div>
        </div>
    )
}
