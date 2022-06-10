<template>
  <div class="executing-page">

    <div style="display: flex; justify-content: center; align-items: center">
      <img src="../../../../assets/image/executing-red.png" alt="" style="width: 150px; margin-top: 20px">
      <el-row type="flex" id="release-btn" style="width: 55%; justify-content: right">
        <el-button type="goon" icon="el-icon-plus" @click="gotoRelease()" style="height: 40px">发布任务</el-button>
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
            <el-button type="goon" @click="gotoDetail(scope.row.id)">任务详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import {getExecutingTasksByBossID} from "@/api/boss";

export default {
  name: "Executing",

  created() {
    this.getTaskList();
  },

  data() {
    return {
      taskList: [],
      loading: true
    }
  },

  methods: {
    async getTaskList(bossid) {
      const res = await getExecutingTasksByBossID(sessionStorage.getItem('userid'));
      if (res.code === 500) {
        this.loading = false;
        return this.$message.error(res.msg);
      }
      if (res.code === 404) {
        this.loading = false;
        return this.$message.info('未找到正在执行的任务');
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

    gotoDetail(taskID) {
      this.$router.push(`/boss/mytasks/detail/${taskID}?isHistory=false`)
    },

    gotoRelease() {
      this.$router.push('/boss/release');
    }
  }

}
</script>

<style scoped>

#release-btn {
  margin-top: 20px;
}

.list-box {
  border: 1px solid #DCDFE6;
  box-shadow: 0 0 8px #909399;

  margin: 8px auto;
  width: 60%;
  padding: 3% 3%;

  background-color: #ffffff;
}


</style>
