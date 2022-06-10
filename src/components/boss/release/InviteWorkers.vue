<template>
  <div>

    <el-button id="invite-btn" type="warning" @click="handleOpenInviteDialog" size="small">
      邀请工人
    </el-button>

    <el-dialog title="邀请工人"
               id="invite-dialog"
               :visible.sync="dialogFormVisible"
               width="50%"
               :lock-scroll="false"
               :close-on-click-modal="false"
               :show-close="false">
      这是系统为您推荐的工人列表，他们之间的合作也能带来1+1>2的收益，推荐您同时邀请列表中的所有工人哦！
<!--      <el-main class="worker-list-area">-->
        <el-table
            :data="workers"
            max-height="350"
            border
            @selection-change="handleSelectionChange"
            style="width: 90%; margin: 0 auto;">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="username"
              label="工人用户名">
            <template v-slot="scope">
              <span style="color: #831414; font-weight: bold;">{{ scope.row.username }}</span>
            </template>
          </el-table-column>

          <el-table-column
              prop="reviewAbility"
              label="评审能力">
            <template v-slot="scope">
              {{ scope.row.reviewAbility > 0.5 ? scope.row.reviewAbility.toFixed(1) : '' }}
              <el-tag
                  :type="typeLevels[getAbilityLevel(scope.row.reviewAbility)]"
                  effect="dark"
                  size="mini"
                  v-if="scope.row.reviewAbility > 0.5"
              >
                {{ typeText[getAbilityLevel(scope.row.reviewAbility)] }}
              </el-tag>
              <i class="el-icon-minus" v-else></i>
            </template>
          </el-table-column>

          <el-table-column
              prop="cooperationAbility"
              label="协作能力">
            <template v-slot="scope">
              {{ scope.row.cooperationAbility > 0.5 ? scope.row.cooperationAbility.toFixed(1) : '' }}
              <el-tag
                  :type="typeLevels[getAbilityLevel(scope.row.cooperationAbility)]"
                  effect="dark"
                  size="mini"
                  v-if="scope.row.cooperationAbility > 0.5"
              >
                {{ typeText[getAbilityLevel(scope.row.cooperationAbility)] }}
              </el-tag>
              <i class="el-icon-minus" v-else></i>
            </template>
          </el-table-column>

          <el-table-column
              prop="othersEvaluation"
              label="他人评价">
            <template v-slot="scope">
              {{ scope.row.othersEvaluation > 0.5 ? scope.row.othersEvaluation.toFixed(1) : '' }}
              <el-tag
                  :type="typeLevels[getAbilityLevel(scope.row.othersEvaluation)]"
                  effect="dark"
                  size="mini"
                  v-if="scope.row.othersEvaluation > 0.5"
              >
                {{ typeText[getAbilityLevel(scope.row.othersEvaluation)] }}
              </el-tag>
              <i class="el-icon-minus" v-else></i>
            </template>
          </el-table-column>
        </el-table>
<!--      </el-main>-->

      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogFormVisible=false" plain>取消</el-button>
        <el-button type="goon" @click="handleInviteWorkers">确定邀请</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getWorkersToInviteByTaskID, inviteWorkers} from "@/api/boss";
import {deleteBossEvaluationByReportID} from "@/api/report";
import {Debounce} from "@/utils/Debounce";

export default {
  name: "InviteWorkers",

  props: [
    'taskid'
  ],

  data() {
    return {
      dialogFormVisible: false,
      invitedWorkers: [],
      workers: [],

      isFirstOpen: true,  // 是否是第一次打开此窗口

      typeLevels: ['success', 'warning', 'danger'],
      typeText: ['优', '良', '差']
    }
  },

  methods: {
    handleOpenInviteDialog() {
      if (this.isFirstOpen) {
        let hint = this.$message({
          message: '　正在为您计算适合此任务的工人列表，请稍作等待　',
          duration: 0,
          showClose: true,
          iconClass: 'el-icon-loading'
        });

        this.isFirstOpen = false;

        getWorkersToInviteByTaskID(this.taskid).then(res => {
          if (res.code === 200) {
            for (const worker of res.data) {
              this.workers.push(worker);
            }
            this.dialogFormVisible = true;
          } else {
            this.$message.error('获取工人列表失败！请稍后刷新再试');
          }

          hint.close();
        })
      } else if (!this.isFirstOpen && this.workers.length !== 0) {
        this.dialogFormVisible = true;
      }
    },

    getAbilityLevel(score) {
      if (score >= 4) {
        return 0;
      } else if (score >= 2) {
        return 1;
      } else {
        return 2;
      }
    },

    handleSelectionChange(val) {
      this.invitedWorkers = val;
    },

    handleInviteWorkers() {
      this.$confirm('确定邀请这些工人吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        if (this.invitedWorkers.length === 0) {
          this.$message.error('您并未选择工人，请选择后再邀请！');
          return;
        }
        var workeridList= this.invitedWorkers.map(w => w.username)
        console.log(workeridList);
        inviteWorkers({
          taskid: this.taskid,
          workeridList
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('邀请成功！');
          } else {
            this.$message.error('邀请失败，请稍后再试！');
          }
          this.dialogFormVisible = false;
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>

.el-checkbox {
  margin-right: 0 !important;
}

.el-checkbox.is-bordered+.el-checkbox.is-bordered {
  margin-left: 0 !important;
}

#invite-dialog {
  text-align: left;
}

#invite-btn {
  position: absolute;
  right: 20px;
  top: 20px;
}

.worker-list-area {
  /*max-height: 350px;*/
}

.worker-list-select-group {
  display: flex;
  flex-direction: column;
  row-gap: 6px;
}

.select-item {
  display: flex;
  flex-direction: row;

}

</style>
