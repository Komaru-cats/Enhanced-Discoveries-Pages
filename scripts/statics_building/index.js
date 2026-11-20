import fs from 'node:fs';
import path from 'node:path';
import {
    DATA_DIR,
    HEADS_OUTPUT_DIR,
    ITEMS_OUTPUT_DIR,
    MANIFEST_PATH,
    ASSETS_SOURCE_DIR,
    TARGET_VERSION,
    MAX_CONCURRENT_OPERATIONS,
} from './config.js';
import { extractAssets } from './assetExtractor.js';
import { copyItemTextures } from './itemService.js';
import { processHead } from './headRenderer.js';
import { runConcurrent } from './utils.js';

/**
 * Scans the base data directory for all `*_versions` subdirectories
 * and returns full paths to all version JSON files inside them.
 *
 * @param {string} dataDir - Path to the `public/data` directory.
 * @returns {string[]} List of absolute file paths to versioned JSON datasets.
 * @throws {Error} Throws if the base data directory does not exist or contains no version files.
 * @example
 * const files = discoverVersionFiles('/project/public/data');
 */
function discoverVersionFiles(dataDir) {
    if (!fs.existsSync(dataDir)) {
        throw new Error(`Data directory not found: ${dataDir}`);
    }

    const entries = fs.readdirSync(dataDir, { withFileTypes: true });
    const jsonFiles = [];

    for (const entry of entries) {
        if (entry.isDirectory() && entry.name.endsWith('_versions')) {
            const folderPath = path.join(dataDir, entry.name);
            const files = fs
                .readdirSync(folderPath)
                .filter((file) => file.endsWith('.json'))
                .map((file) => path.join(folderPath, file));

            jsonFiles.push(...files);
        }
    }

    if (jsonFiles.length === 0) {
        throw new Error(`No version JSON files found inside *_versions folders in: ${dataDir}`);
    }

    return jsonFiles;
}

/**
 * Main application entry point orchestrating asset synchronization and head generation
 * across all discovered dataset versions.
 *
 * @returns {Promise<void>}
 * @throws {Error} If no dataset files are found or reading/parsing fails.
 */
async function main() {
    const versionFiles = discoverVersionFiles(DATA_DIR);

    fs.mkdirSync(HEADS_OUTPUT_DIR, { recursive: true });
    fs.mkdirSync(ITEMS_OUTPUT_DIR, { recursive: true });

    const heads = new Set();
    const items = new Set();

    for (const filePath of versionFiles) {
        const relativeName = path.relative(DATA_DIR, filePath);
        const content = fs.readFileSync(filePath, 'utf-8');

        try {
            // Strip UTF-8 BOM if present, or remove .replace() if you just want to find and re-save the file
            const rawData = JSON.parse(content.replace(/^\uFEFF/, ''));
            extractAssets(rawData, heads, items);
            console.log(`Scanned ${relativeName}`);
        } catch (error) {
            console.error(`Failed to parse JSON in: ${filePath}`);
            throw error;
        }
    }

    console.log(
        `Discovered ${items.size} unique items and ${heads.size} unique heads across ${versionFiles.length} version files.`
    );

    //  Copy missing item textures from Minecraft manifest
    const copiedItems = copyItemTextures(items, MANIFEST_PATH, ASSETS_SOURCE_DIR, ITEMS_OUTPUT_DIR);
    console.log(`Copied ${copiedItems} missing item textures from version ${TARGET_VERSION}.`);

    // Identify missing head renders
    const missingHeads = Array.from(heads).filter(
        (h) => !fs.existsSync(path.join(HEADS_OUTPUT_DIR, `${h}.png`))
    );
    console.log(`Rendering ${missingHeads.length} missing player heads via skia-canvas...`);

    if (missingHeads.length > 0) {
        const tasks = missingHeads.map((h) => () => processHead(h, HEADS_OUTPUT_DIR));
        await runConcurrent(tasks, MAX_CONCURRENT_OPERATIONS);
    }

    console.log('Static asset synchronization completed.');
}

void main();