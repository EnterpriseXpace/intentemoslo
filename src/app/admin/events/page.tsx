import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const { data: events, error } = await supabaseAdmin
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Dashboard Error:', error);
        return (
            <div className="min-h-screen bg-[#FDFDF9] p-8 flex flex-col items-center justify-center font-sans">
                <div className="bg-white p-10 rounded-3xl shadow-xl shadow-stone-200/50 max-w-lg w-full text-center border border-stone-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800 mb-4 font-display">No pudimos cargar los datos</h2>

                    <div className="bg-stone-50 p-4 rounded-xl text-left mb-8 font-mono text-xs text-stone-600 border border-stone-200 overflow-x-auto">
                        {error.message || JSON.stringify(error)}
                    </div>

                    <p className="text-sm text-stone-500">
                        Por favor verifica la conexión con Supabase o la configuración de tablas.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDF9] text-stone-800 font-sans selection:bg-[#a6f20d] selection:text-stone-900">
            {/* Header / Nav Area */}
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-500 text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-[#a6f20d] animate-pulse"></span>
                            Live Analytics
                        </div>
                        <h1 className="text-5xl font-bold font-display text-stone-900 tracking-tight">
                            Panel de Control
                        </h1>
                        <p className="text-lg text-stone-500 max-w-lg leading-relaxed">
                            Monitoreo en tiempo real de la actividad y diagnósticos realizados en la plataforma.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center min-w-[140px]">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Eventos</span>
                            <span className="text-3xl font-display font-bold text-stone-900">{events?.length || 0}</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden">

                    {/* Toolbar */}
                    <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                        <h3 className="font-display font-bold text-xl text-stone-800">Últimos movimientos</h3>
                        <div className="flex gap-2">
                            <span className="text-xs font-medium text-stone-400 px-3 py-1 bg-stone-50 rounded-lg border border-stone-100">
                                Mostrando últimos 100
                            </span>
                        </div>
                    </div>

                    {/* Table Wrapper */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-stone-50/50 border-b border-stone-100">
                                    <th className="px-8 py-5 text-xs font-bold text-stone-400 uppercase tracking-widest w-[25%]">Evento / Contexto</th>
                                    <th className="px-6 py-5 text-xs font-bold text-stone-400 uppercase tracking-widest w-[15%]">Producto</th>
                                    <th className="px-6 py-5 text-xs font-bold text-stone-400 uppercase tracking-widest w-[20%]">Fecha & Hora</th>
                                    <th className="px-6 py-5 text-xs font-bold text-stone-400 uppercase tracking-widest w-[15%]">Usuario (Anon)</th>
                                    <th className="px-8 py-5 text-xs font-bold text-stone-400 uppercase tracking-widest w-[25%] text-right">Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {events?.map((event) => {
                                    const isQuick = event.product_type === 'quick';
                                    const eventColor = event.event_name.includes('completed') || event.event_name.includes('payment')
                                        ? 'bg-green-50 text-green-700'
                                        : event.event_name.includes('started')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-stone-100 text-stone-600';

                                    return (
                                        <tr key={event.id} className="group hover:bg-stone-50/80 transition-colors">
                                            {/* Event Name */}
                                            <td className="px-8 py-5 align-top">
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${event.event_name.includes('payment') ? 'bg-[#a6f20d]' :
                                                            event.event_name.includes('completed') ? 'bg-green-500' : 'bg-stone-300'
                                                        }`} />
                                                    <div>
                                                        <span className="block font-bold text-stone-900 text-sm mb-1">{event.event_name}</span>
                                                        <span className="block text-xs text-stone-400 font-mono break-all">{event.url?.replace(/^https?:\/\/[^/]+/, '')}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Product Tag */}
                                            <td className="px-6 py-5 align-top">
                                                {event.product_type ? (
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${isQuick
                                                            ? 'bg-[#EBF7F0] text-[#2D5B3A] border-[#D1EAD8]'
                                                            : 'bg-[#F4F1FF] text-[#54428E] border-[#E2DBFF]'
                                                        }`}>
                                                        {isQuick ? 'Rápido' : 'Profundo'}
                                                    </span>
                                                ) : (
                                                    <span className="text-stone-300 text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-stone-700">
                                                        {new Date(event.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="text-xs text-stone-400">
                                                        {new Date(event.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Anon ID */}
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex items-center gap-2 group/id cursor-pointer">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-500 border border-stone-100">
                                                        {event.anon_id.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-mono text-xs text-stone-400 group-hover/id:text-stone-600 transition-colors">
                                                        ...{event.anon_id.slice(-6)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Metadata */}
                                            <td className="px-8 py-5 align-top">
                                                <div className="flex justify-end">
                                                    {Object.keys(event.metadata).length > 0 ? (
                                                        <details className="group/details relative">
                                                            <summary className="list-none cursor-pointer">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-600 shadow-sm hover:border-[#a6f20d] hover:text-stone-900 transition-all">
                                                                    Data
                                                                    <svg className="w-3 h-3 opacity-50 transition-transform group-open/details:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                                </span>
                                                            </summary>
                                                            <div className="absolute right-0 top-full mt-2 z-20 w-64 bg-stone-900 text-stone-200 p-4 rounded-xl shadow-2xl border border-stone-800 text-xs font-mono backdrop-blur-md opacity-0 scale-95 origin-top-right group-open/details:opacity-100 group-open/details:scale-100 transition-all">
                                                                <pre className="whitespace-pre-wrap break-words">
                                                                    {JSON.stringify(event.metadata, null, 2)}
                                                                </pre>
                                                            </div>
                                                        </details>
                                                    ) : (
                                                        <span className="text-stone-300 text-xs italic">Sin data</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {events?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                                </div>
                                                <p className="text-stone-500 font-medium">Esperando eventos...</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer of Table */}
                    <div className="px-8 py-5 border-t border-stone-100 bg-stone-50/30 flex justify-between items-center">
                        <span className="text-xs text-stone-400 font-medium">
                            Actualizado: {new Date().toLocaleTimeString()}
                        </span>
                        <div className="flex gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-stone-300"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-stone-300"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-stone-300"></span>
                        </div>
                    </div>
                </div>

                {/* Brand Footer */}
                <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
                    <span className="font-display font-bold text-stone-900 tracking-tight">intentémoslo <span className="text-stone-400 font-normal">| admin</span></span>
                </div>
            </div>
        </div>
    );
}
