<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="dashboard-page theme-modern-grey">
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Enhanced Discoveries</h1>
      </header>

      <!-- Centered Main Showcase Tile -->
      <main class="showcase-wrapper">
        <RouterLink to="/advancements" class="main-tile-card glass-panel">
          <div class="tile-top-row">
            <span class="tile-badge">Documentation</span>
          </div>

          <h2>Advancement Explorer</h2>

          <p class="tile-description">
            Complete table of advancements added in Enhanced Discoveries.
            View actual requirements, rewards and other stuff.
          </p>

          <div class="tile-action-wrapper">
            <span class="tile-action">Open Advancement Table</span>
            <span class="action-arrow">&rarr;</span>
          </div>
        </RouterLink>

        <!-- Subtle "Coming Soon" Teaser -->
        <div class="upcoming-note">
          <span class="pulse-dot"></span>
          <span>Something might appear later...</span>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.theme-modern-grey {
  --bg-main: #121214;
  --bg-gradient: radial-gradient(circle at top, #1e1e24 0%, #101012 70%);
  --glass-bg: rgba(30, 30, 34, 0.55);
  --glass-border: rgba(255, 255, 255, 0.08);

  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  --accent-color: #d4d4d8;
  --accent-bg: rgba(255, 255, 255, 0.05);
}

* {
  box-sizing: border-box;
}

.dashboard-page {
  min-height: 100vh;
  width: 100%;
  background: var(--bg-gradient);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.dashboard-container {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* --- HEADER --- */
.dashboard-header {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-pill {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-color);
  background: var(--accent-bg);
  border: 1px solid var(--glass-border);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.dashboard-header h1 {
  font-size: 2.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.03em;
}

.dashboard-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

/* --- SHOWCASE CARD --- */
.showcase-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
}

.main-tile-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 2.5rem 2.5rem;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
  border-color 0.3s ease,
  box-shadow 0.35s ease;
}

.main-tile-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* --- CARD CONTENT --- */
.tile-top-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.tile-badge {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #e4e4e7;
  background: var(--accent-bg);
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  border: 1px solid var(--glass-border);
  font-weight: 600;
}

.tile-count {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.main-tile-card h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.85rem 0;
  letter-spacing: -0.02em;
}

.tile-description {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.65;
  margin: 0 0 2.25rem 0;
}

/* --- ACTIONS --- */
.tile-action-wrapper {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
  transition: color 0.2s ease;
}

.action-arrow {
  transition: transform 0.25s ease;
  font-size: 1.1rem;
}

.main-tile-card:hover .action-arrow {
  transform: translateX(6px);
  color: #ffffff;
}

/* --- UPCOMING TEASER --- */
.upcoming-note {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background: #71717a;
  border-radius: 50%;
  opacity: 0.7;
}
</style>