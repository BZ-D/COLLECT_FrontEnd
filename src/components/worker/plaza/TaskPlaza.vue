<template>
  <div>

    <el-menu :default-active="$route.path"
             class="el-menu-demo"
             mode="horizontal"
             style="margin: auto 20%;"
             :router="true">
      <el-row type="flex">
        <el-col>
          <el-menu-item index="/worker/plaza/recommended">
            <img src="../../../assets/image/recommended.png" alt="" style="width: 120px">
          </el-menu-item>
        </el-col>

        <el-col>
          <el-menu-item index="/worker/plaza/invited">
            <img src="../../../assets/image/invited.png" alt="" style="width: 120px">
          </el-menu-item>
        </el-col>

        <el-col>
          <el-menu-item index="/worker/plaza/all">
            <img src="../../../assets/image/all.png" alt="" style="width: 120px">
          </el-menu-item>
        </el-col>
      </el-row>
    </el-menu>

    <router-view>
    </router-view>

  </div>
</template>

<script>
export default {
  name: "TaskPlaza",
  data () {
    return {
    }
  },

  methods: {
  }
}
</script>

<style scoped>

.el-menu-item {
  font-size: 16px;
}

.el-menu {
  border: 1px solid #DCDFE6;
  box-shadow: 0 0 8px #909399;
  background-color: #ffffff;
}

</style>
