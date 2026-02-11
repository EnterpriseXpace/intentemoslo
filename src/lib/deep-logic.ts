import { DEEP_DIMENSIONS } from "@/data/questions";
import { getDiagnosticState } from "./diagnostic-state";

// Types
// Types
export type DimensionState = "Funcional" | "Frágil" | "Crítica";

export interface DimensionScore {
    id: string;
    label: string;
    score: number; // 0-100
    state: DimensionState;
    interpretation: string;
    implication: string; // New: What this provokes
}

export interface DeepAnalysisResult {
    globalIer: number;
    humanSummary: string;
    dimensions: DimensionScore[];
    dominantPattern: {
        title: string;
        description: string;
        translation: string; // "Esto significa que..."
        impact: string[]; // New: Affects other areas (max 3)
        signs: string[]; // New: Observable daily signs
    };
    temporalRisk: {
        risk3Months: string;
        risk12Months: string;
        trajectory: { // New: Comparison
            ifIntervened: string;
            ifIgnored: string;
        };
    };
    recommendations: {
        focusOn: string;
        avoid: string;
        commonError: string;
    };
}

// Helper: Get State from Score
function getDimensionState(score: number): DimensionState {
    const diagnostic = getDiagnosticState(score);
    // Map SSOT levels to DimensionState (keeping legacy strings for now but aligned thresholds)
    if (diagnostic.level === "SOLIDO") return "Funcional";
    if (diagnostic.level === "CRITICO") return "Crítica";
    // Both PRECAUCION (60-79) and FRAGIL (40-59) map to middle ground "Frágil" in current Deep strings
    // But we might want to split them? User said "Deep NO puede redefinir umbrales".
    // For now, mapping 40-79 to "Frágil" ensures >=40 is not Critical.
    return "Frágil";
}
// Note: We are keeping the 3-state system for Deep strings to avoid rewriting all strings, 
// but aligning the top threshold to 80 ensures "Funcional" is truly Solid.

// Helper: Get Human Interpretation & Implication
function getDimensionContent(dimensionId: string, state: DimensionState): { interpretation: string; implication: string } {
    const map: Record<string, Record<DimensionState, { interpretation: string; implication: string }>> = {
        comunicacion: {
            Funcional: {
                interpretation: "Existe capacidad de hablar y entenderse, aunque siempre hay margen para pulir.",
                implication: "Esto facilita que los malentendidos se resuelvan rápido y no se acumulen."
            },
            Frágil: {
                interpretation: "Se habla, pero no siempre se resuelve. Hay temas que se evitan para no discutir.",
                implication: "Suele generar una acumulación silenciosa de temas pendientes que reaparecen bajo estrés."
            },
            Crítica: {
                interpretation: "La comunicación está bloqueada o es hiriente. Cuesta mucho sentirse escuchado realmente.",
                implication: "Provoca que cada intento de hablar se sienta peligroso o inútil, aumentando la distancia."
            }
        },
        confianza: {
            Funcional: {
                interpretation: "Hay una base de seguridad que permite a ambos relajarse.",
                implication: "Permite que cada uno tenga su espacio individual sin generar ansiedad en el otro."
            },
            Frágil: {
                interpretation: "Hay dudas recurrentes o 'alertas' que impiden una entrega total.",
                implication: "Te obliga a estar en un estado de vigilancia sutil, gastando energía en comprobar en lugar de disfrutar."
            },
            Crítica: {
                interpretation: "La seguridad emocional está dañada. Te cuesta relajarte porque no sabes qué esperar.",
                implication: "Genera un estado de hiperalerta donde las acciones neutras se interpretan como amenazas."
            }
        },
        afectividad: {
            Funcional: {
                interpretation: "El vínculo se siente vivo y cuidado.",
                implication: "Nutre la relación diariamente, haciendo que los momentos difíciles sean más llevaderos."
            },
            Frágil: {
                interpretation: "La conexión es intermitente; a veces se siente, a veces se 'mecaniza'.",
                implication: "Hace que la relación se sienta más como una gestión logística que como un vínculo emocional."
            },
            Crítica: {
                interpretation: "Hay una sensación de vacío o distancia. La relación funciona, pero la 'chispa' se siente apagada.",
                implication: "Riesgo de sentirse solo estando acompañado, buscando esa conexión vital fuera de la relación."
            }
        },
        conflictos: {
            Funcional: {
                interpretation: "Las diferencias se gestionan sin romper el vínculo.",
                implication: "El conflicto actúa como una oportunidad de ajuste, no como una amenaza a la estabilidad."
            },
            Frágil: {
                interpretation: "Las discusiones dejan un poso amargo o tardan demasiado en sanar.",
                implication: "Crea una resistencia a sacar temas difíciles por miedo a la reacción del otro."
            },
            Crítica: {
                interpretation: "El conflicto es destructivo o inexistente por evitación total.",
                implication: "Convierte la convivencia en un campo minado o en un desierto de silencio defensivo."
            }
        },
        compromiso: {
            Funcional: {
                interpretation: "Ambos miran hacia el mismo lado con claridad.",
                implication: "Genera certeza y permite construir proyectos a largo plazo con tranquilidad."
            },
            Frágil: {
                interpretation: "Hay visiones diferentes sobre el futuro o el nivel de inversión en la relación.",
                implication: "Produce ansiedad de fondo sobre 'hacia dónde vamos' y si vale la pena el esfuerzo."
            },
            Crítica: {
                interpretation: "Sensación de que uno tira del carro solo o de que los caminos se están separando.",
                implication: "Desmotiva la inversión emocional, ya que el futuro juntos se percibe borroso o improbable."
            }
        }
    };
    return map[dimensionId]?.[state] || { interpretation: "Estado por definir.", implication: "" };
}

