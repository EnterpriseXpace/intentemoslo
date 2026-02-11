"use client"

interface DeepPatternProps {
    pattern: {
        title: string
        description: string
        translation: string
        impact: string[]
        signs: string[]
    }
}

export function DeepPattern({ pattern }: DeepPatternProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold font-display">Patrón Dominante</h3>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Main Pattern Card */}
                <div className="bg-secondary/20 rounded-3xl p-8 border-l-4 border-primary md:col-span-2">
                    <div className="space-y-4">
                        <h4 className="text-2xl font-bold text-foreground font-display">
                            {pattern.title}
                        </h4>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {pattern.description}
                        </p>
                        <p className="text-foreground/80 italic font-medium pt-2">
                            <span className="not-italic mr-2">💡</span>
                            {pattern.translation}
                        </p>
                    </div>
                </div>

                {/* Cross Impact */}
                <div className="bg-white rounded-3xl p-6 border border-border/60 shadow-sm">
                    <h5 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <span>🔗</span> Cómo afecta a otras áreas
                    </h5>
                    <ul className="space-y-3">
                        {pattern.impact?.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex gap-3 items-start">
                                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Observable Signs */}
                <div className="bg-white rounded-3xl p-6 border border-border/60 shadow-sm">
                    <h5 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <span>👀</span> Señales en el día a día
                    </h5>
                    <ul className="space-y-3">
                        {pattern.signs?.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex gap-3 items-start">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
