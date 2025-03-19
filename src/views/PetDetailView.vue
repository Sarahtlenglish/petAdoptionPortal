<template>
  <div class="pet-detail">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>Indlæser...</span>
    </div>
    
    <div v-else-if="error" class="error">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h2>Ups! Der skete en fejl</h2>
      <p>{{ error }}</p>
      <router-link to="/pets" class="btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        <span>Tilbage til oversigten</span>
      </router-link>
    </div>
    
    <div v-else class="pet-content" :class="{ 'is-adopted': pet.adopted }">
      <div class="image-section">
        <img :src="pet.imageUrl" :alt="pet.name">
        <div v-if="pet.adopted" class="adopted-badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Adopteret</span>
        </div>
      </div>
      
      <div class="info-section">
        <div class="header">
          <h1>{{ pet.name }}</h1>
          <div class="meta">
            <span class="tag" :style="{ backgroundColor: getCategoryColor(pet.type) }">
              {{ formatType(pet.type) }}
            </span>
            <span class="age">{{ pet.age }} år</span>
          </div>
        </div>
        
        <!-- Waiting Time Counter -->
        <div v-if="!pet.adopted" class="waiting-counter">
          <div class="counter-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{{ waitingTimeText }}</span>
          </div>
        </div>
        
        <div class="description">
          <p>{{ pet.description }}</p>
        </div>
        
        <div class="actions">
          <button 
            class="btn btn-primary" 
            @click="adoptPet"
            :disabled="pet.adopted || isAdopting"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 8v13H3V8"/>
              <path d="M1 3h22v5H1z"/>
              <path d="M10 12h4"/>
            </svg>
            <span>{{ pet.adopted ? 'Allerede adopteret' : isAdopting ? 'Adopterer...' : `Adoptér ${pet.name}` }}</span>
            <div v-if="isAdopting" class="spinner"></div>
          </button>
          
          <router-link :to="`/pets/${petId}/edit`" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
            <span>Redigér</span>
          </router-link>
          
          <button class="btn btn-danger" @click="confirmDelete">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            <span>Slet</span>
          </button>
        </div>
      </div>
      </div>
      
    <div v-if="showDeleteDialog" class="dialog-overlay" @click.self="showDeleteDialog = false">
      <div class="dialog">
        <h2>Slet {{ pet.name }}?</h2>
        <p>Er du sikker på, at du vil slette {{ pet.name }}? Denne handling kan ikke fortrydes.</p>
        <div class="dialog-actions">
          <button class="btn btn-danger" @click="deletePet" :disabled="isDeleting">
            <span>{{ isDeleting ? 'Sletter...' : 'Ja, slet' }}</span>
            <div v-if="isDeleting" class="spinner"></div>
          </button>
          <button class="btn btn-secondary" @click="showDeleteDialog = false" :disabled="isDeleting">
            <span>Annuller</span>
        </button>
        </div>
      </div>
    </div>

    <!-- Adoption Info Dialog -->
    <div v-if="showAdoptDialog" class="dialog-overlay" @click.self="showAdoptDialog = false">
      <div class="dialog">
        <h2>Adoptér {{ pet.name }}</h2>
        <p>Dette er en prototype. I en rigtig version ville du nu blive ført videre til en adoptionsformular, hvor du kan udfylde dine kontaktoplysninger og starte adoptionsprocessen.</p>
        <div class="dialog-actions">
          <button class="btn btn-primary" @click="completeAdoption" :disabled="isAdopting">
            <span>{{ isAdopting ? 'Behandler...' : 'Forstået, fortsæt' }}</span>
            <div v-if="isAdopting" class="spinner"></div>
          </button>
          <button class="btn btn-secondary" @click="showAdoptDialog = false">
            <span>Annuller</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'PetDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const petId = route.params.id
    const pet = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const showDeleteDialog = ref(false)
    const isDeleting = ref(false)
    const isAdopting = ref(false)
    const showAdoptDialog = ref(false)
    
    const categoryColors = {
      'dog': '#4ecdc4',
      'cat': '#ff6b6b',
      'rabbit': '#ffd93d',
      'bird': '#6c5ce7',
      'fish': '#00b8a9',
      'reptile': '#a8e6cf',
      'other': '#9656a1'
    }
    
    const getCategoryColor = (type) => {
      return categoryColors[type?.toLowerCase()] || categoryColors.other
    }

    const formatType = (type) => {
      const types = {
        dog: 'Hund',
        cat: 'Kat',
        rabbit: 'Kanin',
        bird: 'Fugl',
        other: 'Andet'
      }
      return types[type?.toLowerCase()] || 'Andet'
    }

    const fetchPet = async () => {
      try {
        const petDoc = doc(db, 'pets', petId)
        const petSnapshot = await getDoc(petDoc)
        
        if (petSnapshot.exists()) {
          pet.value = { id: petSnapshot.id, ...petSnapshot.data() }
          updateWaitingTime()
        } else {
          error.value = 'Kæledyret blev ikke fundet'
        }
      } catch (err) {
        console.error('Error fetching pet:', err)
        error.value = 'Der opstod en fejl ved indlæsning af kæledyret'
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = () => {
      showDeleteDialog.value = true
    }
    
    const deletePet = async () => {
      if (isDeleting.value) return
      
      isDeleting.value = true
      
      try {
        const petDoc = doc(db, 'pets', petId)
        await deleteDoc(petDoc)
        router.push('/pets')
      } catch (err) {
        console.error('Error deleting pet:', err)
        error.value = 'Der opstod en fejl ved sletning af kæledyret'
        showDeleteDialog.value = false
      } finally {
        isDeleting.value = false
      }
    }

    const adoptPet = () => {
      showAdoptDialog.value = true
    }
    
    const completeAdoption = async () => {
      if (isAdopting.value || pet.value.adopted) return
      
      isAdopting.value = true
      
      try {
        const petDoc = doc(db, 'pets', petId)
        await updateDoc(petDoc, {
          adopted: true,
          adoptedAt: new Date()
        })
        
        // Update local state
        pet.value = {
          ...pet.value,
          adopted: true,
          adoptedAt: new Date()
        }
        
        // Close the dialog
        showAdoptDialog.value = false
      } catch (err) {
        console.error('Error adopting pet:', err)
        error.value = 'Der opstod en fejl ved adoption af kæledyret'
      } finally {
        isAdopting.value = false
      }
    }

    const waitingTime = ref({ days: 0, hours: 0, minutes: 0 })
    let timerInterval

    const updateWaitingTime = () => {
      if (!pet.value?.createdAt) return;
      
      const now = new Date()
      const created = pet.value.createdAt.toDate()
      const diff = now - created
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      waitingTime.value = { days, hours, minutes }
    }

    const waitingTimeText = computed(() => {
      if (!pet.value?.createdAt) return '';
      
      const now = new Date();
      const created = pet.value.createdAt.toDate();
      const diffMinutes = Math.floor((now - created) / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        return `Har ventet ${diffDays} ${diffDays === 1 ? 'dag' : 'dage'} på et nyt hjem`;
      } else if (diffHours > 0) {
        return `Har ventet ${diffHours} ${diffHours === 1 ? 'time' : 'timer'} på et nyt hjem`;
      } else {
        return `Har ventet ${diffMinutes} ${diffMinutes === 1 ? 'minut' : 'minutter'} på et nyt hjem`;
      }
    });

    onMounted(() => {
      fetchPet()
      timerInterval = setInterval(() => {
        if (pet.value?.createdAt) {
          updateWaitingTime();
        }
      }, 60000)
    })

    onUnmounted(() => {
      if (timerInterval) clearInterval(timerInterval)
    })

    return {
      pet,
      petId,
      loading,
      error,
      getCategoryColor,
      formatType,
      showDeleteDialog,
      isDeleting,
      confirmDelete,
      deletePet,
      isAdopting,
      adoptPet,
      showAdoptDialog,
      completeAdoption,
      waitingTime,
      waitingTimeText
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;
@use "sass:color";

.pet-detail {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: vars.$border-radius-large;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .loading, .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    height: 100%;
    text-align: center;
    
    svg {
      width: 32px;
      height: 32px;
    color: vars.$primary-color;
  }
  
    h2 {
      font-size: 1.5rem;
      font-weight: vars.$font-weight-bold;
      color: vars.$text-color-dark;
      margin: 0;
    }
    
    p {
      color: #666;
      margin: 0;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 2px solid #eee;
      border-radius: vars.$border-radius-medium;
      color: vars.$text-color-dark;
      font-weight: vars.$font-weight-bold;
      text-decoration: none;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: vars.$primary-color;
        color: vars.$primary-color;
        transform: translateY(-2px);
        
        svg {
          color: vars.$primary-color;
          transform: translateX(-4px);
        }
      }
      
      svg {
        width: 16px;
        height: 16px;
        transition: transform 0.3s ease;
      }
    }
    
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(vars.$primary-color, 0.3);
      border-top: 3px solid vars.$primary-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
  
  .pet-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .image-section {
      height: 600px;
      position: relative;
      background-color: #f8f9fa;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: filter 0.3s ease;
      }
    }
    
    &.is-adopted {
      opacity: 0.8;
      filter: grayscale(30%);

      .image-section {
        img {
          filter: none;
        }
      }

      .adopted-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 6px;
        backdrop-filter: blur(4px);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        
        svg {
          width: 14px;
          height: 14px;
          stroke: white;
        }
      }
    }
    
    .info-section {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      text-align: left;
      
      .header {
        margin-bottom: 1.25rem;
        
        h1 {
          font-size: 2rem;
          font-weight: vars.$font-weight-black;
          color: vars.$text-color-dark;
          margin: 0 0 0.5rem;
          line-height: 1.2;
        }
        
        .meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #ffffff;
          font-size: 0.9rem;
          
          .age {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
          }
        }
      }
      
      .waiting-counter {
        background: rgba(vars.$primary-color, 0.1);
        border-radius: vars.$border-radius-large;
        padding: 1rem;
        margin: 1rem 0;
        
        .counter-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: vars.$primary-color;
          font-weight: vars.$font-weight-medium;
          
          svg {
            width: 1.25rem;
            height: 1.25rem;
          }
        }
      }
      
      .description {
        flex: 1;
        margin-bottom: 1.5rem;
        
        p {
          margin: 0;
          line-height: 1.6;
          color: vars.$text-color-dark;
        }
      }
      
      .actions {
        display: flex;
        gap: 0.75rem;
        
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
            
            &:hover {
              background: color.adjust(vars.$primary-color, $lightness: -5%);
              transform: translateY(-2px);
              
              svg {
                transform: translateX(4px);
              }
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
              }
            }
          }
          
          &.btn-danger {
            background: white;
            color: vars.$error-color;
            border: 2px solid #eee;
            
            &:hover {
              border-color: vars.$error-color;
              transform: translateY(-2px);
              
              svg {
                transform: translateX(-2px);
              }
            }
            
            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
              transform: none;
              
              svg {
                transform: none;
              }
            }
          }
        }
      }
    }
  }
  
  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 100;
    
    .dialog {
      background: white;
      border-radius: vars.$border-radius-large;
      padding: 1.5rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
      
      h2 {
        font-size: 1.5rem;
        font-weight: vars.$font-weight-bold;
        color: vars.$text-color-dark;
        margin: 0 0 0.75rem;
      }
      
      p {
        color: #666;
        margin: 0 0 1.5rem;
        line-height: 1.6;
      }
      
      .dialog-actions {
        display: flex;
        gap: 0.75rem;
        
        .btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: vars.$border-radius-medium;
          font-weight: vars.$font-weight-bold;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &.btn-danger {
            background: vars.$error-color;
            color: white;
            border: none;
            
            &:hover:not(:disabled) {
              background: color.adjust(vars.$error-color, $lightness: -5%);
              transform: translateY(-2px);
            }
            
            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
              transform: none;
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
            
            &:hover:not(:disabled) {
              border-color: vars.$primary-color;
              color: vars.$primary-color;
              transform: translateY(-2px);
            }
            
            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
              transform: none;
            }
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

.dialog {
  h2 {
    color: vars.$primary-color;
  }
  
  &.adoption-dialog {
    max-width: 450px;
    
    p {
      margin-bottom: 2rem;
    }
  }
}
</style> 