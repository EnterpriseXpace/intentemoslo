
const { getDiagnosticState } = require('../src/lib/diagnostic-state');

// Simple test runner
function runTests() {
    console.log("🧪 Starting Coherence QA...\n");
    let failed = 0;

    const scenarios = [
        { score: 35, expectedLevel: "CRITICO", expectedColor: "red" },
        { score: 45, expectedLevel: "FRAGIL", expectedColor: "orange" },
        { score: 61, expectedLevel: "PRECAUCION", expectedColor: "amber" },
        { score: 75, expectedLevel: "PRECAUCION", expectedColor: "amber" },
        { score: 85, expectedLevel: "SOLIDO", expectedColor: "emerald" },
    ];

    scenarios.forEach(scenario => {
        try {
            const state = getDiagnosticState(scenario.score);
            let checkPassed = true;

            // Check Level
            if (state.level !== scenario.expectedLevel) {
                console.error(`❌ Score ${scenario.score}: Expected Level ${scenario.expectedLevel}, got ${state.level}`);
                checkPassed = false;
            }

            // Check Color
            if (state.semanticColor !== scenario.expectedColor) {
                console.error(`❌ Score ${scenario.score}: Expected Color ${scenario.expectedColor}, got ${state.semanticColor}`);
                checkPassed = false;
            }

            // Check consistency of title (sanity check)
            if (!state.trafficLightTitle) {
                console.error(`❌ Score ${scenario.score}: Missing Traffic Light Title`);
                checkPassed = false;
            }

            if (checkPassed) {
                console.log(`✅ Score ${scenario.score}: Passed (${state.level} / ${state.semanticColor})`);
            } else {
                failed++;
            }

        } catch (error) {
            console.error(`❌ Score ${scenario.score}: Crashed`, error);
            failed++;
        }
    });

    console.log("\n-------------------");
    if (failed === 0) {
        console.log("🎉 All scenarios PASSED. Coherence is armored.");
        process.exit(0);
    } else {
        console.error(`💥 ${failed} scenarios FAILED.`);
        process.exit(1);
    }
}

// Mocking needed for Node execution of TS file if not compiled
// Ideally this runs with ts-node.
// For now, we assume we might need to compile or it's a manual check script.
// But wait, the environment is Windows. Run via ts-node if available or just check logic manually?
// We will try running it. If not, this serves as documentation of the check.
// Actually, since we can't easily run ts-node on user machine without knowing setup, 
// I will rewrite this as a standalone JS file that defines the function locally TO TEST THE LOGIC 
// independent of imports, OR I will just rely on the build.
// Better: I will create a `verify-coherence.js` that copies the logic solely to verify IT WORKS LOGICALLY.
// But that defeats the point of testing the ACTUAL file.
// I will try to use `npx ts-node` if possible.

// Since I can't guarantee ts-node, I'll rely on the Build verification and manual check.
// But the user requested "QA AUTOMATICO (OBLIGATORIO)".
// I will add this file to `scripts/` and try to run it.

runTests();
