<template>
  <div class="mount-management">
    <div class="header-actions">
      <h1>卡口管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon> 添加卡口
      </el-button>
    </div>

    <el-card>
      <div class="search-bar">

      </div>

      <el-table :data="mounts" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="卡口名称" />
        <el-table-column prop="release_year" label="发布年份" width="120" />
        <el-table-column prop="flange_distance" label="法兰距" />
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
      <el-form ref="mountForm" :model="currentMount" label-width="100px" :rules="formRules">
        <el-form-item label="卡口名称" prop="name" :rules="[{ required: true, message: '请输入卡口名称', trigger: 'blur' }]">
          <el-input v-model="currentMount.name" />
        </el-form-item>
        <el-form-item label="发布年份" prop="release_year">
          <el-input v-model.number="currentMount.release_year" type="number" />
        </el-form-item>
        <el-form-item label="法兰距" prop="flange_distance">
          <el-input v-model.number="currentMount.flange_distance" type="number" />
        </el-form-item>
        <el-form-item label="直径" prop="diameter">
          <el-input v-model.number="currentMount.diameter" type="number" />
        </el-form-item>
        <el-form-item label="关联品牌" prop="brand_ids">
          <el-select v-model="currentMount.brand_ids" multiple placeholder="请选择品牌">
            <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentMount.description" type="textarea" :rows="4" />
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
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { Service } from '@/api/services/Service';
import type { Brand } from '@/api/models/Brand';
import type { Mount } from '@/api/models/Mount';
interface MountWithBrands {
  id?: number;
  name?: string;
  release_year?: number | null;
  flange_distance?: number | null;
  diameter?: number | null;
  description?: string | null;
  brand_ids: number[];
}
import type { Body_create_mount_mounts__post } from '@/api/models/Body_create_mount_mounts__post';
import type { Body_update_mount_mounts__mount_id__put } from '@/api/models/Body_update_mount_mounts__mount_id__put';

// 状态管理
const mounts = ref<Mount[]>([]);
const brands = ref<Brand[]>([]);

const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const showAddDialog = ref(false);
const dialogTitle = ref('添加卡口');
const currentMount = ref<MountWithBrands>({ brand_ids: [] });
const mountForm = ref<any>(null);
const loading = ref(false);

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入卡口名称', trigger: 'blur' }],
  brand_ids: [{ required: true, type: 'array', min: 1, message: '请至少选择一个品牌', trigger: 'change' }],
};

// 获取品牌列表
const fetchBrands = async () => {
  try {
    const response = await Service.readBrandsBrandsGet(0, 100);
    brands.value = response;
  } catch (error) {
    ElMessage.error('获取品牌列表失败');
    console.error(error);
  }
};

// 生命周期钩子
onMounted(() => {
  fetchMounts();
  fetchBrands();
});

// API调用 - 获取卡口列表
const fetchMounts = async () => {
  try {
    loading.value = true;
    const skip = (currentPage.value - 1) * pageSize.value;
    const response = await Service.readMountsMountsGet(skip, pageSize.value);
    mounts.value = response;
    total.value = mounts.value.length;
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      ElMessage.error('未知错误类型');
      return;
    }
    ElMessage.error('获取卡口列表失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchMounts();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchMounts();
};

// 编辑操作
const handleEdit = (row: Mount) => {
   currentMount.value = { 
     ...row,
     brand_ids: []
   };
   dialogTitle.value = '编辑卡口';
   showAddDialog.value = true;
};

// 删除操作
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该卡口吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await Service.deleteMountMountsMountIdDelete(id);
    ElMessage.success('删除成功');
    fetchMounts();
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
    await mountForm.value.validate();
    loading.value = true;

    if (currentMount.value.id) {
      // 更新卡口
      const updateData: Body_update_mount_mounts__mount_id__put = {
  mount_update: currentMount.value as Mount,
  brands: currentMount.value.brand_ids || []
};
      await Service.updateMountMountsMountIdPut(currentMount.value.id!, updateData);
      ElMessage.success('更新卡口成功');
    } else {
      // 创建卡口
      const createData: Body_create_mount_mounts__post = {
  mount: currentMount.value as Mount,
  brand_ids: currentMount.value.brand_ids || []
};
      await Service.createMountMountsPost(createData);
      ElMessage.success('添加卡口成功');
    }

    showAddDialog.value = false;
    fetchMounts();
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
  currentMount.value = { brand_ids: [] };

  mountForm.value?.resetFields();
};
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>