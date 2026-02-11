"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/ui/Logo";
import { Instagram, Youtube, Music } from "lucide-react";
import { FooterSubscribeForm } from "@/components/layout/FooterSubscribeForm";

export function Footer() {
    const pathname = usePathname();

    // Visibility Logic: Hide on Checklist, Results, and Legal pages
    // Using startsWith for defensive route matching
    if (
        pathname?.startsWith("/checklist") ||
        pathname?.startsWith("/result") ||
        pathname?.startsWith("/terminos-y-condiciones") ||
        pathname?.startsWith("/politica-de-privacidad") ||
        pathname?.startsWith("/politica-de-cookies")
    ) {
        return null;
    }

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-navy border-t border-white/5 py-16 text-white">
            <Container>
                {/* Subscription Block (Simple Version) */}
                <div className="mb-16">
                    <div className="bg-brand-navy-light/10 border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                            <div className="max-w-xl space-y-2 text-center md:text-left">
                                <h3 className="text-2xl font-bold font-display text-white">
                                    Recibe reflexiones sobre claridad relacional
                                </h3>
                                <p className="text-gray-400">
                                    Ideas breves y herramientas prácticas para comprender mejor tu vínculo.
                                </p>
                            </div>
                            <div className="w-full md:w-auto min-w-[300px]">
                                {/* Using a simplified custom form here or reusing valid parts, 
                                    but since SubscribeBlock has white bg hardcoded, we might want to 
                                    pass a prop or just inline a simple form here to match footer dark theme.
                                    Actually, reusing logic is better. Let's see if we can adapt SubscribeBlock.
                                    If not, I'll implement a simple form here using the same API.
                                    To keep it DRY, I'll use SubscribeBlock but with a className override?
                                    My SubscribeBlock has `bg-white` and text colors hardcoded.
                                    Refactoring SubscribeBlock to support 'dark' mode or 'transparent' mode 
                                    would be ideal.
                                    Let's use a wrapper for now or a simple form inline to save time and ensuring style match.
                                    Wait, the instruction says "And optionally in footer (simple version)".
                                    Let's try to use SubscribeBlock but wrapped or modified.
                                    Actually, I'll just inline a simple form here that calls the same API. 
                                    It's cleaner for styling than hacking the other component. 
                                */}
                                <FooterSubscribeForm />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Column 1: Brand */}
                    <div className="flex flex-col gap-2">
                        <Link href="/" className="flex items-center gap-2 -mt-9">
                            {/* Using text logo for sobriety as requested, or placeholder if image preferred. 
                                 Plan said "Logo (Text or Image)". Converting to text based solely 
                                 on "Estilo sobrio, monocromático" and ensuring high contrast on dark bg. 
                                 If logo image files are dark-unfriendly, text is safer. 
                                 Will use text for now to ensure visibility on dark navy. */}
                            <Logo className="h-16 w-auto text-white/90 opacity-90" />
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            © {currentYear} Intentémoslo de Nuevo<br />
                            Todos los derechos reservados
                        </p>
                    </div>

                    {/* Column 2: Product */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Producto</h3>
                        <nav className="flex flex-col gap-3 text-sm text-gray-400">
                            <Link href="/checklist" className="hover:text-primary transition-colors">
                                Comenzar diagnóstico
                            </Link>
                            <Link href="/#que-es" className="hover:text-primary transition-colors">
                                Qué es este diagnóstico
                            </Link>
                            <Link href="/#productos" className="hover:text-primary transition-colors">
                                Qué incluye
                            </Link>
                            <Link href="/#para-quien" className="hover:text-primary transition-colors">
                                Para quién es
                            </Link>
                        </nav>
                    </div>

                    {/* Column 3: Connect */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Conectar</h3>
                        <nav className="flex flex-col gap-3 text-sm text-gray-400">
                            <a
                                href="https://instagram.com/intentemos_de_nuevo_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                                <Instagram className="w-4 h-4" />
                                <span>Instagram</span>
                            </a>
                            <a
                                href="https://www.youtube.com/@Intent%C3%A9moslodeNuevo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                                <Youtube className="w-4 h-4" />
                                <span>YouTube</span>
                            </a>
                            <a
                                href="https://www.tiktok.com/@intentemoslo_de_nuevo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                                <Music className="w-4 h-4" />
                                <span>TikTok</span>
                            </a>
                        </nav>
                    </div>

                    {/* Column 4: Legal & Support */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Legal</h3>
                        <nav className="flex flex-col gap-3 text-sm text-gray-400">
                            <Link href="/terminos-y-condiciones" className="hover:text-primary transition-colors">
                                Términos y Condiciones
                            </Link>
                            <Link href="/politica-de-privacidad" className="hover:text-primary transition-colors">
                                Política de Privacidad
                            </Link>
                            <Link href="/politica-de-cookies" className="hover:text-primary transition-colors">
                                Política de Cookies
                            </Link>
                            <div className="pt-4 mt-2 border-t border-white/5">
                                <a
                                    href="https://tally.so/r/OD5XXY"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white font-medium hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    Contáctanos
                                </a>
                            </div>
                        </nav>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
