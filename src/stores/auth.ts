import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { OpenAPI } from '@/api/core/OpenAPI';
import type { User } from '@/api/models/User';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref(localStorage.getItem('token') || null);
  const isAuthenticated = computed(() => !!token.value);
  const isLoading = ref(false);
  // 应用初始化时自动验证token并加载用户信息
  checkAuth();

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
    // 优先从localStorage获取最新token并同步到响应式变量
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      token.value = null;
      return false;
    }
    
    // 同步最新token到响应式变量和OpenAPI配置
    token.value = currentToken;
    OpenAPI.TOKEN = currentToken;
    
    isLoading.value = true;
    try {
      OpenAPI.TOKEN = token.value;
      
      const response = await fetch(`${OpenAPI.BASE}/users/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!response.ok) throw new Error('Authentication failed');

      // 获取用户信息，包含角色数据
      user.value = await response.json();
      return true;
    } catch (error) {
      logout();
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    OpenAPI.TOKEN = undefined;
  }

  const getUserRole = computed(() => user.value?.role || null);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    checkAuth,
    logout,
    getUserRole,
    isLoading
  };
});