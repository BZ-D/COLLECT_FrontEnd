<template>
  <div class="item-area" id="expert-fields-cloud-area">
    <img src="../../../../assets/image/review-word-cloud.png"
         alt=""
         style="width: 165px; margin-bottom: 12px;">

    <span class="data-description" v-show="!hasReviewScore">
      您尚未对其他报告进行评审，暂无法显示词云图。
    </span>

    <span class="data-description" v-show="hasReviewScore">
      “<span style="color: #0c3183; font-weight: bold;">评审领域词云图</span>”通过统计您评审的报告关键词，直观地展现出您擅长的报告评审领域。
    </span>

    <el-button v-show="buttonShow && hasReviewScore" @click="drawWordCloud">点击加载</el-button>

    <div class="container" v-if="hasReviewScore">
      <div id="field-word-canvas"></div>
    </div>
  </div>
</template>

<script>
import WordCloud from 'wordcloud'

export default {
  name: "ExpertFieldsWordCloud",

  props: ['contents', 'hasReviewScore'],

  data() {
    return {
      buttonShow: true
    }
  },

  methods: {
    drawWordCloud() {
      this.buttonShow = false;
      if (this.hasReviewScore) {
        const wordFreqData = [];
        for (const word of Object.keys(this.contents.wordFreq)) {
          wordFreqData.push([word, this.contents.wordFreq[word]]);
        }

        const canvas = document.getElementById('field-word-canvas');
        canvas.style.width = window.innerWidth * 0.4 + 'px';
        canvas.style.height = '500px';

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
            let times = parseInt(30 / ((max - min) / 2 + min));
            let divider = 0;

            if (max >= 8) {
              divider = Math.random() + 7;
            } else {
              divider = 1;
            }

            return Math.pow(size, 2.2) * times / divider;
          },
          fontFamily: 'Arial, STKaiti, Microsoft YaHei, 黑体, Times, serif',
          color: "random-dark",
          rotateRatio: 0
        };

        WordCloud(canvas, options);
      }
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

.container {
  width: 70%;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}

#field-word-canvas {
  margin: 0 auto;
}

</style>
