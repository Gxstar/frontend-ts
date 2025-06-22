<template>
  <el-container style="height: 100vh">
    <el-aside width="200px">
      <el-menu :default-openeds="['1']" class="el-menu-vertical-demo">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><setting /></el-icon>
            <span>管理中心</span>
          </template>
          <el-menu-item index="1-1">
            <router-link to="/admin/brands">品牌管理</router-link>
          </el-menu-item>
          <el-menu-item index="1-2">
            <router-link to="/admin/cameras">相机管理</router-link>
          </el-menu-item>
          <el-menu-item index="1-3">
            <router-link to="/admin/lenses">镜头管理</router-link>
          </el-menu-item>
          <el-menu-item index="1-4">
            <router-link to="/admin/mounts">卡口管理</router-link>
          </el-menu-item>
          <el-menu-item index="1-5">
            <router-link to="/admin/users">用户管理</router-link>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';
</script>

<style scoped>
.el-aside {
  background-color: #f5f5f5;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.05);
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-main {
  padding: 20px;
}
</style>