// Helper to calculate scores
export function calculateDeepScores(answers: Record<string, number>): DimensionScore[] {
    return DEEP_DIMENSIONS.map((dim) => {
        const dimQuestions = dim.questionIds;
        let total = 0;
        let count = 0;

        dimQuestions.forEach((qId) => {
            if (answers[qId]) {
                total += answers[qId];
                count++;
            }
        });

        // Valid average 1-5
        const rawAverage = count > 0 ? total / count : 1;

        // Normalize 1-5 to 0-100 STRICTLY
        const score = Math.max(0, Math.min(100, Math.round(((rawAverage - 1) / 4) * 100)));

        const state = getDimensionState(score);
        const content = getDimensionContent(dim.id, state);

        return {
            id: dim.id,
            label: dim.label,
            score,
            state,
            interpretation: content.interpretation,
            implication: content.implication
        };
    });
}

// Generate Human Summary
export function generateHumanSummary(globalScore: number, lowestDimension: DimensionScore): string {
    const dimLabel = lowestDimension.label.toLowerCase();
    const state = getDiagnosticState(globalScore);

    if (state.level === "SOLIDO") {
        return `Tu relación muestra una base **Funcional** y sólida ante la mayoría de retos. Un puntaje alto como este indica una estructura relacional sólida y funcional en el momento actual. Esto no implica ausencia de retos, sino una base estable que, con atención consciente, puede sostenerse y profundizarse en el tiempo. Sin embargo, no hay que confiarse: la dimensión de **${dimLabel}** muestra señales tempranas de desgaste. El objetivo ahora no es 'reparar', sino enriquecer para evitar que la rutina erosione lo que han construido.`;
    } else if (state.level === "PRECAUCION" || state.level === "FRAGIL") {
        return `El diagnóstico general es **${state.label}**. La estructura de la relación se sostiene, pero está costando mucha energía mantenerla a flote. El área de **${dimLabel}** es la que más está drenando la batería emocional de ambos. Están en un punto de inflexión: si no se interviene, la distancia empezará a sentirse normal.`;
    } else {
        return `La situación actual es **Crítica**. No significa que no haya amor, sino que la 'maquinaria' de la relación está fallando en puntos clave, especialmente en **${dimLabel}**. Es probable que sientas agotamiento o soledad a pesar de estar acompañado. Este resultado es una llamada a la acción inmediata para cambiar dinámicas que ya no son sostenibles.`;
    }
}

