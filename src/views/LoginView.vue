<script setup lang="ts">
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f4e6 0%, #e6d8c8 100%);
}

.login-card {
  width: 420px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.9);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #6b8e9c;
  font-weight: 500;
  letter-spacing: 1px;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-form-item__label {
  display: block;
  text-align: left;
  margin-bottom: 8px;
  color: #6b8e9c;
  font-weight: 500;
}

.el-input {
  width: 100%;
}

::v-deep .el-input__wrapper {
  width: 100% !important;
  max-width: 100%;
}

.el-button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.el-button--text {
  color: #6b8e9c;
}

.el-button--text:hover {
  color: #5a7c8a;
}
</style>