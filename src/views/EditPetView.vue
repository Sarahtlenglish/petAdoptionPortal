<template>
  <div class="edit-pet-form">
    <!-- Step indicator -->
    <div class="step-indicator">
      <div 
        class="step" 
        :class="{ active: currentStep === 1 }"
        @click="currentStep = 1"
      >
        <span class="step-number">1</span>
        <span class="step-label">Grundlæggende info</span>
      </div>
      <div 
        class="step" 
        :class="{ active: currentStep === 2 }"
        @click="form.name && form.type && form.age && form.description && form.imageUrl ? currentStep = 2 : null"
      >
        <span class="step-number">2</span>
        <span class="step-label">Adfærd & behov</span>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-content">
      <!-- Step 1 -->
      <div v-if="currentStep === 1" class="form-step">
        <div class="image-section">
          <h2>BILLEDE</h2>
          <div class="image-upload">
            <input 
              type="file" 
              id="image"
              @change="handleImageChange"
              accept="image/*"
              class="file-input"
            >
            <div 
              class="upload-placeholder"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
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
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </div>

        <div class="form-section">
          <h1>Rediger {{ form.name }}</h1>
          <p class="subtitle">Opdater information om kæledyret</p>

          <form @submit.prevent="nextStep">
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
                  <option value="">Vælg type</option>
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
                  v-model.number="form.age" 
                  min="0"
                  placeholder="F.eks. 3"
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
              >
                <span>Næste</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <router-link :to="'/pets/' + petId" class="btn btn-secondary">
                <span>Annuller</span>
              </router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="currentStep === 2" class="form-step">
        <div class="image-section preview-section">
          <h2>FORHÅNDSVISNING</h2>
          <div class="image-preview-container">
            <img :src="form.imageUrl" :alt="form.name">
          </div>
        </div>

        <div class="form-section">
          <h1>Adfærd & behov</h1>
          <p class="subtitle">Fortæl os mere om {{ form.name }}</p>

          <form @submit.prevent="updatePet">
            <!-- Size -->
            <div class="form-group">
              <label>STØRRELSE</label>
              <div class="radio-group">
                <label class="radio-button">
                  <input 
                    type="radio" 
                    v-model="form.size" 
                    value="small"
                    required
                  >
                  <span>Lille</span>
                </label>
                <label class="radio-button">
                  <input 
                    type="radio" 
                    v-model="form.size" 
                    value="medium"
                  >
                  <span>Mellem</span>
                </label>
                <label class="radio-button">
                  <input 
                    type="radio" 
                    v-model="form.size" 
                    value="large"
                  >
                  <span>Stor</span>
                </label>
              </div>
            </div>

            <!-- Activity Level -->
            <div class="form-group">
              <label>AKTIVITETSNIVEAU</label>
              <div class="radio-group">
                <label class="radio-button">
                  <input 
                    type="radio" 
                    v-model="form.activityLevel" 
                    value="low"
                    required
                  >
                  <span>Rolig</span>
                </label>
                <label class="radio-button">
                  <input 
                    type="radio" 
                    v-model="form.activityLevel" 
                    value="moderate"
                  >
                  <span>Moderat</span>
                </label>
                <label class="radio-button">
                  <input 
                    type="radio" 
                    v-model="form.activityLevel" 
                    value="high"
                  >
                  <span>Meget aktiv</span>
                </label>
              </div>
            </div>

            <!-- Goes Good With -->
            <div class="form-group">
              <label>GÅR GODT MED</label>
              <div class="tag-input-group">
                <div class="tag-input">
                  <input 
                    type="text" 
                    v-model="newGoodWith"
                    @keydown.enter.prevent="addGoodWith"
                    placeholder="Skriv og tryk enter..."
                  >
                </div>
                <div class="tags-container">
                  <span 
                    v-for="(tag, index) in form.goodWith" 
                    :key="index"
                    class="tag"
                  >
                    {{ tag }}
                    <button @click="removeGoodWith(index)" class="remove-tag">×</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="form-group">
              <label>KRAV</label>
              <div class="tag-input-group">
                <div class="tag-input">
                  <input 
                    type="text" 
                    v-model="newRequirement"
                    @keydown.enter.prevent="addRequirement"
                    placeholder="Skriv og tryk enter..."
                  >
                </div>
                <div class="tags-container">
                  <span 
                    v-for="(tag, index) in form.requirements" 
                    :key="index"
                    class="tag"
                  >
                    {{ tag }}
                    <button @click="removeRequirement(index)" class="remove-tag">×</button>
                  </span>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-secondary"
                @click="currentStep = 1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                <span>Tilbage</span>
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isUpdating"
              >
                <span>{{ isUpdating ? 'Opdaterer...' : 'Gem ændringer' }}</span>
                <svg v-if="!isUpdating" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div v-else class="spinner"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'EditPetView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const petId = route.params.id
    const currentStep = ref(1)
    const form = ref({
      name: '',
      type: '',
      age: null,
      description: '',
      imageUrl: '',
      requirements: [],
      goodWith: [],
      size: 'medium',
      activityLevel: 'medium'
    })
    const error = ref(null)
    const isUpdating = ref(false)
    const imagePreview = ref(null)
    const imageFile = ref(null)
    const newRequirement = ref('')
    const newGoodWith = ref('')
    
    const petTypes = {
      dog: 'Hund',
      cat: 'Kat',
      rabbit: 'Kanin',
      bird: 'Fugl',
      fish: 'Fisk',
      reptile: 'Krybdyr',
      other: 'Andet'
    }
    
    const fetchPet = async () => {
      try {
        const petDoc = doc(db, 'pets', petId)
        const petSnapshot = await getDoc(petDoc)
        
        if (petSnapshot.exists()) {
          const petData = petSnapshot.data()
          form.value = {
            name: petData.name,
            type: petData.type,
            age: petData.age,
            description: petData.description,
            imageUrl: petData.imageUrl,
            requirements: petData.requirements || [],
            goodWith: petData.goodWith || [],
            size: petData.size || 'medium',
            activityLevel: petData.activityLevel || 'medium'
          }
          imagePreview.value = petData.imageUrl
        } else {
          error.value = 'Kæledyret blev ikke fundet'
          router.push('/pets')
        }
      } catch (err) {
        console.error('Error fetching pet:', err)
        error.value = 'Der opstod en fejl ved indlæsning af kæledyret'
      }
    }

    const triggerFileInput = () => {
      document.getElementById('image').click()
    }

    const nextStep = () => {
      if (!form.value.name || !form.value.type || !form.value.age || !form.value.description || !form.value.imageUrl) {
        error.value = 'Udfyld venligst alle felter'
        return
      }
      currentStep.value = 2
      error.value = null
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
        form.value.imageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    }
    
    const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (!file) {
        removeImage()
        return
      }
      
      if (file.size > 1024 * 1024) {
        error.value = 'Billedet er for stort (maks. 1 MB tilladt)'
        removeImage()
        return
      }
      
      imageFile.value = file
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target.result
        form.value.imageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    }
    
    const removeImage = () => {
      imagePreview.value = null
      imageFile.value = null
      form.value.imageUrl = ''
      const input = document.getElementById('image')
      if (input) input.value = ''
    }
    
    const addRequirement = () => {
      if (newRequirement.value.trim()) {
        form.value.requirements.push(newRequirement.value.trim())
        newRequirement.value = ''
      }
    }
    
    const removeRequirement = (index) => {
      form.value.requirements.splice(index, 1)
    }
    
    const addGoodWith = () => {
      if (newGoodWith.value.trim()) {
        form.value.goodWith.push(newGoodWith.value.trim())
        newGoodWith.value = ''
      }
    }
    
    const removeGoodWith = (index) => {
      form.value.goodWith.splice(index, 1)
    }
    
    const updatePet = async () => {
      error.value = null
      
      if (!form.value.name || !form.value.type || !form.value.age || !form.value.description) {
        error.value = 'Udfyld venligst alle felter'
        return
      }
      
      if (!form.value.imageUrl) {
        error.value = 'Vælg venligst et billede'
        return
      }
      
      isUpdating.value = true
      
      try {
        const petDoc = doc(db, 'pets', petId)
        await updateDoc(petDoc, {
          name: form.value.name,
          type: form.value.type,
          age: form.value.age,
          description: form.value.description,
          imageUrl: form.value.imageUrl,
          requirements: form.value.requirements,
          goodWith: form.value.goodWith,
          size: form.value.size,
          activityLevel: form.value.activityLevel
        })
        
        router.push(`/pets/${petId}`)
      } catch (err) {
        console.error('Error updating pet:', err)
        error.value = 'Der opstod en fejl ved opdatering af kæledyret.'
      } finally {
        isUpdating.value = false
      }
    }
    
    onMounted(fetchPet)
    
    return {
      form,
      error,
      isUpdating,
      imagePreview,
      petId,
      currentStep,
      handleImageChange,
      triggerFileInput,
      removeImage,
      updatePet,
      nextStep,
      handleFileDrop,
      newRequirement,
      addRequirement,
      removeRequirement,
      petTypes,
      newGoodWith,
      addGoodWith,
      removeGoodWith
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;
@use "sass:color";

.edit-pet-form {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  .form-content {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: vars.$border-radius-large;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  .step {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    border-radius: vars.$border-radius-medium;
    background: white;
    transition: all 0.3s ease;
    opacity: 0.7;
    cursor: pointer;
    
    &.active {
      opacity: 1;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .step-number {
        background: vars.$primary-color;
        color: white;
      }
      
      .step-label {
        color: vars.$text-color-dark;
      }
    }
    
    .step-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #eee;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: vars.$font-weight-bold;
      font-size: 0.9rem;
    }
    
    .step-label {
      font-weight: vars.$font-weight-medium;
      color: #666;
      font-size: 0.9rem;
    }
  }
}

.form-step {
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  width: 100%;
  min-height: 600px;

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
    }
  }

  .form-section {
    padding: 2rem;
    flex: 1;
    
    h1 {
      font-size: 1.75rem;
      font-weight: vars.$font-weight-black;
      color: vars.$text-color-dark;
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
  }
}

