import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    variant?: "white" | "color";
}

export function Logo({ className, variant = "white" }: LogoProps) {
    const src = variant === "color" ? "/logo-new (V2).webp" : "/logo/logo-white.webp";

    return (
        <img
            src={src}
            alt="Intentémoslo de Nuevo"
            className={cn("h-8 w-auto object-contain", className)}
        />
    );
}
