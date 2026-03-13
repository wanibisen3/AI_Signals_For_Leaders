const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable is missing.');
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

async function refactorFile(targetFile, instructions) {
    const fullPath = path.resolve(process.cwd(), targetFile);

    if (!fs.existsSync(fullPath)) {
        console.error(`Error: File not found at ${fullPath}`);
        process.exit(1);
    }

    console.log(`\n[Codex] Reading ${targetFile}...`);
    const originalCode = fs.readFileSync(fullPath, 'utf-8');

    console.log(`[Codex] Contacting OpenAI for refactor...`);

    const isMultiFile = instructions.includes('MULTI_FILE_JSON');

    const prompt = `
You are an expert AI agent.
Your task is to process the following file according to these instructions:
${instructions}

CRITICAL RULES:
${isMultiFile ? '1. Return a single valid JSON object where keys are relative file paths and values are the string file contents. Do NOT wrap in markdown.' : '1. ONLY return the final refactored code. Do NOT return markdown formatting.\\n2. The code you return will REPLACE the entire contents of the existing file.'}
3. Ensure no behavior is broken.

File Name: ${targetFile}
Original Code:
${originalCode}
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.1,
            messages: [
                { role: "system", content: "You are a coding and review AI. Follow output format strictly." },
                { role: "user", content: prompt }
            ]
        });

        let newCode = response.choices[0].message.content.trim();

        // Failsafe strip of markdown blocks if model hallucinated them
        if (newCode.startsWith('\`\`\`')) {
            const lines = newCode.split('\n');
            if (lines.length > 2) {
                newCode = lines.slice(1, -1).join('\n');
            }
        }

        if (isMultiFile) {
            try {
                const multiFile = JSON.parse(newCode);
                console.log('[Codex] Detected MULTI_FILE_JSON output. Writing files...');
                for (const [filePath, content] of Object.entries(multiFile)) {
                    const outPath = path.resolve(process.cwd(), filePath);
                    fs.mkdirSync(path.dirname(outPath), { recursive: true });
                    fs.writeFileSync(outPath, content, 'utf-8');
                    console.log(`[Codex] Wrote ${filePath}`);
                }
                return;
            } catch (e) {
                console.error('[Codex] Failed to parse MULTI_FILE_JSON response:', e.message);
                console.error('[Codex] Raw response:', newCode);
                process.exit(1);
            }
        }

        console.log(`[Codex] Refactoring complete. Writing to ${targetFile}...`);
        fs.writeFileSync(fullPath, newCode, 'utf-8');

        console.log(`[Codex] Successfully refactored ${targetFile}!\n`);
    } catch (error) {
        console.error(`[Codex] Error during generation: ${error.message}`);
        process.exit(1);
    }
}

const targetFile = process.argv[2];
const instructions = process.argv[3];

if (!targetFile || !instructions) {
    console.error('Usage: node scripts/codex-refactor.js <targetFile> <instructions>');
    process.exit(1);
}

refactorFile(targetFile, instructions);
