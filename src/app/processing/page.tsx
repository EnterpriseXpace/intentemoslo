"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProcessingView } from "@/components/shared/ProcessingView"
import { Loader2 } from "lucide-react"
import { trackEvent } from "@/lib/instrumentation"

function ProcessingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        trackEvent('processing_started', { productType: 'deep' })
    }, [])

    const handleComplete = () => {
        const params = new URLSearchParams(searchParams.toString())
        router.push(`/pre-result?${params.toString()}`)
    }

    const stages = [
        "Analizando dimensiones...",
        "Cruzando datos estructurados...",
        "Preparando informe profundo..."
    ]

    return (
        <ProcessingView
            stages={stages}
            duration={6000}
            onComplete={handleComplete}
        />
    )
}

export default function ProcessingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <ProcessingContent />
        </Suspense>
    )
}
