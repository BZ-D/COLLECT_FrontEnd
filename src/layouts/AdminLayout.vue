<template>
  <div id="admin-page">

    <div class="backtop-btn" @click="gotoTop()">
      <img src="../assets/image/backtop_admin.png" style="width: 100%">
    </div>


    <el-menu
        :default-active="$route.path"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#2e7d32"
        text-color="#fff"
        active-text-color="#fff"
        :router="true">
      <el-row justify="center" id="logo-region">
        <img src="../assets/admin-logo.png" alt="logo">
      </el-row>
      <el-row type="flex" style="margin: auto 15%;">
        <el-col>
          <el-menu-item class="showed-item" index="/admin/plaza">任务管理</el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item class="showed-item" index="/admin/recommend/intro">任务推荐</el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item class="showed-item">用户管理(待开发)</el-menu-item>
        </el-col>
        <el-col>
          <el-submenu index="3" class="navi-item">
            <template slot="title">
              <span class="showed-item">个人中心</span>
            </template>
            <el-menu-item>身份：<el-tag type="success" effect="dark">管理员</el-tag></el-menu-item>
            <el-menu-item index="/admin/profile">资料查看</el-menu-item>
            <el-menu-item @click="handleLogout()">退出登录</el-menu-item>
          </el-submenu>
        </el-col>
      </el-row>
    </el-menu>

    <keep-alive include="AdminPlazaTaskDetail,RecommendIntro">
      <router-view/>
    </keep-alive>

  </div>
</template>

<script>
export default {
  name: "AdminView",
  data() {
    return {
    };
  },
  methods: {
    // 回到顶部
    gotoTop() {
      document.body.scrollIntoView();
    },

    handleLogout() {
      this.$confirm('确定退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.clear();
        this.$message({
          type: 'success',
          message: '退出成功！'
        });
        this.$router.push('/');
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

#admin-page {
  background: url("../assets/image/main_bg.jpg");
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
}



.backtop-btn {
  width: 50px;
  position: fixed;
  right: 4rem;
  bottom: 5rem;
  cursor: pointer;
}

#logo-region {
  background-color: #256428;
  opacity: 1;
}

#logo-region img {
  width: 300px !important;
  margin: 10px 0;
}

.showed-item {
  font-size: 16px !important;
}

</style>
