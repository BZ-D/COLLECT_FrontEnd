// 发包方页
export const bossRoute = {
  path: '/boss',
  component: () => import('@/layouts/BossLayout'),
  children: [
    {
      path: 'plaza',
      component: () => import('@/components/boss/plaza/Plaza')
    },
    // 子页面：任务详情页
    {
      path: 'detail/:taskid',
      component: () => import('@/components/boss/plaza/TaskDetail')
    },
    // 我的发布页
    {
      path: 'mytasksIntro',
      component: () => import('@/components/boss/mytasks/MytasksIntro')
    },
    // 子页面：发布任务页
    {
      path: 'release',
      component: () => import('@/components/boss/release/ReleaseTask')
    },
    {
      path: 'mytasks',
      component: () => import('@/components/boss/mytasks/MyTasks'),
      children: [
        // 子页面：正在执行的任务和历史任务
        {
          path: 'executing',
          component: () => import('@/components/boss/mytasks/executing/Executing')
        },
        // 子页面：正在执行的某任务详情页
        {
          path: 'detail/:taskid',
          component: () => import('@/components/boss/mytasks/taskDetail/TaskDetail')
        },
        // 子页面：任务报告列表页
        {
          path: 'reportlist/:taskid',
          component: () => import('@/components/boss/mytasks/report/ReportList')
        },
        // 子页面：某一主报告的导引页，展示该报告的协作关系
        {
          path: 'relation/:reportid',
          component: () => import('@/components/boss/mytasks/report/ReportRelation')
        },
        // 子页面：某一主报告的评价详情页
        {
          path: 'report/:reportid',
          component: () => import('@/components/boss/mytasks/report/ReportEvaluationDetail')
        },
        // 子页面：某一子报告的详情页，无评价
        {
          path: 'subreport/:reportid',
          component: () => import('@/components/boss/mytasks/report/ReportDetail')
        },
        {
          path: 'finished',
          component: () => import('@/components/boss/mytasks/finished/Finished')
        }
      ]
    },

    // 个人资料页
    {
      path: 'profile',
      component: () => import('@/components/boss/profile/Profile')
    }
  ]
}
