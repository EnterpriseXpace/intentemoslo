import * as React from "react"
import { cn } from "@/lib/utils"

interface RingChartProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number
    label: string
    subLabel?: string
    color?: string
    size?: number
    strokeWidth?: number
}

const RingChart = React.forwardRef<HTMLDivElement, RingChartProps>(
    ({ className, value, label, subLabel, color = "#a6f20d", size = 96, strokeWidth = 8, ...props }, ref) => {
        // radius = 40 is base for 96px size. 
        // We can keep SVG coordinate system fixed (0-96) and scale via CSS width/height
        const radius = 40
        const circumference = 2 * Math.PI * radius
        const offset = circumference - (value / 100) * circumference

        return (
            <div className={cn("flex flex-col items-center gap-4", className)} ref={ref} {...props}>
                <div className="relative" style={{ width: size, height: size }}>
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                        <circle
                            className="text-muted"
                            cx="48" cy="48"
                            fill="transparent"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                        />
                        <circle
                            cx="48" cy="48"
                            fill="transparent"
                            r={radius}
                            stroke={color}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            strokeWidth={strokeWidth}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ fontSize: size * 0.2 }}>
                        {value}%
                    </div>
                </div>
                <div className="text-center">
                    <h4 className="font-semibold text-lg">{label}</h4>
                    {subLabel && <p className="text-sm text-muted-foreground">{subLabel}</p>}
                </div>
            </div>
        )
    }
)
RingChart.displayName = "RingChart"

export { RingChart }
