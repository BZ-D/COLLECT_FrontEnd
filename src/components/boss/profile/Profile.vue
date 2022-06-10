<template>
  <div>

    <el-form ref="registerForm"
             :model="form"
             label-width="auto"
             class="profile-box">

      <img src="../../../assets/image/profile.png" alt="" style="width: 150px;">

      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="form.username" disabled/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="form.email" disabled/>
      </el-form-item>
      <el-form-item label="身份" prop="role">
        <el-row type="flex">
          <el-tag type="danger" effect="dark">发包方</el-tag>
        </el-row>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>

export default {
  name: 'Profile',
  data() {

    return {
      form: {
        username: sessionStorage.getItem('username'),
        email: sessionStorage.getItem('email'),
        role: "boss"
      }
    };
  },
  methods: {

  }
}
</script>


<style scoped>

.profile-box {
  border: 1px solid #DCDFE6;
  width: 500px;
  margin: 5% auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 8px #909399;

  background-color: #f8f8f8;
}


</style>
