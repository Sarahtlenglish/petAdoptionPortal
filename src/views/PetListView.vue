<template>
  <div class="pet-list-view">
    <div class="list-header">
      <h1>Find din nye ven</h1>
      
      <!-- Type Filter Tags -->
      <div class="type-filter-tags">
        <button 
          v-for="type in petTypes" 
          :key="type.value"
          class="tag clickable"
          :class="{ active: filters.type === type.value }"
          :style="{ 
            '--tag-color': type.color,
            '--tag-hover-color': type.hoverColor 
          }"
          @click="setTypeFilter(type.value)"
        >
          {{ type.label }}
        </button>
      </div>

      <div class="filter-controls">
        <!-- Filter Dropdown -->
        <div class="control-group">
          <button 
            class="control-button"
            :class="{ active: showFilters }"
            @click="showFilters = !showFilters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>Filtrér efter alder</span>
          </button>
          
          <div v-if="showFilters" class="filter-dropdown">
            <div class="filter-section">
              <h3>Alder</h3>
              <div class="age-range">
                <button 
                  v-for="age in ageRanges" 
                  :key="age.value"
                  class="age-button"
                  :class="{ active: filters.age === age.value }"
                  @click="filters.age = age.value"
                >
                  {{ age.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sort Dropdown -->
        <div class="control-group">
          <button 
            class="control-button"
            :class="{ active: showSort }"
            @click="showSort = !showSort"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 5h10M11 9h7M11 13h4M3 17h18M3 5l4 4M7 9L3 5M3 13l4-4M7 9l-4 4"/>
            </svg>
            <span>Sortering</span>
          </button>
          
          <div v-if="showSort" class="sort-dropdown">
            <button 
              v-for="option in sortOptions" 
              :key="option.value"
              class="sort-option"
              :class="{ active: sortBy === option.value }"
              @click="sortBy = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Adopted Toggle -->
        <label class="adopted-toggle">
          <input 
            type="checkbox" 
            v-model="filters.showAdopted"
          >
          <span class="toggle-switch"></span>
          <span class="toggle-label">Vis adopterede</span>
        </label>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="paw-icon">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 119.72 122.88">
          <path class="st0" d="M40.06,0.37c9.4,0,17.03,11.69,17.03,26.1s-7.63,26.1-17.03,26.1c-9.4,0-17.03-11.68-17.03-26.1 C23.04,12.06,30.66,0.37,40.06,0.37L40.06,0.37z M61.71,63.55c19.94,0.04,22.42,13.25,39.23,35.86 c8.38,16.45-2.5,26.82-21.15,22.38c-8.46-4.31-14.41-5.83-20.38-5.63c-10.34,0.36-12.95,7.18-24.98,6.7 c-9.28-0.25-13.46-4.14-14.27-10.07c-0.87-6.3,1.56-10.28,4.52-15.49C36.18,77.02,48.07,61.01,61.71,63.55L61.71,63.55L61.71,63.55 z M7.17,39.08C0.14,41.86-2.1,52.85,2.16,63.62C6.42,74.39,15.57,80.87,22.6,78.09c7.03-2.78,9.27-13.77,5.01-24.54 C23.35,42.78,14.2,36.3,7.17,39.08L7.17,39.08z M112.55,39.08c7.03,2.78,9.27,13.77,5.01,24.54 c-4.26,10.77-13.42,17.25-20.44,14.47c-7.03-2.78-9.27-13.77-5.01-24.54C96.37,42.78,105.52,36.3,112.55,39.08L112.55,39.08z M79.35,0c9.4,0,17.03,11.69,17.03,26.1s-7.63,26.1-17.03,26.1c-9.4,0-17.03-11.68-17.03-26.1C62.33,11.69,69.95,0,79.35,0L79.35,0 z"/>
        </svg>
      </div>
      <p>Finder kæledyr...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ error }}</p>
      <button @click="fetchPets" class="retry-button">Prøv igen</button>
    </div>
    
    <div v-else-if="filteredPets.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 2L2 22M2 2l20 20M12 12v.01"/>
      </svg>
      <p>Ingen kæledyr matcher dine kriterier.</p>
      <button @click="resetFilters" class="reset-button">Nulstil filtre</button>
    </div>
    
    <div v-else class="pet-grid">
      <pet-card 
        v-for="pet in filteredPets" 
        :key="pet.id" 
        :pet="pet"
        @dismiss="dismissPet(pet.id)"
        @favorite="toggleFavorite(pet.id)"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import PetCard from '../components/PetCard.vue'

