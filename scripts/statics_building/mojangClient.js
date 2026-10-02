import { sleep } from './utils.js';

/**
 * Fetches a raw player skin PNG buffer using Mojang Session API (by UUID) or CDN (by hash).
 *
 * @param {string} identifier - Player UUID or 64-character skin texture hash.
 * @param {number} [maxRetries=3] - Maximum retry attempts when encountering transient errors or 429 status.
 * @returns {Promise<Buffer>} Resolved Buffer containing raw skin PNG data.
 * @throws {Error} Throws if retries are exhausted, rate limits cannot be resolved, or payload is malformed.
 * @example
 * const buffer = await fetchSkinBuffer('9c3848b8-b80c-4ec7-a6f9-031e05007328');
 */
export async function fetchSkinBuffer(identifier, maxRetries = 3) {
    const isUuid = /^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}$/.test(identifier);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            let skinUrl = '';

            if (isUuid) {
                const cleanUuid = identifier.replace(/-/g, '');
                const profileUrl = `https://sessionserver.mojang.com/session/minecraft/profile/${cleanUuid}`;
                const profileRes = await fetch(profileUrl);

                if (profileRes.status === 429) {
                    const waitMs = (attempt + 1) * 2000;
                    console.warn(`[429 Rate Limit] Backing off ${waitMs}ms on Mojang Session Server...`);
                    await sleep(waitMs);
                    continue;
                }

                if (!profileRes.ok) {
                    throw new Error(`Profile request failed: HTTP ${profileRes.status}`);
                }

                const profileData = await profileRes.json();
                const texturesProp = profileData.properties?.find((p) => p.name === 'textures');
                if (!texturesProp?.value) {
                    throw new Error(`Textures property is missing for UUID: ${identifier}`);
                }

                const decoded = JSON.parse(Buffer.from(texturesProp.value, 'base64').toString('utf-8'));
                skinUrl = decoded.textures?.SKIN?.url;

                if (!skinUrl) {
                    throw new Error(`No skin URL available in payload for UUID: ${identifier}`);
                }
            } else {
                skinUrl = `https://textures.minecraft.net/texture/${identifier}`;
            }

            const skinRes = await fetch(skinUrl);
            if (!skinRes.ok) {
                throw new Error(`Failed to fetch skin texture: HTTP ${skinRes.status}`);
            }

            return Buffer.from(await skinRes.arrayBuffer());
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;
            await sleep(1000);
        }
    }

    throw new Error(`Failed to retrieve skin buffer for: ${identifier}`);
}