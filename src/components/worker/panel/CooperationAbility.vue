<template>
  <div>
    <span v-show="!hasData" style="font-size: 13px; color: gray">尚未计算完成，请稍后再来！</span>

    <div id="cooperation-ability-area" v-show="hasData">

      <GeneralScoreRadar v-if="hasData" :contents="contents"></GeneralScoreRadar>

      <el-divider></el-divider>

      <AverageSimilarity v-if="hasData" :contents="contents"></AverageSimilarity>

      <el-divider></el-divider>

      <ExpertCooperationField v-if="hasData" :contents="contents"></ExpertCooperationField>

    </div>

  </div>
</template>

<script>
import GeneralScoreRadar from "@/components/worker/panel/cooperationAbility/GeneralScoreRadar";
import AverageSimilarity from "@/components/worker/panel/cooperationAbility/AverageSimilarity";
import ExpertCooperationField from "@/components/worker/panel/cooperationAbility/ExpertCooperationField";

export default {
  name: "CooperationAbility",

  components: {
    GeneralScoreRadar, AverageSimilarity, ExpertCooperationField
  },

  props: [
    'contents'
  ],

  computed: {
    hasData() {
      return JSON.stringify(this.contents) !== '{}'
    }
  },
}
</script>

<style scoped>

#cooperation-ability-area {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 20px;
}

</style>
