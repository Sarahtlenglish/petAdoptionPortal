<template>
  <div class="pet-detail">
    <div v-if="loading" class="loading">
      <div class="paw-icon">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 119.72 122.88">
          <path class="st0" d="M40.06,0.37c9.4,0,17.03,11.69,17.03,26.1s-7.63,26.1-17.03,26.1c-9.4,0-17.03-11.68-17.03-26.1 C23.04,12.06,30.66,0.37,40.06,0.37L40.06,0.37z M61.71,63.55c19.94,0.04,22.42,13.25,39.23,35.86 c8.38,16.45-2.5,26.82-21.15,22.38c-8.46-4.31-14.41-5.83-20.38-5.63c-10.34,0.36-12.95,7.18-24.98,6.7 c-9.28-0.25-13.46-4.14-14.27-10.07c-0.87-6.3,1.56-10.28,4.52-15.49C36.18,77.02,48.07,61.01,61.71,63.55L61.71,63.55L61.71,63.55 z M7.17,39.08C0.14,41.86-2.1,52.85,2.16,63.62C6.42,74.39,15.57,80.87,22.6,78.09c7.03-2.78,9.27-13.77,5.01-24.54 C23.35,42.78,14.2,36.3,7.17,39.08L7.17,39.08z M112.55,39.08c7.03,2.78,9.27,13.77,5.01,24.54 c-4.26,10.77-13.42,17.25-20.44,14.47c-7.03-2.78-9.27-13.77-5.01-24.54C96.37,42.78,105.52,36.3,112.55,39.08L112.55,39.08z M79.35,0c9.4,0,17.03,11.69,17.03,26.1s-7.63,26.1-17.03,26.1c-9.4,0-17.03-11.68-17.03-26.1C62.33,11.69,69.95,0,79.35,0L79.35,0 z"/>
        </svg>
      </div>
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
        <div v-if="!pet.adopted" class="waiting-badge">
          {{ waitingTimeText }}
        </div>
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
          <div class="title-row">
            <h1>{{ pet.name }}</h1>
            <div class="badges">
              <span 
                class="type-badge"
                :style="{ 
                  backgroundColor: getCategoryColor(pet.type)
                }"
              >{{ formatType(pet.type) }}</span>
              <span 
                class="age-badge"
                :style="{ 
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  color: '#ff6b6b'
                }"
              >{{ pet.age }} år</span>
            </div>
          </div>
        </div>

        <div class="description">
          <p>{{ pet.description }}</p>
        </div>

        <div class="pet-attributes">
          <div class="attribute-row">
            <span class="attribute-label">Størrelse</span>
            <div class="attribute-value">
              <div class="size-paws">
                <div 
                  v-for="n in 3" 
                  :key="n"
                  class="paw"
                  :class="{ filled: n <= getSizePaws(pet.size) }"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 119.72 122.88">
                    <path class="st0" d="M40.06,0.37c9.4,0,17.03,11.69,17.03,26.1s-7.63,26.1-17.03,26.1c-9.4,0-17.03-11.68-17.03-26.1 C23.04,12.06,30.66,0.37,40.06,0.37L40.06,0.37z M61.71,63.55c19.94,0.04,22.42,13.25,39.23,35.86 c8.38,16.45-2.5,26.82-21.15,22.38c-8.46-4.31-14.41-5.83-20.38-5.63c-10.34,0.36-12.95,7.18-24.98,6.7 c-9.28-0.25-13.46-4.14-14.27-10.07c-0.87-6.3,1.56-10.28,4.52-15.49C36.18,77.02,48.07,61.01,61.71,63.55L61.71,63.55L61.71,63.55 z M7.17,39.08C0.14,41.86-2.1,52.85,2.16,63.62C6.42,74.39,15.57,80.87,22.6,78.09c7.03-2.78,9.27-13.77,5.01-24.54 C23.35,42.78,14.2,36.3,7.17,39.08L7.17,39.08z M112.55,39.08c7.03,2.78,9.27,13.77,5.01,24.54 c-4.26,10.77-13.42,17.25-20.44,14.47c-7.03-2.78-9.27-13.77-5.01-24.54C96.37,42.78,105.52,36.3,112.55,39.08L112.55,39.08z M79.35,0c9.4,0,17.03,11.69,17.03,26.1s-7.63,26.1-17.03,26.1c-9.4,0-17.03-11.68-17.03-26.1C62.33,11.69,69.95,0,79.35,0L79.35,0 z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="attribute-row">
            <span class="attribute-label">Aktivitetsniveau</span>
            <div class="attribute-value">
              <div class="activity-bar">
                <div 
                  class="activity-fill"
                  :style="{ width: getActivityWidth(pet.activityLevel) }"
                ></div>
                <div class="activity-markers">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="attribute-row">
            <span class="attribute-label">Går godt med</span>
            <div class="compatibility-tags">
              <span 
                v-for="tag in pet.goodWith"
                :key="tag"
              >{{ tag }}</span>
              <span 
                v-if="!pet.goodWith || pet.goodWith.length === 0"
                class="no-requirements"
              >
                Ingen angivelser
              </span>
            </div>
          </div>

          <div class="attribute-row">
            <span class="attribute-label">Krav</span>
            <div class="requirements-tags">
              <span 
                v-for="tag in pet.requirements"
                :key="tag"
              >{{ tag }}</span>
              <span 
                v-if="!pet.requirements || pet.requirements.length === 0"
                class="no-requirements"
              >
                Ingen særlige krav
              </span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button 
            class="btn btn-primary" 
            @click="adoptPet"
            :disabled="pet.adopted || isAdopting"
            :style="buttonStyles.primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 8v13H3V8"/>
              <path d="M1 3h22v5H1z"/>
              <path d="M10 12h4"/>
            </svg>
            <span>{{ pet.adopted ? 'Allerede adopteret' : isAdopting ? 'Adopterer...' : `Adoptér ${pet.name}` }}</span>
            <div v-if="isAdopting" class="spinner"></div>
          </button>
          
          <router-link 
            :to="`/pets/${petId}/edit`" 
            class="btn btn-secondary"
            :style="buttonStyles.secondary"
          >
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

    <!-- Adoption Success Message -->
    <div v-if="showAdoptionSuccess" class="adoption-success">
      <div class="confetti-container">
        <div v-for="n in 150" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
      </div>
      <div class="success-message">
        <h2>Tillykke med din nye bedste ven!</h2>
        <p>{{ pet.name }} har fundet sit forever home hos dig 🎉</p>
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
    const showAdoptionSuccess = ref(false)
    
    const categoryColors = {
      'dog': '#4ecdc4',    // Mint
      'cat': '#f15bb5',    // Pink
      'rabbit': '#ffa45c', // Orange
      'bird': '#4361ee',   // Blue
      'fish': '#00b8a9',   // Teal
      'reptile': '#a8e6cf',// Sage
      'other': '#9656a1'   // Purple
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
        fish: 'Fisk',
        reptile: 'Krybdyr',
        other: 'Andet'
      }
      return types[type?.toLowerCase()] || 'Andet'
    }

    const hexToRgb = (hex) => {
      // Remove the hash if it exists
      hex = hex.replace('#', '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      // Return the RGB values as a string
      return `${r}, ${g}, ${b}`;
    };

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
    
    const getConfettiStyle = (n) => {
      const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#6c5ce7', '#a8e6cf']
      const randomX = Math.random() * 100;
      const randomScale = Math.random() * 0.8 + 0.2;
      const randomRotation = Math.random() * 360;
      const randomDelay = Math.random() * 4; // Increased max delay to 4 seconds
      const randomDuration = Math.random() * 3 + 3; // Duration between 3-6 seconds
      const randomDistance = Math.random() * 150 + 100;

      return {
        '--x': `${randomX}vw`,
        '--initial-y': `-${Math.random() * 100}%`,
        '--scale': randomScale,
        '--rotation': `${randomRotation}deg`,
        '--delay': `${randomDelay}s`,
        '--duration': `${randomDuration}s`,
        '--distance': `${randomDistance}vh`,
        'background-color': colors[Math.floor(Math.random() * colors.length)],
        '--size': `${Math.random() * 1 + 0.5}rem`
      }
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
        
        // Close the dialog and show success message with confetti
        showAdoptDialog.value = false
        showAdoptionSuccess.value = true
        
        // Hide success message after 8 seconds instead of 5
        setTimeout(() => {
          showAdoptionSuccess.value = false
        }, 8000)
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

    const getSizePaws = (size) => {
      switch(size?.toLowerCase()) {
        case 'small': return 1;
        case 'medium': return 2;
        case 'large': return 3;
        default: return 0;
      }
    };

    const formatSize = (size) => {
      switch(size) {
        case 'small': return 'Lille';
        case 'medium': return 'Mellem';
        case 'large': return 'Stor';
        default: return 'Ukendt';
      }
    };

    const getActivityWidth = (level) => {
      switch(level?.toLowerCase()) {
        case 'low': return '33%';
        case 'moderate': return '66%';
        case 'high': return '100%';
        default: return '0%';
      }
    };

    const formatActivity = (level) => {
      switch(level) {
        case 'low': return 'Rolig';
        case 'moderate': return 'Moderat';
        case 'high': return 'Meget aktiv';
        default: return 'Ukendt';
      }
    };

    const buttonStyles = computed(() => {
      return {
        primary: {
          backgroundColor: '#ff6b6b'
        },
        secondary: {
          color: '#ff6b6b',
          borderColor: '#ff6b6b'
        }
      };
    });

    const hasAnyRequirements = computed(() => {
      return pet.value?.requirements?.experience || 
             pet.value?.requirements?.garden || 
             pet.value?.requirements?.otherPets;
    })

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
      hexToRgb,
      showDeleteDialog,
      isDeleting,
      confirmDelete,
      deletePet,
      isAdopting,
      adoptPet,
      showAdoptDialog,
      completeAdoption,
      waitingTime,
      waitingTimeText,
      showAdoptionSuccess,
      getConfettiStyle,
      getSizePaws,
      formatSize,
      getActivityWidth,
      formatActivity,
      buttonStyles,
      hasAnyRequirements
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;
@use "sass:color";

.pet-detail {
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
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
    grid-template-columns: 400px 1fr;
    background: white;
    border-radius: 24px;
    overflow: hidden;
    min-height: 500px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .image-section {
      height: 100%;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
      }

      .waiting-badge {
        position: absolute;
        bottom: 15px;
        left: 15px;
        background: rgba(255, 107, 107, 0.95);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(4px);
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
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .header {
        .title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;

          h1 {
            font-size: 2rem;
            font-weight: 900;
            margin: 0;
            color: #2d3436;
          }

          .badges {
            display: flex;
            gap: 0.5rem;
            
            .type-badge, .age-badge {
              display: inline-flex;
              align-items: center;
              padding: 0.35rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.8rem;
              font-weight: 500;
              line-height: 1;
            }

            .type-badge {
              color: white;
            }
          }
        }
      }

      .waiting-notice {
        display: none;
      }
      
      .description {
        color: #2d3436;
        line-height: 1.5;
        margin-bottom: 1rem;
      }

      .pet-attributes {
        margin: .5rem 0;
        padding: 0;
        background: white;
        border-radius: vars.$border-radius-medium;
        border: 1px solid #eee;

        .attribute-row {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          
          &:nth-child(even) {
            background: #f8f9fa;
          }
          
          &:last-child {
            border-bottom: none;
          }

          .attribute-label {
            min-width: 140px;
            color: #666;
            font-size: 0.9rem;
          }
          
          .attribute-value {
            color: vars.$text-color-dark;
            font-weight: vars.$font-weight-medium;
            display: flex;
            align-items: center;
            gap: 1.5rem;

            .size-paws {
              display: flex;
              gap: 0.5rem;
              align-items: center;

              .paw {
                width: 20px;
                height: 20px;
                opacity: 0.2;
                transition: all 0.3s ease;

                &.filled {
                  opacity: 1;
                  transform: scale(1.1);
                }

                svg {
                  width: 100%;
                  height: 100%;
                  fill: #888;
                }
              }
            }

            .activity-bar {
              position: relative;
              width: 180px;
              height: 8px;
              background: rgba(255, 107, 107, 0.1);
              border-radius: 4px;
              overflow: hidden;
              
              .activity-fill {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: #ff6b6b;
                border-radius: 4px;
                transition: width 0.3s ease;
              }
              
              .activity-markers {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 100%;
                display: flex;
                justify-content: space-between;
                padding: 0 33%;
                pointer-events: none;
                
                span {
                  width: 1px;
                  height: 100%;
                  background: rgba(255, 107, 107, 0.2);
                }
              }
            }
          }

          .compatibility-tags, .requirements-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;

            span {
              display: inline-flex;
              align-items: center;
              padding: 0.35rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.8rem;
              font-weight: 500;
              line-height: 1;
              background-color: white;
              border: 1px solid rgba(0, 0, 0, 0.08);
              color: #888;
            }
          }
        }
      }

      .actions {
        margin-top: 2rem;
        display: flex;
        gap: 0.5rem;

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
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
            color: white;
            border: none;
            flex: 1;
            justify-content: center;
            
            &:hover {
              filter: brightness(0.9);
              transform: translateY(-2px);
              
              svg {
                transform: translateX(4px);
              }
            }
          }

          &.btn-secondary {
            background: white;
            border: 2px solid #eee;
            
            &:hover {
              transform: translateY(-2px);
              opacity: 0.8;
              
              svg {
                transform: translateX(2px);
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

  .adoption-success {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .success-message {
      background: rgba(255, 255, 255, 0.98);
      padding: 3rem;
      border-radius: 1rem;
      text-align: center;
      animation: fadeInUp 0.5s ease forwards;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 10000;
      max-width: 600px;
      width: 90%;

      h2 {
        background: linear-gradient(45deg, vars.$primary-color, color.adjust(vars.$primary-color, $lightness: -10%));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.5rem;
        font-weight: vars.$font-weight-black;
        margin: 0 0 1.5rem;
        line-height: 1.2;
      }

      p {
        font-size: 1.4rem;
        margin: 0;
        color: vars.$text-color-dark;
        font-weight: vars.$font-weight-medium;
      }
    }

    .confetti-container {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      pointer-events: none;
    }

    .confetti {
      position: fixed;
      top: var(--initial-y);
      left: var(--x);
      width: var(--size);
      height: var(--size);
      animation: confettiDrop var(--duration) var(--delay) ease-out forwards;
      transform-origin: center;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes confettiDrop {
  0% {
    opacity: 1;
    transform: 
      translateY(0)
      rotate(0deg)
      scale(var(--scale));
  }
  
  20% {
    opacity: 1;
    transform: 
      translateY(20vh)
      rotate(45deg)
      scale(var(--scale));
  }
  
  40% {
    opacity: 1;
    transform: 
      translateY(40vh)
      rotate(90deg)
      scale(calc(var(--scale) * 0.9));
  }
  
  60% {
    opacity: 1;
    transform: 
      translateY(60vh)
      rotate(180deg)
      scale(calc(var(--scale) * 0.8));
  }
  
  80% {
    opacity: 0.7;
    transform: 
      translateY(80vh)
      rotate(360deg)
      scale(calc(var(--scale) * 0.7));
  }
  
  100% {
    opacity: 0;
    transform: 
      translateY(var(--distance))
      rotate(calc(var(--rotation) * 2))
      scale(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  min-height: 400px;
  text-align: center;
  padding: 2rem;
  
  .paw-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 0.5rem;
    
    svg {
      width: 100%;
      height: 100%;
      fill: vars.$primary-color;
      animation: pulse 2s infinite;
    }
  }
  
  span {
    color: #666;
    font-size: 1.1rem;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.requirements-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  span {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .no-requirements {
    color: #666;
    font-style: italic;
  }
}

.size-paws {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  .paw {
    width: 20px;
    height: 20px;
    opacity: 0.2;
    transition: all 0.3s ease;

    &.filled {
      opacity: 1;
      transform: scale(1.1);
    }

    svg {
      width: 100%;
      height: 100%;
      fill: #888;
    }
  }
}

.activity-bar {
  position: relative;
  width: 180px;
  height: 8px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  overflow: hidden;
  
  .activity-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #ff6b6b;
  }
  
  .activity-markers {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 33%;
    pointer-events: none;
    
    span {
      width: 1px;
      height: 100%;
      background: rgba(255, 107, 107, 0.2);
    }
  }
}

.energy-waves {
  display: none;
}
</style> 