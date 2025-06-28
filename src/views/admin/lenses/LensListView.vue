<template>
  <div class="lens-management">
    <div class="header-actions">
      <h1>镜头管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
          <el-icon><plus /></el-icon> 添加镜头
        </el-button>
    </div>

    <el-card>
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="输入镜头型号搜索"
          style="width: 300px"
          prefix-icon="Search"
        />
        <el-button @click="debouncedFetchLenses">搜索</el-button>
      </div>

      <el-table :data="lenses" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="model" label="镜头型号" />
        <el-table-column prop="model_zh" label="中文型号" />
        <el-table-column label="品牌" width="120">
          <template #default="{ row }">{{ brands.find(b => b.id === row.brand_id)?.name || '-' }}</template>
        </el-table-column>
        <el-table-column prop="focal_length" label="焦距" />
      <el-table-column prop="aperture" label="光圈" />
      <el-table-column label="卡口" width="180">
        <template #default="{ row }">
          {{ row.mount_ids && (row.mount_ids as number[]).map((id: number) => mounts.find(m => m.id === id)?.name).filter(Boolean).join(', ') || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
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
      <el-form ref="lensForm" :model="currentLens" label-width="100px">
        <el-form-item label="镜头型号" prop="model" :rules="[{ required: true, message: '请输入镜头型号', trigger: 'blur' }]">
          <el-input v-model="currentLens.model" />
        </el-form-item>
        <el-form-item label="中文型号" prop="model_zh">
          <el-input v-model="currentLens.model_zh" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand_id" :rules="[{ required: true, message: '请选择品牌', trigger: 'change' }]">
          <el-select v-model="currentLens.brand_id" placeholder="请选择品牌">
            <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="焦距" prop="focal_length" :rules="[{ required: true, message: '请输入焦距', trigger: 'blur' }]">
          <el-input v-model="currentLens.focal_length" />
        </el-form-item>
        <el-form-item label="光圈" prop="aperture" :rules="[{ required: true, message: '请输入光圈', trigger: 'blur' }]">
          <el-input v-model="currentLens.aperture" />
        </el-form-item>
        <el-form-item label="镜头类型" prop="lens_type">
          <el-input v-model="currentLens.lens_type" />
        </el-form-item>
        <el-form-item label="发布年份" prop="release_year">
          <el-date-picker
            v-model="releaseYearStr"
            type="year"
            :disabled-date="disabledFutureYear"
            value-format="YYYY"
            placeholder="选择发布年份"
          />
        </el-form-item>
        <el-form-item label="卡口" prop="mount_ids" :rules="[{ required: true, message: '请选择至少一个卡口', trigger: 'change' }]">
          <el-select v-model="currentLens.mount_ids" multiple placeholder="请选择卡口">
            <el-option v-for="mount in mounts" :key="mount.id" :label="mount.name" :value="mount.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="滤镜尺寸" prop="filter_size">
          <el-input v-model.number="currentLens.filter_size" type="number" />
        </el-form-item>
        <el-form-item label="重量(克)" prop="weight_grams">
          <el-input v-model.number="currentLens.weight_grams" type="number" />
        </el-form-item>
        <el-form-item label="尺寸" prop="dimensions">
          <el-input v-model="currentLens.dimensions" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentLens.description" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { ref, onMounted, watch, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Service } from '@/api/services/Service';
import type { Lens } from '@/api/models/Lens';
import type { Brand } from '@/api/models/Brand';
interface LensWithMounts extends Lens {
  mount_ids: number[];
}
import type { Mount } from '@/api/models/Mount';

// 计算属性：处理发布年份字符串与数字的转换
const releaseYearStr = computed({
  get: () => currentLens.value.release_year?.toString() || '',
  set: (value) => {
    currentLens.value.release_year = value ? parseInt(value, 10) : null;
  }
});

// 禁用未来年份
const disabledFutureYear = (time: Date) => {
  return time.getFullYear() > new Date().getFullYear();
};

// 状态管理
const lenses = ref<LensWithMounts[]>([]);
const brands = ref<Brand[]>([]);
const mounts = ref<Mount[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchKeyword = ref('');
const showAddDialog = ref(false);
const dialogTitle = ref('添加镜头');
const currentLens = ref<Partial<LensWithMounts>>({ mount_ids: [] });
const lensForm = ref<any>(null);
const loading = ref(false);

// 生命周期钩子
onMounted(() => {
  fetchLenses();
  fetchBrands();
  fetchMounts();
});

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

// 获取卡口列表
const fetchMounts = async () => {
  try {
    const response = await Service.readMountsMountsGet(0, 100);
    mounts.value = response;
  } catch (error) {
    ElMessage.error('获取卡口列表失败');
    console.error(error);
  }
};

// 数据获取
const fetchLenses = async () => {
  try {
    loading.value = true;
    // 获取所有符合条件的数据用于计算总条数
      const response = await Service.readLensesLensesGet(0, 1000);
const allLenses = response as LensWithMounts[];
      // 应用搜索过滤
      const filteredLenses = searchKeyword.value
        ? allLenses.filter(lens => 
            (lens.model && lens.model.toLowerCase().includes(searchKeyword.value.toLowerCase())) ||
            (lens.model_zh && lens.model_zh.toLowerCase().includes(searchKeyword.value.toLowerCase()))
          )
        : allLenses;
      // 初始化镜头的mount_ids属性（假设后端已返回或需要手动关联）
      allLenses.forEach(lens => {
        lens.mount_ids = lens.mount_ids || [];
      });
      const skip = (currentPage.value - 1) * pageSize.value;
       lenses.value = filteredLenses.slice(skip, skip + pageSize.value);
        total.value = filteredLenses.length;
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      ElMessage.error('未知错误类型');
      loading.value = false;
      return;
    }
    ElMessage.error('获取镜头列表失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 添加防抖搜索
let timeoutId: NodeJS.Timeout | undefined;
const debouncedFetchLenses = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    fetchLenses();
  }, 300);
};

watch(searchKeyword, debouncedFetchLenses);

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchLenses();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchLenses();
};

// 编辑操作
const handleEdit = (row: LensWithMounts) => {
  currentLens.value = { ...row };
  // 直接使用镜头对象中的mount_ids属性
  currentLens.value.mount_ids = currentLens.value.mount_ids || [];
  dialogTitle.value = '编辑镜头';
  showAddDialog.value = true;
};

// 删除操作
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该镜头吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await Service.deleteLensLensesLensIdDelete(id);
    ElMessage.success('删除成功');
    fetchLenses();
  } catch (error: unknown) {
    if (error === 'cancel') return;
    ElMessage.error('删除失败');
    console.error(error);
  }
};

// 表单提交
const submitForm = async () => {
  try {
    await lensForm.value.validate();
    loading.value = true;
    const lensData = { ...currentLens.value };

    if (currentLens.value.id) {
      // 更新镜头（包含mount_ids）
      await Service.updateLensLensesLensIdPut(currentLens.value.id!, lensData as LensWithMounts);
      ElMessage.success('更新镜头成功');
    } else {
      // 创建镜头（包含mount_ids）
      await Service.createLensLensesPost(lensData as LensWithMounts);
      ElMessage.success('添加镜头成功');
    }

    showAddDialog.value = false;
    fetchLenses();
    resetForm();
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') return;
    ElMessage.error('操作失败，请重试');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  currentLens.value = {};
  lensForm.value?.resetFields();
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