.requirements-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #eee;
    border-radius: vars.$border-radius-medium;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: vars.$primary-color;
      box-shadow: 0 0 0 3px rgba(vars.$primary-color, 0.1);
    }
  }
}

.requirements-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .requirement-tag {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: white;
    border: 2px solid #eee;
    color: vars.$text-color-dark;

    .remove-tag {
      background: none;
      border: none;
      color: #666;
      font-size: 1rem;
      line-height: 1;
      padding: 0;
      cursor: pointer;
      margin-left: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      
      &:hover {
        color: vars.$error-color;
      }
    }
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-weight: vars.$font-weight-bold;
    color: vars.$text-color-dark;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }

  input[type="text"],
  input[type="number"],
  select,
  textarea {
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: 2px solid #eee;
    border-radius: vars.$border-radius-medium;
    font-size: 0.95rem;
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
    min-height: 100px;
    resize: vertical;
  }
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.radio-button {
  flex: 1;
  min-width: 100px;
  
  input {
    display: none;
    
    &:checked + span {
      background: vars.$primary-color;
      color: white;
      border-color: vars.$primary-color;
    }
  }
  
  span {
    display: block;
    padding: 0.4rem 0.6rem;
    border: 1px solid #eee;
    border-radius: vars.$border-radius-medium;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
    
    &:hover {
      border-color: vars.$primary-color;
      color: vars.$primary-color;
    }
  }
}
</style> 