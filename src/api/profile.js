import axios from "axios";

// POST 用户信息更新
export const updateInfo = payload => {
    return axios.post('/user/5', {
            username: payload.username,
            password: payload.password,
            email: payload.email,
            role: payload.role,
            skill: payload.skill,
            taskPrefer: payload.task_prefer,
            freqDevice: payload.freq_device,
            activity: payload.activity
        }
    ).then(res => {
        return res.data;
    })
}