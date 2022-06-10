<template>
  <div class="item-area" id="expert-cooperation-field">

    <img src="../../../../assets/image/co-field.png" alt="" style="width: 170px; margin-bottom: 10px;">

    <span class="data-description">
      经系统综合分析判断，您最擅长的报告协作领域为：
    </span>

    <img v-if="contents.skill==='bug_explore'" src="../../../../assets/image/bug-explore.png" alt="" style="width: 300px; margin-top: 20px;">
    <img v-if="contents.skill==='function_test'" src="../../../../assets/image/function-test.png" alt="" style="width: 300px; margin-top: 20px;">
    <img v-if="contents.skill==='performance_test'" src="../../../../assets/image/performance-test.png" alt="" style="width: 300px; margin-top: 20px;">

  </div>
</template>

<script>
export default {
  name: "ExpertCooperationField",

  props: ['contents']
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
