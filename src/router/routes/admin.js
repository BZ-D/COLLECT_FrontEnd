// 系统管理员页
export const adminRoute = {
  path: '/admin',
  component: () => import('@/layouts/AdminLayout'),
  children: [
    {
      path: '',
      component: () => import('@/components/admin/AdminIntro')
    },
    // 子页面：任务管理
    {
      path: 'plaza',
      component: () => import('@/components/admin/plaza/Plaza')
    },
    // 子页面：任务推荐
    {
      path: 'recommend',
      component: () => import('@/components/admin/recommend/Recommend'),
      children: [
        {
          path: 'intro',
          component: () => import('@/components/admin/recommend/intro/RecommendIntro')
        },
        {
          path: 'rules',
          component: () => import('@/components/admin/recommend/rule/AllRules')
        },
        {
          path: 'ruleDetail/:ruleid',
          component: () => import('@/components/admin/recommend/rule/RuleDetail')
        },
        {
          path: 'modifyRule/:ruleid',
          component: () => import('@/components/admin/recommend/rule/ModifyRule')
        },
        {
          path: 'addRule',
          component: () => import('@/components/admin/recommend/rule/AddRule')
        }
      ]
    },
    // 子页面：任务详情页
    {
      path: 'detail/:taskid',
      component: () => import('@/components/admin/plaza/TaskDetail')
    },
    // 子页面：个人资料
    {
      path: 'profile',
      component: () => import('@/components/admin/profile/Profile')
    }
  ]
}
