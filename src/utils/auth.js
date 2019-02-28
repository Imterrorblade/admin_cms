import Cookies from 'js-cookie'

const TokenKey = 'token' // CMS_SESSION JSESSIONID

export function getToken() {
  var curToken = Cookies.get(TokenKey)
  // console.log('getToken', TokenKey, curToken)
  return curToken
}

export function setToken(token) {
  // console.log('setToken', TokenKey, token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // console.log('removeToken', TokenKey)
  // console.log('gettoken', getToken())
  Cookies.remove(TokenKey)
  // console.log('gettoken', getToken())
  return
}
