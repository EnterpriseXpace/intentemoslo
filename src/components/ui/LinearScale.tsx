import { cn } from "@/lib/utils";

interface LinearScaleProps {
    value: number; // 0 to 100
    className?: string;
}

export function LinearScale({ value, className }: LinearScaleProps) {
    // Ensure value is between 0 and 100
    const clampledValue = Math.min(100, Math.max(0, value));

    return (
        <div className={cn("w-full space-y-2", className)}>
            {/* Labels */}
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                <span className="text-rose-600">Riesgo</span>
                <span className="text-amber-600 pl-4">Alerta</span>
                <span className="text-emerald-600">Salud</span>
            </div>

            {/* Bar container */}
            <div className="relative h-6 w-full rounded-full bg-secondary overflow-visible">
                {/* Gradient Background */}
                <div
                    className="absolute inset-x-0 h-full rounded-full opacity-90"
                    style={{
                        background: "linear-gradient(90deg, #f43f5e 0%, #f59e0b 50%, #10b981 100%)"
                    }}
                />

                {/* Marker */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-lg z-10 transition-all duration-1000 ease-out flex items-center justify-center transform -translate-x-1/2"
                    style={{ left: `${clampledValue}%` }}
                >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
            </div>
        </div>
    );
}
