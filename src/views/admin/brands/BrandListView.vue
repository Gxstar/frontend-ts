<template>
  <div class="brand-management">
    <div class="header-actions">
      <h1>品牌管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
          <el-icon><plus /></el-icon> 添加品牌
        </el-button>
    </div>

    <el-card>
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="输入品牌名称搜索"
          style="width: 300px"
          prefix-icon="Search"
        />
        <el-button @click="fetchBrands">搜索</el-button>
      </div>

      <el-table :data="brands" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="品牌名称" />
        <el-table-column prop="country" label="国家/地区" />
        <el-table-column prop="founded_year" label="成立年份" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
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
      <el-form ref="brandForm" :model="currentBrand" label-width="100px">
        <el-form-item label="品牌名称" prop="name" :rules="formRules.name">
          <el-input v-model="currentBrand.name" />
        </el-form-item>
        <el-form-item label="中文名称" prop="name_zh" :rules="formRules.name_zh">
          <el-input v-model="currentBrand.name_zh" />
        </el-form-item>
        <el-form-item label="国家/地区" prop="country">
          <el-input v-model="currentBrand.country" />
        </el-form-item>
        <el-form-item label="成立年份" prop="founded_year">
          <el-date-picker
            v-model="foundedYearStr"
            type="year"
            :disabled-date="disabledFutureYear"
            value-format="YYYY"
            placeholder="选择成立年份"
          />
        </el-form-item>
        <el-form-item label="官方网站" prop="website">
          <el-input v-model="currentBrand.website" type="url" placeholder="https://" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentBrand.description" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Service } from '@/api/services/Service';
import type { Brand } from '@/api/models/Brand';

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 2, max: 50, message: '品牌名称长度应在2-50个字符之间', trigger: 'blur' }
  ],
  name_zh: [
    { required: true, message: '请输入中文名称', trigger: 'blur' },
    { min: 2, max: 50, message: '中文名称长度应在2-50个字符之间', trigger: 'blur' }
  ],
  country: [
    { max: 50, message: '国家/地区名称不能超过50个字符', trigger: 'blur' }
  ],
  website: [
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  founded_year: [
    { required: true, message: '请选择成立年份', trigger: 'change' }
  ]
};

// 计算属性：处理年份字符串与数字的转换
const foundedYearStr = computed({
  get: () => currentBrand.value.founded_year?.toString() || '',
  set: (value) => {
    currentBrand.value.founded_year = value ? parseInt(value, 10) : null;
  }
});

// 状态管理
const brands = ref<Brand[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchKeyword = ref('');
const showAddDialog = ref(false);
const dialogTitle = ref('添加品牌');
const currentBrand = ref<Partial<Brand>>({});
const brandForm = ref<any>(null);
const loading = ref(false);

// 生命周期钩子
onMounted(() => {
  fetchBrands();
});

// 数据获取
const fetchBrands = async () => {
  try {
    loading.value = true;
    const skip = (currentPage.value - 1) * pageSize.value;
    const data = await Service.readBrandsBrandsGet(skip, pageSize.value, searchKeyword.value);
    brands.value = data;
    // 这里假设total需要单独获取或从响应头中获取，暂时用固定值
    total.value = brands.value.length; // 使用实际返回数据长度作为总数
  } catch (error) {
    ElMessage.error('获取品牌列表失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 添加防抖搜索
let timeoutId: NodeJS.Timeout | undefined;
const debouncedFetchBrands = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    fetchBrands();
  }, 300);
};

watch(searchKeyword, debouncedFetchBrands);

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchBrands();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchBrands();
};

// 编辑操作
const handleEdit = (row: Brand) => {
  currentBrand.value = { ...row };
  dialogTitle.value = '编辑品牌';
  showAddDialog.value = true;
};

// 删除操作
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该品牌吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await Service.deleteBrandBrandsBrandIdDelete(id);
    ElMessage.success('删除成功');
    fetchBrands();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
      console.error(error);
    }
  }
};

// 表单提交
const submitForm = async () => {
  try {
    await brandForm.value.validate();
    loading.value = true;

    const brandData = { ...currentBrand.value };

    if (currentBrand.value.id) {
      // 更新品牌
      await Service.updateBrandBrandsBrandIdPut(currentBrand.value.id, brandData as Brand);
      ElMessage.success('品牌更新成功');
    } else {
      // 创建品牌
      await Service.createBrandBrandsPost(brandData as Brand);
      ElMessage.success('品牌创建成功');
    }

    showAddDialog.value = false;
    fetchBrands();
    resetForm();
  } catch (error) {
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

// 禁用未来年份
const disabledFutureYear = (time: Date) => {
  return time.getFullYear() > new Date().getFullYear();
};

// 重置表单
const resetForm = () => {
  currentBrand.value = {};
  brandForm.value?.resetFields();
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