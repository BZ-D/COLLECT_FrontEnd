<template>
  <div class="report-list-page">

    <div class="list-box">
      <el-table
          :data="reportList"
          v-loading="loading"
          :element-loading-text="loadingText"
          element-loading-spinner="el-icon-loading"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="taskname" label="任务名称"></el-table-column>
        <el-table-column prop="workername" label="测试者"></el-table-column>
        <el-table-column prop="type" label="测试类型"></el-table-column>
        <el-table-column prop="environment" label="测试环境"></el-table-column>
        <el-table-column prop="submittime" label="提交时间"></el-table-column>

        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="goon" @click="gotoRelation(scope.row.id, scope.row.workerid)">报告详情</el-button>
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
      reportList: [],
      loading: true,
      loadingText: '正在加载'
    }
  },


  methods: {
    async getReportList() {
      const res = await getReportListByTaskID(this.$route.params.taskid);
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
      console.log(res)
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

    gotoRelation(reportID, workerID) {
      this.loadingText = '正在分析报告';
      this.loading = true;
      this.getReportSimList(workerID).then(res => {
        this.loading = false;
        if (res) {
          this.$store.commit('setTaskIdOfReportList', this.$route.params.taskid);
          this.$router.push(`/boss/mytasks/relation/${reportID}`);
        }
      })
    },
  }

}
</script>

<style scoped>

.list-box {
  border: 1px solid #DCDFE6;
  box-shadow: 0 0 8px #909399;

  margin: 20px auto;
  width: 60%;
  padding: 3% 3%;

  background-color: #ffffff;
}


</style>
