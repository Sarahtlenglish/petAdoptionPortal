import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(true);

  // Initialize auth state listener
  onAuthStateChanged(auth, (userData) => {
    user.value = userData;
    loading.value = false;
  });

  // Handle user logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    logout
  };
}); 