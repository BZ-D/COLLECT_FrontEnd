<template>

  <div class="intro">
    <div class="banner">
      <img src="../../../assets/image/boss-mytasks-intro.png" alt="" style="width: 200px">
    </div>

    <div class="wrapper">

      <div class="box" @click="$router.push('/boss/mytasks/executing')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-s-promotion"></i>
          </div>
          <span>执行中任务</span>
        </div>
        <div class="back-face">
          <span>执行中任务</span>
          <p>在这里，您可以查看已经发布的任务，也可以浏览已提交的报告。我有嘉宾，鼓瑟吹笙。集思广益，方能成就未来。</p>
        </div>
      </div>

      <div class="box" @click="$router.push('/boss/mytasks/finished')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-success"></i>
          </div>
          <span>历史任务</span>
        </div>
        <div class="back-face">
          <span>历史任务</span>
          <p>在这里，您可以查看已经完成的测试任务，也可以浏览所有已提交的报告。以众人之慧补软件之缺漏，以谦虚之姿推进开发历程。</p>
        </div>
      </div>

      <div class="box" @click="$router.push('/boss/release')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-s-management"></i>
          </div>
          <span>发布任务</span>
        </div>
        <div class="back-face">
          <span>发布任务</span>
          <p>在这里，您可以发布一个全新的测试任务。众人扶船能过山，众人抬柴火焰高。</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "BossMyTasksIntro"
}
</script>

<style scoped>

@import '../../../assets/style/IntroPage.css';


.box .front-face .icon i,
.box .front-face span {
  background: linear-gradient(-135deg, #d04c4c, #b61919);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wrapper {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.wrapper .box {
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(86, 39, 67, 0.2);
  width: 250px;
  margin: 0 auto;
  position: relative;
  perspective: 1000px;
}

.wrapper .box .front-face {
  background: #fff;
}

.wrapper .box .back-face {
  background: linear-gradient(-135deg, #e55656, #ff9898);
  color: #fff;
  box-shadow: 0px 5px 20px 0px rgba(0, 81, 250, 0);
}

</style>
