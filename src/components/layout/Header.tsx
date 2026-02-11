import Link from "next/link"
import Image from "next/image"
import { Logo } from "@/components/ui/Logo"
import { Container } from "@/components/layout/Container"

export function Header() {
    return (
        <header className="border-b border-solid border-b-[#f0efe9] bg-[#faf9f6]">
            <Container>
                <div className="flex items-center justify-between py-5 md:py-6">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Logo variant="color" className="h-10 md:h-12 w-auto" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end gap-6 md:gap-8 items-center">
                        <nav className="hidden md:flex items-center gap-6 md:gap-9">
                            <Link className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors" href="/">Inicio</Link>
                            <Link className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors" href="/#que-es">Qué es este diagnóstico</Link>
                            <Link className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors" href="/#productos">Qué incluye</Link>
                            <Link className="text-[#2d3126] text-sm font-medium leading-normal hover:text-[#a6f20d] transition-colors" href="/#para-quien">Para quién es</Link>
                        </nav>
                        <Link href="/checklist">
                            <button className="bg-[#a6f20d] hover:bg-[#95da0b] text-[#161811] text-sm font-semibold py-3 px-6 rounded-full transition-colors shadow-sm hover:shadow-md">
                                Comenzar diagnóstico
                            </button>
                        </Link>
                    </div>
                </div>
            </Container>
        </header>
    )
}
