<template>

  <div class="intro">
    <div class="banner">
      <img src="../../assets/image/platform-admin.png" alt="" style="width: 220px">
    </div>

    <div class="wrapper">

      <div class="box" @click="$router.push('/admin/plaza')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-setting"></i>
          </div>
          <span>任务管理</span>
        </div>
        <div class="back-face">
          <span>任务管理</span>
          <p>维护平台的健康稳定发展，是平台管理者的职责，您可以浏览平台中的任务，在发现低质量的任务时可以选择将其删除。</p>
        </div>
      </div>

      <div class="box" @click="$router.push('/admin/recommend/intro')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-edit-outline"></i>
          </div>
          <span>任务推荐</span>
        </div>
        <div class="back-face">
          <span>任务推荐</span>
          <p>在这里，您可以自定义任务推荐的规则，并对这些规则进行应用与增删改查，发挥您的管理员职责，为用户带来更好的体验。</p>
        </div>
      </div>

      <div class="box">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-user"></i>
          </div>
          <span>用户管理</span>
        </div>
        <div class="back-face">
          <span>用户管理</span>
          <p>在这里，您可以对平台用户进行管理，筛查出潜水用户、恶意用户，并对这些用户进行相应管理。（待实现）</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "AdminIntro"
}
</script>

<style scoped>

@import '../../assets/style/IntroPage.css';

.intro {
  box-shadow: 0px 5px 20px 0px rgba(22, 110, 56, 0.1);
}

.box .front-face .icon i,
.box .front-face span {
  background: linear-gradient(-135deg, #2bad72, #0e7347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wrapper {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.wrapper .box {
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(39, 86, 55, 0.2);
  width: 250px;
  margin: 0 auto;
  position: relative;
  perspective: 1000px;
}

.wrapper .box .front-face {
  background: #fff;
}

.wrapper .box .back-face {
  background: linear-gradient(-135deg, #5acb6e, #31af39);
  color: #fff;
  box-shadow: 0px 5px 20px 0px rgba(0, 81, 250, 0);
}

</style>
