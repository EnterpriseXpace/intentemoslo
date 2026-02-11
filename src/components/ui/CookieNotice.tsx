"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieNotice() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if notice has been seen before
        const hasSeenNotice = localStorage.getItem("cookies_notice_seen");
        if (!hasSeenNotice) {
            setIsVisible(true);
        }

        const handleInteraction = () => {
            if (isVisible) {
                localStorage.setItem("cookies_notice_seen", "true");
                setIsVisible(false);
            }
        };

        // Add listeners for implicit acceptance
        window.addEventListener("scroll", handleInteraction, { once: true });
        window.addEventListener("click", handleInteraction, { once: true });

        return () => {
            window.removeEventListener("scroll", handleInteraction);
            window.removeEventListener("click", handleInteraction);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            "bg-background/90 backdrop-blur-md border-t border-border/50 shadow-lg",
            "p-4 md:py-3 transition-transform duration-500 ease-in-out translation-y-0"
        )}>
            <div className="container max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center text-center gap-3 md:gap-6 text-sm text-muted-foreground/90">
                <p className="leading-tight">
                    <span className="font-semibold text-foreground mr-1">Uso de cookies</span>
                    Utilizamos cookies técnicas y analíticas básicas para garantizar el funcionamiento del sitio y comprender su uso de forma agregada y anonimizada.
                    Al continuar navegando, aceptas su uso.
                </p>
                <Link
                    href="/politica-de-cookies"
                    className="text-xs font-medium text-primary hover:underline whitespace-nowrap"
                >
                    [Política de Cookies]
                </Link>
            </div>
        </div>
    );
}
