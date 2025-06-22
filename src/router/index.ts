import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import BrandListView from '../views/admin/brands/BrandListView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/brands',
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'brands',
        name: 'admin-brands',
        component: BrandListView
      }
    ]
  },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
  },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  // 确保认证状态已加载
  // 管理员路由始终检查最新权限状态
  if ((!authStore.isAuthenticated && !authStore.isLoading) || to.meta.requiresAdmin) {
    await authStore.checkAuth();
  }

  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      // 未登录，重定向到登录页
      return next('/login');
    } else if (authStore.getUserRole !== 'admin') {
      // 不是管理员，重定向到首页并保留用户状态
      return next({ path: '/', replace: true });
    }
  }
  
  next();
});

export default router
