import axios from "axios";

// GET
export const getReportListByTaskID = taskid => {
  return axios.get(
    `/report/reportlist/${taskid}`
  ).then(res => {
    return res.data;
  });
}

// GET
export const getReportByReportID = reportid => {
  return axios.get(
    `/report/bossdetail/${reportid}`
  ).then(res => {
    return res.data;
  })
}

export const createScreenshot = payload => {
  return axios.post('/screenshot/create', {
    reportId: payload.reportId,
    url: payload.url
  }).then(res => {
    return res.data;
  })
}


export const getScreenshot = reportid => {
  // 参数：任务id
  return axios.get(
    `/screenshot/get/${reportid}`
  ).then(res => {
    return res.data;
  })
}

// GET：报告评价
//
export const getReportEvaluationByReportID = (reportid,loginid) => {
  return axios.get(
    //`https://mock.hmilyld.com/mock/628b2ca52e51320020c6565a/comments/get`
       `/score/getScores/${reportid}/?loginid=${loginid}`
  ).then(res => {
    // 评价包含：该报告的综合评分(float)，[每个评价过该报告的众包工人id、用户名、该工人的打分、该工人的文字评论](list)
    return res.data;
  })
}

// POST: 添加新评价
export const postNewComment = payload => {
  return axios.post('/score/postScore', {
    reportId: payload.reportid,  // int
    userId: payload.userid,      // int
    score: payload.vote,          // float
    description: payload.comment     // string
  }).then(res => {
    return res.data;
  })
}
export const unpdateComment = payload => {
  return axios.post('/score/updateScore', {
    id: payload.id,
    reportId: payload.reportid,  // int
    userId: payload.userid,      // int
    score: payload.vote,          // float
    description: payload.comment     // string
  }).then(res => {
    return res.data;
  })
}

export const deleteComment = commentid => {
  return axios.get(
    `/score/deleteScore/${commentid}`
  ).then(res => {
    return res.data;
  })
}

// GET: 获得某一主报告的所有子报告列表
// todo
export const getSubReportsByReportID = reportid => {
  return axios.get(
    // `https://mock.hmilyld.com/mock/623ee371878b3700170b91d6/relation/subreports`
    `/report/getSubReport/${reportid}`
  ).then(res => {
    return res.data;
  })
}

// POST: 修改报告并更新
// todo
export const updateReportByReportID = payload => {
  return axios.post(`/report/modifyReport/?reportid=${payload.id}`, {
    workerid: payload.workerid,
    taskid: payload.taskid,
    environment: payload.environment,
    description: payload.description,
    steps: payload.steps
  }).then(res => {
    return res.data;
  })
}

// POST: 为某主报告添加子报告
// todo
export const addSubReportToReportByReportID = payload => {
  return axios.post(`/report/subReport/${payload.reportid}?childid=${payload.childid}`, {
    workerid: payload.workerid,
    environment: payload.environment,
    description: payload.description,
    steps: payload.steps,
    screenshot: payload.screenshot,
    taskid: payload.taskid
  }).then(res => {
    return res.data;
  })
}

// GET: 查看发包方对某一报告的评价
export const getBossEvaluationOfReportByReportID = reportid => {
  // notevaluated / getevaluation
  return axios.get(`/score/getBossScore/${reportid}`)
    .then(res => {
      return res.data;
    })
}

// POST: 发包方提交对某报告的评价
export const submitBossEvaluationByReportID = payload => {
  // another url: submitfail / submitbossevaluation
  return axios.post(`/score/postBossScore`, {
    reportId: payload.reportId,
    taskFit: payload.taskFit,
    reality: payload.reality,
    defectImportance: payload.defectImportance,
    recurrence: payload.recurrence,
    totalQuality: payload.totalQuality
  }).then(res => {
    return res.data;
  })
}

export const updateBossEvaluationByReportID = payload => {
  // another url: submitfail / submitbossevaluation
  return axios.post(`/score/updateBossScore`, {
    id:payload.id,
    reportId: payload.reportId,
    taskFit: payload.taskFit,
    reality: payload.reality,
    defectImportance: payload.defectImportance,
    recurrence: payload.recurrence,
    totalQuality: payload.totalQuality
  }).then(res => {
    return res.data;
  })
}

export const deleteBossEvaluationByReportID = commentid=>{
  return axios.get(`/score/deleteBossScore/${commentid}`)
      .then(res => {
        return res.data;
      })
}
// POST: 众包工人或发包方对某评论点赞
export const likeComment = payload => {
  return axios.post(
    `/score/like/?userid=${payload.userid}&commentid=${payload.commentid}`
    // `?userid=${payload.userid}&commentid=${payload.commentid}`
  ).then(res => {
    return res.data;
  })
}

// POST: 众包工人或发包方对某评论取消点赞
export const unlikeComment = payload => {
  return axios.post(
    `/score/unlike/?userid=${payload.userid}&commentid=${payload.commentid}`
    // `?userid=${payload.userid}&commentid=${payload.commentid}`
  ).then(res => {
    return res.data;
  })
}

// GET: 通过报告id获取ReportWithSimilarityVO
// todo
export const getReportWithSimListByReportID = reportid => {
  return axios.get(
    `/report/workerdetail/report/${reportid}`
  ).then(res => {
    return res.data;
  })
}
