"use client"

import { Container } from "@/components/layout/Container"

export function ResultFAQ() {
    const questions = [
        {
            q: "¿Qué es el modelo RAS (Relationship Assessment Scale)?",
            a: "El diagnóstico se basa principalmente en la Relationship Assessment Scale (RAS), una escala de evaluación relacional validada académicamente y ampliamente utilizada para medir la calidad percibida de una relación. La RAS forma parte de un conjunto más amplio de instrumentos conocidos como Quality of Relationship Scales, que evalúan dimensiones como satisfacción, confianza, vínculo y estabilidad relacional. En este diagnóstico, estas escalas han sido adaptadas para orientación digital, con el objetivo de ofrecer una lectura estructurada y comprensible del estado actual de la relación. No buscan etiquetar ni emitir juicios clínicos, sino facilitar claridad y apoyar la toma de decisiones personales."
        }
    ]

    return (
        <section className="print:break-inside-avoid py-8">
            <h3 className="text-xl font-bold font-display mb-6">Preguntas Recurrentes</h3>
            <div className="space-y-3">
                {questions.map((item, i) => (
                    <details key={i} className="group bg-white/50 rounded-xl border border-border/50 overflow-hidden open:shadow-sm transition-all duration-300 open:pb-2">
                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-foreground/80 font-medium hover:text-primary transition-colors [&::-webkit-details-marker]:hidden">
                            <span className="text-base">{item.q}</span>
                            <span className="transform transition-transform duration-300 group-open:rotate-180 text-primary/60 group-hover:text-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </span>
                        </summary>
                        <div className="px-4 pb-4 text-muted-foreground leading-relaxed text-sm border-t border-transparent group-open:border-primary/5 pt-2 animate-in slide-in-from-top-2 duration-300">
                            {item.a}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    )
}
