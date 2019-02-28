// import axios from 'axios'
import qs from 'qs'
import request from '@/utils/request'

export function loginByUsername(userName, password) {
  const data = qs.stringify({
    userName,
    password
  })
  return request({
    url: 'cms/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/cms/user/sign_out', // 'loginOut'
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: 'getUser',
    method: 'post'
  })
}

export function getUserMenu() {
  return request({
    url: 'getMenu',
    method: 'get'
  })
}

export function getUserBtn() {
  return request({
    url: 'getButton',
    method: 'get'
  })
}

