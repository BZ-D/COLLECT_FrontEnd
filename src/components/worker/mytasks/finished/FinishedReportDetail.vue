<template>
  <div>

    <div style="display: flex; justify-content: center;">
      <el-row type="flex" style="width: 60%;">
        <el-button icon="el-icon-back" @click="$router.push('/worker/mytasks/finished')" plain>返回列表</el-button>
      </el-row>
    </div>

    <el-main
        class="report-detail-box"
        v-loading="loading"
        element-loading-text="报告仍在审查中，请稍候刷新"
        element-loading-spinner="el-icon-loading">

      <div class="container-title">
        <img src="../../../../assets/image/report-details.png" alt="" style="width: 150px">
      </div>

      <!-- 提示区域 -->
      <div class="similarity-area"
           v-show="!hasSimilarity"
           title="计算您的报告与其他报告的文本及图像相似度需要一定时间，请您稍作等待。">
        <i class="el-icon-loading" />&nbsp;相似度仍在计算中，请稍候刷新
      </div>
      <div class="no-similarity-tag" v-show="!hasSimilarity">
        <el-tag type="info" effect="dark">报告审查中</el-tag>
      </div>
      <div class="unqualified-tag" v-show="!isQualified && hasSimilarity">
        <el-tag type="danger" effect="dark">审查不通过</el-tag>
      </div>
      <div class="qualified-tag" v-show="isQualified">
        <el-tag type="primary" effect="dark">审查通过</el-tag>
      </div>
      <div class="unqualified-choose-area"
           @click="showChooseMsgBox"
           v-show="!isQualified && hasSimilarity">
        您的报告审查不通过，点此进行操作
      </div>
      <div class="qualified-choose-area"
           @click="gotoSimRelation"
           v-show="isQualified">
        <!-- 相当于跳转到协作页的关系图处 -->
        您的报告已审查通过，点此查看详情
      </div>


      <el-descriptions
          class="margin-top"
          :column="1"
          border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-edit"></i>
            测试名称
          </template>
          <span class="item-text">
            {{ form.taskname }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-setting"></i>
            测试类型
          </template>
          <span class="item-text">
            {{ form.type }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-map-location"></i>
            测试环境
          </template>
          <span class="item-text">
            {{ form.environment }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document"></i>
            缺陷描述
          </template>
          <span class="item-text">
            {{ form.description }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-coin"></i>
            复现步骤
          </template>
          <span class="item-text">
            {{ form.steps }}
          </span>
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
            <el-link :href="form.screenshot" target="_blank"><el-tag effect="dark" type="success">点此下载截图</el-tag></el-link>
          </a>
        </el-descriptions-item>
      </el-descriptions>

      <el-button type="primary" style="margin-top: 20px;"
                 v-show="isQualified"
                 @click="$router.push(`/worker/cooperation/evaluate/detail?taskid=${$route.params.taskid}&reportid=${form.id}`)">
        查看报告评价
      </el-button>

      <el-button type="warning" style="margin-top: 20px; margin-left: 50px"
                 v-show="isQualified"
                 @click="$router.push(`/worker/mytasks/corelation/?taskid=${$route.params.taskid}&reportid=${form.id}`);">
        查看报告协作关系
      </el-button>

    </el-main>

  </div>
</template>

<script>

import {getReportByTaskIDAndWorkerID} from "@/api/worker";
import {getScreenshot} from "@/api/report";

export default {
  name: 'ReportDetail',
  data() {

    return {
      loading: true,

      similarityList: [],
      hasSimilarity: false,  // 相似度是否计算好
      isQualified: false,  // 相似度是否合格
      // 最高的文本相似度和图像相似度
      highestTextSim: 0,
      highestImageSim: 0,
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
    };

  },

  created() {
    this.getReport();
  },

  methods: {
    async getReport() {
      const taskid = this.$route.params.taskid;
      const uid = sessionStorage.getItem('userid');
      const res = await getReportByTaskIDAndWorkerID(taskid, uid);
      if (res.code !== 200) {
        if (res.msg === '没有找到对应的报告！') {
          this.$message.error('您已参与该任务其他报告的协作，此报告因相似度过高已被废弃。');
          return;
        }
        return this.$message.error(res.msg);
      }
      const obj = res.data;
      const reportId = obj.id;


      // 获取报告内容
      for (let key of Object.keys(obj)) {
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

      // 获取相似度列表
      let simList = obj.reportSimilarities;
      // 相似度未计算完成，直接返回
      if (simList.length === 0) {
        return;
      }
      // 先按文本相似度降序，若相同则按图像相似度降序
      simList.sort((s1, s2) => {
        if (s1.textSimilarity !== s2.textSimilarity) {
          return s2.textSimilarity - s1.textSimilarity;
        } else {
          return s2.picSimilarity - s1.picSimilarity;
        }
      });

      this.highestTextSim = simList[0].textSimilarity;
      let highestImageSim = 0;
      for (const sim of simList) {
        if (sim.picSimilarity > highestImageSim) {
          highestImageSim = sim.picSimilarity;
        }
        this.similarityList.push(sim);
      }
      this.highestImageSim = highestImageSim;
      this.hasSimilarity = true;


      // 设定相似度阈值
      const TEXTSIM = 0.5;
      const IMGSIM = 0.75;
      if (this.highestTextSim > TEXTSIM || this.highestImageSim > IMGSIM) {
        // 相似度过高
        this.showChooseMsgBox();
      } else {
        // 否则认为报告合格
        this.isQualified = true;
      }
    },

    showChooseMsgBox() {
      // 选择：去报告协作或继续修改
      const msg = '<span>您的报告相似度已计算完毕，检测到此报告与其他报告的最高文本相似度为 '
          + '<strong>' + (this.highestTextSim * 100).toFixed(2) + '%</strong>，'
          + '最高图像相似度为 '
          + '<strong>' + (this.highestImageSim * 100).toFixed(2) + '%</strong>，'
          + '系统判定为<strong>相似度较高</strong>，'
          + '您可以选择<strong>修改</strong>此报告，也可以选择将该报告<strong>丢弃</strong>，'
          + '并<strong>补充</strong>该任务的其他报告。您可以暂时退出此弹窗。</span>'
      this.$confirm(msg, '提示', {
        confirmButtonText: '参与协作',
        cancelButtonText: '修改报告',
        closeOnClickModal: false,  // 点击遮罩不可关闭弹窗
        closeOnPressEscape: false,  // 点击ESC不可关闭弹窗
        dangerouslyUseHTMLString: true,
        type: 'error',
        lockScroll: false,  // 弹窗开启时不阻止滚动，防止回流
        distinguishCancelAndClose: true  // 关闭弹窗与点击修改应设为不同逻辑
      }).then(() => {
        this.gotoSimRelation();
      }).catch((action, instance, done) => {
        // 区分修改和关闭，避免关闭弹窗时跳到修改页面
        if (action === 'close') {
          done();
        } else {
          this.gotoModifyReport();
        }
      })
    },

    gotoSimRelation() {
      // 把相似度信息存到 sessionStorage 中，减少请求次数
      sessionStorage.setItem('simList', JSON.stringify(this.similarityList));
      // 选择去协作时，先不删除报告，等补充报告提交后再删除原报告
      this.$router.push(`/worker/mytasks/relation?taskid=${this.$route.params.taskid}&reportid=${this.form.id}&qualified=${this.isQualified}`)
    },

    gotoModifyReport() {
      // 把当前报告内容存到 vuex 中，减少请求次数
      this.$store.commit('setReportToBeModified', this.form);
      this.$router.push(`/worker/mytasks/modify?taskid=${this.$route.params.taskid}`)
    }
  }
}
</script>

<style>

.el-button {
  margin-top: 10px;
}

.el-descriptions-item__label.is-bordered-label {
  width: 120px !important;
}

</style>

<style scoped>

.report-detail-box {
  position: relative;
  border: 1px solid #DCDFE6;
  width: 60%;
  margin: 10px auto;
  padding: 3% 3% 1%;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 8px #909399;

  background-color: #f8f8f8;
}

.item-text {
  color: #406EB4;
}

.similarity-area{
  cursor: help;
  color: #5e95ee;
  position: absolute;
  top: 60px;
  right: 50px;
}

.unqualified-choose-area {
  position: absolute;
  top: 60px;
  right: 50px;
  color: #c51616;
  text-decoration: underline;
}

.unqualified-choose-area:hover {
  cursor: pointer;
  color: #e89617;
}

.qualified-choose-area {
  position: absolute;
  top: 60px;
  right: 50px;
  color: #3768c2;
  text-decoration: underline;
}

.qualified-choose-area:hover {
  cursor: pointer;
  color: #74affc;
}

.qualified-tag,
.no-similarity-tag,
.unqualified-tag {
  position: absolute;
  top: 35px;
  left: 35px;
}

</style>
