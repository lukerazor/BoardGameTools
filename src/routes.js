import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './components/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/barenpark_randomiser',
      name: 'Barenpark Randomiser',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./components/barenpark_randomiser.vue'),
    },
    {
      path: '/simple_scorepad',
      name: 'Simple Scorepad',
      component: () => import('./components/simple_scorepad.vue'),
    },
    {
      path: '/bauer_scorer',
      name: 'Bauer Scorer',
      component: () => import('./components/bauer_scorer.vue'),
    },
    {
      path: '/road_and_boats_scorer',
      name: 'Roads & Boats Scorer',
      component: () => import('./components/roads_and_boats_scorer.vue'),
    },
    ,
    {
      path: '/exit_tracker',
      name: 'Exit Tracker',
      component: () => import('./components/ExitTracker.vue'),
    },
    
  ],
})

export default router