// 1. Dominant Pattern Logic
export function identifyDominantPattern(lowestDimensionId: string): { title: string; description: string; translation: string; impact: string[]; signs: string[] } {
    const patterns: Record<string, { title: string; description: string; translation: string; impact: string[]; signs: string[] }> = {
        afectividad: {
            title: "Desconexión Emocional Progresiva",
            description: "El vínculo afectivo se está enfriando. Operan más por inercia que por conexión.",
            translation: "Esto significa que pueden estar conviviendo como 'buenos compañeros de piso', pero la intimidad y la complicidad se están perdiendo.",
            impact: [
                "Reduce la tolerancia en los conflictos (todo molesta más).",
                "Debilita la 'cuenta bancaria emocional' necesaria para momentos difíciles.",
                "Puede llevar a buscar validación emocional fuera de la relación."
            ],
            signs: [
                "Dejar de saludarse o despedirse con afecto real.",
                "Sentir pereza de compartir cómo fue el día.",
                "Priorizar siempre pantallas u otras tareas sobre momentos juntos."
            ]
        },
        comunicacion: {
            title: "Evitación Comunicativa",
            description: "Existe una barrera invisible. Se habla de logística, pero se evitan los temas profundos.",
            translation: "Esto significa que te guardas cosas para 'no estropear el momento', pero eso hace que te sientas cada vez menos comprendido.",
            impact: [
                "Bloquea la resolución de conflictos (se repiten siempre).",
                "Erosiona la intimidad al no compartir el mundo interior.",
                "Genera suposiciones erróneas sobre lo que el otro piensa."
            ],
            signs: [
                "Sentir un 'nudo' antes de sacar un tema importante.",
                "Esperar a que el otro adivine qué te pasa.",
                "Hablar mucho sin decir realmente nada sustancial."
            ]
        },
        conflictos: {
            title: "Ciclo Ataque–Defensa",
            description: "La resolución de problemas es adversarial. El conflicto no repara, solo desgasta.",
            translation: "Esto significa que en las discusiones el objetivo ha pasado de ser 'resolver el problema' a 'protegerse del otro'.",
            impact: [
                "Daña la seguridad emocional (miedo a la reacción del otro).",
                "Hace que la comunicación se vuelva superficial para evitar peleas.",
                "Desgasta el afecto por acumulación de resentimiento."
            ],
            signs: [
                "Sacar trapos sucios del pasado en discusiones actuales.",
                "Interrumpir para defenderse antes de que el otro termine.",
                "Sentirse exhausto después de cada desacuerdo, sin solución clara."
            ]
        },
        confianza: {
            title: "Inseguridad Relacional",
            description: "La base de seguridad está comprometida. Estado de alerta constante.",
            translation: "Esto significa que una parte de ti siempre está esperando que algo salga mal, lo que te impide disfrutar del presente.",
            impact: [
                "Genera conductas de control o demanda excesiva de atención.",
                "Bloquea la autonomía personal (culpa por hacer cosas solo/a).",
                "Tiñe la comunicación de interpretaciones negativas."
            ],
            signs: [
                "Analizar el tono de voz o mensajes buscando 'dobles sentidos'.",
                "Necesidad constante de que te reafirmen que todo está bien.",
                "Miedo desproporcionado ante cambios pequeños en la rutina del otro."
            ]
        },
        compromiso: {
            title: "Desalineación de Expectativas",
            description: "Las visiones de futuro o el nivel de inversión no están sincronizados.",
            translation: "Esto significa que sientes que estás remando con más fuerza que tu pareja, lo que genera frustración silenciosa.",
            impact: [
                "Frena proyectos vitales compartidos.",
                "Genera sensación de injusticia en el reparto de carga emocional.",
                "Reduce la motivación para resolver conflictos (¿para qué?)."
            ],
            signs: [
                "Evitar hablar de planes a más de 6 meses vista.",
                "Sentir que sacrificas más que el otro sistemáticamente.",
                "Dudas frecuentes sobre si esta es la relación definitiva."
            ]
        },
    };

    return patterns[lowestDimensionId] || {
        title: "Desgaste Generalizado",
        description: "Múltiples áreas muestran debilidad sistémica.",
        translation: "Esto significa que la relación pesa más de lo que nutre en este momento.",
        impact: ["Afecta a la salud emocional individual.", "Dificulta la proyección a futuro."],
        signs: ["Apatía generalizada.", "Fantasías frecuentes de estar soltero/a."]
    };
}

