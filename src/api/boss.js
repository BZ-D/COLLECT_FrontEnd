import axios from "axios";

// GET
export const getExecutingTasksByBossID = bossid => {
  // 参数：发包方id
  return axios.get(
    `/task/boss/executing/${bossid}`
  ).then(res => {
    return res.data;
  });
}

// GET
export const getFinishedTasksByBossID = bossid => {
  // 参数：发包方id
  return axios.get(
    `/task/boss/completed/${bossid}`
  ).then(res => {
    return res.data;
  });
}

// POST
export const releaseTask = payload => {
  return axios.post('/task/create', {
    // bossid: payload.bossid,
    username: payload.username,
    taskname: payload.taskname,
    type: payload.type,
    environment: payload.environment,
    deadline: payload.deadline,
    need_num: payload.need_num,
    description: payload.description
  }).then(res => {
    return res.data;
  })
}

// GET 获取要邀请的工人列表
// todo
export const getWorkersToInviteByTaskID = taskid => {
  return axios.get(
    `/grouprecommend/${taskid}`
    // `https://mock.hmilyld.com/mock/628dff682e51320020c65669/invite/worker-list`
  ).then(res => {
    return res.data;
  })
}

// POST 邀请工人
// todo
export const inviteWorkers = payload => {
  return axios.post(
    `/user/invite`,
    {
      taskid: payload.taskid,
      workeridList: payload.workeridList
    }
  ).then(res => {
    return res.data;
  })
}
