<template>
  <div class="report-list-page" v-show="show">

    <div style="display: flex; justify-content: center; align-items: center">
      <el-row type="flex" style="width: 57%; margin-top: 10px">
        <img src="../../../../assets/image/evaluate-report-list.png" alt=""
             v-if="ifEvaluate"
             style="width: 320px" @load="show=true">
        <img src="../../../../assets/image/supplement-report-list.png" alt=""
             v-else
             style="width: 320px" @load="show=true">
      </el-row>

      <el-row type="flex">
        <el-button type="info" icon="el-icon-back" style="height: 45px" @click="returnTaskList" plain>返回任务列表</el-button>
      </el-row>
    </div>

    <div class="list-box">
      <el-table
          :data="reportList"
          v-loading="loading"
          :element-loading-text="loadingText"
          element-loading-spinner="el-icon-loading"
          empty-text="该任务尚未有众包工人提交测试报告"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="taskname" label="任务名称"></el-table-column>
        <el-table-column prop="workername" label="测试者"></el-table-column>
        <el-table-column prop="type" label="测试类型"></el-table-column>
        <el-table-column prop="environment" label="测试环境">
          <template v-slot="scope">
            <img src="../../../../assets/image/Apple.png" alt="" style="width: 20px" v-if="scope.row.environment.startsWith('iOS')">
            <img src="../../../../assets/image/Android.png" alt="" style="width: 20px" v-else-if="scope.row.environment.startsWith('Android')">
            <img src="../../../../assets/image/Huawei.png" alt="" style="width: 20px" v-else-if="scope.row.environment.startsWith('Harmony')">
            {{scope.row.environment}}
          </template>
        </el-table-column>
        <el-table-column prop="submittime" label="提交时间"></el-table-column>

        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" v-if="ifEvaluate"
                       @click="gotoDetail(scope.row.id, scope.row.workerid)">报告评价</el-button>
            <el-button type="primary" v-else
                       @click="gotoDetail(scope.row.id, scope.row.workerid)">补充报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import {getReportListByTaskID} from "@/api/report";
import {getReportByTaskIDAndWorkerID} from "@/api/worker";

export default {
  name: "ReportList",

  created() {
    this.getReportList();
  },

  data() {
    return {
      ifEvaluate: this.$route.path.includes('evaluate'),
      show: false,
      reportList: [],
      loading: true,
      loadingText: '正在加载'
    }
  },


  methods: {
    async getReportList() {
      const res = await getReportListByTaskID(this.$route.params.taskid);
      console.log(res)
      if (res.code === 500) {
        this.loading = false;
        return this.$message.error('获取报告列表失败');
      }
      if (res.code === 404) {
        this.loading = false;
        return this.$message.info('未获取到任务测试报告');
      }


      res.data.forEach(obj => {
        let tmp = {};
        if (obj['type'] === 'function_test') tmp['type'] = '功能测试';
        else if (obj['type'] === 'performance_test') tmp['type'] = '性能测试';
        else if (obj['type'] === 'bug_explore') tmp['type'] = 'Bug探索';

        for (let key of Object.keys(obj)) {
          if (key !== 'type') {
            tmp[key] = obj[key];
          }
        }

        this.reportList.push(tmp);
      })

      this.loading = false;
    },

    async getReportSimList(workerID) {
      const taskid = this.$route.params.taskid;
      const res = await getReportByTaskIDAndWorkerID(taskid, workerID);
      // 要进入的报告还未审查完毕，阻止进入
      if (res.code !== 200) {
        this.$message.error('该报告正在审查中，请稍候尝试');
        return false;
      }

      // 获取相似度，相似度过高说明审查不通过，也不允许进入
      const obj = res.data;
      // 获取相似度列表
      let simList = obj.reportSimilarities;
      // 相似度未计算完成，直接返回
      if (simList.length === 0) {
        this.$message.error('该报告正在审查中，请稍候尝试');
        return false;
      }

      let highestTextSim = 0;
      let highestImageSim = 0;
      for (const sim of simList) {
        if (sim.picSimilarity > highestImageSim) {
          highestImageSim = sim.picSimilarity;
        }
        if (sim.textSimilarity > highestTextSim) {
          highestTextSim = sim.textSimilarity;
        }
      }

      if (highestTextSim > 0.4 || highestImageSim > 0.75) {
        this.$message.error('该报告审查未通过，无法查看！');
        return false;
      }

      return true;
    },

    gotoDetail(reportID, workerID) {
      this.loadingText = '正在分析报告';
      this.loading = true;
      this.getReportSimList(workerID).then(res => {
        this.loading = false;
        if (res) {
          if (this.ifEvaluate) {
            this.$router.push(`/worker/cooperation/evaluate/detail?taskid=${this.$route.params.taskid}&reportid=${reportID}`);
          } else {
            this.$router.push(`/worker/cooperation/supplement/detail?taskid=${this.$route.params.taskid}&reportid=${reportID}`);
          }
        }
      })
    },

    returnTaskList() {
      if (this.ifEvaluate) {
        this.$router.push(`/worker/cooperation/evaluate/claimedTaskList`);
      } else {
        this.$router.push(`/worker/cooperation/supplement/claimedTaskList`);
      }
    }
  }

}
</script>

<style scoped>

.list-box {
  border: 1px solid #DCDFE6;
  box-shadow: 0 0 8px #909399;

  margin: 0 auto;
  width: 60%;
  padding: 3% 3%;

  background-color: #ffffff;
}


</style>
