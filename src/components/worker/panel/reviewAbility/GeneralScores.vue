<template>
  <div class="item-area" id="review-general-scores-area">
    <img src="../../../../assets/image/review-score.png" alt="" style="width: 100px; margin-bottom: 10px;">

    <span class="no-data-hint" v-if="!hasReviewScore">
      您并未评审过其他报告，请评审后再查看！
    </span>

    <span class="data-description" v-if="hasReviewScore" style="margin-bottom: 20px">
      “评审能力”是指您对其他工人报告评价、打分的有效度及擅长的评审报告领域。其中：
    </span>

    <span class="data-description" v-if="hasReviewScore">
      “<span style="color: #0c3183; font-weight: bold;">综合得分</span>”是对您评审报告的记录利用算法进行分析计算，最终综合得到的评审能力值。该值越高，说明您的评审能力越强。
    </span>
    <div id="review-general-score" v-if="hasReviewScore" style="display: flex; margin-bottom: 20px;">
      <span style="color: #0c3183; font-weight: bold;">综合得分：</span>
      <div class="star-score">
        <el-rate :value="getGeneralScore()" disabled></el-rate>
      </div>
      <span>{{ getGeneralScore() }}</span>
    </div>

    <span class="data-description" v-if="hasReviewScore">
      “<span style="color: #0c3183; font-weight: bold;">评价重复</span>”是对您不同评价内容进行查重比较，从而更精准地判断您的评价重复度。该值越高，说明您的评价重复度越低。
    </span>
    <div id="evaluation-plagiarism" v-if="hasReviewScore" style="display: flex; margin-bottom: 20px;">
      <span style="color: #0c3183; font-weight: bold;">评价重复：</span>
      <div class="star-score">
        <el-rate :value="getPlagiarism()" disabled></el-rate>
      </div>
      <span>{{ getPlagiarism() }}</span>
    </div>


    <span class="data-description" v-if="hasReviewScore">
      “<span style="color: #0c3183; font-weight: bold;">有效评价</span>”是对您评价内容的有效性进行判断，一般来说，我们将“报告创作者/发包方是否点赞”作为一个衡量评价有效性的指标。
    </span>
    <div id="evaluation-validity" v-if="hasReviewScore" style="display: flex;">
      <span style="color: #0c3183; font-weight: bold;">总评价份数：</span>
      <span>{{ contents.allNum }}&nbsp;&nbsp;&nbsp;&nbsp;</span>

      <span style="color: #0c3183; font-weight: bold;">有效评价份数：</span>
      <span>{{ contents.validNum }}</span>
    </div>
    <div id="evaluation-validity-rate" v-if="hasReviewScore" style="display: flex; margin-bottom: 20px;">
      <span style="color: #0c3183; font-weight: bold;">有效评价指数：</span>
      <div class="star-score">
        <el-rate :value="getValidity()" disabled></el-rate>
      </div>
      <span>{{ getValidity() }}</span>
    </div>

    <el-row id="score-panel-area" v-if="hasReviewScore">
      <el-col :span="8">
        <div id="general-score-gauge"></div>
      </el-col>

      <el-col :span="8">
        <div id="plagiarism-gauge"></div>
      </el-col>

      <el-col :span="8">
        <div id="validity-gauge"></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "GeneralScores",

  props: ['contents', 'hasReviewScore'],

  data() {
    return {
      generalScoreGauge: null,
      plagiarismGauge: null,
      validityGauge: null
    }
  },

  mounted() {
    if (this.hasReviewScore) {
      this.initGauges();
      this.drawGauges();
      window.addEventListener('resize', this.resizeHandler);
    }
  },

  beforeDestroy() { // 清理工作 避免内存泄漏
    if (this.hasReviewScore) {
      // 销毁监听事件
      window.removeEventListener('resize', this.resizeHandler);
      this.generalScoreGauge.dispose();
      this.plagiarismGauge.dispose();
      this.validityGauge.dispose();
    }
  },

  methods: {
    resizeHandler() {
      let generalScoreContainer = document.getElementById('general-score-gauge');
      generalScoreContainer.style.width = window.innerWidth * 0.22 + 'px';
      generalScoreContainer.style.height = '240px';
      this.generalScoreGauge.resize();

      let plagiarismContainer = document.getElementById('plagiarism-gauge');
      plagiarismContainer.style.width = window.innerWidth * 0.22 + 'px';
      plagiarismContainer.style.height = '240px';
      this.plagiarismGauge.resize();

      let validityContainer = document.getElementById('validity-gauge');
      validityContainer.style.width = window.innerWidth * 0.22 + 'px';
      validityContainer.style.height = '240px';
      this.validityGauge.resize();
    },

    getGeneralScore() {
      return Number((this.contents.generalScore * 5).toFixed(1));
    },

    getPlagiarism() {
      return Number(((this.contents.plagiarismScore) * 5).toFixed(1))
    },

    getValidity() {
      if(this.contents.allNum === 0)
        return Number(0).toFixed(1)
      return Number(((this.contents.validNum / this.contents.allNum) * 5).toFixed(1))
    },

    initGauges() {
      let generalScoreContainer = document.getElementById('general-score-gauge');
      generalScoreContainer.style.width = window.innerWidth * 0.22 + 'px';
      generalScoreContainer.style.height = '240px';
      this.generalScoreGauge = echarts.init(generalScoreContainer);

      let plagiarismContainer = document.getElementById('plagiarism-gauge');
      plagiarismContainer.style.width = window.innerWidth * 0.22 + 'px';
      plagiarismContainer.style.height = '240px';
      this.plagiarismGauge = echarts.init(plagiarismContainer);

      let validityContainer = document.getElementById('validity-gauge');
      validityContainer.style.width = window.innerWidth * 0.22 + 'px';
      validityContainer.style.height = '240px';
      this.validityGauge = echarts.init(validityContainer);
    },

    drawGauges() {
      let gaugeOption = {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#f6b047'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2']
                ]
              }
            },
            pointer: {
              length: '35%',
              width: 4,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: '#8c8c8c'
              }
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 2
              }
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto',
                width: 5
              }
            },
            axisLabel: {
              color: '#464646',
              fontSize: 15,
              distance: -60,
              formatter: function (value) {
                if (value === 0.875) {
                  return '优';
                } else if (value === 0.625) {
                  return '良';
                } else if (value === 0.375) {
                  return '中';
                } else if (value === 0.125) {
                  return '差';
                }
                return '';
              }
            },
            title: {
              offsetCenter: [0, '-20%'],
              fontSize: 15
            },
            detail: {
              fontSize: 17,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value * 100) + '分';
              },
              color: 'auto'
            },
            data: []
          }
        ]
      };

      gaugeOption.series[0].data[0] = {
        value: Number(this.contents.generalScore.toFixed(2)),
        name: '综合得分'
      }
      this.generalScoreGauge.setOption(gaugeOption);

      gaugeOption.series[0].data[0] = {
        value: Number(this.contents.plagiarismScore.toFixed(2)),
        name: '评价重复'
      }
      this.plagiarismGauge.setOption(gaugeOption);

      gaugeOption.series[0].data[0] = {
        value: Number((this.contents.validNum / this.contents.allNum).toFixed(2)),
        name: '有效指数'
      }
      this.validityGauge.setOption(gaugeOption);
    }
  }
}
</script>

<style scoped>

.item-area {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  align-items: center;
}

.no-data-hint, .data-description {
  font-size: 14px;
  margin-top: 15px;
}

</style>
