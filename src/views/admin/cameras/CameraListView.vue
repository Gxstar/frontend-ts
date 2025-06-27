<template>
  <div class="camera-management">
    <div class="header-actions">
      <h1>相机管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
          <el-icon><plus /></el-icon> 添加相机
        </el-button>
    </div>

    <el-card>
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="输入相机型号搜索"
          style="width: 300px"
          prefix-icon="Search"
        />
        <el-button @click="fetchCameras">搜索</el-button>
      </div>

      <el-table :data="cameras" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="model" label="相机型号" />
        <el-table-column prop="brand_id" label="品牌ID" />
        <el-table-column prop="mount_id" label="卡口ID" />
        <el-table-column prop="created_at" label="创建时间" />
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
      <el-form ref="cameraForm" :model="currentCamera" label-width="100px">
        <el-form-item label="相机型号" prop="model" :rules="[{ required: true, message: '请输入相机型号', trigger: 'blur' }]">
          <el-input v-model="currentCamera.model" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand_id" :rules="[{ required: true, message: '请选择品牌', trigger: 'change' }]">
          <el-select v-model="currentCamera.brand_id" placeholder="请选择品牌">
            <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡口" prop="mount_id" :rules="[{ required: true, message: '请选择卡口', trigger: 'change' }]">
          <el-select v-model="currentCamera.mount_id" placeholder="请选择卡口">
            <el-option v-for="mount in mounts" :key="mount.id" :label="mount.name" :value="mount.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="中文型号" prop="model_zh">
          <el-input v-model="currentCamera.model_zh" placeholder="请输入中文型号" />
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
        <el-form-item label="相机类型" prop="type">
          <el-input v-model="currentCamera.type" placeholder="请输入相机类型" />
        </el-form-item>
        <el-form-item label="传感器尺寸" prop="sensor_size">
          <el-input v-model="currentCamera.sensor_size" placeholder="请输入传感器尺寸" />
        </el-form-item>
        <el-form-item label="有效像素" prop="megapixels">
          <el-input v-model.number="currentCamera.megapixels" type="number" placeholder="请输入有效像素" />
        </el-form-item>
        <el-form-item label="ISO范围" prop="iso_range">
          <el-input v-model="currentCamera.iso_range" placeholder="请输入ISO范围" />
        </el-form-item>
        <el-form-item label="快门速度" prop="shutter_speed">
          <el-input v-model="currentCamera.shutter_speed" placeholder="请输入快门速度" />
        </el-form-item>
        <el-form-item label="重量(克)" prop="weight_grams">
          <el-input v-model.number="currentCamera.weight_grams" type="number" placeholder="请输入重量" />
        </el-form-item>
        <el-form-item label="尺寸" prop="dimensions">
          <el-input v-model="currentCamera.dimensions" placeholder="请输入尺寸" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentCamera.description" type="textarea" :rows="4" />
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
import { Plus } from '@element-plus/icons-vue';
import { ref, onMounted, watch, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Service } from '@/api/services/Service';
import type { Camera } from '@/api/models/Camera';
import type { Brand } from '@/api/models/Brand';
import type { Mount } from '@/api/models/Mount';

// 计算属性：处理发布年份字符串与数字的转换
const releaseYearStr = computed({
  get: () => currentCamera.value.release_year?.toString() || '',
  set: (value) => {
    currentCamera.value.release_year = value ? parseInt(value, 10) : null;
  }
});

// 禁用未来年份
const disabledFutureYear = (time: Date) => {
  return time.getFullYear() > new Date().getFullYear();
}

// 状态管理
const cameras = ref<Camera[]>([]);
const brands = ref<Brand[]>([]);
const mounts = ref<Mount[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchKeyword = ref('');
const showAddDialog = ref(false);
const dialogTitle = ref('添加相机');
const currentCamera = ref<Partial<Camera>>({});
const cameraForm = ref<any>(null);
const loading = ref(false);

// 生命周期钩子
onMounted(() => {
  fetchCameras();
  fetchBrands();
  fetchMounts();
});

// 数据获取
const fetchBrands = async () => {
  try {
    const data = await Service.readBrandsBrandsGet(0, 100);
    brands.value = data;
  } catch (error) {
    ElMessage.error('获取品牌列表失败');
    console.error(error);
  }
};

const fetchMounts = async () => {
  try {
    const data = await Service.readMountsMountsGet(0, 100);
    mounts.value = data;
  } catch (error) {
    ElMessage.error('获取卡口列表失败');
    console.error(error);
  }
};

const fetchCameras = async () => {
  try {
    loading.value = true;
    const skip = (currentPage.value - 1) * pageSize.value;
    const data = await Service.readCamerasCamerasGet(skip, pageSize.value, searchKeyword.value);
    cameras.value = data;
    total.value = cameras.value.length;
  } catch (error) {
    ElMessage.error('获取相机列表失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 添加防抖搜索
let timeoutId: NodeJS.Timeout | undefined;
const debouncedFetchCameras = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    fetchCameras();
  }, 300);
};

watch(searchKeyword, debouncedFetchCameras);

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchCameras();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchCameras();
};

// 编辑操作
const handleEdit = (row: Camera) => {
  currentCamera.value = { ...row };
  dialogTitle.value = '编辑相机';
  showAddDialog.value = true;
};

// 删除操作
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该相机吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await Service.deleteCameraCamerasCameraIdDelete(id);
    ElMessage.success('删除成功');
    fetchCameras();
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
    await cameraForm.value.validate();
    loading.value = true;

    if (currentCamera.value.id) {
      // 更新相机
      await Service.updateCameraCamerasCameraIdPut(currentCamera.value.id, currentCamera.value as Camera);
      ElMessage.success('相机更新成功');
    } else {
      // 创建相机
      await Service.createCameraCamerasPost(currentCamera.value as Camera);
      ElMessage.success('相机创建成功');
    }

    showAddDialog.value = false;
    fetchCameras();
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

// 重置表单
const resetForm = () => {
  currentCamera.value = {};
  cameraForm.value?.resetFields();
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