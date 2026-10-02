import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
    },
    {
        path: '/advancements',
        name: 'Advancements',
        // Lazy-loading for performance
        component: () => import('../views/AdvancementTableView.vue'),
    },
];

/**
 * Initializes and configures the application router instance.
 *
 * @returns {RouteRecordRaw} The configured Vue Router instance.
 */
export const router = createRouter({
    history: createWebHistory(),
    routes,
});