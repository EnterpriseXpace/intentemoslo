"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/Logo"
import { Container } from "@/components/layout/Container"

const NAV_LINKS = [
    { href: "/", label: "Inicio" },
    { href: "/#que-es", label: "Qué es este diagnóstico" },
    { href: "/#productos", label: "Qué incluye" },
    { href: "/#para-quien", label: "Para quién es" },
    { href: "/herramientas", label: "Herramientas" },
    { href: "/blog", label: "Blog" },
]


export function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Cerrar menú al hacer scroll
    useEffect(() => {
        if (scrolled && menuOpen) setMenuOpen(false)
    }, [scrolled, menuOpen])

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent overflow-hidden",
                    scrolled
                        ? "bg-white/80 backdrop-blur-md shadow-sm border-stone-200/50 py-2"
                        : "bg-[#faf9f6] py-4 border-[#f0efe9]"
                )}
            >
                <Container className="px-4 md:px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Logo variant="color" className="h-10 md:h-12 w-auto" />
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <nav className="flex items-center gap-6 lg:gap-9">
                                {NAV_LINKS.map((link) => (
                                    <Link key={link.href} href={link.href}>
                                        <span className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors cursor-pointer">
                                            {link.label}
                                        </span>
                                    </Link>
                                ))}
                            </nav>
                            <Link href="/checklist">
                                <button className="bg-[#a6f20d] hover:bg-[#95da0b] text-[#161811] text-sm py-3 px-6 font-semibold rounded-full transition-colors shadow-sm hover:shadow-md">
                                    Comenzar diagnóstico
                                </button>
                            </Link>
                        </div>

                        {/* Mobile: CTA + hamburguesa */}
                        <div className="flex md:hidden items-center gap-3">
                            <Link href="/checklist">
                                <button className="bg-[#a6f20d] hover:bg-[#95da0b] text-[#161811] text-xs py-2 px-4 font-semibold rounded-full transition-colors shadow-sm">
                                    Comenzar diagnóstico
                                </button>
                            </Link>

                            {/* Botón hamburguesa */}
                            <button
                                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="p-2 rounded-lg text-[#2d3126] hover:bg-black/5 transition-colors"
                            >
                                {menuOpen ? (
                                    /* X */
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                        <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    /* ☰ */
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                        <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </Container>
            </header>

            {/* Drawer mobile */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-40 flex flex-col"
                    onClick={() => setMenuOpen(false)}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

                    {/* Panel */}
                    <nav
                        className="relative mt-[64px] mx-4 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Menú de navegación"
                    >
                        {NAV_LINKS.map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    "flex items-center px-5 py-4 text-sm font-medium text-[#2d3126] hover:text-[#a6f20d] hover:bg-[#a6f20d]/5 transition-colors",
                                    i < NAV_LINKS.length - 1 && "border-b border-stone-100"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </>
    )
}
