<template>

  <div class="intro" v-show="show">
    <div class="banner">
      <img src="../../../assets/image/worker-plaza-intro.png" alt="" style="width: 200px" @load="show=true">
    </div>

    <div class="wrapper">

      <div class="box" @click="$router.push('/worker/plaza/recommended')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-edit"></i>
          </div>
          <span>推荐任务</span>
        </div>
        <div class="back-face">
          <span>推荐任务</span>
          <p>COLLECT 智能化协作众测平台通过其多样的算法，为您精准推荐适合您的众测任务，让您免于在众多测试任务中无法决策的烦恼。现在就看一看有什么适合您的任务吧！</p>
        </div>
      </div>

      <div class="box" @click="$router.push('/worker/plaza/invited')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-phone-outline"></i>
          </div>
          <span>受邀任务</span>
        </div>
        <div class="back-face">
          <span>受邀任务</span>
          <p>COLLECT 智能化协作众测平台将优秀的您推荐给发包方，是金子总会发光，看一看你受到了谁的青睐？</p>
        </div>
      </div>

      <div class="box" @click="$router.push('/worker/plaza/all')">
        <div class="front-face">
          <div class="icon">
            <i class="el-icon-document"></i>
          </div>
          <span>所有任务</span>
        </div>
        <div class="back-face">
          <span>所有任务</span>
          <p>若您想要浏览所有有效期内的众测任务，请点击这里，将会为您展示目前已发布的众测任务。现在就看一看任务广场中都有哪些亟需智慧的测试任务吧！</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "WorkerPlazaIntro",
  data() {
    return {
      show: false
    }
  }
}
</script>

<style scoped>

@import '../../../assets/style/IntroPage.css';

.wrapper {

  margin: 4% auto 0;

  width: 100%;

  display: grid;
  grid-gap: 35px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.wrapper .box {
  border-radius: 24px;
  width: 280px;
  margin: 0 auto;
  position: relative;
  perspective: 1000px;
}

</style>
