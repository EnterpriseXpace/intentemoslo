"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getDiagnosticState } from "@/lib/diagnostic-state"

interface ResultMetricProps {
    value: number // 0-100
    label: string
    size?: 'sm' | 'md' | 'lg'
}

export function ResultMetric({ value, label, size = 'md' }: ResultMetricProps) {
    const [animatedValue, setAnimatedValue] = useState(0)
    const state = getDiagnosticState(value)

    useEffect(() => {
        // Simple animation
        const timer = setTimeout(() => {
            setAnimatedValue(value)
        }, 300)
        return () => clearTimeout(timer)
    }, [value])

    // Size Logic
    const sizeMap = {
        sm: { size: 120, radius: 50, stroke: 8, text: 'text-2xl' },
        md: { size: 192, radius: 80, stroke: 12, text: 'text-4xl' },
        lg: { size: 240, radius: 100, stroke: 16, text: 'text-5xl' },
    }
    const { size: svgSize, radius, stroke, text: textSize } = sizeMap[size]

    const circumference = 2 * Math.PI * radius
    const offset = circumference - (animatedValue / 100) * circumference

    // VISUAL SHIELDING: Strict Color Mapping
    const colorMap: Record<string, string> = {
        emerald: "text-emerald-500",
        amber: "text-amber-500",
        orange: "text-orange-500",
        red: "text-rose-500",
    }
    const colorClass = colorMap[state.semanticColor] || "text-slate-900"

    if (!state) return null

    return (
        <div className="flex flex-col items-center justify-center relative">
            <div
                className="relative flex items-center justify-center"
                style={{ width: svgSize, height: svgSize }}
            >
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={stroke}
                        fill="transparent"
                        className="text-slate-100"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={cn("transition-all duration-1000 ease-out", colorClass)}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("font-bold font-display tracking-tight leading-none", textSize, colorClass)}>
                        {Math.round(animatedValue)}
                    </span>
                    {size !== 'sm' && (
                        <span className="text-xs uppercase font-bold text-slate-400 mt-1">
                            Puntos
                        </span>
                    )}
                </div>
            </div>
            {label && (
                <p className="mt-4 text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {label}
                </p>
            )}
        </div>
    )
}

