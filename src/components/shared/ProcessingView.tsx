"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Container } from "@/components/layout/Container"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Loader2 } from "lucide-react"

interface ProcessingViewProps {
    stages: string[]
    duration?: number // ms, default 5000
    onComplete: () => void
}

export function ProcessingView({ stages, duration = 5000, onComplete }: ProcessingViewProps) {
    const [progress, setProgress] = useState(0)
    const [currentStageIndex, setCurrentStageIndex] = useState(0)

    useEffect(() => {
        const intervalTime = 100 // ms
        const steps = duration / intervalTime
        const increment = 100 / steps

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment
                if (next >= 100) {
                    clearInterval(timer)
                    return 100
                }
                return next
            })
        }, intervalTime)

        return () => clearInterval(timer)
    }, [duration])

    // Update stages based on progress
    useEffect(() => {
        if (stages.length === 0) return

        const stageDurationPercent = 100 / stages.length
        const newIndex = Math.min(
            stages.length - 1,
            Math.floor(progress / stageDurationPercent)
        )

        if (newIndex !== currentStageIndex) {
            setCurrentStageIndex(newIndex)
        }
    }, [progress, stages.length, currentStageIndex])

    // Complete
    useEffect(() => {
        if (progress >= 100) {
            const timeout = setTimeout(() => {
                onComplete()
            }, 800) // Small delay at 100%
            return () => clearTimeout(timeout)
        }
    }, [progress, onComplete])

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <Container>
                    <div className="max-w-md mx-auto text-center space-y-10 animate-in fade-in duration-700">
                        {/* Status Text */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold font-display text-foreground min-h-[3rem] items-center flex justify-center">
                                {stages[currentStageIndex] || "Procesando..."}
                            </h2>
                            <p className="text-muted-foreground animate-pulse">
                                Por favor no cierres esta página.
                            </p>
                        </div>

                        {/* Visual Indicators */}
                        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                                style={{ animationDuration: "1.5s" }}
                            ></div>
                            <Loader2 className="w-8 h-8 text-primary/60" />
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2 max-w-xs mx-auto">
                            <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <span>Progreso</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <ProgressBar value={progress} className="h-2" />
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    )
}
