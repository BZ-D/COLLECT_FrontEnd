<template>
  <div>

    <div
        v-show="$route.path.includes('mytasks')"
        style="margin-top: 20px; display: flex; justify-content: center;">
      <el-row type="flex" style="width: 60%;">
        <el-button type="info"
                   plain
                   @click="returnReportRelation">
          <i class="el-icon-back" />&nbsp;返回相似关联
        </el-button>
      </el-row>
    </div>

    <el-main
        class="report-detail-box"
        v-loading="loading"
        element-loading-text="正在加载"
        element-loading-spinner="el-icon-loading">
      <div class="container-title">
        <img src="../../../../assets/image/report-details.png" alt="" style="width: 150px">
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
            <i class="el-icon-user"></i>
            测试人员
          </template>
          <span class="item-text">
            {{ form.workername }}
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
            <i class="el-icon-alarm-clock"></i>
            提交时间
          </template>
          <span class="item-text">
            {{ form.submittime }}
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
            <!--            {{ form.screenshot }}-->
            <el-image
                class="my-img"
                ref="myImg"
                :src=form.screenshot>
            </el-image>
            <el-link :href="form.screenshot" target="_blank"><el-tag type="success" effect="dark">点此下载截图</el-tag></el-link>
          </a>
        </el-descriptions-item>
      </el-descriptions>

      <el-button type="primary"
                 style="margin-top: 20px;"
                 @click="gotoSupplement">
        报告协作
      </el-button>
    </el-main>

  </div>
</template>

<script>

import {getReportByReportID, getScreenshot} from "@/api/report";

export default {
  name: 'ReportDetail',
  data() {

    return {
      form: {
        taskname: '',
        type: '',
        environment: '',
        submittime: '',
        description: '',
        steps: '',
        screenshot: 'https://lluviasnowb01.oss-cn-hangzhou.aliyuncs.com/collect/8d6b0977-83d7-456c-9de7-24260ef6b202.jpg',
        workername: ''
      },
      baseUrl: 'https://lluviasnowb01.oss-cn-hangzhou.aliyuncs.com/collect/'
    };

  },

  computed: {

    loading() {
      return this.form['steps'] === '';
    }

  },

  created() {
    this.getReport();
  },


  methods: {
    async getReport() {

      const res = await getReportByReportID(this.$route.query.reportid);
      if (res.code !== 200) {
        return this.$message.error('报告不存在！');
      }

      const obj = res.data;
      for (let key of Object.keys(obj)) {
        if (key === 'type') {
          if (obj['type'] === 'function_test') this.form['type'] = '功能测试';
          else if (obj['type'] === 'performance_test') this.form['type'] = '性能测试';
          else if (obj['type'] === 'bug_explore') this.form['type'] = 'Bug探索';
        } else {
          this.form[key] = obj[key];
        }
      }

      getScreenshot(this.$route.query.reportid).then(res2 => {
        this.form["screenshot"] = this.baseUrl + res2[0].url;
      });

    },

    returnReportRelation() {
      this.$router.push(`/worker/mytasks/relation?taskid=${this.$route.query.taskid}&reportid=${this.$route.query.reportid}`);
    },

    gotoSupplement() {
      sessionStorage.setItem('reportToSupplement', JSON.stringify(this.form));
      if (this.$route.query.childid !== undefined)
        this.$router.push(`/worker/cooperation/supplement/submit?taskid=${this.$route.query.taskid}&reportid=${this.$route.query.reportid}&childid=${this.$route.query.childid}`)
      else
        this.$router.push(`/worker/cooperation/supplement/submit?taskid=${this.$route.query.taskid}&reportid=${this.$route.query.reportid}&childid=-1`)
    }
  }
}
</script>

<style>

.el-descriptions-item__label.is-bordered-label {
  width: 120px !important;
}

</style>

<style scoped>

.report-detail-box {
  border: 1px solid #DCDFE6;
  width: 60%;
  margin: 20px auto 20px;
  padding: 3% 3%;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 8px #909399;

  background-color: #f8f8f8;
}

.item-text {
  color: #1733b2;
}

</style>
