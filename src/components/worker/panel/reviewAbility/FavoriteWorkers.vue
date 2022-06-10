<template>
  <div class="item-area" id="favorite-worker-area">
    <img src="../../../../assets/image/favorite-workers.png" alt=""
         style="width: 165px; margin-bottom: 12px;">

    <span class="data-description" v-show="!hasReviewScore">
      您尚未对其他报告进行评审，暂无法显示。
    </span>

    <span class="data-description" v-show="hasReviewScore">
      “<span style="color: #0c3183; font-weight: bold;">最爱评价的工人</span>”通过统计您评审报告对应的创作者，得出您对每一位工人的评审次数，进而选出您最爱评价的工人。
    </span>

    <span style="color: #0c3183; font-weight: bold;" v-show="hasReviewScore">最爱评价的工人：{{ favoriteWorker }}</span>

    <el-row id="favorite-worker-chart" v-show="hasReviewScore">
      <el-col :span="12">
        <div id="favorite-worker-pie"></div>
      </el-col>

      <el-col :span="12">
        <div id="favorite-worker-bar"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "FavoriteWorkers",

  props: ['contents', 'hasReviewScore'],

  created() {
    if (this.hasReviewScore) {
      this.chooseFavoriteWorker();
    }
  },

  mounted() {
    this.initFavoriteWorkerChart();
    this.drawFavoriteWorkerChart();

    window.addEventListener('resize', this.resizeHandler);
  },

  beforeDestroy() { // 清理工作 避免内存泄漏
    // 销毁监听事件
    window.removeEventListener('resize', this.resizeHandler);
    this.favoriteWorkerPie.dispose();
    this.favoriteWorkerBar.dispose();
  },

  data() {
    return {
      favoriteWorker: '',

      favoriteWorkerPie: null,
      favoriteWorkerBar: null,

      workers: []
    }
  },

  methods: {
    resizeHandler() {
      let pieContainer = document.getElementById('favorite-worker-pie');
      pieContainer.style.width = window.innerWidth * 0.28 + 'px';
      pieContainer.style.height = '200px';
      this.favoriteWorkerPie.resize();

      let barContainer = document.getElementById('favorite-worker-bar');
      barContainer.style.width = window.innerWidth * 0.28 + 'px';
      barContainer.style.height = '240px';
      this.favoriteWorkerBar.resize();
    },

    chooseFavoriteWorker() {
      this.workers = this.contents.favoriteWorkers.map(v => v);
      this.workers.sort((a, b) => {
        return b.evaluateNum - a.evaluateNum;
      })

      this.favoriteWorker = this.workers[0].username;
    },

    initFavoriteWorkerChart() {
      let pieContainer = document.getElementById('favorite-worker-pie');
      pieContainer.style.width = window.innerWidth * 0.28 + 'px';
      pieContainer.style.height = '200px';
      this.favoriteWorkerPie = echarts.init(pieContainer);

      let barContainer = document.getElementById('favorite-worker-bar');
      barContainer.style.width = window.innerWidth * 0.28 + 'px';
      barContainer.style.height = '240px';
      this.favoriteWorkerBar = echarts.init(barContainer);
    },

    drawFavoriteWorkerChart() {
      // 饼状图
      let pieOption = {
        tooltip: {},
        series: [
          {
            type: 'pie',
            stillShowZeroSum: false,
            data: [] // name, value
          }
        ]
      };

      // 柱状、折线图
      let barOption = {
        title: {
          show: true,
          text: '评价他人次数：折线-柱状图',
          x: 'center',
          textStyle: {
            fontSize: 15
          }
        },
        tooltip: {},
        xAxis: {
          data: []
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

      for (const v of this.workers) {
        pieOption.series[0].data.push({
          name: v.username,
          value: v.evaluateNum
        });

        barOption.xAxis.data.push(v.username);
        barOption.series[0].data.push(v.evaluateNum);
        barOption.series[1].data.push(v.evaluateNum);
      }

      this.favoriteWorkerPie.setOption(pieOption);
      this.favoriteWorkerBar.setOption(barOption);
    }
  }
}
</script>

<style scoped>

* {
  color: #3f3f3f;
}

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
