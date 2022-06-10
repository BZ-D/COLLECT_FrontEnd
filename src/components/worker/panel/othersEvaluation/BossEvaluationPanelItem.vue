<template>
  <!-- 发包方评价区 -->
  <div class="item-area" id="boss-evaluation-area">
    <img src="../../../../assets/image/boss-evaluation-area.png" alt="" style="width: 120px; margin-bottom: 10px;">
    <span class="no-data-hint" v-show="!hasBossEvaluation">
          尚未有发包方评价过您的报告，请稍后再查看。
        </span>

    <span class="data-description" v-show="hasBossEvaluation">
          “<span style="color: #0c3183; font-weight: bold;">发包方评价</span>”是发包方对您提交报告的综合评价，包含五个维度，最终得分为所有发包方对您评价的平均值。
        </span>

    <span class="data-description" v-show="hasBossEvaluation">
          您目前共计获得了&nbsp;{{ contents.bossEvaluationNum }}&nbsp;份发包方评价，发包方评价最终得分见下表：
        </span>

    <div id="boss-evaluation-table" v-show="hasBossEvaluation">
      <el-descriptions direction="vertical" :column="5" border>
        <el-descriptions-item label="报告-任务契合度">
          <el-tag :type="getBossEvaluationLevel(contents.taskFit)" effect="dark">
            {{ contents.taskFit }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="报告真实度">
          <el-tag :type="getBossEvaluationLevel(contents.reality)" effect="dark">
            {{ contents.reality }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="缺陷重要度">
          <el-tag :type="getBossEvaluationLevel(contents.defectImportance)" effect="dark">
            {{ contents.defectImportance }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="复现完整度">
          <el-tag :type="getBossEvaluationLevel(contents.recurrence)" effect="dark">
            {{ contents.recurrence }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="总体报告质量">
          <el-tag :type="getBossEvaluationLevel(contents.totalQuality)" effect="dark">
            {{ contents.totalQuality }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
export default {
  name: "BossEvaluationPanelItem",
  props: ['contents', 'hasBossEvaluation'],

  methods: {
    getBossEvaluationLevel(v) {
      if (v === '偏高' || v === '高') {
        return 'success';
      } else if (v === '中' || v === '偏低') {
        return 'warning';
      } else {
        return 'danger';
      }
    }
  }
}
</script>

<style scoped>

* {
  color: #3f3f3f
}

.no-data-hint, .data-description {
  font-size: 14px;
}

.item-area {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  align-items: center;
}

#boss-evaluation-table {
  width: 60%;
}

.el-tag {
  width: 50px;
  text-align: center;
}

</style>
