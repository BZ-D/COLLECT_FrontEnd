<template>
  <div>

    <el-main id="evaluation-detail-box"
             v-loading="loading"
             element-loading-text="正在加载报告评价"
             element-loading-spinner="el-icon-loading">

      <el-button type="info"
                 plain
                 v-if="$route.query.taskid !== '-1'"
                 style="position: absolute; top: 30px; left: 50px"
                 @click="$router.push(`/worker/cooperation/evaluate/reportList/${$route.query.taskid}`)">
        <i class="el-icon-back"/>&nbsp;返回报告列表
      </el-button>

      <CheckBossEvaluationDialog></CheckBossEvaluationDialog>

      <div class="title">
        <img src="../../../../assets/image/evaluation.png" alt="" style="width: 160px; margin: 10px 0 20px 0;">
      </div>

      <el-row class="content-area-outer-box" style="position: relative">

        <div class="low-quality-hint" v-if="isLowQuality" style="position: absolute; left: 1%; top: 1%">
          <el-tag type="danger" effect="dark">低质量报告，请您参与协作</el-tag>
        </div>

        <div class="low-quality-hint" v-if="isHighQuality" style="position: absolute; left: 1%; top: 1%">
          <el-tag type="success" effect="dark">高质量报告</el-tag>
        </div>

        <el-col class="content-area" :span="15">
          <el-main class="report-details-area" style="margin-bottom: 20px; position: relative">

            <div class="title">
              <img src="../../../../assets/image/report-contents-blue.png" alt=""
                   style="width: 120px; margin-bottom: 10px;">
            </div>
            <el-descriptions
                class="report-detail-content"
                :column="1"
                border>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-edit"></i>
                  测试名称
                </template>
                <span class="item-text">{{ form.taskname }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                  报告作者
                </template>
                <span class="item-text">{{ form.workername }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-setting"></i>
                  测试类型
                </template>
                <span class="item-text">{{ form.type }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-map-location"></i>
                  测试环境
                </template>
                <span class="item-text">{{ form.environment }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-document"></i>
                  缺陷描述
                </template>
                <span class="item-text">{{ form.description }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-coin"></i>
                  复现步骤
                </template>
                <span class="item-text">{{ form.steps }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-picture-outline"></i>
                  缺陷截图
                </template>
                <a class="item-text">
                  <el-image
                      class="my-img"
                      ref="myImg"
                      @load="loading=false"
                      :src=form.screenshot>
                  </el-image>
                  <el-link :href="form.screenshot" target="_blank">
                    <el-tag effect="dark" type="success">点此下载截图</el-tag>
                  </el-link>
                </a>
              </el-descriptions-item>
            </el-descriptions>
          </el-main>

          <div class="button-area" v-if="$route.query.taskid !== '-1'">
            <el-button type="primary" @click="gotoSupplement">报告补充</el-button>
          </div>
        </el-col>

        <el-col class="score-and-comments-area" :span="9">
          <el-main class="score-area" style="margin-bottom: 20px;">
            <div class="title">
              <img src="../../../../assets/image/score.png" alt="" style="width: 120px; margin-bottom: 10px;">
            </div>
            <div class="score-content-area" v-show="hasComment">
              <div class="final-score" style="display: flex; flex-direction: column">
                <span class="score-text"
                      style="font-weight: 600; font-size: 30px; margin-bottom: 8px;">
                  {{ evaluationForm.score }}&nbsp;分
                </span>
                <el-rate v-model="evaluationForm.score" disabled/>
                <span class="all-vote-num" style="color: #777777; font-size: 13px; margin-top: 6px;">
                  {{ voteNum }}&nbsp;人已评价
                </span>
              </div>
              <div class="score-detail">
                <div class="score-item" v-for="(num, i) in scoreStageNum">
                  <el-rate :value="(5 - i)" disabled/>
                  <span class="vote-num" style="color: #777777">{{ num }}&nbsp;人</span>
                </div>
              </div>
            </div>

            <div class="no-score-text" v-show="!hasComment" style="color: #757575">
              暂无评分，快来第一个打分吧！
            </div>
          </el-main>

          <el-main class="my-comment" style="padding: 10px 10px; margin-bottom: 20px;">
            <div class="title">
              <img src="../../../../assets/image/my-comment.png" alt="" style="width: 100px; margin-bottom: 10px;">
            </div>

            <div class="leave-comment-area" v-show="curWorkerHasVoted">
              <span class="username" style="color: #406EB4">{{ myComment.username }}</span>
              <el-rate class="leave-comment-vote" v-model="myComment.score"
                       disabled
                       allow-half/>
              <div class="my-comment-contents">{{myComment.description}}</div>
              <el-button type="danger" @click="deleteMyComment">
                删除
              </el-button>
              <!--              <el-button type="primary" @click="updateComment">-->
              <!--                修改-->
              <!--              </el-button>-->
            </div>

            <div class="no-score-text" v-show="!curWorkerHasVoted" style="color: #757575; margin-bottom: 10px;">
              您还未对此报告进行评价，现在就来评价吧！
            </div>
            <div class="leave-comment-area" v-show="!curWorkerHasVoted">
              <el-rate class="leave-comment-vote" v-model="myComment.score" allow-half/>
              <el-input
                  type="textarea"
                  class="leave-comment-input"
                  placeholder="请输入评论内容"
                  style="margin-bottom: 15px"
                  :rows="2"
                  maxlength="50"
                  show-word-limit
                  v-model="myComment.description">
              </el-input>
              <el-button type="primary" @click="submitComment">
                提交
              </el-button>
            </div>
          </el-main>

          <!-- 独立出来是为了滚动评论区时表头不动 -->
          <div class="title">
            <img src="../../../../assets/image/comment-area.png" alt="" style="width: 80px; margin-bottom: 10px;">
          </div>
          <el-main class="comments-area">
            <div class="comment-content-area" v-show="hasComment">
              <div class="comment-item" v-for="(item, i) in evaluationForm.comments" :key="i">
                <span class="username" style="color: #406EB4">{{
                    item.username
                  }}{{ isMyComment(item.userId.toString()) ? '（我）' : '' }}</span>
                <el-rate :value="item.score" disabled/>
                <span class="comment-content">{{ item.description }}</span>
                <div class="like-area">
                  <img src="../../../../assets/image/like-gray.png" v-if="item.isLoginUserLiked===0" alt=""
                       style="width: 20px" @click="handleLikeComment(item.id, i)">
                  <img src="../../../../assets/image/like-blue.png" v-else alt="" style="width: 20px"
                       @click="handleUnlikeComment(item.id, i)">
                  <span class="like-count">{{ item.likeNum }}</span>
                  <span class="author-like" v-show="item.isReportOwnerLiked===1">创作者觉得很赞</span>
                </div>
              </div>
            </div>
            <div class="no-score-text" v-show="!hasComment" style="color: #757575">
              暂无评论，快来抢沙发吧！
            </div>
          </el-main>


        </el-col>

      </el-row>

    </el-main>

  </div>
</template>

<script>
import {
  getReportByReportID,
  getReportEvaluationByReportID,
  getScreenshot,
  postNewComment,
  unpdateComment,
  deleteComment, likeComment, unlikeComment
} from "@/api/report";
import {Debounce} from "@/utils/Debounce";
import CheckBossEvaluationDialog from "@/components/worker/cooperation/CheckBossEvaluationDialog";

export default {
  name: "ReportEvaluationDetail",

  components: {
    CheckBossEvaluationDialog
  },

  data() {
    return {
      loading: true,

      // myCommentModified: false,  // 是否修改过我的评论

      // 统计分数段人数
      // 5星：5 / 4.5
      // 4星：4 / 3.5
      // 3星：3 / 2.5
      // 2星：2 / 1.5
      // 1星：1 / 0.5
      scoreStageNum: [
        0, 0, 0, 0, 0
      ],
      // 评价人数
      voteNum: 0,

      // 该报告的所有评价
      evaluationForm: {
        score: 0.0,
        comments: []
      },

      // 当前用户对该报告的评价
      myComment: {
        id: -1,
        userId: parseInt(sessionStorage.getItem('userid')),
        username: sessionStorage.getItem('username'),
        score: 0,
        description: ""
      },

      curWorkerHasVoted: false,

      // 报告信息
      form: {
        id: -1,
        taskname: '',
        type: '',
        environment: '',
        description: '',
        steps: '',
        screenshot: 'https://lluviasnowb01.oss-cn-hangzhou.aliyuncs.com/collect/'
      },
      baseUrl: 'https://lluviasnowb01.oss-cn-hangzhou.aliyuncs.com/collect/'
    }
  },

  computed: {
    hasComment() {
      // 是否有评价，用于对分数区和评论区进行占位提示
      return this.evaluationForm.comments.length !== 0;
    },

    isLowQuality() {
      // 低于三分算低质量
      return this.hasComment && this.evaluationForm.score < 3;
    },

    isHighQuality() {
      // 低于三分算低质量
      return this.hasComment && this.evaluationForm.score > 4;
    }
  },

  created() {
    this.getEvaluationForm();
    this.getReport();
    // getFollowingByWorkerID(sessionStorage.getItem('userid')).then(res => {
    //
    // })
  },

  methods: {
    async getEvaluationForm() {
      const res = await getReportEvaluationByReportID(this.$route.query.reportid,sessionStorage.getItem('userid'));
      this.evaluationForm.score = Number(res.data.score.toFixed(1));

      console.log(res.data)
      for (const comment of res.data.comments) {
        this.evaluationForm.comments.push(comment);

        // 统计分数段人数
        // 5星：5 / 4.5
        // 4星：4 / 3.5
        // 3星：3 / 2.5
        // 2星：2 / 1.5
        // 1星：1 / 0.5

        this.scoreStageNum[5 - Math.ceil(comment.score)]++;
        this.voteNum++;

        // 查找当前用户对该报告的评价
        if (comment.userId.toString() === sessionStorage.getItem("userid")) {
          this.curWorkerHasVoted = true;
          for (const key of Object.keys(comment)) {
            // 单独存一份 “我的评价” 以便单独显示
            this.myComment[key] = comment[key];
          }
        }
      }
    },

    async getReport() {
      const reportid = this.$route.query.reportid;
      const res = await getReportByReportID(reportid);
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      }

      const obj = res.data;
      const reportId = obj.id;
      console.log(obj);
      // this.form["screenshot"]=this.baseUrl
      for (let key of Object.keys(obj)) {
        if(key==='id')
          sessionStorage.setItem('report_boss_evaluate_id',obj['id']);
        if (key === 'type') {
          if (obj['type'] === 'function_test') this.form['type'] = '功能测试';
          else if (obj['type'] === 'performance_test') this.form['type'] = '性能测试';
          else if (obj['type'] === 'bug_explore') this.form['type'] = 'Bug探索';
        } else {
          this.form[key] = obj[key];
        }
      }

      getScreenshot(reportId).then(res2 => {
        this.form["screenshot"] = this.baseUrl + res2[0].url
      });
    },

    isMyComment(uid) {
      return sessionStorage.getItem("userid") === uid;
    },

    // async handleUpdateComment() {
    //   const res = await unpdateComment({
    //     id: this.myComment.id,
    //     reportid: this.form.id,  // int
    //     userid: this.myComment.userId,      // int
    //     //username: this.myComment.username,  // string
    //     vote: this.myComment.score,          // float
    //     comment: this.myComment.description     // string
    //   });
    //   if (res.code === 200) {
    //     this.$message.success("评价更新成功！");
    //     setTimeout("location.reload()", 1000);
    //     location.reload();
    //   } else {
    //     this.$message.error(res.msg);
    //   }
    // },

    async handlePostComment() {
      const res = await postNewComment({
        reportid: this.form.id,  // int
        userid: this.myComment.userId,      // int
        //username: this.myComment.username,  // string
        vote: this.myComment.score,          // float
        comment: this.myComment.description     // string
      });
      if (res.code === 200) {
        this.$message.success("评价成功！");
        setTimeout("location.reload()", 1000);
        location.reload();
      } else {
        this.$message.error(res.msg);
      }
    },
    async handleDeleteComment() {
      const res = await deleteComment(this.myComment.id);
      if (res.code === 200) {
        this.$message.success("删除成功！");
        setTimeout("location.reload()", 1000);
      } else {
        this.$message.error(res.msg);
      }
    },

    submitComment: Debounce(function () {
      if (this.myComment.score === 0) {
        this.$message.error('您尚未对报告进行评分！');
        return;
      }
      if (this.myComment.description === '') {
        this.$message.error('您尚未对报告进行评论！');
        return;
      }
      this.handlePostComment();
    }, 1000),

    // updateComment: Debounce(function () {
    //   if (this.myComment.score === 0) {
    //     this.$message.error('更新评分不可为空！');
    //     return;
    //   }
    //   if (this.myComment.description === '') {
    //     this.$message.error('更新评论不可为空！');
    //     return;
    //   }
    //   if (!this.myCommentModified) {
    //     this.$message.error('您并未修改评论，请修改后再提交');
    //     return;
    //   }
    //   this.handleUpdateComment();
    // }, 1000),

    deleteMyComment: Debounce(function () {
      this.handleDeleteComment();
    }, 1000),

    handleLikeComment: Debounce(function(commentID, ind) {
      likeComment({
        userid: sessionStorage.getItem('userid'),
        commentid: commentID
      }).then(res => {
        if (res.code === 200) {
          this.evaluationForm.comments[ind]['isLoginUserLiked'] = 1;
          this.evaluationForm.comments[ind]['likeNum']++;

          if (this.form.workername === sessionStorage.getItem('username')) {
            // 发布者点了赞
            this.evaluationForm.comments[ind]['isReportOwnerLiked'] = 1;
          }
        } else {
          this.$message.error('点赞失败');
        }
      })
    }, 500),

    handleUnlikeComment: Debounce(function(commentID, ind) {
      unlikeComment({
        userid: sessionStorage.getItem('userid'),
        commentid: commentID
      }).then(res => {
        if (res.code === 200) {
          if (this.form.workername === sessionStorage.getItem('username')) {
            // 发布者取消了赞
            this.evaluationForm.comments[ind]['isReportOwnerLiked'] = 0;
          }

          this.evaluationForm.comments[ind]['isLoginUserLiked'] = 0;
          this.evaluationForm.comments[ind]['likeNum']--;
        } else {
          this.$message.error('取消点赞失败')
        }
      })
    }, 500),

    gotoSupplement() {
      sessionStorage.setItem('reportToSupplement', JSON.stringify(this.form));
      this.$router.push(`/worker/cooperation/supplement/submit?taskid=${this.$route.query.taskid}&reportid=${this.form.id}`);
    }
  }
}
</script>

<style>

/* 用于调整表头宽度 */
.el-descriptions-item__label.is-bordered-label {
  width: 120px !important;
}

/* 用于初次评价时的星星大小 */
.leave-comment-vote span .el-rate__icon {
  font-size: 25px !important;
}

</style>

<style scoped>

#evaluation-detail-box {
  position: relative;

  width: 80%;
  background: #fff;
  border-radius: 24px;
  box-shadow: rgba(90, 106, 140, 0.3) 0px 0px 6px;
  margin: 20px auto;
  padding: 40px 50px;
}

.report-detail-content {
  box-shadow: rgba(90, 106, 140, 0.3) 0px 0px 6px;
}

.content-area-outer-box,
.content-area,
.score-and-comments-area,
.score-area,
.comments-area,
.report-details-area {
  padding: 1% 1%;
  /*border: 1px solid #000;*/
}

.score-and-comments-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.score-area {
  max-height: 300px;
}

.score-content-area {
  min-height: 200px;
  max-height: 200px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 20px;
}

.score-item {
  display: flex;
  flex-direction: row;
  column-gap: 5px;
  margin-bottom: 5px;
}

.score-content-area,
.comment-item {
  border-radius: 12px;
  box-shadow: rgba(90, 106, 140, 0.3) 0px 0px 6px;
  background: #f9faff;
}

.comments-area {
  max-height: 400px;
}

.comment-content-area {
  min-height: 200px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.comment-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 5px;
  padding: 20px 20px;
  margin-bottom: 15px;

  box-shadow: rgba(90, 106, 140, 0.3) 0px 0px 6px;
  border-radius: 12px;
}

.comment-item * {
  text-align: left;
}

.leave-comment-area {
  box-shadow: rgba(90, 106, 140, 0.3) 0px 0px 6px;
  border-radius: 12px;
  padding: 15px 15px;
}

.leave-comment-vote {
  margin-bottom: 18px;
}

.like-area {
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 10px;
}

.like-area img:hover {
  cursor: pointer;
}

.like-area .like-count {
  margin-left: 3px;
}

.author-like {
  font-size: 12px;
  background: #e0e0e0;
  color: #6F6F6F;
  padding: 2px 4px;
  margin-left: 10px;
}

.author-like:hover {
  cursor: default;
}

.my-comment-contents {
  margin-bottom: 15px;

}

</style>
