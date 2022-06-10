<template>
  <div>

    <el-main id="rules-manage-box"
             v-loading="loading"
             element-loading-text="正在加载"
             element-loading-spinner="el-icon-loading"
    >

      <div>
        <img src="../../../../assets/image/rule-manage.png"
             alt=""
             style="width: 200px; margin-bottom: 20px; margin-top: 5px;"
        >
      </div>

      <span style="color: gray" v-show="ruleList.length === 0">暂无推荐规则，去设定一条吧！</span>

      <el-row class="rule-item" v-for="(item, ind) in ruleList" :key="ind">
        <el-col :span="2" class="intro-item-no">
          <span>{{ ind + 1 }}</span>
        </el-col>
        <el-col :span="22" class="intro-item-content">
          <div class="intro-item-content-details">
            <p style="text-align: justify">
              {{ item.name }}
            </p>
          </div>
          <div class="enter" @click="$router.push(`/admin/recommend/ruleDetail/${item.id}`)">
            <img src="../../../../assets/image/rule-detail-inactive.png" alt="" style="width: 70px;">
          </div>
        </el-col>
      </el-row>

    </el-main>

  </div>
</template>

<script>
import {getRuleList} from "@/api/recommend-rule";

export default {
  name: "AllRules",

  data() {
    return {
      loading: true,
      ruleList: []
    }
  },

  created() {
    this.initRuleList();
  },

  methods: {
    async initRuleList() {
      const res = await getRuleList();
      if (res.data === null) {
        this.$message(res.msg);
        this.loading = false;
        return;
      }
      res.data.forEach(obj => {
        let tmp = {};
        tmp['id']=obj['id'];
        tmp['name']=obj['name'];
        this.ruleList.push(tmp);
      })
      this.loading = false;
    }
  }
}
</script>

<style scoped>

#rules-manage-box {
  width: 65%;
  height: 75vh;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(90, 106, 140, 0.3);
  margin: 20px auto;
}

.rule-item {
  height: 10%;
  width: 90%;
  margin: 0 auto 20px;
  border-radius: 8px;
  box-shadow: 0px 5px 20px 0px rgba(90, 106, 140, 0.3);
}

.intro-item-no {
  background: #30913c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
}

.intro-item-content {
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 25px;
}

.intro-item-no, .intro-item-content {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  height: 100%;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.intro-item-no span {
  font-size: 30px;
  font-weight: bold;
  cursor: default;
  color: #fff;
}

.enter {
  position: absolute;
  right: 15px;
}

.enter:hover {
  cursor: pointer;
}

.enter img:hover {
  content: url("../../../../assets/image/rule-detail-active.png");
}

</style>
