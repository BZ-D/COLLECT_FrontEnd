<template>
  <div id="modify-rule-page">

    <el-main id="rule-detail-box">

      <div>
        <img src="../../../../assets/image/modify-rule.png" alt="" style="width: 200px;">
      </div>

      <el-row class="detail-content-box">
        <el-col :span="12" class="detail-content factor-chart" ref="chart-box">
          <div class="content-title">
            <img src="../../../../assets/image/factor-weight.png" alt="" style="width: 120px">
          </div>
          <div class="balance-hint" style="margin-bottom: 8px; color: #30913c; cursor: default">
            注：各个因子的权重之和总是会平衡为&nbsp;1
          </div>
          <div id="weight-chart"></div>
        </el-col>

        <el-col :span="12" class="detail-content factor-description">
          <div class="content-title">
            <img src="../../../../assets/image/rule-description.png" alt="" style="width: 120px">
          </div>
          <div class="factor-item">
            <span class="factor-name">规则名称</span>
            <el-input
                type="text"
                placeholder="请输入规则名称"
                v-model="ruleDetail.name"
                @change="ifModified=true"
                maxlength="15"
                show-word-limit
            />
          </div>
          <div class="factor-item">
            <span class="factor-name">已领取任务</span>
            <el-slider
                v-model="ruleDetail.claimedTasks"
                :step="0.05"
                :max="max"
                @change="balanceFactors('claimedTasks')"
                show-stops>
            </el-slider>
          </div>
          <div class="factor-item">
            <span class="factor-name">测试环境</span>
            <el-slider
                v-model="ruleDetail.environment"
                :step="0.05"
                :max="max"
                @change="balanceFactors('environment')"
                show-stops>
            </el-slider>
          </div>
          <div class="factor-item">
            <span class="factor-name">擅长技能</span>
            <el-slider
                v-model="ruleDetail.skills"
                :step="0.05"
                :max="max"
                @change="balanceFactors('skills')"
                show-stops>
            </el-slider>
          </div>
          <div class="factor-item">
            <span class="factor-name">任务偏好</span>
            <el-slider
                v-model="ruleDetail.taskPrefer"
                :step="0.05"
                :max="max"
                @change="balanceFactors('taskPrefer')"
                show-stops>
            </el-slider>
          </div>
          <div class="factor-item">
            <span class="factor-name">最近截止</span>
            <el-slider
                v-model="ruleDetail.latestDeadline"
                :step="0.05"
                :max="max"
                @change="balanceFactors('latestDeadline')"
                show-stops>
            </el-slider>
          </div>
        </el-col>
      </el-row>

      <div class="button-region">
        <el-button type="danger" @click="reset">重置</el-button>
        <el-button type="info"
                   @click="$router.push(`/admin/recommend/ruleDetail/${ruleDetail.id}`)" plain>
          <i class="el-icon-back"></i>&nbsp;返回
        </el-button>
        <el-button type="primary" @click="handleModify">更新</el-button>
      </div>

    </el-main>

  </div>
</template>

<script>

import {drawRuleChart, initRuleChart} from "@/utils/Chart";
import {modifyRule} from "@/api/recommend-rule";

