import router from '@/router/index.js'
import { useUserStore } from '@/stores/modules/user'
import { useTagsStore } from '@/stores/modules/tags'
import { useRouteStore } from '@/stores/modules/route'
import layout from '@/layout/IndexView.vue'

const whiteList = ['/login']
const modules = import.meta.glob('/src/views/**/*.vue')

function generateRoutes(menus, routeStore) {
  menus.forEach((item) => {
    if (item.path === '/home') return

    const removeRoute = router.addRoute({
      name: item.menu_id,
      path: '/',
      component: layout,
      meta: {
        title: item.menu_name,
        clickAble: item.menu_type === 1 ? false : true,
      },
    })
    routeStore.addRemoveRouteFn(removeRoute)
    if (item.menu_type === 2) {
      const removeRoute = router.addRoute(item.menu_id, {
        path: item.path,
        name: `menu-${item.menu_id}`,
        component: modules[`/src/views${item.component_path}/IndexView.vue`],
        meta: {
          title: item.menu_name,
          keepAlive: true,
        },
      })
      routeStore.addRemoveRouteFn(removeRoute)
    } else if (item.menu_type === 1 && Array.isArray(item.children) && item.children.length > 0) {
      item.children.forEach((child) => {
        const removeRoute = router.addRoute(item.menu_id, {
          path: child.path,
          name: child.menu_id,
          component: modules[`/src/views${child.component_path}/IndexView.vue`],
          meta: {
            title: child.menu_name,
            keepAlive: true,
          },
        })
        routeStore.addRemoveRouteFn(removeRoute)
      })
    }
  })
  // console.log(menus)
  // console.log(router.getRoutes())
}

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const routeStore = useRouteStore()
  const token = userStore.token

  document.title = to.meta?.title || '后台管理系统'

  if (token) {
    if (userStore.menus.length && !routeStore.routesLoaded) {
      generateRoutes(userStore.menus, routeStore)
      routeStore.routesLoaded = true

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

  if (tagsStore.tags.some((item) => item.path === to.path)) return
  if (['/home', '/login'].includes(to.path)) return

  tagsStore.addTags({
    title: to.meta.title,
    path: to.path,
    name: to.name,
  })
})
