<template>
  <div id="worker-page">

    <div class="fixed-btn" id="totop" @click="gotoTop()">
      <el-tooltip class="item" effect="dark" content="返回顶部" placement="left-start">
        <div slot="content">返回顶部</div>
        <el-badge class="item">
          <img src="../assets/image/backtop.png" style="width: 100%">
        </el-badge>
      </el-tooltip>
    </div>

    <MessageDrawer></MessageDrawer>

    <div class="contact-btn">
      <el-button type="primary" icon="el-icon-phone" @click="dialogVisible = true">联系客服</el-button>
    </div>

    <el-dialog
        title="联系我们"
        :visible.sync="dialogVisible"
        width="30%"
        :lock-scroll="false"
        style="text-align: left"
    >
      <p><b>小组名称</b>：
        <el-tag>iloveSE</el-tag>
      </p>
      <p><b>组长</b>：梁言&nbsp;Yan&nbsp;Liang</p>
      <p><b>组员</b>：周子杰&nbsp;Zijie&nbsp;Zhou</p>
      <p><b>组员</b>：姬筠刚&nbsp;Yungang&nbsp;Ji</p>
      <p><b>组员</b>：丁炳智&nbsp;Bingzhi&nbsp;Ding</p>
      <p><b>前端问题反馈QQ</b>：
        <el-tag>Edenmann</el-tag>
      </p>
    </el-dialog>

    <WorkerPanel></WorkerPanel>

    <el-menu
        :default-active="$route.path"
        class="el-menu"
        mode="horizontal"
        background-color="#406EB4"
        text-color="#fff"
        active-text-color="#fff"
        :router="true">
      <el-row justify="center" id="logo-region">
        <img src="../assets/worker-logo.png" alt="logo">
      </el-row>
      <el-row type="flex" style="margin: auto 15%">
        <el-col>
          <el-menu-item class="showed-item" index="/worker">任务广场</el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item class="showed-item" index="/worker/mytasksIntro">我的任务</el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item class="showed-item" index="/worker/cooperation/intro">报告协作</el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item class="showed-item" index="/worker/review/intro">报告评审</el-menu-item>
        </el-col>
        <el-col>
          <el-submenu index="3" class="navi-item">
            <template slot="title">
              <span class="showed-item">个人中心</span>
            </template>
            <el-menu-item>身份：
              <el-tag effect="dark">众包工人</el-tag>
            </el-menu-item>
            <el-menu-item index="/worker/profile">资料设置</el-menu-item>
            <el-menu-item @click="handleLogout()">退出登录</el-menu-item>
          </el-submenu>
        </el-col>
      </el-row>
    </el-menu>

    <keep-alive include="WorkerPlazaIntro,WorkerMyTasksIntro">
      <router-view>
      </router-view>
    </keep-alive>

  </div>
</template>

<script>
import WorkerPanel from "@/components/worker/panel/WorkerPanel";
import MessageDrawer from "@/components/worker/messageDrawer/MessageDrawer";

export default {
  name: "WorkerView",
  components: {
    WorkerPanel,
    MessageDrawer
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  mounted() {
    //taskPrefer,freqDevice
    var message = "经过系统后台检测";
    var judge = 0;
    var recSkill = sessionStorage.getItem("recommendSkill");
    var recPrefer = sessionStorage.getItem("recommendPrefer");
    var recDevice = sessionStorage.getItem("recommendDevice");
    if (recSkill !== " " && recSkill !== sessionStorage.getItem("skill")) {
      if (recSkill === "function_test")
        message = message + "，您擅长的技能为“功能测试”";
      if (recSkill === "performance_test")
        message = message + "，您擅长的技能为“性能测试”";
      if (recSkill === "bug_explore")
        message = message + "，您擅长的技能为“用例设计”或“异常定位";
      judge++;
    }
    if (recPrefer !== " " && recPrefer !== sessionStorage.getItem("taskPrefer")) {
      if (recPrefer === "function_test")
        message = message + "，您的任务偏好为“功能测试”";
      if (recPrefer === "performance_test")
        message = message + "，您的任务偏好为“性能测试”";
      if (recPrefer === "bug_explore")
        message = message + "，您的任务偏好为“Bug探索“";
      judge++;
    }
    if (recDevice !== " " && recDevice.substr(0, 1) !== sessionStorage.getItem("freqDevice").substr(0, 1)) {
      message = message + "，您常用的测试环境为“" + recDevice + "”";
      judge++;
    }
    message = message + "，建议您按照系统检测更改个人资料，以更好地推荐最适合您的测试任务！"

    if (judge !== 0) {
      const h = this.$createElement;
      this.$notify({
        title: '工人特性设置提醒',
        message: h('span', { style: 'color: teal'}, message),
        duration: 0
      });
    }


    sessionStorage.setItem("recommendSkill", " ");
    sessionStorage.setItem("recommendPrefer", " ");
    sessionStorage.setItem("recommendDevice", " ");
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
        // 重置数据
        sessionStorage.clear();

        this.$message({
          type: 'success',
          message: '退出成功！'
        });
        this.$router.push('/');
      }).catch(() => {
      })
    }
  }
}
</script>


<style scoped>

#worker-page {
  background: url("../assets/image/main_bg.jpg");
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;

  padding-bottom: 50px;
}

#totop {
  z-index: 1;
  width: 50px;
  position: fixed;
  right: 4rem;
  bottom: 5rem;
  cursor: pointer;
}

.el-dialog p {
  margin-bottom: 10px;
}

.contact-btn {
  z-index: 1;
  position: fixed;
  right: 2rem;
  bottom: 15rem;
}


#logo-region {
  /*background-color: #474566;*/
  background-color: #275893;
}

#logo-region img {
  width: 300px !important;
  margin: 10px 0;
}

.showed-item {
  font-size: 16px !important;
}

.fixed-btn {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: box-shadow, transform;
  transition-property: box-shadow, transform;
}

.fixed-btn:hover, .fixed-btn:focus, .fixed-btn:active {
  /*box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);*/
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
