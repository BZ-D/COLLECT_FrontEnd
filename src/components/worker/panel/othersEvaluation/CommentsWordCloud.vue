<template>
  <div class="item-area" id="comment-word-cloud-area">
    <img src="../../../../assets/image/evaluation-word-cloud.png" alt="" style="width: 125px; margin-bottom: 12px;">

    <span class="data-description" v-show="!hasWorkerEvaluation">
      尚未有其他工人对您的报告进行评价，暂无法显示词云图。
    </span>

    <span class="data-description" v-show="hasWorkerEvaluation">
      “评价词频图”包含两个部分——“<span style="color: #0c3183; font-weight: bold;">词频玫瑰图</span>”和“<span style="color: #0c3183; font-weight: bold;">评价词云图</span>”，其中：
    </span>

    <span class="data-description" v-show="hasWorkerEvaluation">
      “<span style="color: #0c3183; font-weight: bold;">词频玫瑰图</span>”筛选出其他工人对您报告评价关键词中词频排名前十的关键词，展现了其他工人对您的大致印象。
    </span>

    <span class="data-description" v-show="hasWorkerEvaluation">
      “<span style="color: #0c3183; font-weight: bold;">评价词云图</span>”体现了其他工人对您报告的评价中关键词频的分布情况，您可以直观地了解其他工人对您报告的总体评价。
    </span>

    <span style="color: #0c3183; font-weight: bold; margin-top: 40px; font-size: 22px">词频玫瑰图</span>
    <div id="comments-freq-chart"></div>


    <span style="color: #0c3183; font-weight: bold; margin-top: 30px; margin-bottom: 15px; font-size: 22px">评价词云图</span>
    <el-button @click="drawWordCloud" v-show="buttonShow && hasWorkerEvaluation">点击加载词云图</el-button>

    <div class="container" v-show="hasWorkerEvaluation">
      <div id="comment-word-canvas"></div>
    </div>
  </div>
</template>

<script>
import WordCloud from 'wordcloud';
import * as echarts from 'echarts';

export default {
  name: "CommentsWordCloud",

  props: ['contents', 'hasWorkerEvaluation'],

  data() {
    return {
      buttonShow: true,
      freqRoseChart: null
    }
  },

  mounted() {
    this.initFreqRose();
    this.drawFreqRose();
    window.addEventListener('resize', this.resizeHandler);
  },

  beforeDestroy() { // 清理工作 避免内存泄漏
    // 销毁监听事件
    window.removeEventListener('resize', this.resizeHandler);
    this.freqRoseChart.dispose();
  },

  methods: {
    resizeHandler() {
      let pieContainer = document.getElementById('comments-freq-chart');
      pieContainer.style.width = window.innerWidth * 0.46 + 'px';
      pieContainer.style.height = '450px';
      this.freqRoseChart.resize();
    },

    drawWordCloud() {
      this.buttonShow = false;
      if (this.hasWorkerEvaluation) {
        const wordFreqData = [];
        for (const word of Object.keys(this.contents.commentWordFreq)) {
          wordFreqData.push([word, this.contents.commentWordFreq[word]]);
        }

        const canvas = document.getElementById('comment-word-canvas');
        canvas.style.width = window.innerWidth * 0.45 + 'px';
        canvas.style.height = '410px';

        const options = {
          list: wordFreqData,
          gridSize: 16,
          fontWeight: 600,
          shape: "diamond",
          weightFactor: function (size) {
            let tmp = wordFreqData.map(v => v);

            tmp.sort((a, b) => {
              return b[1] - a[1];
            });

            let max = tmp[0][1];
            let min = tmp[tmp.length - 1][1];
            let times = parseInt(25 / ((max - min) / 2 + min));
            let divider = 0;

            if (max >= 8) {
              divider = Math.random() + 7;
            } else {
              divider = 1.8;
            }

            return Math.pow(size, 2.1) * times / divider;
          },
          fontFamily: 'Arial, STKaiti, Microsoft YaHei, 黑体, Times, serif',
          color: "random-dark",
          rotateRatio: 0
        };

        WordCloud(canvas, options);
      }
    },

    initFreqRose() {
      let pieContainer = document.getElementById('comments-freq-chart');
      pieContainer.style.width = window.innerWidth * 0.46 + 'px';
      pieContainer.style.height = '450px';
      this.freqRoseChart = echarts.init(pieContainer);
    },

    drawFreqRose() {
      const wordFreqData = [];
      for (const word of Object.keys(this.contents.commentWordFreq)) {
        wordFreqData.push([word, this.contents.commentWordFreq[word]]);
      }

      wordFreqData.sort((a, b) => {
        return b[1] - a[1];
      });

      let option = {
        tooltip: {
          formatter: function (params) {
            return `<i style="color: #0e8cd9; font-weight: bold;">${params.data.name} </i>:
                    <span style="color: #154ca9; font-weight: bold;">${params.data.actualValue}</span>`
          }
        },
        series: [
          {
            type: 'pie',
            radius: [15, 170],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 4
            },
            data: [
              // { value: 40, name: 'rose 1' }
            ]
          }
        ]
      };

      // 选取前十个最高频率的词
      let lim = wordFreqData.length < 10 ? wordFreqData.length : 10;
      let balanceFactor = parseInt((wordFreqData[0][1] - wordFreqData[lim - 1][1]) / 2)
      for (let i = 0; i < lim; i++) {
        option.series[0].data.push({
          name: wordFreqData[i][0],
          value: wordFreqData[i][1] + balanceFactor,
          actualValue: wordFreqData[i][1]
        })
      }

      this.freqRoseChart.setOption(option);
    }
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

.container {
  width: 70%;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}

#comment-word-canvas {
  margin: 0 auto;
}

.item-area {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  align-items: center;
}

</style>
