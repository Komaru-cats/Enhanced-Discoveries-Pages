import fs from 'node:fs';
import path from 'node:path';
import { Canvas, Image } from 'skia-canvas';
import { fetchSkinBuffer } from './mojangClient.js';

/**
 * 2D projected coordinates on the target canvas.
 * @typedef {Object} Point2D
 * @property {number} x - Horizontal canvas coordinate.
 * @property {number} y - Vertical canvas coordinate.
 */

/**
 * Renders an isometric 3D representation of a Minecraft player head, including the outer helmet layer.
 *
 * @param {Buffer} skinBuffer - Raw PNG buffer of the 64x64 or 64x32 skin.
 * @param {number} [size=180] - Width and height of the resulting image in pixels.
 * @returns {Promise<Buffer>} Rendered PNG image buffer.
 * @throws {Error} Throws if image parsing or canvas buffer generation fails.
 * @example
 * const headPng = await renderIsometricHead(skinBuffer, 256);
 */
export async function renderIsometricHead(skinBuffer, size = 180) {
    const img = new Image();
    await new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = skinBuffer;
    });

    const canvas = new Canvas(size, size);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // 8x8 source buffer for pixel-perfect texture sampling
    const tempCanvas = new Canvas(8, 8);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.imageSmoothingEnabled = false;

    const cx = size / 2;
    const cy = size / 2;
    const scale = (size / 64) * 4.5;

    const rad30 = Math.PI / 6;
    const cos30 = Math.cos(rad30);
    const sin30 = 0.5;
    const invSqrt2 = Math.SQRT2 / 2;

    /**
     * Projects 3D model space coordinates onto 2D canvas coordinates.
     *
     * @param {number} x - X axis coordinate.
     * @param {number} y - Y axis coordinate.
     * @param {number} z - Z axis coordinate.
     * @returns {Point2D} 2D screen coordinate.
     */
    function project(x, y, z) {
        const Xp = invSqrt2 * (x - z);
        const Zp = invSqrt2 * (x + z);
        const Yp = y * cos30 - Zp * sin30;
        return {
            x: cx + Xp * scale,
            y: cy - Yp * scale,
        };
    }

    /**
     * Draws an 8x8 face quad applying isometric perspective and optional shading.
     *
     * @param {number} sx - Source texture X offset.
     * @param {number} sy - Source texture Y offset.
     * @param {[number, number, number]} p00_3d - Top-left 3D vertex coordinates.
     * @param {[number, number, number]} p10_3d - Top-right 3D vertex coordinates.
     * @param {[number, number, number]} p01_3d - Bottom-left 3D vertex coordinates.
     * @param {number} [shade=1] - Brightness multiplier (between 0.0 and 1.0).
     */
    function drawFace(sx, sy, p00_3d, p10_3d, p01_3d, shade = 1) {
        tempCtx.clearRect(0, 0, 8, 8);
        tempCtx.drawImage(img, sx, sy, 8, 8, 0, 0, 8, 8);

        const imgData = tempCtx.getImageData(0, 0, 8, 8).data;
        let hasPixels = false;
        for (let i = 3; i < imgData.length; i += 4) {
            if (imgData[i] > 0) {
                hasPixels = true;
                break;
            }
        }
        if (!hasPixels) return;

        if (shade < 1) {
            tempCtx.globalCompositeOperation = 'source-atop';
            tempCtx.fillStyle = `rgba(0, 0, 0, ${1 - shade})`;
            tempCtx.fillRect(0, 0, 8, 8);
            tempCtx.globalCompositeOperation = 'source-over';
        }

        const p00 = project(...p00_3d);
        const p10 = project(...p10_3d);
        const p01 = project(...p01_3d);

        const a = (p10.x - p00.x) / 8;
        const b = (p10.y - p00.y) / 8;
        const c = (p01.x - p00.x) / 8;
        const d = (p01.y - p00.y) / 8;

        ctx.save();
        ctx.transform(a, b, c, d, p00.x, p00.y);
        ctx.drawImage(tempCanvas, 0, 0, 8.05, 8.05);
        ctx.restore();
    }

    const Rb = 4.0; // Base head cube half-size
    const Rh = 4.5; // Hat outer layer cube half-size

    // Hat back faces (occluded by inner head)
    drawFace(32, 8, [-Rh, Rh, -Rh], [-Rh, Rh, Rh], [-Rh, -Rh, -Rh], 0.75);
    drawFace(56, 8, [Rh, Rh, -Rh], [-Rh, Rh, -Rh], [Rh, -Rh, -Rh], 0.7);

    // Base head cube faces
    drawFace(8, 0, [-Rb, Rb, -Rb], [Rb, Rb, -Rb], [-Rb, Rb, Rb], 1.0);
    drawFace(8, 8, [-Rb, Rb, Rb], [Rb, Rb, Rb], [-Rb, -Rb, Rb], 0.85);
    drawFace(16, 8, [Rb, Rb, Rb], [Rb, Rb, -Rb], [Rb, -Rb, Rb], 0.65);

    // Hat front faces
    drawFace(40, 0, [-Rh, Rh, -Rh], [Rh, Rh, -Rh], [-Rh, Rh, Rh], 1.0);
    drawFace(40, 8, [-Rh, Rh, Rh], [Rh, Rh, Rh], [-Rh, -Rh, Rh], 0.85);
    drawFace(48, 8, [Rh, Rh, Rh], [Rh, Rh, -Rh], [Rh, -Rh, Rh], 0.65);

    return await canvas.toBuffer('png');
}

/**
 * Downloads, renders, and saves a single isometric player head file.
 *
 * @param {string} identifier - Player UUID or texture hash.
 * @param {string} outputDir - Directory where the resulting PNG file will be saved.
 * @returns {Promise<boolean>} True if the head was already present or successfully generated; false on failure.
 * @example
 * const success = await processHead('9c3848b8...', './public/heads');
 */
export async function processHead(identifier, outputDir) {
    const targetPath = path.join(outputDir, `${identifier}.png`);
    if (fs.existsSync(targetPath)) return true;

    try {
        const skinBuffer = await fetchSkinBuffer(identifier);
        const headPngBuffer = await renderIsometricHead(skinBuffer);
        fs.writeFileSync(targetPath, headPngBuffer);
        return true;
    } catch (err) {
        console.warn(`[Fail] Could not render head ${identifier.slice(0, 16)}...: ${err.message}`);
        return false;
    }
}