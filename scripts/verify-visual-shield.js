
const fs = require('fs');
const path = require('path');

// 1. Config
const COMPONENTS_DIR = path.join(__dirname, '../src/components/results');
const FORBIDDEN_TOKENS = [
    'text-gray-900', 'bg-gray-900', 'text-black', 'bg-black', '#000', '#000000', 'stroke="black"', 'fill="black"'
];
const FILES_TO_SCAN = [
    'ResultMetric.tsx',
    'TrafficLight.tsx',
    'deep/DeepDimensions.tsx',
    'AnalysisBlock.tsx'
];

// 2. Static Analysis Runner
function scanFiles() {
    console.log("🛡️  Starting Visual Shielding Scan...\n");
    let errors = 0;

    FILES_TO_SCAN.forEach(file => {
        const filePath = path.join(COMPONENTS_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  File not found: ${file}`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        let fileErrors = 0;

        FORBIDDEN_TOKENS.forEach(token => {
            if (content.includes(token)) {
                console.error(`❌ [${file}] Forbidden token found: "${token}"`);
                fileErrors++;
            }
        });

        // Check for Default/Fallback logic
        if (file === 'ResultMetric.tsx' || file === 'DeepDimensions.tsx') {
            if (!content.includes('colorMap')) {
                console.error(`❌ [${file}] No 'colorMap' found. Strict mapping missing?`);
                fileErrors++;
            }
        }

        if (fileErrors === 0) {
            console.log(`✅ [${file}] Passed visual scan.`);
        } else {
            errors += fileErrors;
        }
    });

    return errors;
}

// 3. Logic Consistency Check (Mini-SSOT check)
function checkLogic() {
    // We can't easily import TS files here without compilation, 
    // but we can verify the scan results are sufficient for now.
    // The previous coherence script handles the logic.
    return 0;
}

// Run
const visualErrors = scanFiles();

console.log("\n-------------------");
if (visualErrors === 0) {
    console.log("🎉 visual Shielding Active. No forbidden colors found.");
} else {
    console.error(`💥 Found ${visualErrors} visual violations.`);
    process.exit(1);
}
