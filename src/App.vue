<template>
  <div class="app-container">
    <nav class="app-navigation">
      <div class="navigation-content">
        <router-link to="/" class="navigation-logo">
          <img src="@/assets/paw.svg" alt="PetMatch Logo" class="logo-icon">
          <span class="logo-text">PetMatch</span>
        </router-link>
        
        <div class="navigation-links">
          <router-link to="/pets" class="navigation-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Find kæledyr</span>
          </router-link>
          <router-link v-if="userStore.user" to="/add" class="navigation-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Tilføj kæledyr</span>
          </router-link>

          <!-- Auth Dropdown -->
          <div class="auth-dropdown" v-click-outside="closeAuthDropdown">
            <template v-if="userStore.user">
              <button @click="handleLogout" class="auth-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Log ud</span>
              </button>
            </template>
            <template v-else>
              <button 
                class="auth-button"
                @click="showAuthDropdown = !showAuthDropdown"
                :class="{ active: showAuthDropdown }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Log ind</span>
              </button>

              <!-- Auth Dropdown Content -->
              <div v-if="showAuthDropdown" class="auth-dropdown-content">
                <h3>{{ isLogin ? 'Log ind' : 'Opret konto' }}</h3>
                <form @submit.prevent="handleSubmit" class="auth-form">
                  <div class="form-group">
                    <input 
                      type="email" 
                      v-model="email" 
                      required
                      placeholder="Email"
                    >
                  </div>
                  
                  <div class="form-group">
                    <input 
                      type="password" 
                      v-model="password" 
                      required
                      placeholder="Adgangskode"
                    >
                  </div>

                  <button type="submit" class="submit-button">
                    <span>{{ isLogin ? 'Log ind' : 'Opret konto' }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                  </button>

                  <p v-if="error" class="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{{ error }}</span>
                  </p>

                  <div class="auth-toggle">
                    <span>{{ isLogin ? "Har du ikke en konto?" : "Har du allerede en konto?" }}</span>
                    <button type="button" @click="toggleAuthMode" class="toggle-button">
                      {{ isLogin ? 'Opret konto' : 'Log ind' }}
                    </button>
                  </div>
                </form>
              </div>
            </template>
          </div>
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

<script setup>
import { ref } from 'vue';
import { useUserStore } from './stores/userStore';
import { useRouter } from 'vue-router';
import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { clickOutside } from './directives/clickOutside';

const vClickOutside = clickOutside;

const userStore = useUserStore();
const router = useRouter();
const showAuthDropdown = ref(false);
const isLogin = ref(true);
const email = ref('');
const password = ref('');
const error = ref('');

const handleLogout = async () => {
  try {
    await userStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const handleSubmit = async () => {
  try {
    error.value = '';
    console.log('Attempting authentication...', { isLogin: isLogin.value, email: email.value });
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    }
    showAuthDropdown.value = false;
    email.value = '';
    password.value = '';
  } catch (e) {
    console.error('Authentication error:', e);
    console.error('Error code:', e.code);
    console.error('Error message:', e.message);
    error.value = translateError(e.code);
  }
};

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
};

const closeAuthDropdown = () => {
  showAuthDropdown.value = false;
};

const translateError = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Denne email er allerede i brug.';
    case 'auth/invalid-email':
      return 'Ugyldig email adresse.';
    case 'auth/operation-not-allowed':
      return 'Email/password login er ikke aktiveret.';
    case 'auth/weak-password':
      return 'Adgangskoden er for svag.';
    case 'auth/user-disabled':
      return 'Denne bruger er deaktiveret.';
    case 'auth/user-not-found':
      return 'Ingen bruger fundet med denne email.';
    case 'auth/wrong-password':
      return 'Forkert adgangskode.';
    default:
      return 'Der opstod en fejl. Prøv igen senere.';
  }
};
</script>

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
  padding: 1rem;
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

    .navigation-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: vars.$text-color-dark;
      
      .logo-icon {
        width: 2rem;
        height: 2rem;
        color: vars.$primary-color;
        transition: animation 0.3s ease;
      }
      
      .logo-text {
        font-size: 1.5rem;
        font-weight: 900;
        background: linear-gradient(90deg, #ff6b6b, #ff2d2d);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
        transition: all 0.3s ease;
      }

      &:hover {
        .logo-icon {
          animation: heartbeat 0.8s ease-in-out;
          animation-iteration-count: 7;
        }
        .logo-text {
          transform: scale(1.05);
          background: linear-gradient(90deg, #ff6b6b, #ff1a1a);
          -webkit-background-clip: text;
          background-clip: text;
        }
      }
    }

    .navigation-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      
      .navigation-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: vars.$text-color-dark;
        font-weight: vars.$font-weight-medium;
        padding: 0.5rem 1rem;
        border-radius: vars.$border-radius-medium;
        transition: all 0.3s ease;
        
        svg {
          width: 1.25rem;
          height: 1.25rem;
          color: #666;
          transition: color 0.3s ease;
        }
        
        &:hover {
          background: rgba(vars.$primary-color, 0.1);
          color: vars.$primary-color;
          
          svg {
            color: vars.$primary-color;
          }
        }
        
        &.router-link-active {
          background: rgba(vars.$primary-color, 0.1);
          color: vars.$primary-color;
          
          svg {
            color: vars.$primary-color;
          }
        }
      }
      
      .auth-dropdown {
        position: relative;
        
        .auth-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          border: 2px solid #eee;
          border-radius: vars.$border-radius-medium;
          color: vars.$text-color-dark;
          font-size: 1rem;
          font-weight: vars.$font-weight-medium;
          cursor: pointer;
          transition: all 0.3s ease;
          
          svg {
            width: 1.25rem;
            height: 1.25rem;
            color: #666;
            transition: color 0.3s ease;
          }
          
          &:hover, &.active {
            border-color: vars.$primary-color;
            color: vars.$primary-color;
            
            svg {
              color: vars.$primary-color;
            }
          }
        }
        
        .auth-dropdown-content {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: white;
          border-radius: vars.$border-radius-medium;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          min-width: 300px;
          z-index: 1000;
          
          h3 {
            margin-bottom: 1.5rem;
            font-size: 1.25rem;
            font-weight: vars.$font-weight-bold;
            color: vars.$text-color-dark;
          }
          
          .auth-form {
            .form-group {
              margin-bottom: 1rem;
              
              input {
                width: 100%;
                padding: 0.75rem 1rem;
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
            
            .submit-button {
              width: 100%;
              padding: 0.75rem 1rem;
              background: vars.$primary-color;
              color: white;
              border: none;
              border-radius: vars.$border-radius-medium;
              font-size: 1rem;
              font-weight: vars.$font-weight-bold;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              transition: all 0.3s ease;
              
              svg {
                width: 1.25rem;
                height: 1.25rem;
                transition: transform 0.3s ease;
              }
              
              &:hover {
                background: color.adjust(vars.$primary-color, $lightness: -5%);
                
                svg {
                  transform: translateX(4px);
                }
              }
            }
            
            .auth-toggle {
              margin-top: 1rem;
              text-align: center;
              
              span {
                color: #666;
              }
              
              .toggle-button {
                background: none;
                border: none;
                color: vars.$primary-color;
                font-weight: vars.$font-weight-medium;
                cursor: pointer;
                padding: 0.25rem;
                margin-left: 0.25rem;
                
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
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

.auth-dropdown {
  position: relative;
  
  .auth-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: vars.$text-color-dark;
    font-weight: vars.$font-weight-medium;
    padding: 8px 16px;
    border-radius: vars.$border-radius-medium;
    cursor: pointer;
    transition: all 0.3s ease;
    
    svg {
      width: 20px;
      height: 20px;
      transition: all 0.2s ease;
    }
    
    &:hover, &.active {
      background: rgba(vars.$primary-color, 0.1);
      color: vars.$primary-color;
      
      svg {
        color: vars.$primary-color;
        transform: scale(1.1);
      }
    }
  }

  .auth-dropdown-content {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: white;
    border-radius: vars.$border-radius-medium;
    box-shadow: 
      0 10px 20px rgba(0, 0, 0, 0.1),
      0 6px 6px rgba(0, 0, 0, 0.05);
    width: 320px;
    padding: 1.5rem;
    z-index: 1000;

    h3 {
      text-align: center;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
      font-weight: vars.$font-weight-bold;
      color: vars.$text-color-dark;
    }

    .auth-form {
      .form-group {
        margin-bottom: 1rem;

        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #eee;
          border-radius: vars.$border-radius-medium;
          font-size: 0.95rem;
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
      }

      .submit-button {
        width: 100%;
        padding: 0.75rem;
        background: vars.$primary-color;
        color: white;
        border: none;
        border-radius: vars.$border-radius-medium;
        font-size: 0.95rem;
        font-weight: vars.$font-weight-bold;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        svg {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }

        &:hover {
          background: color.adjust(vars.$primary-color, $lightness: -5%);
          transform: translateY(-2px);

          svg {
            transform: translateX(4px);
          }
        }
      }

      .error-message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: #dc3545;
        font-size: 0.9rem;
        margin-top: 1rem;
        padding: 0.75rem;
        background: #fff5f5;
        border-radius: vars.$border-radius-medium;

        svg {
          width: 1rem;
          height: 1rem;
          stroke: currentColor;
        }
      }

      .auth-toggle {
        margin-top: 1rem;
        text-align: center;
        font-size: 0.9rem;
        color: vars.$text-color-dark;

        .toggle-button {
          background: none;
          border: none;
          color: vars.$primary-color;
          font-weight: vars.$font-weight-medium;
          cursor: pointer;
          padding: 0;
          margin-left: 0.5rem;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.1);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.15);
  }
  70% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
