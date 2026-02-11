import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Container({ className, ...props }: ContainerProps) {
    return (
        <div
            className={cn("mx-auto max-w-7xl px-6", className)}
            {...props}
        />
    )
}
