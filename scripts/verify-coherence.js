
// QA Script: Verify Coherence Logic (JS Version)

const DIAGNOSTIC_LEVELS = {
    CRITICO: "CRITICO",
    FRAGIL: "FRAGIL",
    PRECAUCION: "PRECAUCION",
    SOLIDO: "SOLIDO"
};

function getDiagnosticState(score) {
    if (score >= 80) {
        return {
            level: "SOLIDO",
            label: "Solidez / Fluidez",
            semanticColor: "emerald",
            uiTone: "stable",
            trafficLightTitle: "Semáforo Relacional",
            positiveBoxTitle: "Lo que está funcionando"
        };
    }

    if (score >= 60) {
        return {
            level: "PRECAUCION",
            label: "Funcionalidad con Fricción",
            semanticColor: "amber",
            uiTone: "caution",
            trafficLightTitle: "Funcionamiento con Fricción",
            positiveBoxTitle: "Bases funcionales"
        };
    }

    if (score >= 40) {
        return {
            level: "FRAGIL",
            label: "Estructura Inestable",
            semanticColor: "orange",
            uiTone: "warning",
            trafficLightTitle: "Señales de Inestabilidad",
            positiveBoxTitle: "Puntos de apoyo"
        };
    }

    return {
        level: "CRITICO",
        label: "Riesgo de Ruptura",
        semanticColor: "red",
        uiTone: "danger",
        trafficLightTitle: "Estado Crítico Detectado",
        positiveBoxTitle: "Recursos remanentes"
    };
}

// Test Runner
function runTests() {
    console.log("🧪 Starting Coherence QA (Logic Verification)...\n");
    let failed = 0;

    const scenarios = [
        { score: 35, expectedLevel: "CRITICO", expectedColor: "red" },
        { score: 45, expectedLevel: "FRAGIL", expectedColor: "orange" },
        { score: 61, expectedLevel: "PRECAUCION", expectedColor: "amber" },
        { score: 75, expectedLevel: "PRECAUCION", expectedColor: "amber" },
        { score: 85, expectedLevel: "SOLIDO", expectedColor: "emerald" },
    ];

    scenarios.forEach(scenario => {
        const state = getDiagnosticState(scenario.score);
        let checkPassed = true;

        if (state.level !== scenario.expectedLevel) {
            console.error(`❌ Score ${scenario.score}: Expected Level ${scenario.expectedLevel}, got ${state.level}`);
            checkPassed = false;
        }

        if (state.semanticColor !== scenario.expectedColor) {
            console.error(`❌ Score ${scenario.score}: Expected Color ${scenario.expectedColor}, got ${state.semanticColor}`);
            checkPassed = false;
        }

        if (checkPassed) {
            console.log(`✅ Score ${scenario.score}: Passed (${state.level} / ${state.semanticColor})`);
        } else {
            failed++;
        }
    });

    console.log("\n-------------------");
    if (failed === 0) {
        console.log("🎉 All scenarios PASSED. Logic is consistent.");
    } else {
        console.error(`💥 ${failed} scenarios FAILED.`);
        process.exit(1);
    }
}

runTests();
