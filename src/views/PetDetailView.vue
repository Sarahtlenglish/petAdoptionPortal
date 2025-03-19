<template>
  <div class="pet-detail">
    <div v-if="loading">Loading pet details...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="!pet">Pet not found</div>
    <div v-else>
      <h1>{{ pet.name }}</h1>
      <div class="status">Status: {{ pet.adopted ? 'Adopted' : 'Available' }}</div>
      
      <div class="pet-info">
        <p><strong>Type:</strong> {{ pet.type }}</p>
        <p><strong>Age:</strong> {{ pet.age }} years</p>
        <p><strong>Description:</strong> {{ pet.description }}</p>
        <p><strong>Added on:</strong> {{ formatDate(pet.createdAt) }}</p>
      </div>
      
      <div class="actions">
        <button 
          v-if="!pet.adopted" 
          @click="markAsAdopted"
          class="adopt-button"
        >
          Mark as Adopted
        </button>
        <router-link to="/pets" class="back-link">Back to all pets</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useRoute } from 'vue-router'

export default {
  name: 'PetDetailView',
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
        error.value = 'Failed to load pet details.'
        loading.value = false
      }
    }

    const markAsAdopted = async () => {
      if (!pet.value || pet.value.adopted) return
      
      try {
        const petDoc = doc(db, 'pets', pet.value.id)
        await updateDoc(petDoc, {
          adopted: true
        })
        
        pet.value.adopted = true
      } catch (err) {
        console.error('Error updating pet:', err)
        error.value = 'Failed to update pet.'
      }
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Unknown'
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString()
    }

    onMounted(fetchPet)

    return {
      pet,
      loading,
      error,
      markAsAdopted,
      formatDate
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;

.pet-detail {
  h1 {
    color: vars.$primary-color;
  }
  
  .status {
    margin-bottom: vars.$spacing-medium;
  }
  
  .pet-info {
    margin: vars.$spacing-large 0;
    padding: vars.$spacing-medium;
    border: 1px solid vars.$border-color;
    
    p {
      margin-bottom: vars.$spacing-small;
    }
  }
  
  .actions {
    .adopt-button {
      margin-right: vars.$spacing-medium;
    }
    
    .back-link {
      color: vars.$secondary-color;
    }
  }
}
</style> 