import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'outline'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "flex cursor-pointer items-center justify-center overflow-hidden transition-colors",
                    variant === 'primary' && "min-w-[140px] rounded-xl h-12 px-6 bg-[#a6f20d] text-[#161811] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#95da0b]",
                    variant === 'ghost' && "text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d]",
                    variant === 'outline' && "border-2 border-primary/20 bg-transparent text-foreground hover:border-primary hover:bg-primary/5",
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
