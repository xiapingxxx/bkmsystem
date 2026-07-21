<template>
  <div class="navbar-view">
    <div class="nav-left">
      <el-icon style="vertical-align: middle; margin-right: 10px">
        <Expand />
      </el-icon>
      <el-breadcrumb separator="|">
        <el-breadcrumb-item :to="{ path: '/home' }" class="catalog">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.path != '/home'" />
      </el-breadcrumb>
      <el-breadcrumb separator="/">
        <template v-for="item in route.matched" :key="item.path">
          <el-breadcrumb-item
            v-if="!['/', '/home'].includes(item.path)"
            :to="item.meta.clickAble === false ? undefined : { path: item.path }"
            :class="{ catalog: item.meta.clickAble === false }"
          >
            {{ item.meta.title }}
          </el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="nav-right">
      <el-icon style="margin-right: 20px" :size="20">
        <Search />
      </el-icon>
      <el-icon style="margin-right: 20px" :size="20" @click="toggleFullscreen">
        <FullScreen />
      </el-icon>
      <el-icon style="margin-right: 20px" :size="20">
        <Bell />
      </el-icon>

      <el-dropdown ref="dropDownRef" trigger="click">
        <div style="display: inline-flex; align-items: center; cursor: pointer">
          <el-avatar :size="30" style="margin-right: 5px" @click="handleDropDown" />
          {{ userStore.userInfo.name }}
          <el-icon :size="12">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item style="color: red" @click="handleLogout"> 退出登录 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { Expand, Search, FullScreen, Bell, ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { useTagsStore } from '@/stores/modules/tags'
import { useRouteStore } from '@/stores/modules/route'

const userStore = useUserStore()
const tagsStore = useTagsStore()
const routeStore = useRouteStore()

const route = useRoute()
const router = useRouter()
const dropDownRef = ref()

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleDropDown = () => {
  dropDownRef.value.handleOpen()
}

const handleLogout = async () => {
  userStore.logout()
  tagsStore.logout()
  routeStore.clearDynamicRoutes()

  await router.replace('/login')
}
</script>

<style lang="scss" scoped>
.navbar-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eee;

  .nav-left {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    :deep(.catalog .el-breadcrumb__inner) {
      font-weight: bold;
    }
  }
  .nav-right {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .el-icon {
      cursor: pointer;
      &:hover {
        color: rgb(31, 111, 254);
      }
    }
  }
}
</style>