export default {
  name: 'ModifyRule',

  data() {
    return {
      chart: null,
      max: 1,
      ruleDetail: {
        id: -1,
        name: "",
        claimedTasks: 0,
        environment: 0,
        skills: 0,
        taskPrefer: 0,
        latestDeadline: 0
      },

      // 用于判断是否做了修改
      ifModified: false
    };
  },

  created() {
    for (const key of Object.keys(this.$store.state.modifiedRule)) {
      this.ruleDetail[key] = this.$store.state.modifiedRule[key];
    }
  },

  mounted() {
    this.initChart('weight-chart');
    window.addEventListener('resize', this.resizeHandler)
  },

  beforeDestroy() { // 清理工作 避免内存泄漏
    // 销毁监听事件
    window.removeEventListener('resize', this.resizeHandler)
    // 销毁 Echarts 实例
    this.chart.dispose()
  },

  methods: {
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

    balanceFactors(changedKey) {
      this.ifModified = true;  // 数据变化说明作了修改
      // 用于平衡各影响因子，让它们和始终为 1
      // 首先获取当前所有因子权重的总和
      let sum = 0;  // 注：sum计算时需要乘以100，避免小数点问题
      let emptySet = new Set();
      const len = Object.keys(this.ruleDetail).length - 2;  // 减 2 是因为 id 和 name 字段各占一个位置
      for (const key of Object.keys(this.ruleDetail)) {
        if (key !== 'name' && key !== 'id') {
          if (this.ruleDetail[key] === 0) {
            emptySet.add(key);
          } else {
            sum += this.ruleDetail[key] * 100;
          }
        }
      }
      // 若五个都为 0，跳出，防止除以 0
      if (emptySet.size === len) {
        drawRuleChart(this.chart, this.ruleDetail);
        return;
      }
      // 若 sum 大于 100，需要平衡，除了 changedKey 所对应的属性和值为 0 的属性不变，其余非 0 属性进行调整
      if (sum > 100) {
        let diff = sum - 100;
        const steps = diff / 5;  // 相差多少倍 0.05
        const remain = sum - this.ruleDetail[changedKey] * 100;  // 除当前属性之外其余非零属性的和，用于计算步数权重

        for (const key of Object.keys(this.ruleDetail)) {
          // 计算每个需要调整属性的步数
          if (key !== 'name' && key !== 'id' && key !== changedKey && !emptySet.has(key)) {
            const avgSteps = Math.round(steps * this.ruleDetail[key] * 100 / remain) * 5;  // 该属性减少的值
            const res = (this.ruleDetail[key] * 100 - avgSteps) / 100;
            this.ruleDetail[key] = Number(res.toFixed(2));
            diff -= avgSteps;
          }
        }

        // 最后对 diff 进行判断，如果大于 0，则需要最后再减一次，如果小于 0，需要最后再加一次
        while (diff > 0) {
          for (const key of Object.keys(this.ruleDetail)) {
            if (key !== 'name' && key !== 'id' && key !== changedKey && !emptySet.has(key) && this.ruleDetail[key] > 0) {
              this.ruleDetail[key] = Number(((this.ruleDetail[key] * 100 - 5) / 100).toFixed(2));
              diff -= 5;
              break;
            }
          }
        }
        while (diff < 0) {
          for (const key of Object.keys(this.ruleDetail)) {
            if (key !== 'name' &&  key !== 'id' && key !== changedKey && !emptySet.has(key)) {
              this.ruleDetail[key] = Number(((this.ruleDetail[key] * 100 + 5) / 100).toFixed(2));
              diff += 5;
              break;
            }
          }
        }
      }
      // 调整完因子后再次绘制，以这种方法取代 watch，避免重绘过于频繁
      drawRuleChart(this.chart, this.ruleDetail);
    },

    reset() {
      this.$confirm('确定重置规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        for (const key of Object.keys(this.ruleDetail)) {
          if (key === 'name') {
            this.ruleDetail[key] = '';
          } else if (key !== 'id') {
            // id 不需要重置
            this.ruleDetail[key] = 0;
          }
        }
        drawRuleChart(this.chart, this.ruleDetail);
        this.$message({
          duration: 1500,
          type: 'success',
          message: '重置成功！'
        });
      }).catch(() => {
      })
    },

    handleModify() {
      this.$confirm('确定修改此条规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        if (!this.ifModified) {
          this.$message.error('您并未对此条规则进行修改，请修改后再试');
          return;
        }
        if (!this.checkRules()) {
          return;
        }
        // 把 vuex 中的 modifiedBool 设为 true，以便修改完成退回规则详情页时刷新
        this.$store.commit('setModifiedBool', true);
        const res = await modifyRule(this.ruleDetail);
        if(res.code===200) {
          this.$message({
            duration: 1500,
            type: 'success',
            message: '修改成功！'
          });
          await this.$router.push(`/admin/recommend/ruleDetail/${this.ruleDetail.id}`);
        }else{
          this.$message.error(res.msg);
        }
      }).catch(() => {
      })
    },

    checkRules() {
      // 检查填写信息的合规性
      const nameMap = new Map([
        ['claimedTasks', '已领取任务'],
        ['environment', '测试环境'],
        ['skills', '擅长技能'],
        ['taskPrefer', '任务偏好'],
        ['latestDeadline', '最近截止']
      ])

      let sum = 0;
      for (const key of Object.keys(this.ruleDetail)) {
        if (key === 'name' && this.ruleDetail[key] === '') {
          this.$message.error('请输入规则名称！');
          return false;
        } else if (key !== 'name' && key !== 'id' && this.ruleDetail[key] === 0) {
          this.$message.error(`"${nameMap.get(key)}" 因子的权重系数未设置！`);
          return false;
        } else if (key !== 'name' && key !== 'id' && this.ruleDetail[key] !== 0) {
          sum += this.ruleDetail[key] * 100;
        }
      }

      if (sum < 100) {
        this.$message.error('各影响因子之和小于 1，请作调整！');
        return false;
      }

      return true;
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
  margin: 20px auto 0;
  padding-bottom: 5px;
}

.detail-content-box .detail-content {
  background: #fff;
}

.factor-description {
  padding-right: 20px;
}

.factor-item {
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.factor-item:last-child {
  margin-bottom: 0;
}

.button-region {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  column-gap: 35px;
}

.factor-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  column-gap: 10px;
}

.factor-item .factor-name {
  font-size: 15px;
  font-weight: 600;
}

</style>

