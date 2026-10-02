import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const TARGET_VERSION = '26.3';
const DATA_FILE = path.join(rootDir, 'public/data/bacaped.json');
const HEADS_OUTPUT_DIR = path.join(rootDir, 'public/heads');
const ITEMS_OUTPUT_DIR = path.join(rootDir, 'public/items');

const MANIFEST_PATH = path.join(
    rootDir,
    'node_modules/minecraft-textures/dist/textures/manifest',
    `${TARGET_VERSION}.json`
);
const ASSETS_SOURCE_DIR = path.join(
    rootDir,
    'node_modules/minecraft-textures/dist/textures/assets'
);

const HEADS_API_BASE_URL = 'https://mc-heads.net/head/{identifier}/left/64';
const MAX_CONCURRENT_DOWNLOADS = 4;

/**
 * Sanitizes a resource identifier for safe filesystem naming across platforms.
 * @param {string} identifier - The raw Minecraft identifier or hash.
 * @returns {string} A safe filename without extension.
 * @example
 * sanitizeFilename('minecraft:diamond'); // returns 'minecraft_diamond'
 */
function sanitizeFilename(identifier) {
    return identifier.replace(/[:/]/g, '_');
}

/**
 * Pauses asynchronous execution for the specified duration.
 * @param {number} ms - Milliseconds to sleep.
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Recursively parses the JSON data tree to find player head identifiers and item IDs.
 * Prioritizes head textures over regular item IDs.
 * @param {unknown} data - The root JSON data structure.
 * @returns {{ heads: Set<string>, items: Set<string> }} Sets of unique head identifiers and item IDs.
 */
function extractAssets(data) {
    const heads = new Set();
    const items = new Set();

    function traverse(node) {
        if (!node || typeof node !== 'object') return;

        if (Array.isArray(node)) {
            for (const item of node) {
                traverse(item);
            }
            return;
        }

        const headData = node.player_head_data;
        let hasHead = false;

        if (headData && typeof headData === 'object') {
            const identifier = headData.texture_hash || headData.uuid;
            if (identifier) {
                heads.add(String(identifier));
                hasHead = true;
            }
        }

        if (!hasHead) {
            const rawId = node.icon_id || node.id;
            if (typeof rawId === 'string') {
                items.add(rawId);
            }
        }

        for (const [key, value] of Object.entries(node)) {
            if (key !== 'player_head_data') {
                traverse(value);
            }
        }
    }

    traverse(data);
    return { heads, items };
}

/**
 * Copies required item textures from the minecraft-textures package to public/items/.
 * @param {Set<string>} requiredItems - Set of Minecraft item IDs.
 * @param {string} manifestPath - Path to the version manifest JSON.
 * @param {string} assetsBaseDir - Path to package assets.
 * @param {string} outputDir - Path to public/items folder.
 * @returns {number} Number of successfully copied textures.
 * @throws {Error} Thrown if the target version manifest cannot be found.
 */
function copyItemTextures(requiredItems, manifestPath, assetsBaseDir, outputDir) {
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`Manifest not found at: ${manifestPath}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const itemMap = new Map();

    for (const entry of manifest.items) {
        itemMap.set(entry.id, entry.texture);
    }

    let copied = 0;
    for (const itemId of requiredItems) {
        const safeFileName = `${sanitizeFilename(itemId)}.png`;
        const targetFile = path.join(outputDir, safeFileName);

        if (fs.existsSync(targetFile)) {
            continue;
        }

        const relTexturePath = itemMap.get(itemId);
        if (!relTexturePath) {
            console.warn(`[Warn] Item texture not found in manifest: ${itemId}`);
            continue;
        }

        const srcFile = path.join(assetsBaseDir, relTexturePath);
        if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, targetFile);
            copied++;
        } else {
            console.warn(`[Warn] Asset file missing on disk: ${srcFile}`);
        }
    }

    return copied;
}

/**
 * Downloads a single isometric player head texture with backoff on HTTP 429.
 * @param {string} identifier - Texture hash or UUID.
 * @param {string} outputDir - Directory to store the head PNG.
 * @param {number} [maxRetries=3] - Maximum retry attempts on rate limit.
 * @returns {Promise<boolean>} True if downloaded or exists; false if failed.
 */
async function downloadHead(identifier, outputDir, maxRetries = 3) {
    const targetPath = path.join(outputDir, `${identifier}.png`);
    if (fs.existsSync(targetPath)) {
        return true;
    }

    const url = HEADS_API_BASE_URL.replace('{identifier}', identifier);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Enhanced Discoveries Docs/1.0' },
            });

            if (response.status === 429) {
                const waitMs = (attempt + 1) * 2000;
                console.warn(`[429 Rate Limit] Backing off ${waitMs}ms for ${identifier.slice(0, 8)}...`);
                await sleep(waitMs);
                continue;
            }

            if (response.status === 404) {
                console.warn(`[404 Not Found] Head not found: ${identifier}`);
                return false;
            }

            if (!response.ok) {
                console.warn(`[HTTP ${response.status}] Failed to fetch ${url}`);
                return false;
            }

            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(targetPath, buffer);
            await sleep(50);
            return true;
        } catch (err) {
            if (attempt === maxRetries - 1) {
                console.error(`[Error] Failed to download head ${identifier}:`, err);
                return false;
            }
            await sleep(1000);
        }
    }

    return false;
}

/**
 * Runs tasks with a concurrency pool limit.
 * @template T
 * @param {Array<() => Promise<T>>} tasks - Task producer functions.
 * @param {number} limit - Maximum parallel executions.
 * @returns {Promise<T[]>}
 */
async function runConcurrent(tasks, limit) {
    const results = [];
    const executing = new Set();

    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        executing.add(p);

        const clean = () => executing.delete(p);
        p.then(clean, clean);

        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }

    return Promise.all(results);
}

/**
 * Main asset discovery and synchronisation flow.
 * @returns {Promise<void>}
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

    // Copy local Minecraft item textures
    const copiedItems = copyItemTextures(items, MANIFEST_PATH, ASSETS_SOURCE_DIR, ITEMS_OUTPUT_DIR);
    console.log(`Copied ${copiedItems} missing item textures from version ${TARGET_VERSION}.`);

    // Fetch missing heads from MC-Heads
    const missingHeads = Array.from(heads).filter(
        (h) => !fs.existsSync(path.join(HEADS_OUTPUT_DIR, `${h}.png`))
    );

    console.log(`Downloading ${missingHeads.length} missing player heads...`);
    if (missingHeads.length > 0) {
        const tasks = missingHeads.map((h) => () => downloadHead(h, HEADS_OUTPUT_DIR));
        await runConcurrent(tasks, MAX_CONCURRENT_DOWNLOADS);
    }

    console.log('Static asset synchronization completed.');
}

void main();