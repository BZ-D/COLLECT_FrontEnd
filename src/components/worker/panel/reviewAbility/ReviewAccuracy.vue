<template>
  <div class="item-area" id="review-accuracy-area">
    <img src="../../../../assets/image/review-accuracy.png" alt="" style="width: 120px; margin-bottom: 10px;">

    <span class="no-data-hint" v-show="!hasReviewScore">您尚未对其他报告进行评审，无法获取！</span>

    <span class="data-description" v-show="hasReviewScore">
      “<span style="color: #0c3183; font-weight: bold;">评审准确度</span>”针对于您给报告评分与该报告的平均得分的偏离程度进行计算，评审准确度越高，说明您的评分越接近报告真实质量。若您的评分和该报告平均得分相同，则偏离程度为0，
      则在这张图上没有偏离度显示。
    </span>

    <el-row id="accuracy-chart-area" v-show="hasReviewScore">
      <el-col :span="10">
        <div id="accuracy-gauge"></div>
      </el-col>

      <el-col :span="12">
        <div id="accuracy-bar"></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "ReviewAccuracy",

  props: ['contents', 'hasReviewScore'],

  mounted() {
    this.initCharts();
    this.drawCharts();
    window.addEventListener('resize', this.resizeHandler);
  },

  beforeDestroy() { // 清理工作 避免内存泄漏
    // 销毁监听事件
    window.removeEventListener('resize', this.resizeHandler);
    this.accuracyGauge.dispose();
    this.accuracyBar.dispose();
  },

  data() {
    return {
      accuracyGauge: null,
      accuracyBar: null
    }
  },

  methods: {
    resizeHandler() {
      let gaugeContainer = document.getElementById('accuracy-gauge');
      gaugeContainer.style.width = window.innerWidth * 0.3 + 'px';
      gaugeContainer.style.height = '400px';
      this.accuracyGauge.resize();

      let barContainer = document.getElementById('accuracy-bar');
      barContainer.style.width = window.innerWidth * 0.4 + 'px';
      barContainer.style.height = '400px';
      this.accuracyBar.resize();
    },

    initCharts() {
      let gaugeContainer = document.getElementById('accuracy-gauge');
      gaugeContainer.style.width = window.innerWidth * 0.3 + 'px';
      gaugeContainer.style.height = '400px';
      this.accuracyGauge = echarts.init(gaugeContainer);

      let barContainer = document.getElementById('accuracy-bar');
      barContainer.style.width = window.innerWidth * 0.4 + 'px';
      barContainer.style.height = '400px';
      this.accuracyBar = echarts.init(barContainer);
    },

    drawCharts() {
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
            data: [ { value: this.contents.accuracyScore, name: '准确度得分' } ]
          }
        ]
      };

      let barOption = {
        legend: {
          data: ['偏高', '偏低']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            min: -5,
            max: 5,
            splitNumber: 21
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '偏高',
            type: 'bar',
            label: {
              show: true,
              position: 'right'
            },
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#7189FF'
            },
            data: []
          },
          {
            name: '偏低',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              position: 'left'
            },
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#F8AC22'
            },
            data: []
          }
        ]
      };
      for (const score of this.contents.accuracyList) {
        const diff = Number((score['score'] - score['averageScore']).toFixed(2));
        if (diff >= 0) {
          barOption.series[0].data.push(diff);
        } else {
          barOption.series[1].data.push(diff);
        }
      }

      this.accuracyGauge.setOption(gaugeOption);
      this.accuracyBar.setOption(barOption);
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
}

</style>
