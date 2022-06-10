<template>

  <div>
    <!-- 评价仪表盘 -->
    <div id="eval-up-hint-box" @click="drawer=true" v-show="!drawer">
      <img id="eval-up-icon" src="../../../assets/image/up.png" alt="">
      <span id="eval-up-hint">查看我的能力仪表盘</span>
    </div>

    <el-drawer
        :visible.sync="drawer"
        :with-header="false"
        size="95%"
        :append-to-body="true"
        :show-close="false"
        :lock-scroll="false"
        direction="btt">

      <div id="eval-down-hint-box" @click="drawer=false" v-show="drawer">
        <img id="eval-down-icon" src="../../../assets/image/down.png" alt="">
        <span id="eval-down-hint">收起仪表盘</span>
      </div>

      <div id="panel-navibar-area">
        <el-tabs id="panel-navibar"
                 :visible.sync="drawer"
                 active-name="综合评价"
                 type="border-card">

          <el-tab-pane name="综合评价">
            <span slot="label"><i class="el-icon-thumb"></i> 综合评价</span>

            <OthersEvaluation v-if="hasOthersEvaluationData" :contents="othersEvaluation"></OthersEvaluation>

          </el-tab-pane>

          <el-tab-pane name="评审能力">
            <span slot="label"><i class="el-icon-finished"></i> 评审能力</span>

            <ReviewAbility v-if="hasReviewAbilityData" :contents="reviewAbility"></ReviewAbility>

          </el-tab-pane>

          <el-tab-pane name="协作能力">
            <span slot="label"><i class="el-icon-connection"></i> 协作能力</span>

            <CooperationAbility v-if="hasCooperationAbilityData"
                                :contents="cooperationAbility"></CooperationAbility>

            <span v-show="cooperationNotEnough" style="font-size: 13px; color: gray">
              您的报告协作数目少于1，暂不能统计协作能力信息，请多协作几篇报告后再查看。
            </span>
          </el-tab-pane>

        </el-tabs>
      </div>

    </el-drawer>
  </div>

</template>

<script>
import CooperationAbility from "@/components/worker/panel/CooperationAbility";
import OthersEvaluation from "@/components/worker/panel/OthersEvaluation";
import ReviewAbility from "@/components/worker/panel/ReviewAbility";

import {getOthersEvaluationByWorkerID, getReviewAbilityByWorkerID, getCooperationAbilityByWorkerID} from "@/api/panel";

export default {
  name: "WorkerPanel",

  components: {
    CooperationAbility, OthersEvaluation, ReviewAbility
  },

  created() {
    getOthersEvaluationByWorkerID(sessionStorage.getItem('userid')).then(_ => {
      if (_.code === 200) {
        this.othersEvaluation = _.data;
      } else {
        this.$message.error('获取综合评价失败，请刷新页面重试！');
      }
    });

    getReviewAbilityByWorkerID(sessionStorage.getItem('userid')).then(_ => {
      if (_.code === 200) {
        this.reviewAbility = _.data;
      } else {
        this.$message.error('获取评审能力失败，请刷新页面重试！');
      }
    });

    getCooperationAbilityByWorkerID(sessionStorage.getItem('userid')).then(_ => {
      if (_.msg === '报告协作数目少于1篇') {
        this.cooperationNotEnough = true;
      }

      if (_.code === 200) {
        this.cooperationAbility = _.data;
      } else {
        this.$message.error('获取协作能力失败，请刷新页面重试！');
      }
    })
  },

  computed: {
    hasOthersEvaluationData() {
      return JSON.stringify(this.othersEvaluation) !== '{}';
    },

    hasReviewAbilityData() {
      return JSON.stringify(this.reviewAbility) !== '{}';
    },

    hasCooperationAbilityData() {
      return JSON.stringify(this.cooperationAbility) !== '{}' && !this.cooperationNotEnough;
    }
  },

  data() {
    return {
      drawer: JSON.stringify(this.othersEvaluation) !== '{}' &&
          JSON.stringify(this.reviewAbility) !== '{}' &&
          JSON.stringify(this.cooperationAbility) !== '{}' &&
          this.$route.path === '/worker',

      othersEvaluation: {},
      reviewAbility: {},
      cooperationAbility: {},

      cooperationNotEnough: false
    }
  }
}
</script>

<style>

.el-drawer__body {
  padding: 50px 20px 20px;
}

.el-drawer.btt {

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 85%;
  margin: 0 auto;

  opacity: 0.96;
}

.v-modal {
  opacity: 0.25;
}

</style>

<style scoped>

#eval-up-hint-box, #eval-down-hint-box {
  width: 220px;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);

  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 8px;

  cursor: pointer;
}

#eval-up-hint-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;

  border-top-left-radius: 19px;
  border-top-right-radius: 19px;

  z-index: 2000;
}

#eval-down-hint-box {
  position: absolute;
  background: rgb(134, 134, 134);

  z-index: 9999;

  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;

  width: 150px;

  border-bottom-left-radius: 19px;
  border-bottom-right-radius: 19px;
}

#eval-up-hint-box:hover > #eval-up-hint, #eval-down-hint-box:hover > #eval-down-hint {
  color: #ceeaff;
}

#eval-up-icon, #eval-down-icon {
  width: 25px;
  position: relative;

  animation-name: beat;
  /*动画名称*/
  animation-duration: .7s;
  /*设置秒数*/
  animation-timing-function: linear;
  /*速度曲线*/
  animation-iteration-count: infinite;
  /*播放次数*/
  animation-direction: alternate;
  /*逆向播放*/
  animation-play-state: running;
  /*正在运行*/
}

@keyframes beat {
  0% {
    bottom: -6%;
  }

  100% {
    bottom: 6%;
  }
}

#eval-up-hint, #eval-down-hint {
  color: #fff;
  font-size: 15px;
}

#panel-navibar-area {
  width: 95%;
  margin: 0 auto;
}

</style>
