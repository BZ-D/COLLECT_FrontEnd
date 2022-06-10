<template>
  <div>
    <el-menu :default-active="$route.path"
             class="el-menu-demo"
             mode="horizontal"
             style="margin: auto 20%;"
             :router="true">
      <el-row type="flex">
        <el-col>
          <el-menu-item index="/worker/mytasks/executing">
            <img src="../../../assets/image/executing.png" alt="" style="width: 120px">
          </el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item index="/worker/mytasks/finished">
            <img src="../../../assets/image/history.png" alt="" style="width: 120px">
          </el-menu-item>
        </el-col>
      </el-row>
    </el-menu>

    <keep-alive include="ExecTaskDetail">
      <router-view/>
    </keep-alive>

  </div>
</template>

<script>
export default {
  name: "MyTasks",
  data () {
    return {

    }
  }
}
</script>

<style scoped>

.el-menu {
  border: 1px solid #DCDFE6;
  box-shadow: 0 0 8px #909399;
  background-color: #ffffff;
}

.el-menu-item {
  font-size: 16px;
}

</style>
