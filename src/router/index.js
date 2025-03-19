import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import HomeView from '../views/HomeView.vue'
import PetListView from '../views/PetListView.vue'
import PetDetailView from '../views/PetDetailView.vue'
import AddPetView from '../views/AddPetView.vue'
import EditPetView from '../views/EditPetView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import Auth from '../components/Auth.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/pets',
    name: 'pets',
    component: () => import('../views/PetListView.vue')
  },
  {
    path: '/pets/:id',
    name: 'pet-detail',
    component: PetDetailView
  },
  {
    path: '/add',
    name: 'add',
    component: () => import('../views/AddPetView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pets/:id/edit',
    name: 'edit-pet',
    component: EditPetView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router 