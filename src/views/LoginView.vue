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
      <el-form @submit.prevent="handleSubmit">
        <el-form-item label="用户名">
          <el-input v-model="username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-button type="primary" native-type="submit">
          {{ isLogin ? '登录' : '注册' }}
        </el-button>
        <el-button type="text" @click="isLogin = !isLogin">
          {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
        </el-button>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #409eff;
}

.el-button {
  width: 100%;
  margin-top: 10px;
}
</style>