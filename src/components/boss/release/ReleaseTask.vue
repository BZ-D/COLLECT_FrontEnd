<template>
  <div>
    <el-form :model="form"
             label-width="auto"
             ref="form"
             :rules="rules"
             class="release-box">

      <div class="container-title">
        <img src="../../../assets/image/release-task.png" alt="" style="width: 150px">
      </div>
      <el-form-item label="发包方" prop="username">
        <el-input type="text" v-model="form.username" disabled/>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskname">
        <el-input type="text" placeholder="请输入任务名称" v-model="form.taskname"/>
      </el-form-item>
      <el-form-item label="测试类型" prop="type">
        <el-row type="flex">
          <el-select v-model="form.type" placeholder="请选择测试类型">
            <el-option label="功能测试" value="function_test"></el-option>
            <el-option label="性能测试" value="performance_test"></el-option>
            <el-option label="Bug探索" value="bug_explore"></el-option>
          </el-select>
        </el-row>
      </el-form-item>
      <el-form-item label="测试环境" prop="environment">
        <el-row type="flex">
          <el-select v-model="form.environment" placeholder="请选择测试环境">
            <el-option label="iOS12.x" value="iOS12.x"></el-option>
            <el-option label="iOS13.x" value="iOS13.x"></el-option>
            <el-option label="iOS14.x" value="iOS14.x"></el-option>
            <el-option label="iOS15.x" value="iOS15.x"></el-option>
            <el-option label="Android12" value="Android12"></el-option>
            <el-option label="Android11" value="Android11"></el-option>
            <el-option label="Android10" value="Android10"></el-option>
            <el-option label="Android9" value="Android9"></el-option>
            <el-option label="Android8" value="Android8"></el-option>
            <el-option label="HarmonyOS1.x" value="HarmonyOS1.x"></el-option>
            <el-option label="HarmonyOS2.x" value="HarmonyOS2.x"></el-option>
          </el-select>
        </el-row>
      </el-form-item>
      <el-form-item label="截止时间" prop="deadline">
        <el-row type="flex">
          <el-date-picker
              v-model="form.deadline"
              type="datetime"
              placeholder="选择截止时间">
          </el-date-picker>
        </el-row>
      </el-form-item>
      <el-form-item label="需求人数" prop="need_num">
        <el-row type="flex">
          <el-input-number v-model="form.need_num" :min="1" :max="1000">
          </el-input-number>
        </el-row>
      </el-form-item>
      <el-form-item label="任务描述" prop="description">
        <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请在此处填写测试任务描述"
            maxlength="200"
            show-word-limit
            v-model="form.description">
        </el-input>
      </el-form-item>
      <el-form-item label="待测应用上传">
        <el-row type="flex">
          <el-upload
              ref="upload"
              action="#"
              :on-change="handleChangeExe"
              :auto-upload="false">
            <el-button slot="trigger" size="small" type="goon">选取文件</el-button>
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item label="描述文档上传">
        <el-row type="flex">
          <el-upload
              ref="upload"
              action="#"
              :on-change="handleChangeGuide"
              :auto-upload="false">
            <el-button slot="trigger" size="small" type="goon">选取文件</el-button>
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="warning" v-if="false" @click="dialogFormVisible = true">邀请工人</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="goon" @click="onSubmit('form')">发布任务</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import {Debounce} from "@/utils/Debounce.js";
import {releaseTask} from "@/api/boss";
import {uploadFile} from "@/api/file";
import {createTaskFile} from "@/api/task";

export default {
  name: 'ReleaseTask',

  data() {

    return {
      form: {
        username: sessionStorage.getItem("username"),
        taskname: "",
        environment: "",
        deadline: "",
        need_num: "",
        description: ""
      },

      rules: {
        username: [
          {required: true, message: '请填写您的姓名', trigger: 'blur'}
        ],
        taskname: [
          {required: true, message: '请填写任务名称', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择测试类型'}
        ],
        environment: [
          {required: true, message: '请选择测试环境'}
        ],
        deadline: [
          {required: true, message: '请选择截止时间'}
        ],
        need_num: [
          {required: true, message: '请填写需求人数'}
        ],
        description: [
          {required: true, message: '请填写任务描述', trigger: 'blur'}
        ]

      },
      exeFileList: [],
      guideFileList: [],
    };
  },
  methods: {

    onSubmit: Debounce(function (formName) {

      this.$confirm('确定发布任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if ((new Date(this.form.deadline).getTime() - new Date().getTime()) / 86400000 < 1) {
              // 日期检查逻辑：至少比当前时刻多一天
              this.$message.error('截止时间过近，请重新选取！');
              return;
            }
            this.handleReleaseTask(this.form);
          } else {
            this.$message.error('发布失败，请检查您的信息！')
            return false;
          }
        });
      }).catch(() => {
      })
    }, 1000),


    async handleReleaseTask(payload) {
      if (this.exeFileList.length < 1 || this.guideFileList < 1) {
        this.$message.error('发布失败，请选择相关文件')
        return
      }

      const taskRes = await releaseTask(payload);

      if (taskRes.code === 200) {
        this.$message.success('发布成功！');
        await this.$router.push('/boss/mytasks/executing');
      } else {
        this.$message.error('发布失败！服务器出错');
      }

      // 上传可执行文件
      const formDataExe = new window.FormData();
      formDataExe.append("file", this.exeFileList[0].raw);
      let res = await uploadFile(formDataExe);

      // 写入数据库
      if (res.code === 200) {
        const fileInfo = {
          taskId: taskRes.data.id,
          url: res.data.name,
          type: res.data.type,
          size: res.data.size,
          kind: "0",
          name: res.data.name
        };

        createTaskFile(fileInfo).then(res => {
          console.log(res);
        });
      }

      //上传文档
      const formDataGuide = new window.FormData();
      formDataGuide.append("file", this.guideFileList[0].raw);
      res = await uploadFile(formDataGuide);

      //写入数据库
      if (res.code === 200) {
        const fileInfo = {
          taskId: taskRes.data.id,
          url: res.data.name,
          type: res.data.type,
          size: res.data.size,
          kind: "1",
          name: res.data.name
        };

        createTaskFile(fileInfo).then(res => {
          console.log(res);
        });
      }
    },


    handleChangeExe(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.exeFileList = fileList
      console.log(fileList)
    },


    handleChangeGuide(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.guideFileList = fileList
      console.log(fileList)
    }

  }
}
</script>


<style scoped>

.release-box {
  border: 1px solid #DCDFE6;
  width: 500px;
  margin: 2% auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 8px #909399;

  background-color: #f8f8f8;
}

.release-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}

.btn, a {
  margin-right: 30%;
}

</style>
