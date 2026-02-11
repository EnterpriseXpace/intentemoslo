import { getKPIs, getFunnelData, getRetentionMetrics, getProductPerformance, getLocationMetrics, Period } from "@/lib/analytics";
import Link from "next/link";
import { ArrowRight, BarChart3, Users, Activity, CreditCard, MapPin, Globe } from "lucide-react";
import { DateFilter } from "./DateFilter";

export const dynamic = 'force-dynamic';

export default async function FounderDashboard({ searchParams }: { searchParams: { period?: string } }) {
    const period = (searchParams.period as Period) || 'all';

    const [kpis, funnel, retention, prodPerf, location] = await Promise.all([
        getKPIs(), // KPIs are currently total/7d fixed, but we can pass period if updated
        getFunnelData(),
        getRetentionMetrics(period),
        getProductPerformance(period),
        getLocationMetrics(period)
    ]);

    const periodLabel = period === '7d' ? 'Últimos 7 días' : period === '30d' ? 'Últimos 30 días' : 'Total histórico';

    return (
        <div className="min-h-screen bg-[#FDFDF9] text-stone-800 font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-100">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-500 text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-[#a6f20d] animate-pulse"></span>
                            Live Data
                        </div>
                        <h1 className="text-4xl font-bold font-display text-stone-900 tracking-tight">
                            Tablero de Decisiones
                        </h1>
                        <p className="text-stone-500 text-sm max-w-2xl leading-relaxed">
                            Una visión humana de tu negocio. Entiende quiénes te compran y dónde se pierden.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <DateFilter />
                        <Link href="/admin/events">
                            <button className="text-xs font-medium text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors">
                                Ver Event Log (Debug) <ArrowRight className="w-3 h-3" />
                            </button>
                        </Link>
                    </div>
                </header>

                {/* LAYER 1: Estado General (Termómetro) */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-stone-400" />
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Estado General ({periodLabel})</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KPICard
                            label="Iniciados"
                            value={kpis.started.total}
                            subvalue="Sesiones totales"
                            icon={<Users className="w-4 h-4" />}
                        />
                        <KPICard
                            label="Completados"
                            value={kpis.completed.total}
                            subvalue={`${kpis.completed.rate}% terminaron`}
                            icon={<BarChart3 className="w-4 h-4" />}
                        />
                        <KPICard
                            label="Ventas"
                            value={kpis.paid.total}
                            subvalue={`${kpis.paid.conversionRate}% conversión`}
                            icon={<CreditCard className="w-4 h-4" />}
                            highlight
                        />
                        <KPICard
                            label="Tasa de Cierre"
                            value={`${kpis.paid.conversionRate}%`}
                            subvalue="De inicio a pago"
                            textSize="text-2xl"
                        />
                    </div>
                </section>

                {/* LAYER 2: Personas Reales (The Core Story) */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-stone-400" />
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Personas Reales</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Block A: Paid vs Not Paid (The Hero Chart) */}
                        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between min-h-[300px]">
                            <div>
                                <h4 className="text-lg font-bold text-stone-900 mb-1">Personas que completaron</h4>
                                <p className="text-sm text-stone-500 mb-8 max-w-xs">
                                    De los que invirtieron tiempo en responder todo el test, ¿cuántos dieron el paso final?
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                                {/* Large Donut */}
                                <div className="relative w-40 h-40 flex-shrink-0">
                                    <div
                                        className="w-full h-full rounded-full"
                                        style={{
                                            background: `conic-gradient(#a6f20d ${Math.round((retention.paid / (retention.completed || 1)) * 360)}deg, #f5f5f5 0deg)`
                                        }}
                                    />
                                    <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                                        <div className="text-center">
                                            <span className="block text-2xl font-bold text-stone-900">{retention.paid}</span>
                                            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Pagaron</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Legend/Data */}
                                <div className="flex-1 w-full space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-[#a6f20d]" />
                                            <span className="font-medium text-stone-700">Pagaron</span>
                                        </div>
                                        <span className="font-bold text-stone-900">{retention.paid}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-stone-200" />
                                            <span className="font-medium text-stone-600">No Pagaron</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-stone-900">{retention.notPaid}</span>
                                            <span className="text-[10px] text-stone-400">Oportunidad perdida</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block B: Product Choice */}
                        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between min-h-[300px]">
                            <div>
                                <h4 className="text-lg font-bold text-stone-900 mb-1">¿Qué diagnóstico eligen?</h4>
                                <p className="text-sm text-stone-500 mb-8">
                                    Preferencia entre Rápido (Gratis/Low cost) vs Profundo.
                                </p>
                            </div>

                            <div className="space-y-8 flex-1 flex flex-col justify-center">
                                {/* Quick */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="block text-sm font-bold text-emerald-800">Diagnóstico Rápido</span>
                                            <span className="text-xs text-stone-400">{prodPerf.quick.started} iniciados</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold text-stone-900">{prodPerf.quick.paid}</span>
                                            <span className="text-xs text-stone-400">Ventas</span>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-400 rounded-full"
                                            style={{ width: `${(prodPerf.quick.paid / (prodPerf.quick.started || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Deep */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="block text-sm font-bold text-purple-800">Evaluación Profunda</span>
                                            <span className="text-xs text-stone-400">{prodPerf.deep.started} iniciados</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold text-stone-900">{prodPerf.deep.paid}</span>
                                            <span className="text-xs text-stone-400">Ventas</span>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-400 rounded-full"
                                            style={{ width: `${(prodPerf.deep.paid / (prodPerf.deep.started || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* LAYER 3: Contexto Humano & Técnico */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-stone-400" />
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Contexto Humano</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Block C: Geography */}
                        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                            <h4 className="text-base font-bold text-stone-900 mb-4">Origen de las visitas</h4>

                            <div className="space-y-3">
                                {location.length > 0 && location[0].count > 0 && location[0].country !== "Preparado (Sin datos)" ? (
                                    location.map((loc, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">🌍</span>
                                                <span className="font-medium text-stone-700 text-sm">{loc.country}</span>
                                            </div>
                                            <span className="font-bold text-stone-900 text-sm">{loc.count}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                                        <MapPin className="w-8 h-8 text-stone-300 mb-2" />
                                        <span className="text-sm font-bold text-stone-400">Preparado</span>
                                        <p className="text-xs text-stone-400 px-4 mt-1">
                                            Esperando datos de ubicación reales.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Context: Funnel (Technical) */}
                        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                            <h4 className="text-base font-bold text-stone-900 mb-4">Embudo de Fricción (Técnico)</h4>

                            <div className="space-y-4">
                                {funnel.map((step, i) => (
                                    <div key={step.step} className="group relative">
                                        <div className="flex justify-between items-center text-xs mb-1.5 z-10 relative">
                                            <span className="font-semibold text-stone-600 group-hover:text-stone-900 transition-colors">
                                                {step.label}
                                            </span>
                                            <div className="flex gap-3">
                                                <span className="font-mono font-bold text-stone-800">{step.count}</span>
                                                {i > 0 && (
                                                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${step.dropoff > 50 ? 'bg-red-50 text-red-600' : 'bg-stone-100 text-stone-500'
                                                        }`}>
                                                        -{step.dropoff}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${i === funnel.length - 1 ? 'bg-stone-800' : 'bg-stone-300'
                                                    }`}
                                                style={{ width: `${(step.count / (funnel[0].count || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}

function KPICard({ label, value, subvalue, icon, highlight, textSize = "text-2xl" }: any) {
    return (
        <div className={`p-5 rounded-2xl border flex flex-col justify-between h-full ${highlight ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-100 shadow-sm text-stone-800'
            }`}>
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${highlight ? 'text-stone-400' : 'text-stone-400'
                    }`}>
                    {label}
                </span>
                {icon && <div className={highlight ? 'text-stone-500' : 'text-stone-300'}>{icon}</div>}
            </div>
            <div>
                <div className={`${textSize} font-bold font-display tracking-tight leading-none mb-1`}>
                    {value}
                </div>
                <div className={`text-[10px] font-medium ${highlight ? 'text-stone-400' : 'text-stone-500'
                    }`}>
                    {subvalue}
                </div>
            </div>
        </div>
    );
}
