import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PetListView from '../views/PetListView.vue'
import PetDetailView from '../views/PetDetailView.vue'
import AddPetView from '../views/AddPetView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/pets',
    name: 'pet-list',
    component: PetListView
  },
  {
    path: '/pets/:id',
    name: 'pet-detail',
    component: PetDetailView
  },
  {
    path: '/add',
    name: 'add-pet',
    component: AddPetView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 