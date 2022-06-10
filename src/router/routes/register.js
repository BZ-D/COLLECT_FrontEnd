// 注册页
export const registerRoute = {
  path: '/register',
  name: 'register',
  component: () => import(/* webpackChunkName: "about" */ '@/views/RegisterView.vue'),
}
