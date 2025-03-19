<template>
  <div class="add-pet-form">
    <div class="image-section">
      <h2>BILLEDE</h2>
      <div 
        class="image-upload"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleFileDrop"
      >
        <input 
          type="file" 
          ref="fileInput"
          @change="handleFileSelect"
          accept="image/*"
        >
        
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Preview">
          <button type="button" class="remove-image" @click.stop="removeImage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span class="upload-text">Klik for at vælge billede</span>
          <span class="upload-hint">eller træk og slip (maks. 1 MB)</span>
        </template>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <div class="form-section">
      <h1>Tilføj nyt kæledyr</h1>
      <p class="subtitle">Del et kæledyr der søger et nyt hjem</p>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">NAVN</label>
          <input 
            type="text" 
            id="name"
            v-model="form.name"
            placeholder="F.eks. Flemming"
            required
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="type">TYPE</label>
            <select 
              id="type"
              v-model="form.type"
              required
            >
              <option value="" disabled>Vælg type</option>
              <option v-for="(label, value) in petTypes" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="age">ALDER (ÅR)</label>
            <input 
              type="number" 
              id="age"
              v-model="form.age"
              placeholder="F.eks. 3"
              min="0"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for="description">BESKRIVELSE</label>
          <textarea 
            id="description"
            v-model="form.description"
            placeholder="Fortæl lidt om kæledyrets personlighed..."
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            <span>{{ isSubmitting ? 'Tilføjer...' : 'Tilføj kæledyr' }}</span>
            <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            <div v-else class="spinner"></div>
          </button>
          <router-link to="/pets" class="btn btn-secondary">
            <span>Annuller</span>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase'

const router = useRouter()
const fileInput = ref(null)
const imagePreview = ref(null)
const error = ref(null)
const isSubmitting = ref(false)

const form = ref({
  name: '',
  type: '',
  age: '',
  description: '',
  imageUrl: '',
  adopted: false
})

const petTypes = {
  'dog': 'Hund',
  'cat': 'Kat',
  'rabbit': 'Kanin',
  'bird': 'Fugl',
  'fish': 'Fisk',
  'reptile': 'Krybdyr',
  'other': 'Andet'
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 1024 * 1024) {
    error.value = 'Billedet er for stort (maks. 1 MB tilladt)'
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    form.value.imageUrl = e.target.result // Gem base64 URL direkte i form
  }
  reader.readAsDataURL(file)
}

const handleFileDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (!file) return
  
  if (file.size > 1024 * 1024) {
    error.value = 'Billedet er for stort (maks. 1 MB tilladt)'
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    form.value.imageUrl = e.target.result // Gem base64 URL direkte i form
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = null
  form.value.imageUrl = '' // Ryd også URL'en i form
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const submitForm = async () => {
  try {
    isSubmitting.value = true
    error.value = null

    if (!form.value.imageUrl) {
      error.value = 'Vælg venligst et billede'
      return
    }

    // Add pet to Firestore with the base64 image data
    const pet = {
      ...form.value,
      createdAt: new Date()
    }

    await addDoc(collection(db, 'pets'), pet)
    router.push('/pets')
  } catch (err) {
    console.error('Error adding pet:', err)
    error.value = 'Der skete en fejl. Prøv igen senere.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;
@use "sass:color";

.add-pet-form {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: vars.$border-radius-large;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .image-section {
    background-color: vars.$primary-color;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    position: relative;
    
    h2 {
      color: white;
      font-size: 1.2rem;
      font-weight: vars.$font-weight-bold;
      margin-bottom: 1rem;
      letter-spacing: 0.05em;
    }

    .error-message {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.9);
      color: vars.$error-color;
      padding: 0.75rem;
      border-radius: vars.$border-radius-medium;
      font-size: 0.9rem;
      text-align: center;
      animation: fadeIn 0.3s ease;
    }

    .image-upload {
      flex: 1;
      border: 2px dashed rgba(255, 255, 255, 0.5);
      border-radius: vars.$border-radius-medium;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      .image-preview {
        position: absolute;
        inset: 0;
        background: vars.$primary-color;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .remove-image {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
          
          &:hover {
            background: rgba(0, 0, 0, 0.7);
            transform: scale(1.1);
          }
          
          svg {
            width: 16px;
            height: 16px;
            margin: 0;
          }
        }
      }

      svg {
        width: 48px;
        height: 48px;
        color: white;
        margin-bottom: 1rem;
      }

      .upload-text {
        color: white;
        font-size: 1.1rem;
        font-weight: vars.$font-weight-medium;
        text-align: center;
      }

      .upload-hint {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        margin-top: 0.5rem;
      }

      input[type="file"] {
        display: none;
      }
    }
  }

  .form-section {
    padding: 2rem;

    h1 {
      font-size: 2rem;
      font-weight: vars.$font-weight-black;
      color: vars.$text-color-dark;
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        font-weight: vars.$font-weight-bold;
        color: vars.$text-color-dark;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        letter-spacing: 0.05em;
      }

      input[type="text"],
      input[type="number"],
      select,
      textarea {
        width: 100%;
        padding: 0.8rem 1rem;
        border: 2px solid #eee;
        border-radius: vars.$border-radius-medium;
        font-size: 1rem;
        font-family: vars.$font-family;
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: vars.$primary-color;
          box-shadow: 0 0 0 3px rgba(vars.$primary-color, 0.1);
        }

        &::placeholder {
          color: #999;
        }
      }

      textarea {
        min-height: 120px;
        resize: vertical;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.8rem 1.5rem;
        border-radius: vars.$border-radius-medium;
        font-weight: vars.$font-weight-bold;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;

        &.btn-primary {
          background: vars.$primary-color;
          color: white;
          flex: 1;

          &:hover:not(:disabled) {
            background: color.adjust(vars.$primary-color, $lightness: -5%);
            transform: translateY(-2px);
          }

          svg {
            width: 20px;
            height: 20px;
          }

          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        }

        &.btn-secondary {
          background: white;
          color: vars.$text-color-dark;
          border: 2px solid #eee;

          &:hover {
            border-color: vars.$primary-color;
            color: vars.$primary-color;
            transform: translateY(-2px);
          }
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      }
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .image-section {
      min-height: 300px;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 