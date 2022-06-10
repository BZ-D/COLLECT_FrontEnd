<template>
  <div id="register-page" ref="vantaRef">

    <el-form ref="registerForm" :model="form" :rules="rules" label-width="80px" class="register-box">
      <h3 class="register-title">
        <img src="../assets/image/register.png" alt="" style="width: 150px;">
      </h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="form.username"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" placeholder="请输入注册邮箱" v-model="form.email"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
      </el-form-item>
      <el-form-item label="重复密码" prop="re_password">
        <el-input type="password" placeholder="再次输入密码" v-model="form.re_password"/>
      </el-form-item>
      <el-form-item label="身份选择" prop="role">
        <el-radio v-model="form.role" label="boss" border>发包方</el-radio>
        <el-radio v-model="form.role" label="worker" border>众包工人</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" id="clear-btn" type="danger" @click="handleReset()">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" id="register-btn" type="primary"
                   @click="onSubmit('registerForm')"
                   @keyup.enter="onSubmit('registerForm')"
        >注册</el-button>
      </el-form-item>
      <el-form-item>
        <el-link type="warning" @click="toLogin()">已有账号？立即登录</el-link>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { Debounce } from "@/utils/Debounce.js";
import {register} from "@/api/register";
import * as THREE from 'three';
import CLOUDS from 'vanta/src/vanta.globe';

export default {
  name: 'RegisterView',
  data() {
    var form = {
      username: "",
      email: "",
      password: "",
      re_password: "",
      role: ""
    };
    // 验证两次密码是否一致
    var validateRePasswd = function (rule, value, callback) {
      if (value !== form.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };

    return {
      form,

      rules: {
        username: [
          {required: true, message: '账号不可为空', trigger: 'blur'},
          {min: 6, max: 18, message: '账号长度在6-18字符之间', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '邮箱不可为空', trigger: 'blur'},
          {type: "email", message: '请输入正确的邮箱格式', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'},
          {type: "string",
            message: '密码由8-20个字母、数字、字符两种以上组成',
            pattern: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,20}$/}
        ],
        re_password: [
          {required: true, message: '请重复密码', trigger: 'blur'},
          {validator: validateRePasswd, trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请选择身份'}
        ],
      },
    };
  },

  mounted() {
    // 支持回车注册
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
    // 支持回车注册
    enterKeyup: function () {
      document.addEventListener('keyup', this.enterKey);
    },
    enterKeyupDestroyed: function () {
      document.removeEventListener('keyup', this.enterKey);
    },
    enterKey(event) {
      if (event.keyCode === 13) {
        this.onSubmit('registerForm');
      }
    },


    handleReset: function () {
      this.$confirm('确定重置所有信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空信息
        for (let key of Object.keys(this.form)) {
          this.form[key] = '';
        }
        this.$message({
          type: 'success',
          message: '重置成功！'
        });
      }).catch(() => {})
    },


    onSubmit: Debounce(function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleRegister(this.form);
        } else {
          this.$message.error('注册失败，请检查您的信息！')
          return false;
        }
      });
    }, 1000),


    async handleRegister(payload) {
      const res = await register(payload);
      if (res.code === 200) {
        this.$message.success('注册成功！');
        await this.$router.push("/");
      } else {
        this.$message.error(res.msg);
      }
    },


    toLogin: function () {
      this.$router.push('/');
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

#register-page {
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
}

.register-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 3% auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 8px #909399;

  background-color: #f8f8f8;
}

.btn, a {
  margin-right: 30%;
}
</style>
