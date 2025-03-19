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
            <h2 class="pet-name">{{ pet.name }}, {{ pet.age }} år</h2>
            <p v-if="!isNewToday && !pet.adopted" class="waiting-time">
              {{ waitingTimeText }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pet-actions">
          <router-link :to="'/pets/' + pet.id" class="action-button">
            <span>Se mere</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

        <!-- Status Badge -->
        <div v-if="pet.adopted" class="pet-status">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>Adopteret</span>
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
    waitingTimeText() {
      if (!this.pet.createdAt) return '';
      
      const now = new Date();
      const created = this.pet.createdAt.toDate();
      const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return '';
      if (diffDays === 1) return 'Har ventet 1 dag';
      if (diffDays < 7) return `Har ventet ${diffDays} dage`;
      if (diffDays < 14) return `Har ventet 1 uge`;
      if (diffDays < 30) return `Har ventet ${Math.floor(diffDays / 7)} uger`;
      if (diffDays < 60) return `Har ventet 1 måned`;
      return `Har ventet ${Math.floor(diffDays / 30)} måneder`;
    }
  },
  setup() {
    const categoryColors = {
      'dog': '#4ecdc4',    // Mint
      'cat': '#ff6b6b',    // Coral
      'rabbit': '#ffd93d', // Yellow
      'bird': '#6c5ce7',   // Purple
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

  .pet-info-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, 
      rgba(0,0,0,0.9) 0%, 
      rgba(0,0,0,0.6) 30%,
      rgba(0,0,0,0) 100%);
    color: white;
    pointer-events: none;
    
    .pet-details {
      .pet-name {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 900;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        letter-spacing: -0.02em;
      }
      .waiting-time {
        font-size: 0.9rem;
        opacity: 0.9;
        margin-top: 0.25rem;
        font-weight: 500;
      }
    }
  }

  .pet-actions {
    position: absolute;
    bottom: 80px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 10;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0 20px;
    
    .action-button {
      width: auto;
      height: auto;
      border-radius: 30px;
      border: none;
      background: vars.$primary-color;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      padding: 12px 24px;
      font-weight: 600;
      font-size: 1rem;
      
      span {
        font-weight: 600;
      }
      
      svg {
        width: 20px;
        height: 20px;
        transition: all 0.2s ease;
        stroke-width: 2.5;
      }
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        background-color: color.adjust(vars.$primary-color, $lightness: -5%);
        
        svg {
          transform: translateX(4px);
        }
      }
    }
  }

  .pet-status {
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