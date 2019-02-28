import axios from 'axios'
// import { Message } from 'element-ui'
// import { removeToken } from '@/utils/auth'
// import store from '@/store'
// import { Message } from 'element-ui'
// import store from '@/store'
// import { removeToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000, // request timeout
  // headers: {
  //   'Content-type': 'application/x-www-form-urlencoded'
  // },
  withCredentials: true // 允许携带cookie
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  // }
  config.url += '?' + Date.now()
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 404 && error.request.responseURL && error.request.responseURL.indexOf('login.html') > -1) {
      // Message.error('登录超时，请重新登录')
      setTimeout(() => {
        location.href = '/'
      }, 1000)
    } else if (error.response.status === 404 && error.response && (typeof error.response.data === 'string') && error.response.data.indexOf('login.html') > -1) {
      setTimeout(() => {
        location.href = '/'
      }, 1000)
    } else if (error.response && error.response.data && error.response.data.message === '用户未登录') {
      // Message.error('登陆超时，请重新登陆')
      setTimeout(function() {
        location.href = '/'
      }, 1000)
    }
    console.log('err' + error)// for debug

    return Promise.reject(error)
  })

export default service
