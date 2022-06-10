<template>
  <div style="position: relative">
    <el-main id="follow-others-box" v-loading="loading">

      <div>
        <img src="../../../assets/image/follow-list.png" alt="" style="width: 160px; margin: 10px 0 20px 0;">
      </div>

      <div id="follow-others-transfer">
        <el-transfer
            filterable
            filter-placeholder="请输入工人用户名"
            v-model="following"
            :button-texts="['取关', '关注']"
            :titles="['未关注工人', '已关注工人']"
            :data="allWorkers">
        </el-transfer>
      </div>

    </el-main>

    <el-button id="confirm-follow-btn" type="success" @click="handleSubmit">
      提交
    </el-button>
  </div>
</template>

<script>
import {getAllWorkers, getFollowingByWorkerID, followOtherWorkers, unfollowOtherWorkers} from "@/api/worker";
import {Debounce} from "@/utils/Debounce";

export default {
  name: "FollowOthers",

  created() {
    getFollowingByWorkerID(sessionStorage.getItem('userid'))
        .then(res => {
          for (const worker of res.data) {
            if (String(worker['id']) !== sessionStorage.getItem('userid')) {
              this.following.push(worker.id);
              this.initFollowing.push(worker.id);
            }
          }

          getAllWorkers()
              .then(res => {
                for (const worker of res.data) {
                  if (String(worker['id']) !== sessionStorage.getItem('userid')) {
                    this.allWorkers.push({
                      label: worker.username,
                      key: worker.id
                    });
                  }
                }
                this.loading = false;
              });
        })
  },

  data() {
    return {
      loading: true,

      allWorkers: [],  // 对象数组 { label, key }
      following: [],

      initFollowing: []
    };
  },

  methods: {
    getArrDiff(arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      })
    },

    handleSubmit: Debounce( function () {
      // following: 现在关注列表里有谁
      // initFollowing: 初始的关注列表里有谁
      // 这两个列表的相异元素中，若包含于following，说明是新关注的，若包含于initFollowing，说明是取关的
      const diff = this.getArrDiff(this.following, this.initFollowing);  // 目前的关注列表中和原来的关注列表差了谁

      if (diff.length === 0) {
        this.$message.error('您未做任何操作，请操作后再提交！');
        return;
      }

      const newUnFollowing = [];  // 用于统计取关者
      const newFollowing = [];  // 用于统计关注者

      for (const id of diff) {
        if (this.initFollowing.includes(id)) {
          // 取关名单
          newUnFollowing.push(id);
        } else {
          // 新关注名单
          newFollowing.push(id);
        }
      }

      followOtherWorkers({
        workerid: sessionStorage.getItem('userid'),
        workeridList: newFollowing
      }).then(res => {
        // 批量关注成功后，再批量取关
        if (res.code === 200) {
          unfollowOtherWorkers({
            workerid: sessionStorage.getItem('userid'),
            workeridList: newUnFollowing
          }).then(res1 => {
            if (res1.code === 200) {
              this.$message.success('提交成功！');
              setTimeout(_ => {
                location.reload();
              }, 800);
            } else {
              this.$message.error('服务器出错了，请稍候再试~');
            }
          })
        } else {
         this.$message.error('服务器出错了，请稍候再试~');
        }
      })

    }, 1000)
  }
}
</script>


<style>
.el-transfer-panel__list.is-filterable {
  width: 100% !important;
  height: 60vh !important;
}

.el-transfer-panel {
  width: 30% !important;
  height: 60vh !important;

  /* 这个居左非常重要，否则显示异常！ */
  text-align: left;
}

.el-transfer-panel__item.el-checkbox .el-checkbox__label {
  font-size: 16px;
  font-family: 'Consolas', serif;
  color: #1c67bd;
}

.el-transfer .el-transfer-panel:first-child .el-checkbox__label {
  color: #212121;
}

</style>


<style scoped>

#follow-others-box {
  width: 65%;
  height: 78vh;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0px 5px 20px 0px rgba(90, 106, 140, 0.3);
  margin: 20px auto;
}

#confirm-follow-btn {
  position: absolute;
  bottom: 7%;
  left: 45%;
  right: 45%;
}

</style>
