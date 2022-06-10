<template>
  <div>

    <el-main id="review-intro-box" v-show="show">

      <div>
        <img src="../../../../assets/image/recommend-manage-title.png" alt="" style="width: 280px" @load="show=true">
      </div>

      <el-row class="intro-item">
        <el-col :span="6" class="intro-item-no">
          <i class="el-icon-s-cooperation"></i>
          <span>规则仓库</span>
        </el-col>
        <el-col :span="18" class="intro-item-content">
          <div class="intro-item-content-title">
            <img src="../../../../assets/image/rule-manage.png" alt="" style="width: 160px; margin-bottom: 10px;">
          </div>
          <div class="intro-item-content-details">
            <p style="text-align: justify">
              作为&nbsp;COLLECT&nbsp;协作式众测平台的管理员，您可以在此管理所有已定义的任务推荐规则，包括浏览规则、删除规则等。此外，您还可以对已定义的规则进行修改，以达到更佳的推荐效果。
            </p>
          </div>
          <div class="enter" @click="$router.push('/admin/recommend/rules')">
            <img src="../../../../assets/image/enter-inactive.png" alt="" style="width: 80px;">
          </div>
        </el-col>
      </el-row>

      <el-row class="intro-item">
        <el-col :span="6" class="intro-item-no">
          <i class="el-icon-s-operation"></i>
          <span>新的规则</span>
        </el-col>
        <el-col :span="18" class="intro-item-content">
          <div class="intro-item-content-title">
            <img src="../../../../assets/image/add-new-rule.png" alt="" style="width: 160px; margin-bottom: 10px;">
          </div>
          <div class="intro-item-content-details">
            <p style="text-align: justify">
              作为&nbsp;COLLECT&nbsp;协作式众测平台的管理员，您可以在此添加一条新的任务推荐规则，您需要合理调配各关联因子的权重系数，为众包工人推荐更适合他们的众测任务。
            </p>
          </div>
          <div class="enter" @click="$router.push('/admin/recommend/addRule')">
            <img src="../../../../assets/image/enter-inactive.png" alt="" style="width: 80px">
          </div>
        </el-col>
      </el-row>

    </el-main>

  </div>
</template>

<script>
export default {
  name: "RecommendIntro",

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
  height: 75vh;
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
  background: #30913c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
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
  font-size: 70px;
}

.intro-item-no span {
  font-size: 30px;
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
  content: url("../../../../assets/image/enter-active.png");
}

</style>
