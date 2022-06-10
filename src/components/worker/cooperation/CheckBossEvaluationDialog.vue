<template>
  <div>
    <el-button type="primary"
               style="position: absolute; top: 30px; right: 50px"
               @click="showEvaluateBox">
      <i class="el-icon-s-check" />&nbsp;查看发包方评价
    </el-button>

    <el-dialog width="48%" :title="bossEvaluateTitle" :visible.sync="dialogFormVisible" :lock-scroll="false">

      <span v-show="!hasBossEvaluation">
        发包方尚未评价，先去别处看看吧~
      </span>

      <el-main class="boss-evaluate-container" v-loading="bossEvaluationLoading" v-show="hasBossEvaluation">
        <el-row class="boss-evaluate-item">
          <el-col class="evaluate-item-name" :span="8">
            <span>报告-任务契合度：</span>
          </el-col>
          <el-col class="evaluate-item-radio" :span="16">
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.taskFit" disabled>
              <el-radio-button v-for="level in evaluateLevels" :label="level" :key="level">
                {{level}}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

        <el-row class="boss-evaluate-item">
          <el-col class="evaluate-item-name" :span="8">
            <span>报告真实度：</span>
          </el-col>
          <el-col class="evaluate-item-radio" :span="16">
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.reality" disabled>
              <el-radio-button v-for="level in evaluateLevels" :label="level" :key="level">
                {{level}}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

        <el-row class="boss-evaluate-item">
          <el-col class="evaluate-item-name" :span="8">
            <span>缺陷重要程度：</span>
          </el-col>
          <el-col class="evaluate-item-radio" :span="16">
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.defectImportance" disabled>
              <el-radio-button v-for="level in evaluateLevels" :label="level" :key="level">
                {{level}}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

        <el-row class="boss-evaluate-item">
          <el-col class="evaluate-item-name" :span="8">
            <span>复现完整度：</span>
          </el-col>
          <el-col class="evaluate-item-radio" :span="16">
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.recurrence" disabled>
              <el-radio-button v-for="level in evaluateLevels" :label="level" :key="level">
                {{level}}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

        <el-row class="boss-evaluate-item">
          <el-col class="evaluate-item-name" :span="8">
            <span>报告总体质量：</span>
          </el-col>
          <el-col class="evaluate-item-radio" :span="16">
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.totalQuality" disabled>
              <el-radio-button v-for="level in evaluateLevels" :label="level" :key="level">
                {{level}}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

      </el-main>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBossEvaluationOfReportByReportID
} from "@/api/report";

export default {
  name: "CheckBossEvaluationDialog",

  data() {
    return {
      bossEvaluationLoading: true,

      textColor: '#fafafa',

      fill: '#55a1fd',

      bossEvaluateTitle: '',

      dialogFormVisible: false,

      hasBossEvaluation: false,

      formLabelWidth: '120px',

      evaluateLevels: [
        '低', '偏低', '中', '偏高', '高'
      ],

      bossEvaluateForm: {
        taskFit: '',
        reality: '',
        defectImportance: '',
        recurrence: '',
        totalQuality: ''
      },
    }
  },

  methods: {
    showEvaluateBox() {
      getBossEvaluationOfReportByReportID(sessionStorage.getItem('report_boss_evaluate_id')).then(res => {
        if (res.msg === '暂未评价') {
          this.bossEvaluateTitle = '发包方尚未评价';
        } else {
          this.bossEvaluateTitle = '查看发包方评价';
          this.hasBossEvaluation = true;
          for (let key of Object.keys(res.data)) {
            this.bossEvaluateForm[key] = res.data[key];
          }
        }

        this.dialogFormVisible = true;
        this.bossEvaluationLoading = false;
      })
    }
  }
}
</script>


<style scoped>
.boss-evaluate-container {
  display: flex;
  flex-direction: column;
  row-gap: 25px;
}

.evaluate-item-name {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
}
</style>