export default {
  name: 'PetListView',
  components: {
    PetCard
  },
  setup() {
    const pets = ref([])
    const loading = ref(true)
    const error = ref(null)
    const showFilters = ref(false)
    const showSort = ref(false)
    
    const filters = ref({
      type: '',
      age: '',
      showAdopted: false
    })
    
    const sortBy = ref('newest')

    const petTypes = [
      {
        value: '',
        label: 'Alle',
        color: '#666',
        hoverColor: '#444'
      },
      {
        value: 'dog',
        label: 'Hunde',
        color: '#4ecdc4',  // Mint - matching detail view
        hoverColor: '#3dbdb4'
      },
      {
        value: 'cat',
        label: 'Katte',
        color: '#f15bb5',  // Pink - matching detail view
        hoverColor: '#e13a3e'
      },
      {
        value: 'rabbit',
        label: 'Kaniner',
        color: '#ffa45c',  // Orange - matching detail view
        hoverColor: '#ff8c3c'
      },
      {
        value: 'bird',
        label: 'Fugle',
        color: '#4361ee',  // Blue - matching detail view
        hoverColor: '#3a5baa'
      },
      {
        value: 'fish',
        label: 'Fisk',
        color: '#00b8a9',  // Teal - matching detail view
        hoverColor: '#0097a7'
      },
      {
        value: 'reptile',
        label: 'Krybdyr',
        color: '#a8e6cf',  // Sage - matching detail view
        hoverColor: '#8bc3a5'
      },
      {
        value: 'other',
        label: 'Andre',
        color: '#9656a1',  // Purple - matching detail view
        hoverColor: '#7a4e9e'
      }
    ]

    const ageRanges = [
      { value: '', label: 'Alle aldre' },
      { value: 'young', label: '0-2 år' },
      { value: 'adult', label: '3-7 år' },
      { value: 'senior', label: '8+ år' }
    ]

    const sortOptions = [
      { value: 'newest', label: 'Nyeste først' },
      { value: 'oldest', label: 'Ældste først' },
      { value: 'name', label: 'Navn (A-Z)' }
    ]

    const fetchPets = async () => {
      loading.value = true
      error.value = null
      
      try {
        const petsCollection = collection(db, 'pets')
        const petsQuery = query(petsCollection, orderBy('createdAt', 'desc'))
        const petsSnapshot = await getDocs(petsQuery)
        
        pets.value = petsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        
        loading.value = false
      } catch (err) {
        console.error('Error fetching pets:', err)
        error.value = 'Der opstod en fejl ved indlæsning af kæledyr.'
        loading.value = false
      }
    }

    const migrateExistingPets = async () => {
      try {
        const petsCollection = collection(db, 'pets')
        const petsSnapshot = await getDocs(petsCollection)
        
        for (const docSnapshot of petsSnapshot.docs) {
          const petData = docSnapshot.data()
          const updates = {}
          
          // Konverter goodWith fra objekt til array
          if (petData.goodWith && typeof petData.goodWith === 'object' && !Array.isArray(petData.goodWith)) {
            const goodWithArray = []
            if (petData.goodWith.children) goodWithArray.push('Børn')
            if (petData.goodWith.dogs) goodWithArray.push('Hunde')
            if (petData.goodWith.cats) goodWithArray.push('Katte')
            updates.goodWith = goodWithArray
          }
          
          // Konverter requirements fra objekt til array
          if (petData.requirements && typeof petData.requirements === 'object' && !Array.isArray(petData.requirements)) {
            const requirementsArray = []
            if (petData.requirements.experience) requirementsArray.push('Erfaring med dyrehold')
            if (petData.requirements.garden) requirementsArray.push('Adgang til have')
            if (petData.requirements.otherPets) requirementsArray.push('Skal have andre kæledyr')
            updates.requirements = requirementsArray
          }
          
          // Hvis der er ændringer, opdater dokumentet
          if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'pets', docSnapshot.id), updates)
          }
        }
        
        console.log('Data migration completed')
      } catch (err) {
        console.error('Error migrating data:', err)
      }
    }

    const filteredPets = computed(() => {
      let result = [...pets.value]
      
      if (filters.value.type) {
        result = result.filter(pet => pet.type === filters.value.type)
      }
      
      if (filters.value.age) {
        result = result.filter(pet => {
          const age = pet.age
          switch(filters.value.age) {
            case 'young': return age <= 2
            case 'adult': return age > 2 && age <= 7
            case 'senior': return age > 7
            default: return true
          }
        })
      }
      
      if (!filters.value.showAdopted) {
        result = result.filter(pet => !pet.adopted)
      }
      
      result.sort((a, b) => {
        switch(sortBy.value) {
          case 'oldest':
            return a.createdAt - b.createdAt
          case 'name':
            return a.name.localeCompare(b.name)
          default: // newest
            return b.createdAt - a.createdAt
        }
      })
      
      return result
    })

    const setTypeFilter = (type) => {
      filters.value.type = filters.value.type === type ? '' : type
    }

    const resetFilters = () => {
      filters.value = {
        type: '',
        age: '',
        showAdopted: false
      }
      sortBy.value = 'newest'
      showFilters.value = false
      showSort.value = false
    }

    const dismissPet = (id) => {
      console.log('Dismissed:', id)
    }

    const toggleFavorite = (id) => {
      console.log('Favorited:', id)
    }

    onMounted(async () => {
      await migrateExistingPets()
      await fetchPets()
    })

    return {
      pets,
      loading,
      error,
      filters,
      sortBy,
      showFilters,
      showSort,
      petTypes,
      ageRanges,
      sortOptions,
      filteredPets,
      setTypeFilter,
      resetFilters,
      dismissPet,
      toggleFavorite,
      fetchPets
    }
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables' as vars;

