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
      <div class="loader"></div>
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
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
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
        color: '#4ecdc4',  // mint
        hoverColor: '#3dbdb4'
      },
      {
        value: 'cat',
        label: 'Katte',
        color: '#f15bb5',  // pink
        hoverColor: '#ef2fa1'
      },
      {
        value: 'rabbit',
        label: 'Kaniner',
        color: '#ffa45c',  // orange
        hoverColor: '#ff8f29'
      },
      {
        value: 'bird',
        label: 'Fugle',
        color: '#4361ee',  // blue
        hoverColor: '#1f43eb'
      },
      {
        value: 'other',
        label: 'Andre',
        color: '#9656a1',  // purple
        hoverColor: '#7c4685'
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

    onMounted(fetchPets)

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
  
  .list-header {
    text-align: center;
    margin-bottom: 2rem;

    h1 {
      margin: 2rem 0;
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
      font-weight: vars.$font-weight-medium;
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
      font-weight: vars.$font-weight-medium;
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
    .loader {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid vars.$primary-color;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 