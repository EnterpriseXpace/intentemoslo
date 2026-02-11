import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
}

const RadioCard = React.forwardRef<HTMLInputElement, RadioCardProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className={cn(
                "group text-base font-medium leading-normal flex items-center justify-start rounded-xl border border-[#e2e6db] bg-white px-6 h-16 text-[#2d3126] hover:border-[#a6f20d] hover:bg-[#a6f20d]/5 has-[:checked]:border-[#a6f20d] has-[:checked]:bg-[#a6f20d]/10 has-[:checked]:border-2 relative cursor-pointer transition-all shadow-sm",
                className
            )}>
                {label}
                <input
                    ref={ref}
                    type="radio"
                    className="invisible absolute"
                    {...props}
                />
            </label>
        )
    }
)
RadioCard.displayName = "RadioCard"

export { RadioCard }
