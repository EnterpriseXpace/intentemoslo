export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface Question {
    id: string;
    text: string;
    dimension?: string;
}

export interface Dimension {
    id: string;
    label: string;
    questionIds: string[];
}

export const LIKERT_OPTIONS = [
    { label: "😞 Totalmente en desacuerdo", value: 1 },
    { label: "😕 En desacuerdo", value: 2 },
    { label: "😐 Ni de acuerdo ni en desacuerdo", value: 3 },
    { label: "🙂 De acuerdo", value: 4 },
    { label: "😄 Totalmente de acuerdo", value: 5 },
];

export const RAS_QUESTIONS: Question[] = [
    { id: "R1", text: "En general, me siento satisfecho/a con mi relación actual." },
    { id: "R2", text: "Mi relación cumple mis expectativas principales." },
    { id: "R3", text: "Me siento comprendido/a por mi pareja." },
    { id: "R4", text: "Estoy satisfecho/a con la forma en que nos comunicamos." },
    { id: "R5", text: "Estoy satisfecho/a con la manera en que resolvemos los problemas." },
    { id: "R6", text: "Me siento emocionalmente cercano/a a mi pareja." },
    { id: "R7", text: "Considero que mi relación es estable en este momento." },
];

export const DEEP_DIMENSIONS: Dimension[] = [
    { id: "comunicacion", label: "Comunicación", questionIds: ["D1", "D2", "D3", "D4", "D5"] },
    { id: "confianza", label: "Confianza y seguridad", questionIds: ["D6", "D7", "D8", "D9", "D10"] },
    { id: "afectividad", label: "Afectividad y vínculo", questionIds: ["D11", "D12", "D13", "D14"] },
    { id: "conflictos", label: "Resolución de conflictos", questionIds: ["D15", "D16", "D17", "D18"] },
    { id: "compromiso", label: "Compromiso y proyección", questionIds: ["D19", "D20", "D21", "D22"] },
];

export const DEEP_QUESTIONS: Question[] = [
    // Comunicación
    { id: "D1", text: "Puedo expresar lo que siento sin miedo a reacciones negativas.", dimension: "comunicacion" },
    { id: "D2", text: "Mi pareja escucha con atención cuando hablo.", dimension: "comunicacion" },
    { id: "D3", text: "Podemos hablar de temas difíciles sin evitar la conversación.", dimension: "comunicacion" },
    { id: "D4", text: "Siento que mis opiniones son tomadas en cuenta.", dimension: "comunicacion" },
    { id: "D5", text: "Nuestra comunicación suele ser clara y respetuosa.", dimension: "comunicacion" },

    // Confianza
    { id: "D6", text: "Confío en mi pareja.", dimension: "confianza" },
    { id: "D7", text: "Me siento emocionalmente seguro/a en esta relación.", dimension: "confianza" },
    { id: "D8", text: "No siento que deba estar en guardia con mi pareja.", dimension: "confianza" },
    { id: "D9", text: "Creo que puedo contar con mi pareja cuando lo necesito.", dimension: "confianza" },
    { id: "D10", text: "Me siento valorado/a por mi pareja.", dimension: "confianza" },

    // Afectividad
    { id: "D11", text: "Siento cercanía emocional con mi pareja.", dimension: "afectividad" },
    { id: "D12", text: "Me siento acompañado/a dentro de la relación.", dimension: "afectividad" },
    { id: "D13", text: "Hay muestras de afecto que me hacen sentir querido/a.", dimension: "afectividad" },
    { id: "D14", text: "Me siento importante para mi pareja.", dimension: "afectividad" },

    // Conflictos
    { id: "D15", text: "Cuando surge un conflicto, solemos encontrar soluciones.", dimension: "conflictos" },
    { id: "D16", text: "Los problemas no se acumulan sin resolverse.", dimension: "conflictos" },
    { id: "D17", text: "Las discusiones no dañan el vínculo a largo plazo.", dimension: "conflictos" },
    { id: "D18", text: "Podemos recuperar la calma después de un conflicto.", dimension: "conflictos" },

    // Compromiso
    { id: "D19", text: "Me siento comprometido/a con esta relación.", dimension: "compromiso" },
    { id: "D20", text: "Veo un futuro posible con mi pareja.", dimension: "compromiso" },
    { id: "D21", text: "Siento que ambos estamos invirtiendo en la relación.", dimension: "compromiso" },
    { id: "D22", text: "Deseo seguir construyendo esta relación.", dimension: "compromiso" },
];

export function getRasResult(score: number): { level: string; description: string; color: string } {
    if (score >= 28) return { level: "Relación sólida", description: "Tu relación muestra bases firmes de satisfacción y estabilidad.", color: "text-emerald-600" };
    if (score >= 21) return { level: "Relación estable con dudas", description: "La relación funciona, pero existen áreas de incertidumbre que requieren atención.", color: "text-amber-600" };
    if (score >= 14) return { level: "Relación deteriorada", description: "La satisfacción es baja y existen fricciones importantes en el día a día.", color: "text-orange-600" };
    return { level: "Relación en riesgo", description: "Los indicadores de satisfacción y estabilidad son críticos.", color: "text-rose-600" };
}

export function getDeepResult(average: number): { level: string; description: string; color: string } {
    if (average >= 4.0) return { level: "Relación sólida", description: "Altos niveles de conexión y seguridad en las dimensiones clave.", color: "text-emerald-600" };
    if (average >= 3.0) return { level: "Relación funcional", description: "Estructura válida con áreas específicas de mejora.", color: "text-amber-600" };
    if (average >= 2.0) return { level: "Relación frágil", description: "La estructura relacional muestra debilidades en múltiples dimensiones.", color: "text-orange-600" };
    return { level: "Relación en riesgo", description: "Dificultades profundas para sostener el vínculo en su estado actual.", color: "text-rose-600" };
}
