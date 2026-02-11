
export type DiagnosticLevel = "CRITICO" | "FRAGIL" | "PRECAUCION" | "SOLIDO";
export type SemanticColor = "red" | "orange" | "amber" | "emerald";
export type UITone = "danger" | "warning" | "caution" | "stable";

export interface DiagnosticState {
    level: DiagnosticLevel;
    label: string;
    semanticColor: SemanticColor;
    uiTone: UITone;
    color: string; // Tailwind text color class
    bg: string; // Tailwind bg color class
    borderColor: string; // Tailwind border color class
    trafficLightTitle: string;
    positiveBoxTitle: string;
    keyMessage: string;
}

export function getDiagnosticState(score: number): DiagnosticState {
    if (score >= 80) {
        return {
            level: "SOLIDO",
            label: "Solidez / Fluidez",
            semanticColor: "emerald",
            uiTone: "stable",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            borderColor: "border-emerald-200",
            trafficLightTitle: "Semáforo Relacional",
            positiveBoxTitle: "Lo que está funcionando",
            keyMessage: "Solidez relacional / fluidez"
        };
    }

    if (score >= 60) {
        return {
            level: "PRECAUCION",
            label: "Funcionalidad con Fricción",
            semanticColor: "amber",
            uiTone: "caution",
            color: "text-amber-500",
            bg: "bg-amber-50",
            borderColor: "border-amber-200",
            trafficLightTitle: "Funcionamiento con Fricción",
            positiveBoxTitle: "Bases funcionales",
            keyMessage: "Funcionalidad con Fricción"
        };
    }

    if (score >= 40) {
        return {
            level: "FRAGIL",
            label: "Estructura Inestable",
            semanticColor: "orange",
            uiTone: "warning",
            color: "text-orange-500",
            bg: "bg-orange-50",
            borderColor: "border-orange-200",
            trafficLightTitle: "Señales de Inestabilidad",
            positiveBoxTitle: "Puntos de apoyo",
            keyMessage: "Estructura Inestable / Riesgo Activo"
        };
    }

    return {
        level: "CRITICO",
        label: "Riesgo de Ruptura",
        semanticColor: "red",
        uiTone: "danger",
        color: "text-rose-600",
        bg: "bg-rose-50",
        borderColor: "border-rose-200",
        trafficLightTitle: "Estado Crítico Detectado",
        positiveBoxTitle: "Recursos remanentes",
        keyMessage: "Riesgo de Ruptura / Desgaste Severo"
    };
}
