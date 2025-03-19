<template>
  <div class="app-container">
    <nav class="app-navigation">
      <div class="navigation-content">
        <router-link to="/" class="navigation-logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            <circle cx="9" cy="10" r="1.2" fill="currentColor"/>
            <circle cx="15" cy="10" r="1.2" fill="currentColor"/>
            <circle cx="8" cy="13" r="1.2" fill="currentColor"/>
            <circle cx="16" cy="13" r="1.2" fill="currentColor"/>
            <circle cx="12" cy="14" r="1.8" fill="currentColor"/>
          </svg>
          <span class="logo-text">PetMatch</span>
        </router-link>
        
        <div class="navigation-links">
          <router-link to="/pets" class="navigation-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Find kæledyr</span>
          </router-link>
          <router-link to="/add" class="navigation-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Tilføj kæledyr</span>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style lang="scss">
@use "sass:color";
@use '@/assets/styles/variables' as vars;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: vars.$font-family;
  background-color: vars.$background-color;
  color: vars.$text-color-dark;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.app-navigation {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  border-radius: 1rem 1rem;

  .navigation-content {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      padding: 0 1rem;
    }
  }

  .navigation-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: vars.$primary-color;
    font-weight: vars.$font-weight-black;
    font-size: 1.5rem;
    
    .logo-icon {
      width: 38px;
      height: 38px;
      margin-right: 12px;
      color: vars.$primary-color;
      
      path {
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }
    
    .logo-text {
      font-size: 1.8rem;
      background: linear-gradient(45deg, vars.$primary-color, color.adjust(vars.$primary-color, $lightness: -10%));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .navigation-links {
    display: flex;
    gap: 20px;
    
    .navigation-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: vars.$text-color-dark;
      font-weight: vars.$font-weight-medium;
      padding: 8px 16px;
      border-radius: vars.$border-radius-medium;
      transition: all 0.3s ease;
      
      svg {
        width: 20px;
        height: 20px;
        transition: all 0.3s ease;
      }
      
      &:hover {
        background: rgba(vars.$primary-color, 0.1);
        color: vars.$primary-color;
        
        svg {
          color: vars.$primary-color;
          transform: scale(1.1);
        }
      }
      
      &.router-link-active {
        background: vars.$primary-color;
        color: white;
        
        svg {
          color: white;
        }
      }
    }
  }
}

.app-content {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}
</style>
