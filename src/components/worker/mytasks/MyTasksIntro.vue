<template>

  <div class="intro" v-show="show">
    <div class="banner">
      <img src="../../../assets/image/worker-mytasks-intro.png" alt="" style="width: 200px" @load="show=true">
    </div>

    <div class="wrapper">

      <div class="box" @click="$router.push('/worker/mytasks/executing')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-s-promotion"></i>
          </div>
          <span>执行中任务</span>
        </div>
        <div class="back-face">
          <span>执行中任务</span>
          <p>在这里，您可以查看已经领取的任务，并在完成测试任务后提交测试报告。韶光易逝，岁月如水，种一棵树最好的光景是十年前和当下。</p>
        </div>
      </div>

      <div class="box" @click="$router.push('/worker/mytasks/finished')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-success"></i>
          </div>
          <span>历史任务</span>
        </div>
        <div class="back-face">
          <span>历史任务</span>
          <p>在这里，您可以查看已经完成的测试任务，也可以查看自己的和其他测试者提交的报告。集思广益方能共同进步，相互批评才能一起成长。</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "WorkerMyTasksIntro",
  data() {
    return {
      show: false
    }
  }
}
</script>

<style scoped>

@import '../../../assets/style/IntroPage.css';

</style>
