<template>
  <div class="item-area" id="average-similarity-area">

    <img src="../../../../assets/image/average-similarity.png" alt="" style="width: 170px; margin-bottom: 10px;">

    <el-row>

      <el-col :span="24">
        <div id="sim-line"></div>
      </el-col>

    </el-row>

    <div style="width: 60%; display: flex; flex-direction: column;">
      <span class="data-description">
        <span style="color: #0c3183; font-weight: bold;">
          上图
        </span>
        展示了您每篇报告的文本/图像相似度与所有报告的平均文本/图像相似度的偏差折线，您可以直观地看到自己报告的相似度情况。
      </span>
      <br>
      <span class="data-description">
        您有
        <span style="color: #0c3183; font-weight: bold;">
          {{ higherThanAverageTextSim }}
        </span>
        篇报告的文本相似度高于您所有报告的平均文本相似度
        <span style="color: #0c3183; font-weight: bold;">
          ({{ (contents.avgTextSim * 100).toFixed(1) }}%)
        </span>。
      </span>
      <span class="data-description">
        您有
        <span style="color: #0c3183; font-weight: bold;">
          {{ higherThanAveragePicSim }}
        </span>
        篇报告的图像相似度高于您所有报告的平均图像相似度
        <span style="color: #0c3183; font-weight: bold;">
          ({{ (contents.avgPicSim * 100).toFixed(1) }}%)
        </span>。
      </span>
    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "AverageSimilarity",

  props: ['contents'],

  mounted() {
    this.initSimChart();
    this.drawSimChart();
    window.addEventListener('resize', this.resizeHandler);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
    this.simLineChart.dispose()
  },

  data() {
    return {
      simLineChart: null,

      higherThanAverageTextSim: 0,
      higherThanAveragePicSim: 0
    }
  },

  methods: {
    resizeHandler() {
      let container = document.getElementById('sim-line');
      container.style.width = window.innerWidth * 0.43 + 'px';
      container.style.height = '400px';
      this.simLineChart.resize();
    },

    initSimChart() {
      let container = document.getElementById('sim-line');
      container.style.width = window.innerWidth * 0.43 + 'px';
      container.style.height = '400px';
      this.simLineChart = echarts.init(container);
    },

    drawSimChart() {
      let option = {
        tooltip: {
          trigger: 'axis'
        },

        legend: {},

        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false

        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: '文本相似度',
            type: 'line',
            data: [],
            markPoint: {
              data: [
                { type: 'max' },
                { type: 'min' }
              ]
            },
            markLine: {
              data: [{ name: '文本相似度平均值' }]
            }
          },
          {
            name: '图像相似度',
            type: 'line',
            data: [],
            markPoint: {
              data: [
                { type: 'max' },
                { type: 'min' }
              ]
            },
            markLine: {
              data: [{ name: '图像相似度平均值' }]
            }
          }
        ]
      };

      option.series[0].markLine.data[0]['yAxis'] = Number((this.contents.avgTextSim * 100).toFixed(1));
      option.series[1].markLine.data[0]['yAxis'] = Number((this.contents.avgPicSim * 100).toFixed(1));

      for (const sim of this.contents.simList) {
        if (sim.textSimilarity > this.contents.avgTextSim) {
          this.higherThanAverageTextSim++;
        }
        if (sim.picSimilarity > this.contents.avgPicSim) {
          this.higherThanAveragePicSim++;
        }

        option.series[0].data.push(Number((sim.textSimilarity * 100).toFixed(1)));
        option.series[1].data.push(Number((sim.picSimilarity * 100).toFixed(1)));
      }

      this.simLineChart.setOption(option);
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
