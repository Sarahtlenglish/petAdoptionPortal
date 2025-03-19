<template>
  <div class="pet-details">
    <div v-if="loading">Loading pet details...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="!pet">Pet not found</div>
    <div v-else>
      <h1>{{ pet.name }}</h1>
      <div class="pet-info">
        <p><strong>Species:</strong> {{ pet.species }}</p>
        <p><strong>Breed:</strong> {{ pet.breed }}</p>
        <p><strong>Age:</strong> {{ pet.age }} years</p>
        <p><strong>Description:</strong> {{ pet.description }}</p>
      </div>
      <router-link to="/" class="back-link">Back to all pets</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useRoute } from 'vue-router'

export default {
  name: 'PetDetailsView',
  setup() {
    const route = useRoute()
    const pet = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchPet = async () => {
      const petId = route.params.id
      
      try {
        const petDoc = doc(db, 'pets', petId)
        const petSnapshot = await getDoc(petDoc)
        
        if (petSnapshot.exists()) {
          pet.value = {
            id: petSnapshot.id,
            ...petSnapshot.data()
          }
        } else {
          error.value = 'Pet not found'
        }
        
        loading.value = false
      } catch (err) {
        console.error('Error fetching pet details:', err)
        error.value = 'Failed to load pet details. Please try again later.'
        loading.value = false
      }
    }

    onMounted(fetchPet)

    return {
      pet,
      loading,
      error
    }
  }
}
</script>

<style scoped>
.pet-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.pet-info {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}
</style> 