<template>
  <el-dialog v-model="dialogFormVisible" :title="title" width="800">
    <el-form ref="rulesFormRef" :model="form" :rules="rules" :inline="true" label-width="100">
      <el-form-item prop="menu_type" label="菜单类型">
        <el-radio-group v-model="form.menu_type" style="width: 400px">
          <el-radio v-for="option in menuTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="parent_id" label="上级条目">
        <el-tree-select
          v-model="form.parent_id"
          :data="menuListOptions"
          placeholder="上级条目"
          check-strictly
          clearable
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item
        prop="menu_name"
        :label="`${getOptionsLabel(menuTypeOptions, form.menu_type)}名称`"
        required
      >
        <el-input
          v-model="form.menu_name"
          :placeholder="`请输入${getOptionsLabel(menuTypeOptions, form.menu_type)}名称`"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item prop="icon" :label="`${getOptionsLabel(menuTypeOptions, form.menu_type)}图标`">
        <el-select
          :disabled="form.menu_type === 3"
          :prop="form.icon"
          v-model="form.icon"
          :placeholder="`请选择${getOptionsLabel(menuTypeOptions, form.menu_type)}图标`"
          style="width: 250px"
        >
          <el-option
            v-for="option in menuIconOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
            <component :is="option.icon" class="menu_icons" />
          </el-option>
          <template #label="{ value }">
            <component
              :is="menuIconOptions.find((opt) => opt.value === value)?.icon"
              class="menu_icons"
            />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="sort" label="显示排序">
        <el-input-number
          v-model="form.sort"
          :min="1"
          placeholder="请输入显示排序"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item prop="path" label="路由地址">
        <el-input
          :disabled="form.menu_type === 3"
          v-model="form.path"
          placeholder="请输入路由地址"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item prop="component_path" label="组件路径">
        <el-input
          :disabled="form.menu_type !== 2"
          :prop="form.icon"
          v-model="form.component_path"
          placeholder="请输入组件路径"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item prop="permission" label="权限标识">
        <el-input
          :disabled="form.menu_type === 1"
          v-model="form.permission"
          placeholder="请输入权限标识"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-switch
          v-model="form.status"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :active-text="statusOptions[0].label"
          :active-value="statusOptions[0].value"
          :inactive-text="statusOptions[1].label"
          :inactive-value="statusOptions[1].value"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { menuTypeOptions, menuIconOptions, statusOptions } from '@/constants/options'

import { getMenuList, addMenu, editMenu } from '@/api/menu'

const dialogFormVisible = defineModel('visible')
const props = defineProps({
  mode: {
    type: String,
    default: 'add',
  },
  data: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['success'])

const form = ref({})
const rulesFormRef = ref(null)

const title = computed(() => (props.mode === 'add' ? '新增菜单' : '编辑菜单'))
const menuListOptions = ref([])

const initForm = () => {
  const baseForm = props.mode === 'add' ? { menu_type: 1, sort: 1, status: 1 } : props.data
  form.value = Object.assign({}, baseForm)
}

const getOptionsLabel = (options, value) => {
  const option = options.find((opt) => opt.value === value)
  return option ? option.label : ''
}

const rules = computed(() => ({
  menu_type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  menu_name: [
    {
      required: true,
      message: `请输入${getOptionsLabel(menuTypeOptions, form.value.menu_type)}名`,
      trigger: 'blur',
    },
    { min: 3, max: 10, message: '长度在3-10个字符之间', trigger: 'blur' },
  ],
  path: [
    {
      required: [1, 2].includes(form.value.menu_type),
      message: '请输入路由地址',
      trigger: 'change',
    },
  ],
  component_path: [
    { required: form.value.menu_type === 2, message: '请输入组件地址', trigger: 'change' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}))

const submitForm = async () => {
  if (!rulesFormRef.value) return

  await rulesFormRef.value.validate(async (valid, fields) => {
    if (!valid) {
      console.log('提交失败', fields)
      return
    }
    // if (!form.value.path?.startsWith('/')) {
    //   form.value.path = `/${form.value.path}`
    // }
    // if (!form.value.component_path?.startsWith('/')) {
    //   form.value.component_path = `/${form.value.component_path}`
    // }
    if (props.mode === 'add') {
      await addMenu(form.value)
    } else {
      await editMenu(form.value)
    }

    ElMessage.success(props.mode === 'add' ? '新增成功' : '编辑成功')
    dialogFormVisible.value = false
    rulesFormRef.value.resetFields()
    emit('success')
  })
}

const resetForm = () => {
  rulesFormRef.value?.resetFields()
  dialogFormVisible.value = false
}

const getTreeData = (data) =>
  data.map((item) => ({
    value: item.menu_id,
    label: item.menu_name,
    children: item.children?.length ? getTreeData(item.children) : [],
  }))

watch(
  () => [props.data, props.mode, dialogFormVisible.value],
  () => {
    if (dialogFormVisible.value) {
      rulesFormRef.value?.resetFields()
      initForm()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  const { list = [] } = await getMenuList()
  menuListOptions.value = getTreeData(list)
})
</script>

<style lang="scss" scoped>
:deep(.menu_icons) {
  width: 20px;
  height: 20px;
}
</style>
