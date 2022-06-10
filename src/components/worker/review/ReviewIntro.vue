<template>
  <div>

    <el-main id="review-intro-box" v-show="show">

      <div>
        <img src="../../../assets/image/review.png" alt="" style="width: 160px; margin: 10px 0 20px 0;" @load="show=true">
      </div>

      <el-row class="intro-item">
        <el-col :span="6" class="intro-item-no">
          <i class="el-icon-finished"></i>
          <span>评审列表</span>
        </el-col>
        <el-col :span="18" class="intro-item-content">
          <div class="intro-item-content-title">
            评审列表
          </div>
          <div class="intro-item-content-details">
            <p style="text-align: justify">
              这里列举了您关注工人的任务报告和系统根据您的能力为您推荐的任务报告，您可以从中选择，并直接进行评审。
            </p>
          </div>
          <div class="enter" @click="$router.push('/worker/review/report-list')">
            <img src="../../../assets/image/enter-blue-inactive.png" alt="" style="width: 80px;">
          </div>
        </el-col>
      </el-row>

      <el-row class="intro-item">
        <el-col :span="6" class="intro-item-no">
          <i class="el-icon-wind-power"></i>
          <span>关注工人</span>
        </el-col>
        <el-col :span="18" class="intro-item-content">
          <div class="intro-item-content-title">
            关注工人
          </div>
          <div class="intro-item-content-details">
            <p style="text-align: justify">
              您可以在这里关注其他众包工人，他们完成的测试报告将会优先推送给您进行评审。
            </p>
          </div>
          <div class="enter" @click="$router.push('/worker/review/follow-others')">
            <img src="../../../assets/image/enter-blue-inactive.png" alt="" style="width: 80px">
          </div>
        </el-col>
      </el-row>

    </el-main>

  </div>
</template>

<script>
export default {
  name: "ReviewIntro",

  data() {
    return {
      show: false
    }
  }
}
</script>

<style scoped>

#review-intro-box {
  width: 65%;
  height: 70vh;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(90, 106, 140, 0.3);
  margin: 20px auto;
}

.intro-item {
  height: 37%;
  width: 90%;
  margin: 0 auto 20px;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(90, 106, 140, 0.3);
}

.intro-item-no {
  background: #406EB4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
}

.intro-item-content-title {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 24px;
  color: #406EB4;
}

.intro-item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 25px;
}

.intro-item-no, .intro-item-content {
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  height: 100%;
}

.intro-item:last-child {
  margin-bottom: 0;
}

.intro-item-no i {
  font-size: 55px;
}

.intro-item-no span {
  font-size: 24px;
  font-weight: bold;
  cursor: default;
}

.intro-item-no i,
.intro-item-no span {
  color: #fff;
}

.enter {
  position: absolute;
  right: 30px;
  bottom: 15px;
}

.enter:hover {
  cursor: pointer;
}

.enter img:hover {
  content: url("../../../assets/image/enter-blue-active.png");
}

</style>
