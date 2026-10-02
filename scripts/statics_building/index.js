import fs from 'node:fs';
import path from 'node:path';
import {
    DATA_FILE,
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
 * Main application entry point orchestrating asset synchronization and head generation.
 *
 * @returns {Promise<void>}
 * @throws {Error} If the source data file cannot be accessed or loaded.
 */
async function main() {
    if (!fs.existsSync(DATA_FILE)) {
        throw new Error(`Data file not found: ${DATA_FILE}`);
    }

    fs.mkdirSync(HEADS_OUTPUT_DIR, { recursive: true });
    fs.mkdirSync(ITEMS_OUTPUT_DIR, { recursive: true });

    const rawData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const { heads, items } = extractAssets(rawData);

    console.log(`Discovered ${items.size} items and ${heads.size} unique heads.`);

    // 1. Copy missing item textures from Minecraft manifest
    const copiedItems = copyItemTextures(items, MANIFEST_PATH, ASSETS_SOURCE_DIR, ITEMS_OUTPUT_DIR);
    console.log(`Copied ${copiedItems} missing item textures from version ${TARGET_VERSION}.`);

    // 2. Identify missing head renders
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