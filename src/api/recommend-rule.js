import axios from "axios";

// GET
export const getRuleList = () => {
    return axios.get(
        `/recommend/getAllRules`
    ).then(res => {
        return res.data;
    });
}

// GET
export const getRuleDetailByRuleId = ruleid => {
    return axios.get(
        `/recommend/getrule/${ruleid}`
    ).then(res => {
        return res.data;
    })
}
// GET 删除推荐规则
export const deleteByRuleId = ruleid => {
    return axios.get(
        `/recommend/deleteRule/${ruleid}`
    ).then(res => {
        return res.data;
    })
}

// POST
export const addNewRule = payload => {
    return axios.post('/recommend/create', {
            name: payload.name,
            taskAcceptedFactor: payload.claimedTasks,
            testEnvFactor: payload.environment,
            skillFactor: payload.skills,
            taskPreferFactor: payload.taskPrefer,
            taskLatestDdlFactor: payload.latestDeadline
        }
    ).then(res => {
        return res.data;
    })
}

// POST
export const modifyRule = payload => {
    return axios.post('/recommend/updateRule', {
            id: payload.id,
            name: payload.name,
            taskAcceptedFactor: payload.claimedTasks,
            testEnvFactor: payload.environment,
            skillFactor: payload.skills,
            taskPreferFactor: payload.taskPrefer,
            taskLatestDdlFactor: payload.latestDeadline
        }
    ).then(res => {
        return res.data;
    })
}
