<template>
  <div class="pet-card" :class="{ 'is-adopted': pet.adopted }">
    <div class="pet-card-content">
      <!-- Image Container -->
      <div class="pet-image-wrapper" :style="{ backgroundColor: getCategoryColor(pet.type) }">
        <img 
          v-if="pet.imageUrl" 
          :src="pet.imageUrl" 
          :alt="pet.name"
          class="pet-image"
        >
        <div v-else class="pet-image-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2c.5-1.7 1.8-2 3-2 4.5 0 7 6.5 7 11 0 4.5-2.5 11-7 11-1.2 0-2.5-.3-3-2M12 2C11.5.3 10.2 0 9 0 4.5 0 2 6.5 2 11c0 4.5 2.5 11 7 11 1.2 0 2.5-.3 3-2"/>
            <circle cx="8" cy="8" r="2"/>
            <circle cx="16" cy="8" r="2"/>
            <circle cx="8" cy="14" r="2"/>
            <circle cx="16" cy="14" r="2"/>
          </svg>
        </div>

        <!-- Type Tag -->
        <span 
          class="pet-type-tag"
          :style="{ '--tag-color': getCategoryColor(pet.type) }"
        >
          {{ formatType(pet.type) }}
        </span>

        <!-- New Today Badge -->
        <span v-if="isNewToday" class="new-badge">
          Ny i dag
        </span>
        
        <!-- Info Overlay -->
        <div class="pet-info-overlay">
          <div class="pet-details">
            <div v-if="pet.adopted" class="pet-status">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Adopteret</span>
            </div>
            <h2 class="pet-name">{{ pet.name }}, {{ pet.age }} år</h2>
            <p class="description">{{ truncatedDescription }}</p>
          </div>
        </div>

        <!-- Action Button -->
        <div class="view-more">
          <router-link :to="'/pets/' + pet.id" class="view-more-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PetCard',
  props: {
    pet: {
      type: Object,
      required: true
    }
  },
  computed: {
    isNewToday() {
      if (!this.pet.createdAt) return false;
      const now = new Date();
      const created = this.pet.createdAt.toDate();
      return Math.floor((now - created) / (1000 * 60 * 60 * 24)) === 0;
    },
    truncatedDescription() {
      if (!this.pet.description) return '';
      return this.pet.description.length > 100 
        ? this.pet.description.substring(0, 100) + '...'
        : this.pet.description;
    }
  },
  setup() {
    const categoryColors = {
      'dog': '#4ecdc4',    // Mint
      'cat': '#f15bb5',    // Pink (matching the filter button)
      'rabbit': '#ffa45c', // Orange
      'bird': '#4361ee',   // Blue
      'fish': '#00b8a9',   // Teal
      'reptile': '#a8e6cf',// Sage
      'other': '#9656a1'   // Purple
    };
    
    const getCategoryColor = (type) => {
      return categoryColors[type?.toLowerCase()] || categoryColors.other;
    };
    
    const formatType = (type) => {
      const translations = {
        'dog': 'Hund',
        'cat': 'Kat',
        'rabbit': 'Kanin',
        'bird': 'Fugl',
        'fish': 'Fisk',
        'reptile': 'Krybdyr',
        'other': 'Andet'
      };
      
      if (!type) return 'Ukendt';
      return translations[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
    };
    
    return {
      getCategoryColor,
      formatType
    };
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables' as vars;

.pet-card {
  width: 100%;
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
  perspective: 1000px;
  
  &.is-adopted {
    .pet-card-content {
      opacity: 0.8;
      filter: grayscale(30%);
    }
  }
  
  .pet-card-content {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    background: white;
    box-shadow: 
      0 10px 20px rgba(0, 0, 0, 0.1),
      0 6px 6px rgba(0, 0, 0, 0.05),
      0 0 0 2px rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 
        0 15px 30px rgba(0, 0, 0, 0.15),
        0 10px 10px rgba(0, 0, 0, 0.08),
        0 0 0 2px rgba(255, 255, 255, 0.2);
      
      .pet-actions {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  .pet-image-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    
    .pet-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(1.1) contrast(0.95) saturate(1.2);
      transition: transform 0.4s ease;
    }
    
    .pet-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.05);
      
      svg {
        width: 60px;
        height: 60px;
        color: rgba(0, 0, 0, 0.2);
      }
    }

    .pet-type-tag {
      position: absolute;
      top: 15px;
      left: 15px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: white;
      background-color: var(--tag-color);
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      z-index: 2;
    }
  }

  .view-more {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    
    .view-more-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px 0 0 20px;
      color: vars.$primary-color;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
      
      svg {
        width: 20px;
        height: 20px;
        transition: transform 0.3s ease;
      }
      
      &:hover {
        width: 48px;
        background: white;
        
        svg {
          transform: translateX(2px);
        }
      }
    }
  }

  .pet-info-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, 
      rgba(0,0,0,0.95) 0%, 
      rgba(0,0,0,0.8) 50%,
      rgba(0,0,0,0) 100%);
    color: white;
    
    .pet-details {
      .pet-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.2);
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
        backdrop-filter: blur(4px);
        
        svg {
          width: 12px;
          height: 12px;
          stroke: white;
        }
      }

      .pet-name {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 900;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        letter-spacing: -0.02em;
      }

      .description {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.9;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.new-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(vars.$primary-color, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
  z-index: 2;
}
</style> 