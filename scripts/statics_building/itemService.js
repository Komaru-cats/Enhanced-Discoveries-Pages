import fs from 'node:fs';
import path from 'node:path';
import { sanitizeFilename } from './utils.js';

/**
 * Copies required item textures from the 'minecraft-textures' distribution folder to the output directory.
 *
 * @param {Set<string>} requiredItems - Unique item IDs that need to be copied.
 * @param {string} manifestPath - Path to the versioned manifest JSON file.
 * @param {string} assetsBaseDir - Base folder containing source texture files.
 * @param {string} outputDir - Target destination folder for sanitized item files.
 * @returns {number} Count of successfully copied textures.
 * @throws {Error} Throws if the manifest file is not found at the provided path.
 * @example
 * const copied = copyItemTextures(itemsSet, '/path/to/manifest.json', '/assets', '/output');
 */
export function copyItemTextures(requiredItems, manifestPath, assetsBaseDir, outputDir) {
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

        if (fs.existsSync(targetFile)) continue;

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