<template>
  <div id="boss-page">

    <div class="backtop-btn" @click="gotoTop()">
      <img src="../assets/image/backtop_boss.png" style="width: 100%">
    </div>

    <div class="contact-btn">
      <el-button type="goon" icon="el-icon-phone" @click="dialogVisible = true">联系客服</el-button>
    </div>

    <el-dialog
        title="联系我们"
        :visible.sync="dialogVisible"
        width="30%"
        style="text-align: left"
    >
      <p><b>小组名称</b>：<el-tag>iloveSE</el-tag></p>
      <p><b>组长</b>：梁言&nbsp;Yan&nbsp;Liang</p>
      <p><b>组员</b>：周子杰&nbsp;Zijie&nbsp;Zhou</p>
      <p><b>组员</b>：姬筠刚&nbsp;Yungang&nbsp;Ji</p>
      <p><b>组员</b>：丁炳智&nbsp;Bingzhi&nbsp;Ding</p>
      <p><b>前端问题反馈QQ</b>：<el-tag>Edenmann</el-tag></p>
    </el-dialog>

    <el-menu
        :default-active="$route.path"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#84001B"
        text-color="#fff"
        active-text-color="#fff"
        :router="true">
      <el-row justify="center" id="logo-region">
        <img src="../assets/boss-logo.png" alt="logo">
      </el-row>
      <el-row type="flex" style="margin: auto 15%">
        <el-col>
          <el-menu-item class="showed-item" index="/boss/plaza">任务广场</el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item class="showed-item" index="/boss/mytasksIntro">我的发布</el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item class="showed-item">荣誉榜单(待开发)</el-menu-item>
        </el-col>
        <el-col>
          <el-submenu index="3" class="navi-item">
            <template slot="title">
              <span class="showed-item">个人中心</span>
            </template>
            <el-menu-item>身份：<el-tag type="warning" effect="dark">发包方</el-tag></el-menu-item>
            <el-menu-item index="/boss/profile">资料查看</el-menu-item>
            <el-menu-item @click="handleLogout()">退出登录</el-menu-item>
          </el-submenu>
        </el-col>
      </el-row>
    </el-menu>

    <keep-alive include="BossPlazaTaskDetail,BossMyTasksIntro">
      <router-view/>
    </keep-alive>

  </div>
</template>

<script>
export default {
  name: "BossView",
  data() {
    return {
      dialogVisible: false
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

#boss-page {
  background: url("../assets/image/main_bg.jpg");
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;
}

.el-dialog p {
  margin-bottom: 10px;
}

.backtop-btn {
  width: 50px;
  position: fixed;
  right: 4rem;
  bottom: 5rem;
  cursor: pointer;
}

.contact-btn {
  position: fixed;
  right: 2rem;
  bottom: 10rem;
}

#logo-region {
  /*background-color: #474566;*/
  background-color: #720017;
}

#logo-region img {
  width: 300px !important;
  margin: 10px 0;
}

.showed-item {
  font-size: 16px !important;
}

</style>
