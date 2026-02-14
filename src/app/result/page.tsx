import { Suspense } from "react"
import ResultClient from "./ResultClient"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <ResultClient />
        </Suspense>
    )
}
