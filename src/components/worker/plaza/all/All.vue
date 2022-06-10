<template>
  <div class="all-tasks-page">

    <div style="display: flex; justify-content: center;">
      <el-row type="flex" id="release-btn" style="width: 66%; margin-top: 15px">
        <img src="../../../../assets/image/all-blue.png" alt="" style="width: 150px">
      </el-row>
    </div>

    <TaskList></TaskList>

  </div>
</template>

<script>
import TaskList from "@/components/worker/plaza/TaskList";

export default {
  name: "all",
  components: {
    TaskList
  }
}
</script>

<style scoped>

.list-box {
  border: 1px solid #DCDFE6;
  box-shadow: 0 0 8px #909399;

  margin: 0 auto;
  width: 60%;
  padding: 3% 3%;

  background-color: #ffffff;
}

</style>
