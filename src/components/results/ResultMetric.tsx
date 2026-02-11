"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getDiagnosticState } from "@/lib/diagnostic-state"

interface ResultMetricProps {
    value: number // 0-100
    label: string
}

export function ResultMetric({ value, label }: ResultMetricProps) {
    const [animatedValue, setAnimatedValue] = useState(0)
    const state = getDiagnosticState(value)

    useEffect(() => {
        // Simple animation
        const timer = setTimeout(() => {
            setAnimatedValue(value)
        }, 300)
        return () => clearTimeout(timer)
    }, [value])

    // Circumference for SVG
    const radius = 80
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (animatedValue / 100) * circumference

    // VISUAL SHIELDING: Strict Color Mapping
    // Never rely on default colors. Never allow black.
    const colorMap: Record<string, string> = {
        emerald: "text-emerald-500",
        amber: "text-amber-500",
        orange: "text-orange-500",
        red: "text-rose-500",
    }

    const activeColor = colorMap[state.semanticColor] || "text-transparent" // Fail safe

    if (!state) return null

    return (
        <div className="flex flex-col items-center justify-center relative">
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-stone-100" // Explicit neutral, never black
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={cn("transition-all duration-1000 ease-out", activeColor)}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-4xl font-bold font-display tracking-tight", activeColor)}>
                        {Math.round(animatedValue)}
                    </span>
                    <span className="text-xs uppercase font-bold text-muted-foreground mt-1">
                        Puntos
                    </span>
                </div>
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {state.label}
            </p>
        </div>
    )
}

