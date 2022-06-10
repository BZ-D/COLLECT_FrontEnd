<template>
  <div>

    <div style="display: flex; justify-content: center;">
      <el-row type="flex" style="width: 60%;">
        <el-button type="info" icon="el-icon-back" @click="$router.push('/admin/plaza')" plain>返回列表</el-button>
      </el-row>
    </div>

    <el-main
        class="detail-box"
        v-loading="loading"
        element-loading-text="正在加载"
        element-loading-spinner="el-icon-loading">
      <div class="container-title">
        <img src="../../../assets/image/task-details.png" alt="" style="width: 150px">
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

      <el-button type="goon" @click="deleteTask()" style="margin-top: 10px">
        删除任务
      </el-button>

    </el-main>

  </div>
</template>

<script>
import { getTaskDetailsByTaskID, deleteTaskByID } from "@/api/task";

export default {
  name: 'AdminPlazaTaskDetail',
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
    this.taskId = this.$route.params.taskid;
  },

  activated() {
    // 触发加载动画
    const tmp = this.form['taskname'];
    this.form['taskname'] = '';

    if (this.$route.params.taskid !== this.taskId) {
      this.getDetailObj();
      this.taskId = this.$route.params.taskid;
    } else {
      this.form['taskname'] = tmp;
    }
  },

  methods: {
    async deleteTask(){
      this.$confirm('确定删除任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteTaskByID(this.$route.params.taskid);
        if (res.code !== 200) {
          return this.$message.error(res.msg);
        } else {
          this.$message.success('删除成功！');
          await this.$router.push('/admin/plaza');
        }
        }).catch(() => {
      })
    },

    // 组件挂载后，用于加载任务信息表格
    async getDetailObj() {
      const res = await getTaskDetailsByTaskID(this.$route.params.taskid);
      if (res.code !== 200) {
        return this.$message.error('获取任务列表失败');
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
    }

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
