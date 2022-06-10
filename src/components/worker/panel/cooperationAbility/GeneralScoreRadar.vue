<template>
  <div class="item-area" id="general-score-radar-area">
    <img src="../../../../assets/image/cooperation-lidar.png" alt="" style="width: 170px; margin-bottom: 10px;">

    <el-row>
      <el-col :span="24">
        <div id="cooperation-radar"></div>
      </el-col>
    </el-row>

    <span class="data-description">
        您一共协作了 <span style="color: #0c3183; font-weight: bold;">{{ contents.coordinateNum }}</span> 篇报告
    </span>
    <div id="general-score-description" style="width: 60%; display: flex; flex-direction: column;">
      <br>
      <span class="data-description">
        <span style="color: #0c3183; font-weight: bold;">
          协作积极性
        </span>
        是指您对他人报告协作的积极性，与低质量报告修改率成负相关，与协作报告数目成正相关。协作积极性得分越高，说明您更愿意协作他人的报告。
      </span>
      <br>
      <span class="data-description">
        <span style="color: #0c3183; font-weight: bold;">
          低质量报告修改率
        </span>
        是指当您提交的主报告审查不通过后，进行报告修改再提交的比例。在该值上得分越高，说明您更积极地修改原有报告并完成测试任务。如果您没有任何低质量报告，您在该值的得分将为最大值1。
      </span>
      <br>
      <span class="data-description">
        <span style="color: #0c3183; font-weight: bold;">
          优质报告率
        </span>
        是指您提交的测试任务主报告中，通过相似度审查的比例，该指标得分越高，说明您报告审查通过的比例越大。
      </span>
      <br>
      <span class="data-description">
        <span style="color: #0c3183; font-weight: bold;">
          报告独特性
        </span>
        是指您提交报告的文本/图像相似度在所有报告中的排名，该指标得分越高，说明您的报告独特性排名越靠前，您提交报告的平均文本/图像相似度越低。
      </span>
    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "GeneralScoreRadar",

  props: ['contents'],

  mounted() {
    this.initCooperationRadar();
    this.drawCooperationRadar();
  },

  data() {
    return {
      radarChart: null
    }
  },

  methods: {

    initCooperationRadar() {
      let radarContainer = document.getElementById('cooperation-radar');
      radarContainer.style.width = window.innerWidth * 0.4 + 'px';
      radarContainer.style.height = '300px';
      this.radarChart = echarts.init(radarContainer);
    },

    drawCooperationRadar() {
      let radarOption = {
        color: ['#FFE434'],
        tooltip: {},

        radar: [
          {
            indicator: [
              { text: '综合得分', max: 5 },
              { text: '协作积极性', max: 5 },
              { text: '低质量报告修改率', max: 5 },
              { text: '优质报告率', max: 5 },
              { text: '报告独特性', max: 5 }
            ],
            radius: 100,
            startAngle: 90,
            splitNumber: 5,
            shape: 'circle',
            axisName: {
              formatter: '【{value}】',
              color: '#428BD4'
            },
            splitArea: {
              areaStyle: {
                color: ['#77EADF', '#89C9EE', '#67CAFD', '#34B5EE', '#228BDE'],
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(211, 253, 250, 0.8)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(211, 253, 250, 0.8)'
              }
            }
          }
        ],
        series: [
          {
            type: 'radar',
            emphasis: {
              lineStyle: {
                width: 4
              }
            },
            data: [
              {
                value: [],
                name: '能力得分',
                areaStyle: {
                  color: 'rgba(255, 228, 52, 0.6)'
                }
              }
            ]
          }
        ]
      };

      radarOption.series[0].data[0].value.push(
          Number((this.contents.score * 5).toFixed(1)),
          Number(this.contents.enthusiasm.toFixed(1)),
          Number((this.contents.badReportModifyRate * 5).toFixed(1)),
          Number(((this.contents.goodReportRate) * 5).toFixed(1)),
          Number(((1 - this.contents.rank) * 5).toFixed(1))
      )

      this.radarChart.setOption(radarOption);
    }
  }
}
</script>

<style scoped>

* {
  color: #3f3f3f
}

.no-data-hint, .data-description {
  font-size: 15px;
}

.item-area {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  align-items: center;
}

</style>
