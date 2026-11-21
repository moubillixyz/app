document.addEventListener('alpine:init', () => {
  const profileKey = 'moubillixyz-profile'
  Alpine.store('profile', {
    init() {
      this.data = window.localStorage.getItem(profileKey) ? JSON.parse(window.localStorage.getItem(profileKey)) : this.data
      console.log('init profile', this.data)
    },

    data: {
      name: 'Moub Moub'
    },

    save() {
      console.log('save profile', this.data)
      window.localStorage.setItem(profileKey, JSON.stringify(this.data))
    }
  })
})