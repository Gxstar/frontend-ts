<script setup lang="ts">
import '@/assets/auth-styles.css';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleSubmit() {
  try {
    if (isLogin.value) {
      await authStore.login(username.value, password.value);
    } else {
      // TODO: 注册逻辑
    }
    router.push('/');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '发生未知错误';
  }
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      <el-form @submit.prevent="handleSubmit" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" native-type="submit">{{ isLogin ? '登录' : '注册' }}</el-button>
        </el-form-item>
        <div class="form-footer">
          <router-link to="/register" class="login-link">没有账号？去注册</router-link>
        </div>
      </el-form>
      <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />
    </el-card>
  </div>
</template>

<style scoped>
@import '@/assets/auth-styles.css';

.el-form-item__label {
  display: block;
  text-align: left;
  margin-bottom: 8px;
  font-weight: 500;
}

.el-input {
  width: 100%;
}
</style>