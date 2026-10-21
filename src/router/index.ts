import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
} from 'vue-router';
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
    component: () => import('../views/AdvancementTableView.vue'),
  },
];

/**
 * Initializes and configures the application Vue Router instance.
 *
 * @returns {Router} The configured Vue Router instance.
 */
export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
