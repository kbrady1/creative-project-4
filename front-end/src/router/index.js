import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Journal from '../views/Journal.vue'
import Entry from '../views/Entry.vue'
import Author from '../views/Author.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/journal',
    name: 'journal',
    component: Journal
  },
  {
    path: '/entry',
    name: 'entry',
    component: Entry
  },
  {
    path: '/author',
    name: 'author',
    component: Author
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
