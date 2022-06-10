<template>
  <div>
    <el-menu :default-active="$route.path"
             class="el-menu-demo"
             mode="horizontal"
             style="margin: auto 20%;"
             active-text-color="#A1001F"
             :router="true">
      <el-row type="flex">
        <el-col>
          <el-menu-item index="/boss/mytasks/executing">
            <img src="../../../assets/image/executing.png" alt="" style="width: 120px">
          </el-menu-item>
        </el-col>
        <el-col>
          <el-menu-item index="/boss/mytasks/finished">
            <img src="../../../assets/image/history.png" alt="" style="width: 120px">
          </el-menu-item>
        </el-col>
      </el-row>
    </el-menu>

    <keep-alive include="ReportDetail,Executing,Finished,ReportRelation">
      <!-- 因为MyTask组件本身是不缓存的，在该组件内部来回跳转可以缓存，但发布任务再次查看我的任务时，会重新请求 -->
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

.el-menu-item {
  font-size: 16px;
}

</style>