// 2. Temporal Risk Logic
// 2. Temporal Risk Logic
export function assessTemporalRisk(globalIer: number): { risk3Months: string; risk12Months: string; trajectory: { ifIntervened: string; ifIgnored: string } } {
    const state = getDiagnosticState(globalIer);

    if (state.level === "SOLIDO") {
        return {
            risk3Months: "Riesgo bajo. Si se descuida, podría surgir una falsa sensación de seguridad ('damos por sentado al otro').",
            risk12Months: "Si no se invierte activamente, la pasión y la novedad podrían erosionarse, dando paso a una rutina funcional pero plana.",
            trajectory: {
                ifIntervened: "Es muy probable que la relación florezca y alcance niveles de intimidad y complicidad superiores.",
                ifIgnored: "Probablemente se mantenga estable un tiempo, pero perdiendo 'brillo' y conexión emocional gradualmente."
            }
        };
    } else if (state.level === "PRECAUCION" || state.level === "FRAGIL") {
        return {
            risk3Months: "Riesgo de cronificación del patrón. Las pequeñas fricciones de hoy pueden convertirse en la 'norma' aceptada, reduciendo las expectativas de felicidad.",
            risk12Months: "Riesgo de normalización del desgaste. La distancia emocional podría solidificarse, haciendo que la desconexión se sienta cómoda y el cambio parezca demasiado costoso.",
            trajectory: {
                ifIntervened: "Suele facilitar la reactivación del vínculo y la recuperación de la ilusión compartida.",
                ifIgnored: "El riesgo es que la 'funcionalidad' sustituya al amor, convirtiéndose en una sociedad eficiente pero sin alma."
            }
        };
    } else {
        return {
            risk3Months: "Riesgo de escalada. Los conflictos no resueltos o el silencio acumulado podrían generar resentimiento activo, haciendo la convivencia cada vez más tensa.",
            risk12Months: "Riesgo de ruptura emocional o física. Es probable que uno o ambos busquen fuera de la relación (trabajo, otros vínculos) la satisfacción que no encuentran dentro.",
            trajectory: {
                ifIntervened: "Puede frenar la caída libre y abrir un espacio seguro para decidir, sea continuar sanamente o cerrar con respeto.",
                ifIgnored: "Es probable que el deterioro se acelere, llegando a un punto de no retorno donde la indiferencia sustituya al dolor."
            }
        };
    }
}

// 3. Strategic Recommendations
export function getDeepRecommendations(lowestDimensionId: string) {
    const recs: Record<string, { focusOn: string; avoid: string; commonError: string }> = {
        afectividad: {
            focusOn: "Recuperar el 'micro-afecto'. Gestos pequeños, no sexuales, de aprecio diario.",
            avoid: "Intentar 'arreglar' la relación con grandes gestos o viajes.",
            commonError: "Esperar a 'sentir' ganas de ser cariñoso. La acción precede al sentimiento en esta etapa.",
        },
        comunicacion: {
            focusOn: "Escucha validante. Repetir lo que el otro dice antes de dar tu opinión.",
            avoid: "Justificarse o explicar 'tu punto' inmediatamente.",
            commonError: "Confundir sinceridad con crueldad. La verdad sin empatía es agresión.",
        },
        conflictos: {
            focusOn: "Desescalada. Aprender a pedir una pausa cuando la emoción sube.",
            avoid: "Seguir discutiendo para 'ganar' o tener la última palabra.",
            commonError: "Creer que si no se resuelve YA, no se resolverá nunca. La pausa es estratégica, no evasiva.",
        },
        confianza: {
            focusOn: "Transparencia radical y cumplimiento de pequeñas promesas.",
            avoid: "Ocultar cosas 'para no preocupar' al otro.",
            commonError: "Exigir confianza ciega. La confianza se reconstruye con hechos, no con palabras.",
        },
        compromiso: {
            focusOn: "Crear rituales compartidos y hablar de sueños pequeños a corto plazo.",
            avoid: "Presionar por compromisos grandes (matrimonio, hijos) si la base tambalea.",
            commonError: "Asumir que el compromiso es estático. Se renueva (o no) cada día.",
        },
    };

    return recs[lowestDimensionId] || {
        focusOn: "Estabilizar el clima emocional reduciendo la crítica.",
        avoid: "Tomar decisiones drásticas en caliente.",
        commonError: "Buscar un culpable único. El patrón es circular.",
    };
}

