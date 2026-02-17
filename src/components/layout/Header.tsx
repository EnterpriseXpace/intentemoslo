"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

import { Logo } from "@/components/ui/Logo"
import { Container } from "@/components/layout/Container"

export function Header() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-stone-200/50 py-2" : "bg-[#faf9f6] py-4 border-[#f0efe9]"
            )}
        >
            <Container>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Logo variant="color" className="h-10 md:h-12 w-auto" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end gap-6 md:gap-8 items-center">
                        <nav className="hidden md:flex items-center gap-6 md:gap-9">
                            <Link href="/">
                                <span className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors cursor-pointer">
                                    Inicio
                                </span>
                            </Link>
                            <Link href="/#que-es">
                                <span className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors cursor-pointer">
                                    Qué es este diagnóstico
                                </span>
                            </Link>
                            <Link href="/#productos">
                                <span className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors cursor-pointer">
                                    Qué incluye
                                </span>
                            </Link>
                            <Link href="/#para-quien">
                                <span className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors cursor-pointer">
                                    Para quién es
                                </span>
                            </Link>
                        </nav>
                        <Link href="/checklist">
                            <button className="bg-[#a6f20d] hover:bg-[#95da0b] text-[#161811] text-xs py-2 px-4 md:text-sm md:py-3 md:px-6 font-semibold rounded-full transition-colors shadow-sm hover:shadow-md">
                                Comenzar diagnóstico
                            </button>
                        </Link>
                    </div>
                </div>
            </Container>
        </header>
    )
}
