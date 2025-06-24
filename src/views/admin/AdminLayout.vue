<template>
  <el-container direction="vertical" style="height: 100vh; display: flex;">
    <el-header style="background-color: #fff; border-bottom: 1px solid #e6e6e6; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
      <div class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/admin" class="nav-link">管理中心</router-link>
      </div>
      <div class="user-info">
        <el-dropdown v-if="authStore.isAuthenticated" @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar :size="32" style="vertical-align: middle; margin-right: 8px;">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="用户头像">
            </el-avatar>
            <span>{{ authStore.user?.username }} ({{ authStore.getUserRole }})</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><user /></el-icon>
                <span>个人资料</span>
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><setting /></el-icon>
                <span>设置</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <router-link to="/login" v-else class="login-link">登录</router-link>
      </div>
    </el-header>
    <el-container direction="horizontal" style="flex: 1; height: 100%; display: flex;">
      <el-aside width="200px" style="height: 100%; display: flex; flex-direction: column;">
        <el-menu :default-openeds="['1']" class="el-menu-vertical-demo" router>
          <el-sub-menu index="1">
            <template #title>
              <span>管理中心</span>
            </template>
            <el-menu-item index="/admin/brands">品牌管理</el-menu-item>
            <el-menu-item index="/admin/cameras">相机管理</el-menu-item>
            <el-menu-item index="/admin/lenses">镜头管理</el-menu-item>
            <el-menu-item index="/admin/mounts">卡口管理</el-menu-item>
            <el-menu-item index="/admin/users">用户管理</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { Setting, ArrowDown, User, SwitchButton } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ElHeader, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElIcon } from 'element-plus';

const authStore = useAuthStore();
const router = useRouter();

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/admin/profile');
      break;
    case 'settings':
      router.push('/admin/settings');
      break;
    case 'logout':
      await authStore.logout();
      router.push('/login');
      break;
  }
}
</script>

<style scoped>
.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.nav-link.router-link-exact-active {
  color: #1890ff;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-link {
  color: #1890ff;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  transition: all 0.2s;
}

.login-link:hover {
  background-color: #e6f7ff;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.el-aside {
  background-color: #f5f5f5;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.05);
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  flex: 1;
}
.el-main {
  padding: 20px;
}

.el-header .el-icon {
  margin-right: 4px;
}

.el-dropdown-menu__item {
  display: flex;
  align-items: center;
}

.el-dropdown-menu__item .el-icon {
  margin-right: 8px;
}
</style>