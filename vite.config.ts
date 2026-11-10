import vue from '@vitejs/plugin-vue'
import {defineConfig, type Plugin} from 'vite'
import fs from 'node:fs';
import path from 'node:path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), versionManifestPlugin()],
  build: {
    target: 'esnext',
    cssMinify: 'esbuild'
  }
})

/**
 * Compares two semantic version strings in descending order (newest first).
 *
 * @param {string} v1 - First version string (e.g. "3.0.0").
 * @param {string} v2 - Second version string (e.g. "2.9.4").
 * @returns {number} Positive if v2 > v1, negative if v2 < v1, 0 if equal.
 * @example
 * ['2.9.4', '3.0.0'].sort(compareSemverDesc); // ['3.0.0', '2.9.4']
 */
function compareSemverDesc(v1: string, v2: string): number {
  const parse = (v: string) =>
      v
          .replace(/^v/i, '')
          .split('.')
          .map((n) => parseInt(n, 10) || 0);

  const [maj1 = 0, min1 = 0, pat1 = 0] = parse(v1);
  const [maj2 = 0, min2 = 0, pat2 = 0] = parse(v2);

  if (maj2 !== maj1) return maj2 - maj1;
  if (min2 !== min1) return min2 - min1;
  return pat2 - pat1;
}

/**
 * Vite plugin that scans `public/data/*_versions` directories and generates
 * `public/data/versions.json` automatically on build and during dev server file changes.
 *
 * @returns {Plugin} Configured Vite plugin instance.
 * @example
 * plugins: [vue(), versionManifestPlugin()]
 */
function versionManifestPlugin(): Plugin {
  const dataDir = path.resolve(import.meta.dirname, 'public/data');
  const manifestPath = path.join(dataDir, 'versions.json');

  const generateManifest = (): void => {
    if (!fs.existsSync(dataDir)) return;

    const manifest: Record<string, string[]> = {};
    const entries = fs.readdirSync(dataDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.endsWith('_versions')) {
        const folderPath = path.join(dataDir, entry.name);
        manifest[entry.name] = fs
            .readdirSync(folderPath)
            .filter((file) => file.endsWith('.json'))
            .map((file) => file.replace(/\.json$/i, ''))
            .sort(compareSemverDesc);
      }
    }

    const newContent = JSON.stringify(manifest, null, 2) + '\n';
    const currentContent = fs.existsSync(manifestPath)
        ? fs.readFileSync(manifestPath, 'utf-8')
        : '';

    // Write only when changed to avoid triggering infinite watcher loops
    if (newContent !== currentContent) {
      fs.writeFileSync(manifestPath, newContent, 'utf-8');
    }
  };

  return {
    name: 'vite-plugin-version-manifest',
    buildStart() {
      generateManifest();
    },
    configureServer(server) {
      generateManifest();
      server.watcher.on('add', (filePath) => {
        if (filePath.includes('_versions') && filePath.endsWith('.json')) {
          generateManifest();
        }
      });
      server.watcher.on('unlink', (filePath) => {
        if (filePath.includes('_versions') && filePath.endsWith('.json')) {
          generateManifest();
        }
      });
    },
  };
}