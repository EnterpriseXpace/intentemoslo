"use client"

import { DimensionScore } from "@/lib/deep-logic"

interface DeepDimensionsProps {
    dimensions: DimensionScore[]
}

import { getDiagnosticState } from "@/lib/diagnostic-state"

export function DeepDimensions({ dimensions }: DeepDimensionsProps) {
    // Helper for state color replaced by SSOT


    return (
        <div className="space-y-6">
            <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold font-display">Mapa de Dimensiones</h3>
                <span className="text-sm text-muted-foreground">Tu estructura relacional</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dimensions.map((dim) => {
                    const state = getDiagnosticState(dim.score)

                    // VISUAL SHIELDING: Strict Color Mapping
                    const colorMap: Record<string, { text: string; bg: string; border: string; bar: string }> = {
                        emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-400" },
                        amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-400" },
                        orange: { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", bar: "bg-orange-400" },
                        red: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", bar: "bg-rose-400" },
                    }

                    const theme = colorMap[state.semanticColor] || colorMap.red // Fallback to red, never black

                    return (
                        <div key={dim.id} className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:break-inside-avoid">
                            {/* Header: Label + State Badge */}
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-foreground text-lg">{dim.label}</h4>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider border ${theme.text} ${theme.bg} ${theme.border}`}>
                                    {dim.state}
                                </span>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm font-medium text-foreground/90 leading-snug">
                                    {dim.interpretation}
                                </p>
                                <div className="mt-2 text-xs text-muted-foreground bg-stone-50 p-3 rounded-lg border border-stone-100 italic">
                                    <span className="font-bold not-italic text-stone-600 block mb-1">Impacto:</span>
                                    "{dim.implication}"
                                </div>
                            </div>

                            {/* Progress Bar (Visual Shielding) */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${theme.bar}`}
                                        style={{ width: `${dim.score}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-muted-foreground opacity-60">
                                    {dim.score}/100
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
