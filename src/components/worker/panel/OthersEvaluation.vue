<template>
  <div>
    <span class="no-data-hint" v-show="!hasData">尚未计算完成，请稍后再来！</span>

    <div id="others-evaluation-area" v-show="hasData">

      <!-- 父组件向子组件传递异步数据时，需要用v-if限制一下子组件渲染，拿到后再渲染，否则子组件拿不到数据 -->

      <BossEvaluationPanelItem v-if="hasData" :contents="contents" :has-boss-evaluation="hasBossEvaluation">
      </BossEvaluationPanelItem>

      <el-divider></el-divider>

      <WorkerEvaluationPanelItem v-if="hasData"
                                 :contents="contents"
                                 :has-worker-evaluation="hasWorkerEvaluation">
      </WorkerEvaluationPanelItem>

      <el-divider></el-divider>

      <CommentsWordCloud v-if="hasData" :contents="contents" :has-worker-evaluation="hasWorkerEvaluation"></CommentsWordCloud>

    </div>
  </div>
</template>

<script>
import BossEvaluationPanelItem from "@/components/worker/panel/othersEvaluation/BossEvaluationPanelItem";
import WorkerEvaluationPanelItem from "@/components/worker/panel/othersEvaluation/WorkerEvaluationPanelItem";
import CommentsWordCloud from "@/components/worker/panel/othersEvaluation/CommentsWordCloud";

export default {
  name: "OthersEvaluation",

  components: {
    BossEvaluationPanelItem, WorkerEvaluationPanelItem, CommentsWordCloud
  },

  props: [
    'contents'
  ],

  computed: {
    hasData() {
      return JSON.stringify(this.contents) !== '{}'
    }
  },

  data() {
    return {
      hasBossEvaluation: this.contents.bossEvaluationNum !== 0,
      hasWorkerEvaluation: this.contents.workerEvaluationNum !== 0  && this.contents.workerEvaluationNum !== 0
    }
  }
}
</script>

<style scoped>

#others-evaluation-area {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 20px;
}

</style>
