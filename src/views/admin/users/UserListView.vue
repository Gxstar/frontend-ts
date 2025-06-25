<template>
  <div class="user-management">
    <div class="header-actions">
      <h1>用户管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon> 添加用户
      </el-button>
    </div>

    <el-card>
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="full_name" label="姓名" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="showAddDialog" :title="dialogTitle">
      <el-form ref="userForm" :model="currentUser" label-width="100px" :rules="formRules">
        <el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
          <el-input v-model="currentUser.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="currentUser.email" />
        </el-form-item>
        <!-- 编辑模式下显示密码字段，可选填 -->
        <el-form-item label="密码" prop="password_hash" :rules="currentUser.id ? [{ required: false, message: '不输入则不修改密码', trigger: 'blur' }] : [{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input v-model="currentUser.password_hash" type="password" />
        </el-form-item>
        <el-form-item label="角色" prop="role" :rules="[{ required: true, message: '请选择角色', trigger: 'change' }]">
          <el-select v-model="currentUser.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="full_name">
          <el-input v-model="currentUser.full_name" />
        </el-form-item>
        <el-form-item label="个人简介" prop="bio">
          <el-input v-model="currentUser.bio" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { Service } from '@/api/services/Service';
import type { User } from '@/api/models/User';

// 状态管理
const users = ref<User[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const showAddDialog = ref(false);
const dialogTitle = ref('添加用户');
const currentUser = ref<Partial<User>>({});
const userForm = ref<any>(null);
const loading = ref(false);

// 表单验证规则
const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  password_hash: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

// 生命周期钩子
onMounted(() => {
  fetchUsers();
});

// API调用 - 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true;
    const skip = (currentPage.value - 1) * pageSize.value;
    const response = await Service.readUsersUsersGet(skip, pageSize.value);
    users.value = response;
    total.value = users.value.length;
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      ElMessage.error('未知错误类型');
      return;
    }
    ElMessage.error('获取用户列表失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchUsers();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchUsers();
};

// 编辑操作
const handleEdit = (row: User) => {
  currentUser.value = { ...row };
  dialogTitle.value = '编辑用户';
  showAddDialog.value = true;
};

// 删除操作
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await Service.deleteUserUsersUserIdDelete(id);
    ElMessage.success('删除成功');
    fetchUsers();
  } catch (error: unknown) {
    if (error === 'cancel') return;
    if (!(error instanceof Error)) {
      ElMessage.error('未知错误类型');
      return;
    }
    ElMessage.error('删除失败');
    console.error(error);
  }
};

// 表单提交
const submitForm = async () => {
  try {
    await userForm.value.validate();
    loading.value = true;

    if (currentUser.value.id) {
      // 包含所有必填字段，包括password_hash
      // 确保包含所有必填字段，为password_hash提供默认值
      // 确保包含所有必填字段，使用现有密码哈希或空字符串
      // 仅在提供新密码时包含password_hash字段
      // 确保所有必填字段存在且不为undefined
      const updateData = { ...currentUser.value } as User;
      // 为必填字段提供默认值
      updateData.username = updateData.username || '';
      updateData.email = updateData.email || '';
      updateData.role = updateData.role || 'user';
      // 保留现有密码哈希（不修改密码）
      if (!updateData.password_hash) updateData.password_hash = currentUser.value.password_hash || '';
        await Service.updateUserUsersUserIdPut(currentUser.value.id!, updateData);
      ElMessage.success('更新用户成功');
    } else {
      // 创建用户
      await Service.createUserUsersPost(currentUser.value as User);
      ElMessage.success('添加用户成功');
    }

    showAddDialog.value = false;
    fetchUsers();
    resetForm();
  } catch (error: unknown) {
    if (typeof error === 'string') {
      ElMessage.error(error);
    } else {
      ElMessage.error('操作失败，请重试');
      console.error(error);
    }
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  currentUser.value = {};
  userForm.value?.resetFields();
};
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>