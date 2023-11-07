import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isAdmin = ref(false);
  const toggleIsAdmin = () => {
    isAdmin.value = !isAdmin.value;
  }

  return { isAdmin, toggleIsAdmin }
})
