"use client"

import { Clock, AlertTriangle } from "lucide-react"

interface DeepRiskProps {
    risk: {
        risk3Months: string
        risk12Months: string
        trajectory: {
            ifIntervened: string
            ifIgnored: string
        }
    }
}

export function DeepRisk({ risk }: DeepRiskProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold font-display">Proyección de Riesgo Temporal</h3>

            <div className="grid md:grid-cols-2 gap-6">
                {/* 3 Months */}
                <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm print:shadow-none print:border-black/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-foreground">A 3 meses</h4>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {risk.risk3Months}
                    </p>
                </div>

                {/* 12 Months */}
                <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm print:shadow-none print:border-black/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-foreground">A 12 meses</h4>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {risk.risk12Months}
                    </p>
                </div>
            </div>

            {/* Trajectory Comparison */}
            <div className="pt-4">
                <h4 className="text-lg font-bold font-display mb-4">Trayectoria Proyectada</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Intervention */}
                    <div className="bg-[#f0fdf4] rounded-2xl p-5 border border-green-100">
                        <h5 className="font-bold text-green-800 text-sm mb-2">🌱 Si se trabaja ahora</h5>
                        <p className="text-green-900/80 text-sm leading-relaxed">
                            {risk.trajectory?.ifIntervened}
                        </p>
                    </div>

                    {/* Ignoring */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <h5 className="font-bold text-slate-700 text-sm mb-2">🌫️ Si se deja pasar</h5>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {risk.trajectory?.ifIgnored}
                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}
