import axios from "axios";


// POST 由用户名登录
export const loginByUsername = payload => {
  return axios.post('/user/2', {
      username: payload.username,
      password: payload.password
    }
  ).then(res => {
    return res.data;
  })
}


// POST 由邮箱登录
export const loginByEmail = payload => {
  return axios.post('/user/3', {
      email: payload.email,
      password: payload.password
    }
  ).then(res => {
    return res.data;
  })
}
