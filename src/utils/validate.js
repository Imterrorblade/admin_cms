/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const reg = /^[A-Za-z0-9]+$/
  return reg.test(str)
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * validate tel
 * @param tel
 * @returns {boolean}
 */
export function isvalidateTel(tel, type) {
  const re = [/^0\d{2,3}-?\d{7,8}$/, /^1\d{10}$/, /^0\d{2,3}-?\d{7,8}$|1\d{10}$/]
  type = type || 0
  return re[type].test(tel)
}
/**
 * from checkRequired
 * @param message _selef(vue)
 * @returns message
 */
export function checkRequired(message, _self) {
  message += _self.$t('table.common.error.__message')
  return message
}

// 获取单个字段表单验证规则
export function formRule(mapfield, _self) {
  return [{ required: true, message: checkRequired(_self.$t(mapfield), _self), trigger: 'change' }]
}
// 手机号验证
export function isTelvalidate(tel, type) {
  const re = [/^[1][3,4,5,7,8][0-9]{9}$/]
  type = type || 0
  return re[type].test(tel)
}
// 身份证验证
export function IdCodeValid(code, type) {
  // 身份证号合法性验证
  // 支持15位和18位身份证号
  // 支持地址编码、出生日期、校验位验证
  // var city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 ' }
  const re = [/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/]
  type = type || 0
  return re[type].test(code)
}
// 获取整个表单验证规则
export function getRules(fields, _self) {
  const rules = {}
  for (const i of fields) {
    if (typeof i === 'string') {
      rules[i] = formRule('table.common.' + i, _self)
    } else if (typeof i === 'object') {
      const key = Object.keys(i)[0]
      rules[key] = formRule(i[key], _self)
    }
  }
  return rules
}
