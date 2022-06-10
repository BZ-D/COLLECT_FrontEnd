// 众包工人页
export const workerRoute = {
  path: '/worker',
  component: () => import('@/layouts/WorkerLayout'),
  // 使用children属性实现子路由时
  // 子路由path前面 不能带/
  // 以 / 开头的嵌套路径会被当作根路径否则会永远以根路由开始请求
  // 这样不方便我们调用渲染数据
  children: [
    {
      path: '',
      component: () => import('@/components/worker/plaza/PlazaIntro')
    },
    {
      path: 'plaza',
      component: () => import('@/components/worker/plaza/TaskPlaza'),
      children: [
        {
          path: 'recommended',
          component: () => import('@/components/worker/plaza/recommended/Recommended')
        },
        // 任务广场子页面：所有任务
        {
          path: 'all',
          component: () => import('@/components/worker/plaza/all/All')
        },
        // 受邀任务
        {
          path: 'invited',
          component: () => import('@/components/worker/plaza/invited/Invited')
        },
        // 任务广场子页面：任务详情
        {
          path: 'detail/:taskid',
          component: () => import('@/components/worker/plaza/taskDetail/TaskDetail')
        }
      ]
    },

    // 我的任务页
    {
      path: 'mytasksIntro',
      component: () => import('@/components/worker/mytasks/MyTasksIntro')
    },
    {
      path: 'mytasks',
      component: () => import('@/components/worker/mytasks/MyTasks'),
      children: [
        // 正在执行任务列表
        {
          path: 'executing',
          component: () => import('@/components/worker/mytasks/executing/Executing')
        },
        // 具体某项正在执行任务详情页
        {
          path: 'execdetail/:taskid',
          component: () => import('@/components/worker/mytasks/executing/ExecTaskDetail')
        },
        // 某项正在执行任务的报告提交页
        {
          path: 'submitreport/:taskid',
          component: () => import('@/components/worker/mytasks/report/SubmitReport')
        },
        // 历史任务列表
        {
          path: 'finished',
          component: () => import('@/components/worker/mytasks/finished/Finished')
        },
        // 任务报告详情页（工人视角），包含审查结果
        {
          path: 'report/:taskid',
          component: () => import('@/components/worker/mytasks/finished/FinishedReportDetail')
        },
        // 报告相似度关系图页
        {
          path: 'relation',
          component: () => import('@/components/worker/mytasks/report/SimRelation')
        },
        // 协作关系图页
        {
          path: 'corelation',
          component: () => import('@/components/worker/mytasks/ReportCoRelation')
        },
        // 修改报告页面
        {
          path: 'modify',
          component: () => import('@/components/worker/mytasks/report/ModifyReport')
        },
        // // 报告详情页，原始报告详情布局，按钮为补充报告
        {
          path: 'reportDetail/:reportid',
          component: () => import('@/components/boss/mytasks/report/ReportDetail')
        }
      ]
    },
    // 报告协作页
    {
      path: 'cooperation',
      component: () => import('@/components/worker/cooperation/Cooperation'),
      children: [
        // 导引
        {
          path: 'intro',
          component: () => import('@/components/worker/cooperation/CooperationIntro')
        },
        // 报告评价
        {
          path: 'evaluate',
          component: () => import('@/components/worker/cooperation/evaluate/Evaluate'),
          children: [
            // 所有已领任务列表
            {
              path: 'claimedTaskList',
              component: () => import('@/components/worker/cooperation/claimedTasks/ClaimedTaskList')
            },
            // 某一已领任务的报告列表
            {
              path: 'reportList/:taskid',
              component: () => import('@/components/worker/cooperation/claimedTasks/ReportList')
            },
            // 某报告的评价页面
            {
              path: 'detail',
              component: () => import('@/components/worker/cooperation/evaluate/ReportEvaluationDetail')
            }
          ]
        },
        // 报告补充
        {
          path: 'supplement',
          component: () => import('@/components/worker/cooperation/supplement/Supplement'),
          children: [
            {
              path: 'claimedTaskList',
              component: () => import('@/components/worker/cooperation/claimedTasks/ClaimedTaskList')
            },
            {
              path: 'reportList/:taskid',
              component: () => import('@/components/worker/cooperation/claimedTasks/ReportList')
            },
            // 补充报告之前，展示报告内容
            {
              path: 'detail',
              component: () => import('@/components/worker/mytasks/report/ReportDetail')
            },
            // 补充报告页
            {
              path: 'submit',
              component: () => import('@/components/worker/cooperation/supplement/SubmitSubReport')
            }
          ]
        }
      ]
    },
    // 报告评审页
    {
      path: 'review',
      component: () => import('@/components/worker/review/Review'),

      children: [
        {
          path: 'intro',
          component: () => import('@/components/worker/review/ReviewIntro')
        },
        {
          path: 'report-list',
          component: () => import('@/components/worker/review/ReviewReportList')
        },
        {
          path: 'follow-others',
          component: () => import('@/components/worker/review/FollowOthers')
        }
      ]
    },
    {
      path: 'profile',
      component: () => import('@/components/worker/profile/Profile')
    }
  ]
}
