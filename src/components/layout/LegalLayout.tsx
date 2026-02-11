import { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

interface LegalLayoutProps {
    children: ReactNode;
    title: string;
    lastUpdated?: string;
}

export function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
    return (
        <div className="min-h-screen bg-brand-navy text-gray-300 font-sans selection:bg-primary/30 selection:text-white">
            {/* Minimal Header */}
            <header className="absolute top-0 w-full py-8 text-center bg-transparent z-10">
                <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                    <span className="font-serif text-xl font-bold tracking-tight text-white">
                        Intentémoslo de Nuevo
                    </span>
                </Link>
            </header>

            <main className="pt-32 pb-24">
                <Container className="max-w-3xl">
                    <article className="bg-[#131b2e] border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl">
                        <header className="mb-10 text-center border-b border-white/5 pb-8">
                            <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
                                {title}
                            </h1>
                            {lastUpdated && (
                                <p className="text-sm text-gray-500 font-medium">
                                    Última actualización: {lastUpdated}
                                </p>
                            )}
                        </header>

                        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-white prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white">
                            {children}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 text-center">
                            <Link href="/">
                                <span className="text-sm text-gray-500 hover:text-white transition-colors">
                                    ← Volver al inicio
                                </span>
                            </Link>
                        </div>
                    </article>
                </Container>
            </main>
        </div>
    );
}
