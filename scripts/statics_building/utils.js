/**
 * Sanitizes an identifier or Minecraft resource location to create a filesystem-safe file name.
 *
 * @param {string} identifier - Minecraft resource ID or texture hash (e.g., "minecraft:diamond_sword").
 * @returns {string} Safe file name with colons and slashes replaced by underscores.
 * @example
 * sanitizeFilename('minecraft:diamond_sword'); // returns 'minecraft_diamond_sword'
 */
export function sanitizeFilename(identifier) {
    return identifier.replace(/[:/]/g, '_');
}

/**
 * Suspends asynchronous execution for a specified duration.
 *
 * @param {number} ms - Sleep duration in milliseconds.
 * @returns {Promise<void>} Resolves when the delay has passed.
 * @example
 * await sleep(1000); // Waits 1 second
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs a list of asynchronous tasks using a concurrency pool limiter.
 *
 * @template T
 * @param {Array<() => Promise<T>>} tasks - Array of factory functions returning promises.
 * @param {number} limit - Maximum number of simultaneously running tasks.
 * @returns {Promise<T[]>} Results of all tasks in insertion order.
 * @throws {Error} Throws if any individual task rejects without being caught.
 * @example
 * const results = await runConcurrent([() => fetch('url1'), () => fetch('url2')], 2);
 */
export async function runConcurrent(tasks, limit) {
    const results = [];
    const executing = new Set();

    for (const task of tasks) {
        const promise = Promise.resolve().then(() => task());
        results.push(promise);
        executing.add(promise);

        const cleanup = () => executing.delete(promise);
        promise.then(cleanup, cleanup);

        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }

    return Promise.all(results);
}