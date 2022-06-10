<template>
  <div>

    <div style="display: flex; justify-content: center; position: relative">
      <el-row type="flex" id="release-btn" style="width: 66%; margin-top: 15px; align-items: center">
        <img src="../../../../assets/image/recommended-blue.png" alt="" style="width: 150px">
        <el-select placeholder="请选择推荐规则"
                   value=""
                   v-model="chosenRuleId"
                   style="width: 300px"
                   @change="changeRule"
                   :disabled="!hasFeatures"
        >
          <el-option
              v-for="rule in ruleList"
              :key="rule.id"
              :label="rule.name"
              :value="rule.id">
          </el-option>
        </el-select>
      </el-row>
      <span style="position: absolute; top: 50px; right: 17%; color: #114a9d">按照匹配度从高到低排列，位置越靠前的任务，可能越适合您。</span>
    </div>

    <div class="list-box">

      <el-table
          :data="recommendedTaskList"
          :empty-text="emptyText"
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
        <el-table-column prop="need_num" label="需求情况"></el-table-column>
        <el-table-column prop="deadline" label="截止日期"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button v-if="scope.row.need_num!==0" type="primary" @click="gotoDetail(scope.row.id)">参与测试</el-button>
            <el-button v-else-if="scope.row.need_num===0" type="info" disabled>人员已满</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import {getRuleList} from "@/api/recommend-rule";
import {getRecommendTaskListByWorkerIDAndRuleID} from "@/api/worker";

export default {
  name: "Recommended",
  data() {
    let chosenRuleId;
    return {
      recommendedTaskList: [],
      emptyText: '暂无推荐，去个人中心完善下资料吧！',
      ruleList: [],
      chosenRuleId,
      loading: false
    }
  },

  computed: {
    hasFeatures() {
      // 该工人是否已设定特性
      /*return (sessionStorage.getItem('skill') !==null||sessionStorage.getItem('skill')!== '')&&
          (sessionStorage.getItem('taskPrefer') !==null||sessionStorage.getItem('taskPrefer')!== '')&&
          (sessionStorage.getItem('freqDevice') !==null||sessionStorage.getItem('freqDevice')!== '')
          ;*/
      return sessionStorage.getItem('skill') !== 'null'&&
          sessionStorage.getItem('skill') !== null&&
          sessionStorage.getItem('taskPrefer') !== 'null'&&
          sessionStorage.getItem('taskPrefer') !== null&&
          sessionStorage.getItem('freqDevice')!== 'null'&&
          sessionStorage.getItem('freqDevice') !== null&&
          sessionStorage.getItem('skill') !== ''&&
          sessionStorage.getItem('taskPrefer') !== ''&&
          sessionStorage.getItem('freqDevice')!== ''


    }
  },

  async created() {
    if (!this.hasFeatures) {
      // 该工人已设置个人资料，才予推荐任务
      // 未选择推荐规则，引导工人进行选择
      this.$message.error("暂时无法推荐，请前往个人中心完善个人资料！");
      await this.$router.push("/worker");
      return;
    }
    if(this.chosenRuleId===undefined) {
      this.emptyText = '暂无推荐，去应用一条推荐规则吧！';
    }
    // 初始化规则列表
    if (sessionStorage.getItem('ruleList') === null) {
      await getRuleList().then(res => {
        sessionStorage.setItem('ruleList', JSON.stringify(res.data));
        for (const rule of res.data) {
          this.ruleList.push(rule);
        }
      });
    } else {
      await getRuleList().then(res => {
        sessionStorage.setItem('ruleList', JSON.stringify(res.data));
        for (const rule of res.data) {
          this.ruleList.push(rule);
        }
      });
    }
  },

  methods: {
    async changeRule() {
      this.recommendedTaskList = [];
      this.loading = true;  // 加载动画
      const res = await getRecommendTaskListByWorkerIDAndRuleID(
          parseInt(sessionStorage.getItem('userid')),
          this.chosenRuleId
      );
      if(res.code===200) {
        const typeMap = new Map([
          ['function_test', '功能测试'],
          ['performance_test', '性能测试'],
          ['bug_explore', 'bug探索']
        ])
        for (let task of res.data) {
          task['type'] = typeMap.get(task['type']);
          this.recommendedTaskList.push(task);
        }
        this.$message.success(res.msg);
      }else{
        this.$message.error(res.msg);
      }
      this.loading = false;
    },

    gotoDetail(taskid) {
      this.$router.push(`/worker/plaza/detail/${taskid}`);
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
