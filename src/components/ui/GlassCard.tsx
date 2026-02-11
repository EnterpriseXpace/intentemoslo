import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> { }

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl p-8 backdrop-blur-[10px]",
                    className
                )}
                style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(168, 214, 114, 0.2)'
                }}
                {...props}
            />
        )
    }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
