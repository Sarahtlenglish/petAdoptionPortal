<template>
  <div class="edit-pet">
    <div class="edit-pet-content">
      <div class="image-section">
        <div class="image-upload">
          <label>Billede</label>
          <input 
            type="file" 
            id="image"
            @change="handleImageChange"
            accept="image/*"
            class="file-input"
          >
          <div class="upload-placeholder" @click="triggerFileInput">
            <div class="upload-content">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                <line x1="16" y1="5" x2="22" y2="5"/>
                <line x1="19" y1="2" x2="19" y2="8"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span>Klik for at vælge nyt billede</span>
              <small>eller træk og slip (maks. 1 MB)</small>
            </div>
          </div>
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Preview">
            <button type="button" class="remove-image" @click="removeImage">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="header">
          <h1>Rediger {{ form.name }}</h1>
          <p class="subtitle">Opdater information om kæledyret</p>
        </div>

        <form @submit.prevent="updatePet">
          <div class="form-group">
            <label for="name">Navn</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              placeholder="F.eks. Flemming"
              required
            >
          </div>
          
          <div class="form-group inline-group">
            <div>
              <label for="type">Type</label>
              <select 
                id="type" 
                v-model="form.type" 
                required
              >
                <option value="">Vælg type</option>
                <option value="dog">Hund</option>
                <option value="cat">Kat</option>
                <option value="rabbit">Kanin</option>
                <option value="bird">Fugl</option>
                <option value="other">Andet</option>
              </select>
            </div>
            
            <div>
              <label for="age">Alder (år)</label>
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
            <label for="description">Beskrivelse</label>
            <textarea 
              id="description" 
              v-model="form.description" 
              rows="4"
              placeholder="Fortæl lidt om kæledyrets personlighed..."
              required
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isUpdating">
              <span>{{ isUpdating ? 'Opdaterer...' : 'Gem ændringer' }}</span>
              <svg v-if="!isUpdating" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              <div v-else class="spinner"></div>
            </button>
            
            <router-link :to="'/pets/' + petId" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              <span>Annuller</span>
            </router-link>
          </div>
          
          <div v-if="error" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ error }}</span>
          </div>
        </form>
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
    const form = ref({
      name: '',
      type: '',
      age: null,
      description: '',
      imageUrl: ''
    })
    const error = ref(null)
    const isUpdating = ref(false)
    const imagePreview = ref(null)
    const imageFile = ref(null)
    
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
            imageUrl: petData.imageUrl
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
          imageUrl: form.value.imageUrl
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
      handleImageChange,
      triggerFileInput,
      removeImage,
      updatePet
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;
@use "sass:color";

.edit-pet {
  width: 100%;
  height: 100%;
  padding: 1rem;
  
  .edit-pet-content {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 2rem;
    background: white;
    border-radius: vars.$border-radius-large;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    min-height: 0;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      margin: 0;
    }
    
    .image-section {
      position: relative;
      background: linear-gradient(135deg, vars.$primary-color, color.adjust(vars.$primary-color, $lightness: -10%));
      padding: 1.5rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      @media (max-width: 768px) {
        height: 300px;
      }

      .image-upload {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        label {
          color: white;
          font-size: 0.75rem;
          font-weight: vars.$font-weight-medium;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
      
      .file-input {
        display: none;
      }
      
      .upload-placeholder {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed rgba(255, 255, 255, 0.5);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 1rem;
        
        .upload-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          
          svg {
            width: 32px;
            height: 32px;
            stroke: white;
          }
          
          span {
            font-weight: vars.$font-weight-medium;
            font-size: 1rem;
          }
          
          small {
            opacity: 0.7;
            font-size: 0.85rem;
          }
        }
      }
      
      .image-preview {
        position: absolute;
        inset: 1.5rem;
        overflow: hidden;
        border-radius: 1rem;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1rem;
        }
        
        .remove-image {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 2;
          padding: 0;
          
          &:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.1);
          }
          
          svg {
            width: 20px;
            height: 20px;
            stroke: white;
            stroke-width: 2.5;
          }
        }
      }
    }
    
    .form-section {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      text-align: left;
      
      .header {
        margin-bottom: 1.25rem;
        
        h1 {
          font-size: 1.75rem;
          font-weight: vars.$font-weight-black;
          color: vars.$text-color-dark;
          margin-bottom: 0.375rem;
          line-height: 1.2;
        }
        
        .subtitle {
          color: #666;
          font-size: 0.9rem;
        }
      }
      
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          
          &.inline-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            
            > div {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
            }
            
            input, select {
              width: 100%;
              height: 38px;
            }
          }
          
          label {
            font-size: 0.75rem;
            font-weight: vars.$font-weight-medium;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666;
          }
          
          input, select, textarea {
            padding: 0.5rem 0.75rem;
            border: 2px solid #eee;
            border-radius: vars.$border-radius-medium;
            font-size: 0.9rem;
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
            resize: vertical;
            min-height: 80px;
            max-height: 120px;
          }
        }
        
        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
          
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: vars.$border-radius-medium;
            font-weight: vars.$font-weight-bold;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            
            svg {
              width: 16px;
              height: 16px;
              transition: transform 0.3s ease;
            }
            
            &.btn-primary {
              background: vars.$primary-color;
              color: white;
              border: none;
              flex: 1;
              justify-content: center;
              
              &:hover:not(:disabled) {
                background: color.adjust(vars.$primary-color, $lightness: -5%);
                transform: translateY(-2px);
                
                svg {
                  transform: translateX(4px);
                }
              }
              
              &:disabled {
                opacity: 0.7;
                cursor: not-allowed;
              }
              
              .spinner {
                width: 16px;
                height: 16px;
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
                
                svg {
                  color: vars.$primary-color;
                  transform: translateX(-4px);
                }
              }
            }
          }
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(vars.$error-color, 0.1);
          border-radius: vars.$border-radius-medium;
          color: vars.$error-color;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          
          svg {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 