<template>
  <div id="rule-detail-page">

    <el-main id="rule-detail-box" v-loading="loading" element-loading-text="正在加载"
             element-loading-spinner="el-icon-loading">

      <div>
        <img src="../../../../assets/image/rule-detail-title.png" alt="" style="width: 200px;">
      </div>

      <el-row class="detail-content-box">
        <el-col :span="12" class="detail-content factor-chart" ref="chart-box">
          <div class="content-title">
            <img src="../../../../assets/image/factor-weight.png" alt="" style="width: 120px">
          </div>
          <div id="weight-chart"></div>
        </el-col>

        <el-col :span="12" class="detail-content factor-description">
          <div class="content-title">
            <img src="../../../../assets/image/rule-description.png" alt="" style="width: 120px">
          </div>
          <el-descriptions class="margin-top" :column="1" border>
            <el-descriptions-item>
              <template slot="label">
                规则名称
              </template>
              {{ ruleDetail.name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                已领取任务
              </template>
              {{ ruleDetail.claimedTasks }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                擅长技能
              </template>
              {{ ruleDetail.skills }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                任务偏好
              </template>
              {{ ruleDetail.taskPrefer }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                测试环境
              </template>
              {{ ruleDetail.environment }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                最近截止
              </template>
              {{ ruleDetail.latestDeadline }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <div class="button-region">
        <el-button type="danger" @click="confirmDelete">删除</el-button>
        <el-button type="info"
                   @click="$router.push('/admin/recommend/rules')" plain>
          <i class="el-icon-back"></i>&nbsp;返回规则列表
        </el-button>
        <el-button type="primary" @click="gotoModify">修改</el-button>
      </div>

    </el-main>

  </div>
</template>

<script>
import {deleteByRuleId} from "@/api/recommend-rule";
import {getRuleDetailByRuleId} from "@/api/recommend-rule";
import {drawRuleChart, initRuleChart} from "@/utils/Chart";

export default {
  name: 'RuleDetail',

  data() {
    return {
      chart: null,
      ruleDetail: {
        claimedTasks: 0,
        environment: 0,
        id: -1,
        latestDeadline: 0,
        name: "",
        skills: 0,
        taskPrefer: 0
      },
      ruleId: -1,
      loading: true
    };
  },

  created() {
    this.getRuleDetail();
    this.ruleId = this.$route.params.ruleid;
  },

  mounted() {
    this.initChart('weight-chart');
    window.addEventListener('resize', this.resizeHandler)
  },

  activated() {
    if (this.ruleId === -1) {
      return;
    }
    if (this.$route.params.ruleid !== this.ruleId || this.$store.state.modified) {
      // 如果请求了不同id 的规则详情，或当前规则被修改过
      // 加载动画
      this.loading = true;
      this.getRuleDetail();
      this.chart.dispose();  // 若 id 变化，需要重新绘制 echart，首先需要废弃掉先前的 chart dom
      this.initChart('weight-chart');
      this.ruleId = this.$route.params.ruleid;
      this.loading = false;
      // 把 vuex 的 modifiedBool 设为 false
      this.$store.commit('setModifiedBool', false);
    }
  },

  beforeDestroy() { // 清理工作 避免内存泄漏
    // 销毁监听事件
    window.removeEventListener('resize', this.resizeHandler)
    // 销毁 Echarts 实例
    this.chart.dispose()
  },

  methods: {
    getRuleDetail() {
      getRuleDetailByRuleId(this.$route.params.ruleid).then(res => {
        this.ruleDetail['id']=res.data.id;
        this.ruleDetail['name']=res.data.name;
        this.ruleDetail['claimedTasks']=res.data.taskAcceptedFactor;
        this.ruleDetail['environment']=res.data.testEnvFactor;
        this.ruleDetail['skills']=res.data.skillFactor;
        this.ruleDetail['taskPrefer']=res.data.taskPreferFactor;
        this.ruleDetail['latestDeadline']=res.data.taskLatestDdlFactor;
        this.loading = false;
      })
    },

    resizeHandler() {
      let mainContainer = document.getElementById('weight-chart');
      mainContainer.style.width = window.innerWidth * 0.28 + 'px';
      mainContainer.style.height = '280px';
      this.chart.resize();
    },

    initChart(elId) {
      this.chart = initRuleChart(elId);
      drawRuleChart(this.chart, this.ruleDetail);
    },

    confirmDelete() {
      this.$confirm('确定删除此条规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        const res=await deleteByRuleId(this.$route.params.ruleid);
        if (res.code === 200) {
          this.$message({
            duration: 1500,
            type: 'success',
            message: '删除成功！'
          });
          await this.$router.push('/admin/recommend/rules');
        }else{
          this.$message.error(res.msg);
        }
      }).catch(() => {
      })
    },

    gotoModify() {
      // 修改规则
      // 把当前规则详情存储在 vuex 中
      this.$store.commit('setModifiedRule', this.ruleDetail);
      this.$router.push(`/admin/recommend/modifyRule/${this.$route.params.ruleid}`)
    }
  },

  watch: {
    ruleDetail: {
      deep: true,
      handler: function () {
        drawRuleChart(this.chart, this.ruleDetail);
      }
    }
  }
};
</script>

<style scoped>

#rule-detail-box {
  width: 65%;
  height: 75vh;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(90, 106, 140, 0.3);
  margin: 20px auto;
}

.detail-content-box .detail-content {
  background: #fff;
}

.factor-description {
  padding: 0 20px 20px;
}

.button-region {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  column-gap: 35px;
}

</style>

