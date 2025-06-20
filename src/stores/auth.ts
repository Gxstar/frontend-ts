import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { OpenAPI } from '@/api/core/OpenAPI';
import type { User } from '@/api/models/User';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref(localStorage.getItem('token') || null);
  const isAuthenticated = computed(() => !!token.value);

  async function register(username: string, password: string) {
    try {
      OpenAPI.TOKEN = undefined;
      
      const response = await fetch(`${OpenAPI.BASE}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async function login(username: string, password: string) {
    try {
      OpenAPI.TOKEN = undefined;
      
      const response = await fetch(`${OpenAPI.BASE}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      token.value = data.access_token;
      if (token.value) {
        localStorage.setItem('token', token.value);
      }
      OpenAPI.TOKEN = token.value || undefined;
      
      // 获取用户信息
      await checkAuth();
      
      return true;
    } catch (error) {
      logout();
      throw error;
    }
  }

  async function checkAuth() {
    if (!token.value) return false;
    
    try {
      OpenAPI.TOKEN = token.value;
      
      const response = await fetch(`${OpenAPI.BASE}/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!response.ok) throw new Error('Authentication failed');

      user.value = await response.json();
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    OpenAPI.TOKEN = undefined;
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    checkAuth,
    logout
  };
});