.pet-list-view {
  width: 100%;
  min-height: calc(100vh - 80px);
  
  .list-header {
    text-align: center;
    margin-bottom: 2rem;
    position: sticky;
    top: 0;
    z-index: 50;

    h1 {
      margin: 1rem 0;
      font-size: 2.5rem;
      font-weight: vars.$font-weight-black;
      color: vars.$text-color-dark;
    }
  }

  .type-filter-tags {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .filter-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    padding: 0 1rem;

    .control-group {
      position: relative;
    }

    .control-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: 2px solid #eee;
      border-radius: vars.$border-radius-medium;
      background: white;
      color: #666;
      font-size: 1rem;
      font-weight: vars.$font-weight-normal;
      cursor: pointer;
      transition: all 0.3s ease;
      
      svg {
        width: 1.25rem;
        height: 1.25rem;
      }
      
      &:hover, &.active {
        border-color: vars.$primary-color;
        color: vars.$primary-color;
        
        svg {
          color: vars.$primary-color;
        }
      }
    }

    .adopted-toggle {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.75rem 1.25rem;
      border: 2px solid #eee;
      border-radius: vars.$border-radius-medium;
      background: white;
      font-size: 1rem;
      font-weight: vars.$font-weight-normal;
      transition: all 0.3s ease;

      &:hover {
        border-color: vars.$primary-color;
        color: vars.$primary-color;
      }

      input {
        display: none;
        
        &:checked + .toggle-switch {
          background: vars.$primary-color;
          
          &:before {
            transform: translateX(20px);
          }
        }
      }
      
      .toggle-switch {
        width: 44px;
        height: 24px;
        background: #ddd;
        border-radius: 12px;
        position: relative;
        transition: all 0.3s ease;
        
        &:before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
        }
      }

      .toggle-label {
        color: #666;
      }
    }

    .filter-dropdown,
    .sort-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 0.5rem;
      min-width: 220px;
      background: white;
      border-radius: vars.$border-radius-medium;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 100;
      
      .filter-section {
        padding: 1rem;
        
        h3 {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.75rem;
        }
      }
      
      .age-range {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        
        .age-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 16px;
          background: #f5f5f5;
          color: #666;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: rgba(vars.$primary-color, 0.1);
            color: vars.$primary-color;
          }
          
          &.active {
            background: vars.$primary-color;
            color: white;
          }
        }
      }
    }

    .sort-dropdown {
      .sort-option {
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        background: none;
        text-align: left;
        color: #666;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(vars.$primary-color, 0.1);
          color: vars.$primary-color;
        }
        
        &.active {
          color: vars.$primary-color;
          font-weight: vars.$font-weight-medium;
        }
      }
    }
  }
  
  .pet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    width: 100%;
    margin-top: 2.5rem;
    justify-items: center;
    
    @media (min-width: 640px) {
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    }
  }

  .loading-state,
  .error-state,
  .empty-state {
    text-align: center;
    padding: 4rem 1rem;
    width: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    
    svg {
      width: 2.5rem;
      height: 2.5rem;
      color: #666;
      margin-bottom: 1.25rem;
    }
    
    p {
      color: #666;
      margin-bottom: 1.25rem;
      font-size: 1.1rem;
    }
    
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: vars.$border-radius-medium;
      background: vars.$primary-color;
      color: white;
      font-weight: vars.$font-weight-medium;
      cursor: pointer;
      transition: all 0.3s ease;
    
      &:hover {
        background: color.adjust(vars.$primary-color, $lightness: -5%);
      }
    }
  }

  .loading-state {
    text-align: center;
    padding: 4rem 1rem;
    width: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    
    .paw-icon {
      width: 60px;
      height: 60px;
      margin-bottom: 1.25rem;
      
      svg {
        width: 100%;
        height: 100%;
        fill: vars.$primary-color;
        animation: pulse 2s infinite;
      }
    }
    
    p {
      color: #666;
      margin-bottom: 1.25rem;
      font-size: 1.1rem;
    }
  }

  .tag {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
    border: 2px solid transparent;
    
    &.clickable {
      &:hover {
        background: var(--tag-hover-color);
        color: white;
        transform: translateY(-1px);
      }
      
      &.active {
        background: var(--tag-color);
        color: white;
      }
    }
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
</style> 