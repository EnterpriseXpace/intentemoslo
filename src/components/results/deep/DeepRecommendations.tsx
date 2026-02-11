"use client"

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface DeepRecommendationsProps {
    recommendations: {
        focusOn: string
        avoid: string
        commonError: string
    }
}

export function DeepRecommendations({ recommendations }: DeepRecommendationsProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold font-display">Estrategia de Intervención</h3>

            <div className="grid gap-4">
                {/* Focus On */}
                <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-emerald-900 mb-1">Qué trabajar primero</h4>
                        <p className="text-emerald-800/80 text-sm leading-relaxed">
                            {recommendations.focusOn}
                        </p>
                    </div>
                </div>

                {/* Avoid */}
                <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100 flex gap-4">
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-rose-900 mb-1">Qué NO hacer ahora</h4>
                        <p className="text-rose-800/80 text-sm leading-relaxed">
                            {recommendations.avoid}
                        </p>
                    </div>
                </div>

                {/* Common Error */}
                <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-amber-900 mb-1">Error común que empeora el patrón</h4>
                        <p className="text-amber-800/80 text-sm leading-relaxed">
                            {recommendations.commonError}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
