<template>
  <main>
    <div>这是主页</div>
    <div v-if="authStore.isLoading">
      加载中...
    </div>
    <div v-else-if="authStore.isAuthenticated">
      登录成功
      用户名：{{ authStore.user?.username }}
      角色：{{ authStore.user?.role }}
    </div>
    <div v-else>
      登录失败
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore=useAuthStore()
</script>
