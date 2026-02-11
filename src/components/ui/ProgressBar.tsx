import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, value, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("rounded bg-[#e8e7df] h-2.5 overflow-hidden", className)}
                {...props}
            >
                <div
                    className="h-full rounded bg-[#a6f20d]"
                    style={{ width: `${value}%` }}
                />
            </div>
        )
    }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
