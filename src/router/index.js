import Vue from 'vue'
import VueRouter from 'vue-router'
import {guard} from "@/utils/RouterUtil";
import {loginRoute} from "@/router/routes/login";
import {registerRoute} from "@/router/routes/register";
import {workerRoute} from "@/router/routes/worker";
import {bossRoute} from "@/router/routes/boss";
import {adminRoute} from "@/router/routes/admin";

Vue.use(VueRouter)

const routes = [
  loginRoute,

  registerRoute,

  workerRoute,

  bossRoute,

  adminRoute
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  guard(to, from, next);
});


export default router
