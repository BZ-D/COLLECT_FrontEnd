<template>
  <div id="login-page" ref="vantaRef">

    <el-form ref="loginForm" :model="form" label-width="80px" class="login-box">
      <img src="../assets/logo-blue.png" alt="" style="width: 200px; margin-bottom: 4px">

      <el-tabs v-model="login_way" @tab-click="handleLoginWay()" stretch>
        <el-tab-pane label="账号登录" name="username">
          <el-form-item label="账号" prop="username">
            <el-input type="text" placeholder="请输入账号" v-model="form.username"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="邮箱登录" name="email">
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" placeholder="请输入邮箱" v-model="form.email"/>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
      </el-form-item>

      <el-form-item>
        <el-button id="login-btn" type="primary"
                   @click="onSubmit('loginForm')"
        >登录</el-button>
      </el-form-item>

      <el-form-item>
        <el-link type="warning" @click="toRegister()">还没账号？立即注册</el-link>
      </el-form-item>

    </el-form>

  </div>
</template>



<script>
import { Debounce } from "@/utils/Debounce.js";
import {loginByEmail, loginByUsername} from "@/api/login";
import {getWorkerFeaturesByWorkerID} from "@/api/worker";
import * as THREE from 'three';
import CLOUDS from 'vanta/src/vanta.globe';

export default {
  name: 'LoginView',
  data() {
    return {
      login_way : "username",
      form : {
        username: "",
        email: "",
        password: ""
      }
    };
  },

  mounted() {
    this.vantaEffect = CLOUDS({
      el: this.$refs.vantaRef,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x3fa6ff,
      color2: 0x1d47c7,
      size: 1.10,
      backgroundColor: 0xe9f0f2
    })
    // 支持回车登录
    this.enterKeyup();
  },
  beforeDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  },
  destroyed() {
    this.enterKeyupDestroyed();
  },

  methods: {
    // 支持回车登录
    enterKeyup: function () {
      document.addEventListener('keyup', this.enterKey);
    },
    enterKeyupDestroyed: function () {
      document.removeEventListener('keyup', this.enterKey);
    },
    enterKey(event) {
      if (event.keyCode === 13) {
        this.onSubmit('loginForm');
      }
    },


    handleLoginWay: function () {
      this.form.username = '';
      this.form.email = '';
      this.form.password = '';
    },

    async handleLogin(payload) {
      let res;
      if (this.login_way === 'username') {
        res = await loginByUsername(payload);
      } else {
        res = await loginByEmail(payload);
      }
      if (res.code === 200) {
        sessionStorage.setItem("userid",res.data.id);
        sessionStorage.setItem("username", res.data.username);
        sessionStorage.setItem("email",res.data.email);
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("skill",res.data.skill);
        sessionStorage.setItem("taskPrefer",res.data.taskPrefer);
        sessionStorage.setItem("freqDevice",res.data.freqDevice);
        sessionStorage.setItem("activity",res.data.activity);
        sessionStorage.setItem("initMessageNum",res.data.messageNum);
        sessionStorage.setItem("recommendSkill",res.data.recommendSkill);
        sessionStorage.setItem("recommendPrefer",res.data.recommendPrefer);
        sessionStorage.setItem("recommendDevice",res.data.recommendDevice);
        if (res.data.role === 'boss')  await this.$router.push('/boss/mytasksIntro');
        else if (res.data.role === 'worker') {
          await this.$router.push('/worker');
        }
        else if (res.data.role === 'admin')  await this.$router.push('/admin');

      } else {
        this.$message.error(res.msg);
      }
    },

    onSubmit: Debounce(function(formName) {
      if (this.login_way === 'username') {
        // 账号登陆
        if (this.form.username === '') {
          this.$message.error('账号不得为空！')
          return;
        }
        if (this.form.username.length > 18) {
          this.$message.error('账号不得超过18个字符！')
          return;
        }
      }

      if (this.login_way === 'email') {
        // 邮箱登陆
        if (this.form.email === '') {
          this.$message.error('邮箱不得为空！')
          return;
        }
        let emailReg = /(?=([a-zA-Z0-9._\-]{2,}@[a-zA-Z0-9_\-]{2,}(\.[a-zA-Z0-9_\-]+)+))^\S{6,32}$/;
        if (!emailReg.test(this.form.email)) {
          this.$message.error('请输入正确的邮箱！')
          return;
        }
      }

      if (this.form.password === '') {
        this.$message.error('密码不得为空！')
        return;
      }

      this.handleLogin(this.form);
    }, 1000),

    toRegister: function () {
      this.$router.push('/register')
    }
  }
}

</script>


<style>

#app {
  padding-bottom: 0;
}

</style>


<style scoped>

#login-page {
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
}

.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 5% auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 8px #909399;

  background-color: #f8f8f8;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}

#login-btn, a {
  margin-right: 30%;
}
</style>
