<template>
  <div>
    <el-button type="goon"
               style="position: absolute; top: 30px; right: 50px"
               @click="showEvaluateBox">
      <i class="el-icon-s-check" />&nbsp;评价此报告
    </el-button>

    <el-dialog width="48%" :title="bossEvaluateTitle" :visible.sync="dialogFormVisible" :lock-scroll="false">
      <el-main class="boss-evaluate-container" v-loading="bossEvaluationLoading">
        <el-row class="boss-evaluate-item">
          <el-col class="evaluate-item-name" :span="8">
            <span>报告-任务契合度：</span>
          </el-col>
          <el-col class="evaluate-item-radio" :span="16">
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.taskFit">
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
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.reality">
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
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.defectImportance">
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
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.recurrence">
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
            <el-radio-group :text-color="textColor" :fill="fill" v-model="bossEvaluateForm.totalQuality">
              <el-radio-button v-for="level in evaluateLevels" :label="level" :key="level">
                {{level}}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

      </el-main>

      <div slot="footer" class="dialog-footer" v-show="!hasBossEvaluation">
        <el-button type="info" plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="goon" @click="handlePostBossEvaluation">确 定</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-show="hasBossEvaluation">
        <el-button type="warning" @click="handleUpdateBossEvaluation">更 新</el-button>
        <el-button type="goon" @click="handleDeleteBossEvaluation">删 除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBossEvaluationOfReportByReportID,
  submitBossEvaluationByReportID,
  updateBossEvaluationByReportID,
  deleteBossEvaluationByReportID
} from "@/api/report";

export default {
  name: "BossEvaluationDialog",

  data() {
    return {
      bossEvaluationLoading: true,

      textColor: '#f3f3f3',

      fill: '#af0808',

      bossEvaluateTitle: '',

      dialogFormVisible: false,

      hasBossEvaluation: false,

      formLabelWidth: '120px',

      evaluateLevels: [
        '低', '偏低', '中', '偏高', '高'
      ],

      bossEvaluateForm: {
        id:0,
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
          this.bossEvaluateTitle = '报告评价';
        } else {
          this.bossEvaluateTitle = '查看我的评价';
          this.hasBossEvaluation = true;
          for (let key of Object.keys(res.data)) {
            this.bossEvaluateForm[key] = res.data[key];
          }
        }

        this.dialogFormVisible = true;
        this.bossEvaluationLoading = false;
      })
    },
    handleDeleteBossEvaluation(){
      this.$confirm('确定删除评价吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        deleteBossEvaluationByReportID(this.bossEvaluateForm.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！');
            setTimeout(() => {
              location.reload();
            }, 600)
          } else {
            this.$message.error('删除失败，请稍后再试！');
            this.dialogFormVisible = false;
          }
        })

      }).catch(() => {
      })
    },
    handleUpdateBossEvaluation(){
      this.$confirm('确定更新吗？请仔细检查您的评价内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        for (let key of Object.keys(this.bossEvaluateForm)) {
          if (this.bossEvaluateForm[key] === '') {
            this.$message.error('请完整评价后再提交！');
            return;
          }
        }

        updateBossEvaluationByReportID({
          id:this.bossEvaluateForm.id,
          reportId: this.$route.params.reportid,
          taskFit: this.bossEvaluateForm.taskFit,
          reality: this.bossEvaluateForm.reality,
          defectImportance: this.bossEvaluateForm.defectImportance,
          recurrence: this.bossEvaluateForm.recurrence,
          totalQuality: this.bossEvaluateForm.totalQuality
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('更新成功！');
            setTimeout(() => {
              location.reload();
            }, 600)
          } else {
            this.$message.error('更新失败，请稍后再试！');
            this.dialogFormVisible = false;
          }
        })

      }).catch(() => {
      })
    },
    handlePostBossEvaluation() {
      this.$confirm('确定提交吗？请仔细检查您的评价内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        for (let key of Object.keys(this.bossEvaluateForm)) {
          if (this.bossEvaluateForm[key] === '') {
            this.$message.error('请完整评价后再提交！');
            return;
          }
        }

        submitBossEvaluationByReportID({
          reportId: this.$route.params.reportid,
          taskFit: this.bossEvaluateForm.taskFit,
          reality: this.bossEvaluateForm.reality,
          defectImportance: this.bossEvaluateForm.defectImportance,
          recurrence: this.bossEvaluateForm.recurrence,
          totalQuality: this.bossEvaluateForm.totalQuality
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('评价成功！');
            setTimeout(() => {
              location.reload();
            }, 600)
          } else {
            this.$message.error('评价失败，请稍后再试！');
            this.dialogFormVisible = false;
          }
        })

      }).catch(() => {
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
