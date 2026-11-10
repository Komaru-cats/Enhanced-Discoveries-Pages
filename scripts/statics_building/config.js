import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT_DIR = path.resolve(import.meta.dirname, '../..');
export const TARGET_VERSION = '26.3';

export const DATA_DIR = path.join(ROOT_DIR, 'public/data');
export const HEADS_OUTPUT_DIR = path.join(ROOT_DIR, 'public/heads');
export const ITEMS_OUTPUT_DIR = path.join(ROOT_DIR, 'public/items');

export const MANIFEST_PATH = path.join(
    ROOT_DIR,
    'node_modules/minecraft-textures/dist/textures/manifest',
    `${TARGET_VERSION}.json`
);

export const ASSETS_SOURCE_DIR = path.join(
    ROOT_DIR,
    'node_modules/minecraft-textures/dist/textures/assets'
);

export const MAX_CONCURRENT_OPERATIONS = 6;