<template>
  <div class="all-claimed-tasks-page" v-show="show">

    <div style="display: flex; justify-content: center;">
      <el-row type="flex" id="release-btn" style="width: 66%; margin-top: 15px">
        <img v-if="$route.path.includes('evaluate')" @load="show=true"
             src="../../../../assets/image/evaluate-all-claimed-tasks.png" alt="" style="width: 380px">
        <img v-else-if="$route.path.includes('supplement')" @load="show=true"
             src="../../../../assets/image/supplement-all-claimed-tasks.png" alt="" style="width: 380px">
      </el-row>
    </div>

    <div class="list-box">
      <el-table
          :data="taskList"
          v-loading="loading"
          element-loading-text="正在加载"
          element-loading-spinner="el-icon-loading"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="taskname" label="任务名称"></el-table-column>
        <el-table-column prop="username" label="发布者"></el-table-column>
        <el-table-column prop="type" label="测试类型"></el-table-column>
        <el-table-column prop="environment" label="测试环境">
          <template v-slot="scope">
            <img src="../../../../assets/image/Apple.png" alt="" style="width: 20px" v-if="scope.row.environment.startsWith('iOS')">
            <img src="../../../../assets/image/Android.png" alt="" style="width: 20px" v-else-if="scope.row.environment.startsWith('Android')">
            <img src="../../../../assets/image/Huawei.png" alt="" style="width: 20px" v-else-if="scope.row.environment.startsWith('Harmony')">
            {{scope.row.environment}}
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" @click="gotoReportList(scope.row.id)">报告列表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import {getAllClaimedTasksByWorkerID} from "@/api/worker";

export default {
  name: "ClaimedTaskList",

  created() {
    this.getAllClaimedTaskList();
  },

  data() {
    return {
      taskList: [],
      show: false,
      loading: true
    }
  },


  methods: {
    async getAllClaimedTaskList() {
      const res = await getAllClaimedTasksByWorkerID(sessionStorage.getItem("userid"));

      if (res.code === 404) {
        this.loading = false;
        return this.$message.info('您并未领取过任何任务');
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

        this.taskList.push(tmp);
      })

      this.loading = false;
    },

    gotoReportList(taskid) {
      if (this.$route.path.includes('evaluate')) {
        this.$router.push(`/worker/cooperation/evaluate/reportList/${taskid}`);
      } else if (this.$route.path.includes('supplement')) {
        this.$router.push(`/worker/cooperation/supplement/reportList/${taskid}`);
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
