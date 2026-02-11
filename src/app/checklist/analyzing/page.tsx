"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProcessingView } from "@/components/shared/ProcessingView"
import { Loader2 } from "lucide-react"
import { trackEvent } from "@/lib/instrumentation"

function AnalyzingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        trackEvent('processing_started', { productType: 'quick' })
    }, [])

    const handleComplete = () => {
        const params = new URLSearchParams(searchParams.toString())
        router.push(`/pre-result?${params.toString()}`)
    }

    const stages = [
        "Revisando consistencia...",
        "Identificando patrones...",
        "Generando pre-visualización..."
    ]

    return (
        <ProcessingView
            stages={stages}
            duration={4000}
            onComplete={handleComplete}
        />
    )
}

export default function AnalyzingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <AnalyzingContent />
        </Suspense>
    )
}
