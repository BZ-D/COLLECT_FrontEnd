<template>
  <div>

    <el-form :model="form"
             :rules="rules"
             ref="profileForm"
             label-width="auto"
             class="profile-box"
             v-loading="loading"
             element-loading-text="正在加载"
             element-loading-spinner="el-icon-loading"
    >

      <img src="../../../assets/image/profile-change.png" alt="" style="width: 150px">

      <el-form-item label="账号">
        <el-input type="text" v-model="form.username" disabled/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input type="email" v-model="form.email" disabled/>
      </el-form-item>
      <el-form-item label="身份" prop="role">
        <el-row type="flex">
          <el-tag effect="dark">众包工人</el-tag>
        </el-row>
      </el-form-item>
      <el-form-item label="擅长技能">
        <el-row type="flex">
          <el-select v-model="form.skill" placeholder="请选择擅长技能">
            <el-option label="无" value="none"></el-option>
            <el-option label="功能测试" value="function_test"></el-option>
            <el-option label="性能测试" value="performance_test"></el-option>
            <el-option label="用例设计" value="usecase_design"></el-option>
            <el-option label="异常定位" value="exception_locate"></el-option>
          </el-select>
        </el-row>
      </el-form-item>
      <el-form-item label="任务偏好">
        <el-row type="flex">
          <el-select v-model="form.task_prefer" placeholder="请选择任务偏好">
            <el-option label="无" value="none"></el-option>
            <el-option label="功能测试" value="function_test"></el-option>
            <el-option label="性能测试" value="performance_test"></el-option>
            <el-option label="Bug探索" value="bug_explore"></el-option>
          </el-select>
        </el-row>
      </el-form-item>
      <el-form-item label="常用测试环境" prop="freq_device">
        <el-row type="flex">
          <el-select v-model="form.freq_device" placeholder="请选择常用测试环境" @change="changed=true">
            <el-option label="无" value=""></el-option>
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

      <ActivityView></ActivityView>

      <el-form-item>
        <el-button class="btn" id="register-btn" type="primary" @click="onSubmit">更新</el-button>
      </el-form-item>

    </el-form>
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import {Debounce} from "@/utils/Debounce.js";
import {updateInfo} from "@/api/profile";
import ActivityView from "@/components/worker/profile/ActivityView";

export default {
  name: 'RegisterView',
  components: {
    ActivityView,
  },
  data() {
    return {
      form: {
        username: sessionStorage.getItem('username'),
        email: sessionStorage.getItem('email'),
        role: "worker",
        skill: sessionStorage.getItem("skill"),
        task_prefer: sessionStorage.getItem("taskPrefer"),
        freq_device: sessionStorage.getItem("freqDevice")
      },

      rules: {
        skill: [
          {required: true, message: '擅长技能不可为空', trigger: 'change'},
        ],
        task_prefer: [
          {required: true, message: '任务偏好不可为空', trigger: 'change'},
        ],
        freq_device: [
          {required: true, message: '常用测试环境不可为空', trigger: 'change'},
        ]
      },

      loading: true,
      changed: false
    };
  },

  created() {
    this.initProfile();
  },

  methods: {
    initProfile() {
      if(sessionStorage.getItem("skill")==='null')
        this.form.skill='';
      else
        this.form.skill = sessionStorage.getItem("skill");
      if(sessionStorage.getItem("taskPrefer")==='null')
        this.form.task_prefer='';
      else
        this.form.task_prefer = sessionStorage.getItem("taskPrefer");
      if(sessionStorage.getItem("freqDevice")==='null')
        this.form.freq_device='';
      else
        this.form.freq_device = sessionStorage.getItem("freqDevice");

      this.loading = false;
    },

    // todo: 更改众包工人特征
    onSubmit: Debounce(function () {
      if (!this.changed) {
        this.$message.error('您并未更改资料，请更改后再试！');
        return;
      }

      this.$refs['profileForm'].validate((valid) => {
        if (valid) {
          sessionStorage.setItem("skill",this.form.skill);
          sessionStorage.setItem("taskPrefer",this.form.task_prefer);
          sessionStorage.setItem("freqDevice",this.form.freq_device);

          this.handleUpdate(this.form);
        } else {
          this.$message.error('更新失败，请检查您的信息！')
          return false;
        }
      });
    }, 1000),
    async handleUpdate(payload){
      const res = await updateInfo(payload);
      if (res.code === 200) {
        this.$message.success('资料更新成功！');
        await this.$router.push('/worker');
      } else {
        this.$message.error(res.msg);
      }
    }

  }
}
</script>


<style scoped>

.profile-box {
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

.profile-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}

.btn, a {
  margin-right: 30%;
}
</style>
