"use client"

interface DeepSummaryProps {
    summary: string
}

export function DeepSummary({ summary }: DeepSummaryProps) {
    // Process markdown-like bold syntax (**text**) to HTML b tags
    const renderSummary = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g)
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <b key={i} className="font-bold text-foreground">{part.slice(2, -2)}</b>
            }
            return part
        })
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-primary/20 shadow-xl shadow-primary/5 print:shadow-none print:border-black/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />

            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Resumen Ejecutivo
            </h3>

            <p className="text-xl md:text-2xl leading-relaxed text-foreground/80 font-medium font-display">
                {renderSummary(summary)}
            </p>
        </div>
    )
}
