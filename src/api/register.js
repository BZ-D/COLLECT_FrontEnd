import axios from "axios";

// POST 用户注册
export const register = payload => {
  return axios.post('/user/1', {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role: payload.role
    }
  ).then(res => {
    return res.data;
  })
}
