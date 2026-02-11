"use client"

import { useRouter, useSearchParams } from "next/navigation";

export function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPeriod = searchParams.get("period") || "all";

    const setPeriod = (period: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("period", period);
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
                onClick={() => setPeriod("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${currentPeriod === "all" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
            >
                Total histórico
            </button>
            <button
                onClick={() => setPeriod("7d")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${currentPeriod === "7d" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
            >
                Últimos 7 días
            </button>
            <button
                onClick={() => setPeriod("30d")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${currentPeriod === "30d" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
            >
                Últimos 30 días
            </button>
        </div>
    );
}
