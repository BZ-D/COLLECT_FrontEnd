<template>
  <div id="recommend-manage-page">
    <keep-alive include="RuleDetail">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "Recommend"
}
</script>

<style scoped>

</style>
