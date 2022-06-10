<template>
  <div id="review-page">

    <keep-alive include="ReviewIntro">
      <router-view/>
    </keep-alive>

  </div>
</template>

<script>
export default {
  name: "Review"
}
</script>

<style scoped>

</style>
