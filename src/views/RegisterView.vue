<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>注册</h2>
      <el-form @submit.prevent="handleSubmit" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="confirmPassword" type="password" placeholder="请确认密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" native-type="submit">注册</el-button>
        </el-form-item>
        <div class="form-footer">
          <router-link to="/login" class="login-link">已有账号？去登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import '@/assets/auth-styles.css';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    ElMessage.error('两次密码输入不一致');
    return;
  }
  try {
    await authStore.register(username.value, password.value);
    ElMessage.success('注册成功，请登录');
    router.push('/login');
  } catch (error) {
    ElMessage.error('注册失败，请重试');
  }
};
</script>

<style scoped>
@import '@/assets/auth-styles.css';
</style>