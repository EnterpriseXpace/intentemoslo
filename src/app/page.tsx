import { Header } from "@/components/layout/Header";
import Image from "next/image";


import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Brain, Compass, Search, Scale, Map, FileText, BookOpen, Eye, Shield } from "lucide-react";
import { SessionTracker } from "@/components/SessionTracker";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";

export default function Home() {


    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SessionTracker />
            <Header />

            <main className="flex-1">
                {/* HERO SECTION - Background: Light */}
                <section className="pt-24 pb-20 md:pt-32 md:pb-24 px-4 overflow-hidden bg-background relative">
                    <Container className="relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                            {/* Left Column: Text */}
                            <div className="text-left space-y-8 max-w-2xl">
                                <h1 className="text-5xl md:text-7xl leading-[1.1] font-display tracking-tight text-foreground">
                                    <span className="font-bold block">Entiende tu relación</span>
                                    <span className="font-normal block text-foreground/80">sin ruido,</span>
                                    <span className="font-normal block text-primary">sin presión.</span>
                                </h1>

                                <div className="space-y-2">
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        Un diagnóstico relacional basado en ciencia para saber dónde estás antes de decidir.
                                    </p>
                                    <p className="text-sm text-muted-foreground/60 font-medium">
                                        Basado en modelos psicológicos validados.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-base text-muted-foreground font-medium">
                                        No es terapia. No hay juicios. Solo claridad.
                                    </p>

                                    <div className="flex flex-col items-start gap-3">
                                        <Link href="/checklist">
                                            <Button className="text-lg px-8 py-6 h-auto rounded-full text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                                Comenzar diagnóstico
                                            </Button>
                                        </Link>
                                        <span className="text-xs text-muted-foreground/70 ml-2">
                                            Anónimo · Sin juicios · 5–10 minutos
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Image */}
                            <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden bg-secondary/20">
                                <Image
                                    src="/header-image.jpg"
                                    alt="Momento de calma e introspección"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover object-center opacity-90 hover:opacity-100 transition-opacity duration-700"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAIxAAAQMEAgMBAAAAAAAAAAAAAQIDBAAFEiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqWnQ9VuV5d2oWL+XJCVqU4w62oLCgcFKScEGrOlaTrVy0OJuUiYmW0y2VNltCkLQkDOFJO4n3xVc5aRHuLCvVCWipHiD2Hkcef/Z"
                                />
                            </div>

                        </div>
                    </Container>
                </section>

                {/* IDENTIFICATION SECTION - Background: Soft Green */}
                <section id="para-quien" className="py-24 md:py-32 bg-secondary/40">
                    <Container>
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-2xl md:text-3xl font-bold font-display mb-12 text-foreground/90">
                                Este diagnóstico tiene sentido para ti si...
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: Brain, text: "Sientes que algo no está bien, pero no sabes ponerle nombre. No es una crisis evidente, pero tampoco te sientes en paz." },
                                    { icon: Compass, text: "Das vueltas a las mismas preguntas y sigues sin claridad. Te preguntas si insistir, cambiar algo o aceptar que así es." },
                                    { icon: Search, text: "Quieres entender la relación sin buscar culpables. No quieres pelear ni justificarte, solo entender qué está pasando." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 flex flex-col items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="p-3 rounded-full bg-primary/10 text-primary/80">
                                            <item.icon className="w-9 h-9" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-muted-foreground font-medium text-lg leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Container>
                </section>

                {/* HOW IT WORKS / ANTIDOTE - Background: Light */}
                {/* HOW IT WORKS / ANTIDOTE - Background: Light */}
                <section className="pt-28 pb-24 md:pt-36 md:pb-32 bg-background">
                    <Container>
                        {/* Section Header - Centered with same max-w as grid */}
                        <div className="mb-10 max-w-6xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Claridad, no presión</h2>
                            <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">Lo diseñamos para ayudarte a entender, no para empujarte a decidir.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                            {/* Card 1: No hay juicios - Featured/Distinct */}
                            <div className="md:col-span-1 bg-primary/[0.03] border border-primary/10 p-8 rounded-3xl flex flex-col justify-start text-left relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-primary mb-6 shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                    <Eye className="w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">No hay juicios</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Aquí no hay culpables ni etiquetas. Solo observamos dinámicas reales para que entiendas qué está pasando.
                                </p>
                            </div>

                            {/* Card 2: No es terapia */}
                            <div className="md:col-span-1 bg-white border border-border/60 p-8 rounded-3xl flex flex-col justify-start text-left hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center text-foreground/70 mb-6 shrink-0">
                                    <Shield className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">No es terapia</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    No reemplaza un proceso clínico ni pretende hacerlo. Si detectamos algo que requiere apoyo profesional, lo diremos con honestidad.
                                </p>
                            </div>

                            {/* Card 3: No te decimos qué hacer */}
                            <div className="md:col-span-1 bg-white border border-border/60 p-8 rounded-3xl flex flex-col justify-start text-left hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center text-foreground/70 mb-6 shrink-0">
                                    <Map className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">No te decimos qué hacer</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    No te empujamos a quedarte ni a irte. Te damos claridad. La decisión siempre es tuya.
                                </p>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* LEAD MAGNET SECTION - High Conversion Zone */}
                <section className="py-20 bg-background relative z-10">
                    <Container>
                        <LeadMagnetBlock source="landing" />
                    </Container>
                </section>

                {/* PRODUCTS SECTION - Background: Soft Green */}
                <section id="productos" className="py-24 md:py-32 bg-secondary/40">
                    <Container>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-display mb-4">Elige tu nivel de profundidad</h2>
                            <p className="text-muted-foreground">Dos formas de obtener claridad, adaptadas a lo que necesitas ahora.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Quick Product */}
                            <GlassCard className="hover:-translate-y-2 transition-all duration-300 flex flex-col border-primary/10 shadow-sm relative overflow-hidden bg-white/60">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                </div>
                                <div className="mb-8 flex-1 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                            Claridad Inmediata
                                        </span>
                                        <div className="text-right">
                                            <span className="block text-2xl font-bold font-display text-foreground">$5 USD</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-foreground mb-2 font-display">
                                        Diagnóstico Rápido
                                    </h3>

                                    {/* Guía Visual */}
                                    <div className="mb-4 pb-4 border-b border-dashed border-primary/20">
                                        <p className="text-sm font-medium text-foreground/60 italic">
                                            "Necesito saber dónde estoy hoy."
                                        </p>
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        Una lectura clara y directa del estado actual de tu relación basada en el modelo estructural RAS.
                                    </p>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center gap-2 text-sm text-foreground/80">
                                            <span className="text-primary">✓</span> Resultado inmediato (2 min)
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-foreground/80">
                                            <span className="text-primary">✓</span> Índice de Estabilidad (0-100)
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-foreground/80">
                                            <span className="text-primary">✓</span> Semáforo relacional
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-4 mt-auto z-10">
                                    <Link href="/checklist">
                                        <Button className="w-full text-lg h-12 rounded-xl">
                                            Calcular mi Temperatura
                                        </Button>
                                    </Link>
                                </div>
                            </GlassCard>

                            {/* Deep Product */}
                            <GlassCard className="hover:-translate-y-2 transition-all duration-300 flex flex-col border-primary/30 shadow-md relative overflow-hidden bg-white ring-1 ring-primary/20">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12h20M2 12l10-10M2 12l10 10" /></svg>
                                </div>
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8CC63F]"></div>
                                <div className="mb-8 flex-1 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 rounded-full bg-[#8CC63F] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                                            Recomendado
                                        </span>
                                        <div className="text-right">
                                            <span className="block text-2xl font-bold font-display text-foreground">$27 USD</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-foreground mb-2 font-display">
                                        Evaluación Profunda
                                    </h3>

                                    {/* Guía Visual */}
                                    <div className="mb-4 pb-4 border-b border-dashed border-primary/20">
                                        <p className="text-sm font-medium text-foreground/60 italic">
                                            "Necesito entender la raíz y decidir."
                                        </p>
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        Análisis estructural completo de 5 dimensiones para identificar el patrón dominante y trazar una hoja de ruta.
                                    </p>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center gap-2 text-sm text-foreground/80">
                                            <span className="text-primary font-bold">✓</span> Análisis de 5 Dimensiones
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-foreground/80">
                                            <span className="text-primary font-bold">✓</span> Identificación de Patrón Dominante
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-foreground/80">
                                            <span className="text-primary font-bold">✓</span> Hoja de ruta estratégica
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-4 mt-auto z-10">
                                    <Link href="/checklist/deep">
                                        <Button className="w-full text-lg h-12 rounded-xl bg-[#8CC63F] hover:bg-[#7AB32E] text-white font-bold shadow-lg shadow-green-900/10">
                                            Acceder a Evaluación Completa
                                        </Button>
                                    </Link>
                                </div>
                            </GlassCard>
                        </div>
                    </Container>
                </section>

                {/* SOCIAL PROOF SECTION - Background: Dark Navy */}
                <section className="py-24 md:py-32 bg-[#0B1120] text-white overflow-hidden">
                    <Container>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-display text-white mb-4">Personas que buscan claridad, no juicios</h2>
                            <p className="text-white/60">Historias de quienes decidieron mirar antes de saltar.</p>
                        </div>

                        {/* Infinite Slider */}
                        <div className="relative w-full mask-linear-gradient">
                            <div className="flex w-full overflow-hidden mask-fade-sides group">
                                <div className="flex animate-loop-scroll space-x-8 group-hover:paused w-max">
                                    {[
                                        "No sabía si exageraba o no. El diagnóstico me ayudó a ordenar mis ideas y ver qué era real.",
                                        "No me dijo qué hacer, pero me ayudó a ver lo que estaba pasando realmente en mi relación.",
                                        "Me dio la validación que necesitaba para confiar en mi instinto.",
                                        "Claridad absoluta. Pude ver los patrones que se repetían sin darme cuenta.",
                                        "Es diferente a un test de revista. Se siente científico y serio."
                                    ].map((quote, i) => (
                                        <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10 w-[350px] md:w-[450px] shrink-0">
                                            <div className="mb-6 text-primary opacity-60">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01662 21L5.01662 18C5.01662 16.8954 5.91205 16 7.01662 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.01662C5.46434 8 5.01662 8.44772 5.01662 9V11C5.01662 11.5523 4.56891 12 4.01662 12H3.01662V5H13.0166V15C13.0166 18.3137 10.3303 21 7.01662 21H5.01662Z" /></svg>
                                            </div>
                                            <p className="text-lg leading-relaxed italic opacity-90 font-serif min-h-[80px]">"{quote}"</p>
                                            <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-6 opacity-60">
                                                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                                <span className="text-sm font-medium">Usuario verificado</span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Duplicated for infinite loop */}
                                    {[
                                        "No sabía si exageraba o no. El diagnóstico me ayudó a ordenar mis ideas y ver qué era real.",
                                        "No me dijo qué hacer, pero me ayudó a ver lo que estaba pasando realmente en mi relación.",
                                        "Me dio la validación que necesitaba para confiar en mi instinto.",
                                        "Claridad absoluta. Pude ver los patrones que se repetían sin darme cuenta.",
                                        "Es diferente a un test de revista. Se siente científico y serio."
                                    ].map((quote, i) => (
                                        <div key={`dup-${i}`} className="bg-white/5 p-8 rounded-2xl border border-white/10 w-[350px] md:w-[450px] shrink-0" aria-hidden="true">
                                            <div className="mb-6 text-primary opacity-60">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01662 21L5.01662 18C5.01662 16.8954 5.91205 16 7.01662 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.01662C5.46434 8 5.01662 8.44772 5.01662 9V11C5.01662 11.5523 4.56891 12 4.01662 12H3.01662V5H13.0166V15C13.0166 18.3137 10.3303 21 7.01662 21H5.01662Z" /></svg>
                                            </div>
                                            <p className="text-lg leading-relaxed italic opacity-90 font-serif min-h-[80px]">"{quote}"</p>
                                            <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-6 opacity-60">
                                                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                                <span className="text-sm font-medium">Usuario verificado</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* BENEFITS / SCIENCE SECTION - Background: Light */}
                {/* BENEFITS / SCIENCE SECTION - Background: Light */}
                <section className="py-20 md:py-28 bg-background">
                    <Container>
                        <div className="max-w-6xl mx-auto space-y-20 md:space-y-32">

                            {/* ROW 1: Definition + Mockup */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                                {/* Left Column: Definition */}
                                <div id="que-es" className="order-1 bg-primary/5 rounded-3xl p-8 md:p-10 text-left border-l-4 border-primary/20 max-w-[540px] scroll-mt-32">
                                    <h3 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-6">
                                        ¿Qué es este diagnóstico?
                                    </h3>
                                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                        <p>
                                            Este diagnóstico es una herramienta digital de claridad relacional.
                                        </p>
                                        <p>
                                            A través de preguntas estructuradas y modelos psicológicos validados, te ayuda a entender el estado actual de tu relación, identificar patrones relevantes y ponerle nombre a lo que estás viviendo, sin juicios y sin presión para tomar una decisión inmediata.
                                        </p>
                                        <div className="pt-6 border-t border-primary/10 w-24 mr-auto"></div>
                                        <p className="text-base font-medium text-foreground/80 italic">
                                            No te dice qué hacer ni te empuja a quedarte o irte. <br className="hidden md:block" />
                                            Te ofrece información clara para que decidas con más conciencia.
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Mockup */}
                                <div className="order-2 flex flex-col justify-center items-center relative">
                                    {/* Visual Anchor - Abstract Background */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 pointer-events-none flex justify-center items-center">
                                        <div className="absolute w-[380px] h-[380px] bg-primary/10 rounded-full blur-3xl translate-y-8"></div>
                                        <div className="absolute w-[320px] h-[320px] bg-secondary/40 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
                                    </div>

                                    {/* Mockup Container */}
                                    <div className="relative aspect-[9/16] w-full max-w-[280px]">
                                        {/* Grounding Shadow */}
                                        <div className="absolute bottom-2 left-6 right-6 h-6 bg-black/10 blur-xl rounded-[100%] translate-y-2 -z-10"></div>

                                        <img
                                            src="/Mockup Celular2.webp"
                                            alt="Vista previa del diagnóstico en móvil mostrando preguntas claras y diseño amigable"
                                            className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
                                        />
                                    </div>

                                    {/* Editorial Caption */}
                                    <div className="mt-8 text-center max-w-[280px] space-y-2 relative z-10">
                                        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                                            Así empieza el diagnóstico
                                        </p>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium opacity-80">
                                            7 preguntas breves para entender el estado actual de tu relación.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ROW 2: Differentiation + Models */}
                            <div id="diferente" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center scroll-mt-32">
                                {/* Left Column: Differentiation Points */}
                                <div className="space-y-8">
                                    <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground text-center lg:text-left">Por qué este diagnóstico es diferente</h2>
                                    <div className="space-y-6">
                                        {[
                                            { icon: "ciencia", title: "Ciencia, no opiniones", desc: "Basado en modelos psicológicos validados (RAS, Quality of Relationship Scales)." },
                                            { icon: "privacidad", title: "100% Privado y Anónimo", desc: "Tus respuestas son tuyas. No compartimos datos con nadie. Tú decides si lo compartes." },
                                            { icon: "control", title: "Tú tienes el control", desc: 'Sin presión para "arreglarlo" ni para "romper". Solo información clara para tu decisión.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-5 items-start">
                                                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shrink-0 shadow-sm mt-1">
                                                    {item.icon === "ciencia" && <svg className="w-7 h-7 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                                    {item.icon === "privacidad" && <svg className="w-7 h-7 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                                                    {item.icon === "control" && <svg className="w-7 h-7 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl mb-2 text-foreground">{item.title}</h3>
                                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Models Card - Low Visual Weight */}
                                <div className="bg-secondary/5 rounded-3xl p-6 md:p-8 border border-border/20 relative overflow-hidden shadow-sm transition-shadow opacity-90 hover:opacity-100">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] text-foreground">
                                        <BookOpen className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10 space-y-3">
                                        <div className="flex items-center gap-3 mb-1 opacity-60">
                                            <div className="p-1.5 bg-secondary/30 rounded-md text-foreground/70">
                                                <BookOpen className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-medium text-base uppercase tracking-wider">Modelos utilizados</h3>
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed text-sm">
                                            Este diagnóstico se apoya en modelos psicológicos validados como la <span className="font-medium text-foreground/70">Relationship Assessment Scale (RAS)</span> y las <span className="font-medium text-foreground/70">Quality of Relationship Scales</span>, ampliamente utilizados en investigación para evaluar la satisfacción y dinámica de las relaciones.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Container>
                </section>

                {/* FAQ SECTION - Background: Soft Green */}
                {/* FAQ SECTION - Background: Soft Green */}
                <section className="py-24 bg-secondary/30">
                    <Container>
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
                                    Preguntas frecuentes
                                </h2>
                                <p className="text-lg text-muted-foreground/80 font-medium">
                                    Respuestas claras antes de empezar.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        q: "¿Esto es terapia?",
                                        a: "No. Esto no es terapia, no la reemplaza ni intenta tratar nada. Es una herramienta de orientación para darte claridad sobre tu situación actual."
                                    },
                                    {
                                        q: "¿Para qué sirve realmente este diagnóstico?",
                                        a: "Sirve para ponerle palabras a lo que estás viviendo, identificar patrones y entender el estado actual de la relación, sin decirte qué hacer."
                                    },
                                    {
                                        q: "¿Qué es el modelo RAS (Relationship Assessment Scale)?",
                                        a: "El diagnóstico se basa principalmente en la Relationship Assessment Scale (RAS), una escala de evaluación relacional validada académicamente y ampliamente utilizada para medir la calidad percibida de una relación. La RAS forma parte de un conjunto más amplio de instrumentos conocidos como Quality of Relationship Scales, que evalúan dimensiones como satisfacción, confianza, vínculo y estabilidad relacional. En este diagnóstico, estas escalas han sido adaptadas para orientación digital, con el objetivo de ofrecer una lectura estructurada y comprensible del estado actual de la relación. No buscan etiquetar ni emitir juicios clínicos, sino facilitar claridad y apoyar la toma de decisiones personales."
                                    },
                                    {
                                        q: "¿Qué tipo de análisis voy a recibir?",
                                        a: "Recibirás un análisis estructurado y fácil de leer (no solo números), donde verás las dimensiones clave de tu relación, patrones de comportamiento y áreas de tensión o estabilidad."
                                    },
                                    {
                                        q: "¿Sirve incluso si estoy confundido/a o no sé qué siento?",
                                        a: "Sí. De hecho, la confusión es el punto de partida más común. Esta herramienta está diseñada específicamente para ese momento en el que no sabes qué sientes exactamente."
                                    },
                                    {
                                        q: "¿Esto me va a decir si debo quedarme o terminar?",
                                        a: "No. No damos instrucciones, veredictos ni presionamos hacia ninguna dirección. Nuestro objetivo es darte la claridad necesaria para que tú decidas."
                                    },
                                    {
                                        q: "¿Mis respuestas son privadas?",
                                        a: "Totalmente. Tus respuestas son 100% privadas y anónimas. No compartimos tus datos con nadie y el reporte es solo para tus ojos."
                                    },
                                    {
                                        q: "¿Cuánto tiempo toma?",
                                        a: "Menos de 2 minutos. Es directo y al grano."
                                    },
                                    {
                                        q: "¿Para quién NO es este diagnóstico?",
                                        a: "No es para quien busca terapia clínica, mediación de pareja o para quien espera que una herramienta tome la decisión por ellos."
                                    }
                                ].map((item, i) => (
                                    <details key={i} className="group bg-white rounded-xl border border-primary/5 overflow-hidden open:shadow-sm transition-all duration-300 open:pb-2">
                                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-foreground/80 font-medium hover:text-primary transition-colors [&::-webkit-details-marker]:hidden">
                                            <span className="text-lg">{item.q}</span>
                                            <span className="transform transition-transform duration-300 group-open:rotate-180 text-primary/60 group-hover:text-primary">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed text-base border-t border-transparent group-open:border-primary/5 pt-2 animate-in slide-in-from-top-2 duration-300">
                                            {item.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </Container>
                </section>

                {/* FINAL CTA - Background: Light */}
                <section className="py-32 text-center px-4 bg-background">
                    <Container className="flex flex-col items-center">
                        <h2 className="text-4xl md:text-5xl font-bold font-display mb-8">
                            No es una decisión. <br />
                            Es claridad antes de decidir.
                        </h2>
                        <Link href="/checklist">
                            <Button className="text-lg px-10 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                Comenzar diagnóstico hoy
                            </Button>
                        </Link>
                    </Container>
                </section>
            </main>

            {/* Footer removed from here, moving to global layout */}
            {/* <Footer /> */}
        </div>
    );
}
