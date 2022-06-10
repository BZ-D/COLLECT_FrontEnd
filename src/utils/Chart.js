import * as echarts from 'echarts'

export const initRuleChart = function (elId) {
  // 初始化echarts实例
  let mainContainer = document.getElementById(elId);
  mainContainer.style.width = window.innerWidth * 0.28 + 'px';
  mainContainer.style.height = '280px';
  // 初始化图表
  return echarts.init(mainContainer);
}

export const drawRuleChart = function (chartObj, ruleDetail) {
  // 绘制图表
  chartObj.setOption({
    tooltip: {},
    series: [
      {
        type: 'pie',
        stillShowZeroSum: false,
        data: [
          {
            value: ruleDetail.claimedTasks,
            name: '已领取任务'
          },
          {
            value: ruleDetail.skills,
            name: '工人技能'
          },
          {
            value: ruleDetail.taskPrefer,
            name: '任务偏好'
          },
          {
            value: ruleDetail.environment,
            name: '测试环境'
          },
          {
            value: ruleDetail.latestDeadline,
            name: '最近截止'
          }
        ]
      }
    ]
  })
}
