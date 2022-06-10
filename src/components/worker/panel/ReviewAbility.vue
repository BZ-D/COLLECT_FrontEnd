<template>
  <div>
    <span v-show="!hasData" style="font-size: 13px; color: gray">尚未计算完成，请稍后再来！</span>

    <div id="review-ability-area" v-show="hasData">

      <!-- 父组件向子组件传递异步数据时，需要用v-if限制一下子组件渲染，拿到后再渲染，否则子组件拿不到数据 -->

      <GeneralScores v-if="hasData" :contents="contents" :has-review-score="hasReviewScore"></GeneralScores>

      <el-divider></el-divider>

      <ReviewAccuracy v-if="hasData" :contents="contents" :has-review-score="hasReviewScore"></ReviewAccuracy>

      <el-divider></el-divider>

      <ExpertFieldsWordCloud v-if="hasData" :contents="contents" :has-review-score="hasReviewScore"></ExpertFieldsWordCloud>

      <el-divider></el-divider>

      <FavoriteWorkers v-if="hasData" :contents="contents" :has-review-score="hasReviewScore"></FavoriteWorkers>

    </div>
  </div>
</template>

<script>
import GeneralScores from "@/components/worker/panel/reviewAbility/GeneralScores";
import ReviewAccuracy from "@/components/worker/panel/reviewAbility/ReviewAccuracy";
import ExpertFieldsWordCloud from "@/components/worker/panel/reviewAbility/ExpertFieldsWordCloud";
import FavoriteWorkers from "@/components/worker/panel/reviewAbility/FavoriteWorkers";

export default {
  name: "ReviewAbility",
  components: { GeneralScores, ReviewAccuracy, ExpertFieldsWordCloud, FavoriteWorkers },
  props: ['contents'],

  computed: {
    hasData() {
      return JSON.stringify(this.contents) !== '{}'
    }
  },

  data() {
    return {
      hasReviewScore: this.contents.generalScore !== 0
    }
  }
}
</script>

<style scoped>

* {
  color: #3f3f3f
}

#review-ability-area {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 20px;
}

</style>
