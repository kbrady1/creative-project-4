import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

let author = {}
let journal = {}
let entry = {}

new Vue({
  router,
  author,
  journal,
  entry,
  render: h => h(App)
}).$mount('#app')
