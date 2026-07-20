import router from '@/router/index.js'
import { useUserStore } from '@/stores/modules/user'
import { useTagsStore } from '@/stores/modules/tags'
import { usePermissionStore } from '@/stores/modules/permission'
import layout from '@/layout/IndexView.vue'
import { useRouter } from 'vue-router'

const whiteList = ['/login']
const modules = import.meta.glob('/src/views/**/*.vue')

function generateRoutes(menus) {
  menus.forEach((item) => {
    if (item.path === '/home') return
    const adminSymbol = Symbol(item.menu_id)
    router.addRoute({
      name: item.menu_id,
      path: '/',
      component: layout,
      meta: {
        title: item.menu_name,
        clickAble: item.menu_type === 1 ? false : true,
      },
    })
    if (item.menu_type === 2) {
      router.addRoute(item.menu_id, {
        path: item.path,
        name: adminSymbol,
        component: modules[`/src/views${item.component_path}/IndexView.vue`],
        meta: {
          title: item.menu_name,
          keepAlive: true,
        },
      })
    } else if (item.menu_type === 1 && Array.isArray(item.children) && item.children.length > 0) {
      item.children.forEach((child) => {
        router.addRoute(item.menu_id, {
          path: child.path,
          name: child.menu_id,
          component: modules[`/src/views${child.component_path}/IndexView.vue`],
          meta: {
            title: child.menu_name,
            keepAlive: true,
          },
        })
      })
    }
  })
  // console.log(menus)
  // console.log(router.getRoutes())
}

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const token = userStore.token
  const router = useRouter()
  document.title = to.meta?.title || '后台管理系统'

  if (token) {
    if (userStore.menus.length && !permissionStore.routesLoaded) {
      generateRoutes(userStore.menus)
      permissionStore.routesLoaded = true

      return {
        ...to,
        replace: true,
      }
    }
    if (to.path === '/login') {
      return '/home'
    } else {
      return
    }
  } else {
    if (whiteList.includes(to.path)) {
      return
    } else {
      return '/login'
    }
  }
})

router.afterEach((to, from, failure) => {
  const tagsStore = useTagsStore()
  if (to.path === '/login') {
    tagsStore.logout()
    return
  }
  if (tagsStore.tags.some((item) => item.path === to.path)) return
  if (to.path === '/home') return

  tagsStore.addTags({
    title: to.meta.title,
    path: to.path,
    name: to.name,
  })
})
