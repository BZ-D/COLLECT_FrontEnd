import axios from "axios";

// TODO

export const getOthersEvaluationByWorkerID = workerid => {
  return axios.get(
    `/score/othersEvaluteAbility/${workerid}`
  ).then(res => {
    return res.data;
  })
}


export const getReviewAbilityByWorkerID = workerid => {
  return axios.get(
    `/score/ability/${workerid}`
  ).then(res => {
    return res.data;
  })
}


export const getCooperationAbilityByWorkerID = workerid => {
  return axios.get(
    `/coordination/getCoorAbility/${workerid}`
  ).then(res => {
    return res.data;
  })
}
