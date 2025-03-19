<template>
  <div class="add-pet">
    <h1>Add New Pet</h1>
    <form @submit.prevent="addPet">
      <div class="form-group">
        <label for="name">Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="type">Type</label>
        <select 
          id="type" 
          v-model="form.type" 
          required
        >
          <option value="">Select type</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="bird">Bird</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="age">Age (years)</label>
        <input 
          type="number" 
          id="age" 
          v-model.number="form.age" 
          min="0" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="form.description" 
          rows="4" 
          required
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="submit">Add Pet</button>
        <router-link to="/pets" class="cancel-link">Cancel</router-link>
      </div>
      
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useRouter } from 'vue-router'

export default {
  name: 'AddPetView',
  setup() {
    const router = useRouter()
    const form = ref({
      name: '',
      type: '',
      age: null,
      description: ''
    })
    const error = ref(null)
    
    const addPet = async () => {
      error.value = null
      
      try {
        const petsCollection = collection(db, 'pets')
        await addDoc(petsCollection, {
          name: form.value.name,
          type: form.value.type,
          age: form.value.age,
          description: form.value.description,
          adopted: false,
          createdAt: serverTimestamp()
        })
        
        router.push('/pets')
      } catch (err) {
        console.error('Error adding pet:', err)
        error.value = 'Failed to add pet.'
      }
    }
    
    return {
      form,
      error,
      addPet
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;

.add-pet {
  h1 {
    color: vars.$primary-color;
    margin-bottom: vars.$spacing-large;
  }
  
  .form-group {
    margin-bottom: vars.$spacing-large;
    
    label {
      display: block;
      margin-bottom: vars.$spacing-small;
    }
    
    input, select, textarea {
      width: 100%;
      padding: vars.$spacing-small;
      border: 1px solid vars.$border-color;
    }
  }
  
  .form-actions {
    margin-top: vars.$spacing-large;
    
    button {
      margin-right: vars.$spacing-medium;
    }
    
    .cancel-link {
      color: vars.$secondary-color;
    }
  }
  
  .error {
    margin-top: vars.$spacing-medium;
    color: vars.$error-color;
  }
}
</style> 