<template>
  <div>

    <div style="display: flex; justify-content: center;">
      <el-row type="flex" style="width: 50%; margin-top: 10px;">
        <el-button icon="el-icon-back"
                   @click="$router.push(`/worker/mytasks/report/${$route.query.taskid}`)"
                   plain>
          返回报告审查</el-button>
      </el-row>
    </div>

    <el-form :model="form"
             label-width="auto"
             ref="form"
             v-show="show"
             :rules="rules"
             class="report-submit-box">

      <img src="../../../../assets/image/modify-report.png" alt="" style="width: 150px" @load="show=true">


      <el-form-item label="测试设备" prop="environment">
        <el-row type="flex">
          <el-select v-model="form.environment" placeholder="请选择测试设备">
            <el-option label="iOS12.x" value="iOS12.x"></el-option>
            <el-option label="iOS13.x" value="iOS13.x"></el-option>
            <el-option label="iOS14.x" value="iOS14.x"></el-option>
            <el-option label="iOS15.x" value="iOS15.x"></el-option>
            <el-option label="Android12" value="Android12"></el-option>
            <el-option label="Android11" value="Android11"></el-option>
            <el-option label="Android10" value="Android10"></el-option>
            <el-option label="Android9" value="Android9"></el-option>
            <el-option label="Android8" value="Android8"></el-option>
            <el-option label="HarmonyOS1.x" value="HarmonyOS1.x"></el-option>
            <el-option label="HarmonyOS2.x" value="HarmonyOS2.x"></el-option>
          </el-select>
        </el-row>
      </el-form-item>

      <el-form-item label="缺陷描述" prop="description">
        <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请在此处进行缺陷描述"
            maxlength="200"
            show-word-limit
            v-model="form.description">
        </el-input>
      </el-form-item>

      <el-form-item label="缺陷复现步骤" prop="steps">
        <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请在此处叙述缺陷复现步骤"
            maxlength="200"
            show-word-limit
            v-model="form.steps">
        </el-input>
      </el-form-item>

      <el-form-item label="缺陷截图上传">
        <el-row type="flex">
          <el-upload
              ref="upload"
              action="#"
              accept="image/jpeg,image/png"
              :before-upload="onBeforeUpload"
              :on-preview="handlePreview"
              :on-change="handleChange"
              :file-list="form.screenshot"
              :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button class="btn" id="register-btn" type="primary" @click="onSubmit('form')">修改</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import {Debounce} from "@/utils/Debounce.js";
import {uploadFile} from "@/api/file";
import {createScreenshot, updateReportByReportID} from "@/api/report";


export default {
  name: 'ModifyReport',
  data() {

    return {
      show: false,
      form: {
        id: -1,
        environment: '',
        description: '',
        steps: '',
        screenshot: []
      },

      rules: {
        environment: [
          {required: true, message: '请选择测试设备'}
        ],
        description: [
          {required: true, message: '请填写缺陷描述', trigger: 'blur'}
        ],
        steps: [
          {required: true, message: '请填写缺陷复现步骤', trigger: 'blur'}
        ],
        screenshot: [],
      },

      fileList: [],
    };

  },

  created() {
    this.getReportToBeModified();
  },

  methods: {
    getReportToBeModified() {
      const reportObj = this.$store.state.reportToBeModified;
      if (Object.keys(reportObj).length === 0) {
        return;
      }

      this.form['id'] = reportObj['id'];
      this.form['environment'] = reportObj['environment'];
      this.form['description'] = reportObj['description'];
      this.form['steps'] = reportObj['steps'];
    },

    // 防抖
    onSubmit: Debounce(function (formName) {
      this.$confirm('确定提交报告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleModifyReport(this.form);
          } else {
            this.$message.error('提交失败，请检查您的信息！')
            return false;
          }
        });
      }).catch(() => {
      })
    }, 1000),

    async handleModifyReport(payload) {
      if (this.fileList.length < 1) {
        this.$message.error('提交失败！请选择截图并上传！');
        return;
      }

      payload['workerid'] = sessionStorage.getItem('userid');
      payload['taskid'] = this.$route.query.taskid;

      const res1 = await updateReportByReportID(payload);
      if (res1.code === 200) {
        this.$message.success('修改成功！报告正在审查中');
        await this.$router.push('/worker/mytasks/finished');

        const reportId = res1.data.id;
        // 上传文件
        const formData = new window.FormData();
        formData.append("file", this.fileList[0].raw);
        let res = await uploadFile(formData);

        // 写数据库
        if (res.code === 200) {
          const fileInfo = {
            reportId: reportId,
            url: res.data.name
          };
          createScreenshot(fileInfo).then(res => {
            console.log(res);
          });
        }
      } else {
        this.$message.error('发布失败！服务器异常');
      }
    },


    onBeforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!');
      }
      return isIMAGE && isLt1M;
    },


    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = []
    },

    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift();
      }
      this.fileList = fileList;
    },

    handlePreview(file) {
    }
  }
}
</script>


<style scoped>

.report-submit-box {
  border: 1px solid #DCDFE6;
  width: 45%;
  margin: 10px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 8px #909399;

  background-color: #fff;
}


.btn, a {
  margin-right: 20%;
}
</style>
