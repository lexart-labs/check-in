// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire';
import { getAuth, signOut } from 'firebase/auth';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Login.vue'),
      },
    ],
  },
  {
    path: '/check-in',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true, isAdmin: true }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const currentUser = await getCurrentUser()
  // routes with `meta: { requiresAuth: true }` will check for
  // the users, others won't
  if (to.meta.requiresAuth && !to.meta.isAdmin) {
    // if the user is not logged in, redirect to the login page
    if (!currentUser) {
      return {
        path: '/check-in'
      }
    }
  } else if (to.meta.requiresAuth && to.meta.isAdmin){
    let isAdmin = false
    if(currentUser?.reloadUserInfo?.customAttributes){
      isAdmin = (JSON.parse(currentUser?.reloadUserInfo?.customAttributes))?.admin
    }
    if (!currentUser || isAdmin === false) {
      const auth = await getAuth()
      await signOut(auth)
      return {
        path: '/'
      }
    }
  }
})

export default router
