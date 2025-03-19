<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>{{ isLogin ? 'Log ind' : 'Opret konto' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="Indtast din email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Adgangskode:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Indtast din adgangskode"
          >
        </div>

        <button type="submit" class="auth-button">
          <span>{{ isLogin ? 'Log ind' : 'Opret konto' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        </button>
      </form>

      <p class="toggle-text">
        {{ isLogin ? "Har du ikke en konto?" : "Har du allerede en konto?" }}
        <a href="#" @click.prevent="toggleAuthMode">
          {{ isLogin ? 'Opret konto' : 'Log ind' }}
        </a>
      </p>

      <p v-if="error" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ error }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Auth',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const isLogin = ref(true);
    const router = useRouter();

    const handleSubmit = async () => {
      try {
        error.value = '';
        if (isLogin.value) {
          await signInWithEmailAndPassword(auth, email.value, password.value);
        } else {
          await createUserWithEmailAndPassword(auth, email.value, password.value);
        }
        router.push('/pets');
      } catch (e) {
        error.value = translateError(e.code);
      }
    };

    const toggleAuthMode = () => {
      isLogin.value = !isLogin.value;
      error.value = '';
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

    return {
      email,
      password,
      error,
      isLogin,
      handleSubmit,
      toggleAuthMode
    };
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;
@use "sass:color";

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: vars.$background-color;
}

.auth-box {
  background: white;
  padding: 2.5rem;
  border-radius: vars.$border-radius-large;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.1),
    0 6px 6px rgba(0, 0, 0, 0.05),
    0 0 0 2px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 440px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 15px 30px rgba(0, 0, 0, 0.15),
      0 10px 10px rgba(0, 0, 0, 0.08),
      0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: vars.$font-weight-black;
    background: linear-gradient(45deg, vars.$primary-color, color.adjust(vars.$primary-color, $lightness: -10%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: vars.$text-color-dark;
    font-weight: vars.$font-weight-medium;
  }

  input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #eee;
    border-radius: vars.$border-radius-medium;
    font-size: 1rem;
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

.auth-button {
  width: 100%;
  padding: 1rem;
  background: vars.$primary-color;
  color: white;
  border: none;
  border-radius: vars.$border-radius-medium;
  font-size: 1rem;
  font-weight: vars.$font-weight-bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;

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

.toggle-text {
  text-align: center;
  margin-top: 1.5rem;
  color: vars.$text-color-dark;

  a {
    color: vars.$primary-color;
    text-decoration: none;
    font-weight: vars.$font-weight-medium;
    margin-left: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #dc3545;
  text-align: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #fff5f5;
  border-radius: vars.$border-radius-medium;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke: currentColor;
  }
}
</style> 