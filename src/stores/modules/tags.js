import { defineStore } from 'pinia'

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: [{ title: '首页', path: '/home', name: 'home' }],
  }),
  actions: {
    addTags(tag) {
      this.tags.push(tag)
    },
    removeTags(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    logout() {
      this.$reset()
    },
  },
  persist: true,
})
