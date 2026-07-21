import { defineStore } from 'pinia'

export const useRouteStore = defineStore('route', {
  state: () => ({
    routesLoaded: false,
    removeRouteFns: [],
  }),
  actions: {
    addRemoveRouteFn(fn) {
      this.removeRouteFns.push(fn)
    },

    clearDynamicRoutes() {
      this.removeRouteFns.forEach((removeFn) => {
        removeFn()
      })

      this.$reset()
    },
  },
})
