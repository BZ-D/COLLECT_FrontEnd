import axios from "axios";

export const getExecutingTasksByWorkerID = workerid => {
  // 参数：众包工人id
  return axios.get(
      `/task/worker/working/${workerid}`
  ).then(res => {
    return res.data;
  })
}

// GET
export const getFinishedTasksByWorkerID = workerid => {
  // 参数：众包工人id
  return axios.get(
      `/task/worker/finished/${workerid}`
  ).then(res => {
    return res.data;
  })
}
export const getActivityCount=workerid=>{
  return axios.get(
      `/user/getActivityCount/${workerid}`
  ).then(res=>{
    return res.data;
  })
}
export const getMyMessage=workerid=>{
  return axios.get(
      `/message/allmessage/${workerid}`
  ).then(res=>{
    return res.data;
  })
}

export const setRead=(messageId,uid)=>{
  return axios.get(
      `/message/setRead/${messageId}/?uid=${uid}`
  ).then(res=>{
    return res.data;
  })
}
// POST
// 返回应为布尔值，表示workerid的工人是否领取了taskid的任务
export const whetherClaimedCertainTask = (taskid, workerid) => {
  return axios.get(`/work/getStatus/?taskid=${taskid}&workerid=${workerid}`
  ).then(res => {
    return res.data;
  })
}

// POST
export const claimTask = payload => {
  // 参数：workerid / taskid
  return axios.post('/work/pick', {
    workerid: payload.workerid,
    taskid: payload.taskid
  }).then(res => {
    return res.data;
  })
}

// POST
export const submitReport = payload => {
  // 参数：workerid, taskid, environment, description, steps, screenshot
  return axios.post('/report/submit', {
    workerid: payload.workerid,
    taskid: payload.taskid,
    environment: payload.environment,
    description: payload.description,
    steps: payload.steps
  }).then(res => {
    return res.data;
  })
}

// GET
export const getReportByTaskIDAndWorkerID = (taskid, workerid) => {
  // 参数：workerid / taskid
  return axios.get(
      `/report/workerdetail/${taskid}?workerid=${workerid}`
      //`https://mock.hmilyld.com/mock/62401d10878b3700170b91d9/similarity/getReportByWorkerIDAndTaskID`
  ).then(res => {
    return res.data;
  })
}

// GET
export const getWorkerFeaturesByWorkerID = workerid => {
  return axios.get(
      `https://mock.hmilyld.com/mock/623acfa7878b3700170b91c3/worker/features`
  ).then(res => {
    return res.data;
  })
}

// GET
export const getRecommendTaskListByWorkerIDAndRuleID = (workerid, ruleid) => {
  return axios.get(
      `/recommend/useRule/?ruleid=${ruleid}&workerid=${workerid}`
  ).then(res => {
    return res.data;
  })
}

// GET
// todo
export const getAllClaimedTasksByWorkerID = workerid => {
  return axios.get(
      // 暂时用历史任务顶一下
      `/task/worker/finished/${workerid}`
  ).then(res => {
    return res.data;
  })
}

// GET
export const deleteReportByWorkerIDAndTaskID = (workerid, taskid) => {
  return axios.get(
      `xxx`
  ).then(res => {
    return res.data;
  })
}


// GET 获取所有工人
// todo: 以便关注
export const getAllWorkers = _ => {
  return axios.get(
    `/user/getWorkers`
  ).then(res => {
    return res.data;
  })
}


// GET 获取为某工人推荐的审查报告列表
// todo: 目前暂时用别的方法顶一下
export const getReviewReportListByWorkerID = workerid => {
  return axios.get(
    `/score/recommendReport/${workerid}`
  ).then(res => {
    return res.data;
  })
}

// GET 获取某工人关注了谁
// todo
export const getFollowingByWorkerID = workerid => {
  return axios.get(
    `/follow/getFollows?userId=${workerid}`
  ).then(res => {
    return res.data;
  })
}

// POST 批量关注
// todo
export const followOtherWorkers = payload => {
  return axios.post(
    `/follow/follow`,
    {
      workerid: payload.workerid,
      workeridList: payload.workeridList
    }
  ).then(res => {
    return res.data;
  })
}

// POST 批量取关
// todo
export const unfollowOtherWorkers = payload => {
  return axios.post(
    `/follow/unfollow`,
    {
      workerid: payload.workerid,
      workeridList: payload.workeridList
    }
  ).then(res => {
    return res.data;
  })
}
