<template>
  <div>
    <h1>Available Pets</h1>
    <div v-if="loading">Loading pets...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="pets.length === 0">No pets available for adoption.</div>
    <div v-else>
      <div v-for="pet in pets" :key="pet.id" class="pet-item">
        <span class="pet-status">{{ pet.adopted ? 'Adopted' : 'Available' }}</span>
        <h2>{{ pet.name }}</h2>
        <p>{{ pet.type }} - {{ pet.age }} years old</p>
        <router-link :to="'/pets/' + pet.id">View Details</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

export default {
  name: 'PetListView',
  setup() {
    const pets = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchPets = async () => {
      try {
        const petsCollection = collection(db, 'pets')
        const petsQuery = query(petsCollection, orderBy('createdAt', 'desc'))
        const petsSnapshot = await getDocs(petsQuery)
        
        pets.value = petsSnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        })
        
        loading.value = false
      } catch (err) {
        console.error('Error fetching pets:', err)
        error.value = 'Failed to load pets. Please try again later.'
        loading.value = false
      }
    }

    onMounted(fetchPets)

    return {
      pets,
      loading,
      error
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;

h1 {
  color: vars.$primary-color;
}

.pet-item {
  margin-bottom: vars.$spacing-large;
  border: 1px solid vars.$border-color;
  padding: vars.$spacing-medium;
  
  .pet-status {
    display: inline-block;
  }
  
  h2 {
    margin-top: vars.$spacing-small;
  }
}
</style> 