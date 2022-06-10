// GET
import axios from "axios";

export const getAllTasks = () => {
  return axios.get(
    '/task/AllTasks'
  ).then(res => {
    return res.data;
  })
}
// GET
export const getAllValidTasks = () => {
  // 无参数
  return axios.get(
    '/task/ValidTasks'
  ).then(res => {
    return res.data;
  })
}

export const getTaskDetailsByTaskID = taskid => {
  // 参数：任务id
  return axios.get(
    `/task/detail/${taskid}`
  ).then(res => {
    return res.data;
  })
}


export const createTaskFile = payload => {
  return axios.post('/taskfile/create', {
    taskId: payload.taskId,
    url: payload.url,
    type: payload.type,
    size: payload.size,
    kind: payload.kind,
    name: payload.name
  }).then(res => {
    return res.data;
  })
}

export const getTaskFile = payload => {
  // 参数：任务id
  const taskid = payload.taskId
  const kind = payload.kind
  return axios.get(
    `/taskfile/getfile/${taskid}/${kind}`
  ).then(res => {
    return res.data;
  })
}

// Post
export const deleteTaskByID = taskId => {
  return axios.post(
    `/task/delete/${taskId}`
  ).then(res => {
    return res.data;
  })
}

// get
// todo
export const getInvitedTaskByWorkerID = workerid => {
  return axios.get(
    `/user/getInvitedTasks/${workerid}`
  ).then(res => {
    return res.data;
  })
}
