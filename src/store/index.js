import Vue from 'vue'
import Vuex from 'vuex'
import fr from "element-ui/src/locale/lang/fr";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // admin
    // 修改规则的相关共享
    // 当某条规则修改后，回退到规则详情页时，用于重新请求规则
    modified: false,
    // 要修改某条规则时，临时保存该规则的当前信息，进行兄弟组件之间传值
    modifiedRule: {},


    // boss
    // 发包方查看报告关系时的共享变量
    // 记录报告列表的 taskid
    taskIdOfReportList: -1,
    // 记录主报告 reportid，便于子报告详情页返回关联页
    reportIdOfSubReport: -1,


    // worker
    // 众包工人在提交报告后选择修改报告时用于存放之前提交的报告内容
    reportToBeModified: {}
  },

  getters: {
  },

  mutations: {
    setModifiedBool(state, bool) {
      state.modified = bool;
    },

    setModifiedRule(state, ruleDetail) {
      for (const key of Object.keys(ruleDetail)) {
        state.modifiedRule[key] = ruleDetail[key];
      }
    },

    setTaskIdOfReportList(state, taskid) {
      state.taskIdOfReportList = taskid;
    },

    setReportIdOfSubReport(state, reportid) {
      state.reportIdOfSubReport = reportid;
    },

    setReportToBeModified(state, reportObj) {
      for (const key of Object.keys(reportObj)) {
        state.reportToBeModified[key] = reportObj[key];
      }
    }
  },

  actions: {
  },

  modules: {
  }
})
