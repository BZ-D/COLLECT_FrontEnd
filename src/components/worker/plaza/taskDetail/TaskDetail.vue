<template>
  <div>

    <div style="display: flex; justify-content: center;">
      <el-row type="flex" style="width: 60%;">
        <el-button icon="el-icon-back" @click="$router.push('/worker/plaza/recommended')" plain>返回列表</el-button>
      </el-row>
    </div>

    <el-main
        class="detail-box"
        v-loading="loading"
        element-loading-text="正在加载"
        element-loading-spinner="el-icon-loading">
      <div class="container-title">
        <img src="../../../../assets/image/task-details.png" alt="" style="width: 150px">
      </div>
      <el-descriptions
          class="margin-top"
          :column="1"
          border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-edit"></i>
            测试名称
          </template>
          {{ form.taskname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            发包方
          </template>
          {{ form.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-setting"></i>
            测试类型
          </template>
          {{ form.type }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-map-location"></i>
            测试环境
          </template>
          {{ form.environment }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            截止日期
          </template>
          {{ form.deadline }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user-solid"></i>
            需求人数
          </template>
          {{ form.need_num }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document"></i>
            任务描述
          </template>
          {{ form.description }}
        </el-descriptions-item>
      </el-descriptions>

      <el-button id="get-task-btn" type="primary" @click="getTask()" v-if="!got">
        领取任务
      </el-button>
      <el-button type="info" v-else-if="got" disabled>
        已领取
      </el-button>

      <el-row v-if="got" type="flex" justify="center">
        <el-col :span="8">
          <el-button type="warning" @click="handleGetApp()">
            下载待测应用
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="handleGetDoc()">
            下载测试文档
          </el-button>
        </el-col>
      </el-row>

    </el-main>

  </div>
</template>

<script>
import {Debounce} from "@/utils/Debounce.js";
import {getTaskDetailsByTaskID, getTaskFile} from "@/api/task";
import {claimTask} from "@/api/worker";
import {downloadFile} from "@/api/file";
import {whetherClaimedCertainTask} from "@/api/worker";

export default {
  name: 'task-detail',

  data() {
    return {
      form: {
        taskname: '',
        environment: '',
        deadline: '',
        username: '',
        need_num: '',
        total_num: '',
        description: ''
      },

      got: false,

      taskId: -1
    };
  },

  computed: {
    loading() {
      return this.form['taskname'] === '';
    }
  },

  created() {
    this.getDetailObj();
    this.getTaskStatus();
    this.taskId = this.$route.params.taskid;
  },

  methods: {

    // 组件挂载后，用于加载任务信息表格
    async getDetailObj() {
      const res = await getTaskDetailsByTaskID(this.$route.params.taskid);
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      }

      for (let key of Object.keys(res.data)) {
        if (key !== 'type') {
          this.form[key] = res.data[key];
        } else {
          if (res.data['type'] === 'function_test') this.form['type'] = '功能测试';
          else if (res.data['type'] === 'performance_test') this.form['type'] = '性能测试';
          else if (res.data['type'] === 'bug_explore') this.form['type'] = 'Bug探索';
        }
      }
    },


    async getTaskStatus() {
      const workerid = sessionStorage.getItem('userid');
      const taskid = this.$route.params.taskid;
      const res = await whetherClaimedCertainTask(taskid, workerid);
      if (res.code === 200) {
        this.got = true;
      }
    },


    getTask() {
      this.$confirm('确定领取该任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleGetTask();
      }).catch(() => {
      })
    },


    async handleGetTask() {
      const res = await claimTask({
        workerid: sessionStorage.getItem('userid'),
        taskid: this.$route.params.taskid
      });
      if (res.code === 200) {
        this.$message.success('领取成功！');
        this.got = true;
      } else {
        this.$message.error('领取失败！服务器异常');
      }
    },


    handleGetApp: Debounce(function () {
      this.$message('正在下载待测应用……');
      const taskId = this.$route.params.taskid
      let url = null
      const data = {
        taskId: taskId,
        kind: "0"
      }
      getTaskFile(data).then(res => {
        url = res.name
        downloadFile(url).then(res => {
        })
      });
    }, 1000),


    handleGetDoc: Debounce(function () {
      this.$message('正在下载测试文档……');
      const taskId = this.$route.params.taskid
      let url = null
      const data = {
        taskId: taskId,
        kind: "1"
      }
      getTaskFile(data).then(res => {
        url = res.name
        downloadFile(url).then(res => {
          console.log(res);
        })
      });
    }, 1000)

  }
}
</script>


<style>

.el-descriptions-item__label.is-bordered-label {
  width: 120px !important;
}

</style>

<style scoped>

.el-button {
  margin-top: 10px;
}

.detail-box {
  margin: 10px auto;
  width: 60%;

  border: 1px solid #DCDFE6;
  box-shadow: 0 0 8px #909399;

  padding: 3% 3%;

  background-color: #ffffff;
}

</style>
