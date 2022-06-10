<template>
  <!-- 其他工人的评价区 -->
  <div class="item-area" id="worker-evaluation-area">
    <img src="../../../../assets/image/others-evaluation.png" alt="" style="width: 180px; margin-bottom: 10px;">
    <span class="no-data-hint" v-if="!hasWorkerEvaluation">
      尚未有其他工人评价过您的报告，请稍后再查看。
    </span>

    <span class="data-description" v-if="hasWorkerEvaluation">
      “<span style="color: #0c3183; font-weight: bold;">其他工人评价</span>”是其他工人对您提交报告的评价，包含评分和评论两部分，最终得分为所有工人对您评分的平均值。
    </span>

    <span class="data-description" v-if="hasWorkerEvaluation">
      您目前共计获得了&nbsp;{{ contents.workerEvaluationNum }}&nbsp;份其他工人评价，具体情况见下：
    </span>

    <div id="worker-evaluation-score" v-if="hasWorkerEvaluation" style="display: flex; margin-top: 20px;">
      <span style="color: #0c3183; font-weight: bold;">总体得分：</span>
      <div class="star-score">
        <el-rate :value="getWorkerScore()" disabled></el-rate>
      </div>
      <span>{{ getWorkerScore() }}</span>
    </div>

    <el-row class="chart-area" v-if="hasWorkerEvaluation" style="margin-top: 10px">
      <el-col :span="12">
        <div id="worker-scores-pie"></div>
      </el-col>
      <el-col :span="12">
        <div id="worker-scores-bar"></div>
      </el-col>
    </el-row>

    <div id="comment-word-cloud"></div>

  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "WorkerEvaluationPanelItem",

  props: ['contents', 'hasWorkerEvaluation'],

  mounted() {
    if (this.hasWorkerEvaluation) {
      this.initWorkerScoreChart();
      this.drawWorkerScoreChart();

      window.addEventListener('resize', this.resizeHandler);
    }
  },

  beforeDestroy() { // 清理工作 避免内存泄漏
    if (this.hasWorkerEvaluation) {
      // 销毁监听事件
      window.removeEventListener('resize', this.resizeHandler);
      this.workerScorePie.dispose();
      this.workerScoreBar.dispose();
    }
  },

  data() {
    return {
      workerScorePie: null,
      workerScoreBar: null
    }
  },

  methods: {
    resizeHandler() {
      let pieContainer = document.getElementById('worker-scores-pie');
      pieContainer.style.width = window.innerWidth * 0.28 + 'px';
      pieContainer.style.height = '200px';
      this.workerScorePie.resize();

      let barContainer = document.getElementById('worker-scores-bar');
      barContainer.style.width = window.innerWidth * 0.28 + 'px';
      barContainer.style.height = '240px';
      this.workerScoreBar.resize();
    },

    getWorkerScore() {
      return Number(this.contents.workerEvaluationScore.toFixed(1))
    },

    initWorkerScoreChart() {
      let pieContainer = document.getElementById('worker-scores-pie');
      pieContainer.style.width = window.innerWidth * 0.28 + 'px';
      pieContainer.style.height = '200px';
      this.workerScorePie = echarts.init(pieContainer);

      let barContainer = document.getElementById('worker-scores-bar');
      barContainer.style.width = window.innerWidth * 0.28 + 'px';
      barContainer.style.height = '240px';
      this.workerScoreBar = echarts.init(barContainer);
    },

    drawWorkerScoreChart() {
      // 饼状图
      let pieOption = {
        tooltip: {},
        series: [
          {
            type: 'pie',
            stillShowZeroSum: false,
            data: [
              {
                name: '0-1星',
                value: 0
              },
              {
                name: '1-2星',
                value: 0
              },
              {
                name: '2-3星',
                value: 0
              },
              {
                name: '3-4星',
                value: 0
              },
              {
                name: '4-5星',
                value: 0
              }
            ] // name, value
          }
        ]
      };

      // 柱状、折线图
      let barOption = {
        title: {
          show: true,
          text: '报告打分：折线-柱状图',
          x: 'center',
          textStyle: {
            fontSize: 15
          }
        },
        tooltip: {},
        xAxis: {
          data: ['4-5星', '3-4星', '2-3星', '1-2星', '0-1星']
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: []
          },
          {
            type: 'line',
            data: []
          }
        ]
      };

      for (const score of this.contents['workerScores']) {
        if (score >= 4) {
          pieOption.series[0]['data'][4]['value']++;
        } else if (score >= 3) {
          pieOption.series[0]['data'][3]['value']++;
        } else if (score >= 2) {
          pieOption.series[0]['data'][2]['value']++;
        } else if (score >= 1) {
          pieOption.series[0]['data'][1]['value']++;
        } else if (score > 0) {
          pieOption.series[0]['data'][0]['value']++;
        }
      }

      for (let i = 4; i >= 0; i--) {
        barOption.series[0]['data'].push(pieOption.series[0]['data'][i]);
        barOption.series[1]['data'].push(pieOption.series[0]['data'][i]);
      }

      this.workerScorePie.setOption(pieOption);
      this.workerScoreBar.setOption(barOption);
    }
  },

  watch: {

  }
}
</script>

<style scoped>

* {
  color: #3f3f3f
}

.no-data-hint, .data-description {
  font-size: 14px;
}

.item-area {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  align-items: center;
}

</style>
