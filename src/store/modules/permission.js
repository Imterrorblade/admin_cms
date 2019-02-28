import { constantRouterMap, asyncRouterMap } from '@/router'
const _import = require('../../router/_import_' + process.env.NODE_ENV)
import Layout from '../../views/layout/Layout'

/* 处理父级菜单权限编号开头问题 */
function dealParentPath(rightCode) {
  return rightCode.indexOf('/') === 0 ? rightCode : '/' + rightCode
}

/**
 * 依据菜单,动态生成路由
 * @param menus
 */
function transMenuToRouter(menus) {
  for (let i = 0, len = menus.length; i < len; i++) { // 一共二级菜单,确认过的,写死循环了 menus.length
    const pItem = menus[i]
    const cItems = pItem.childrens
    if (cItems.length > 0) {
      // 有子级的情况
      const router = {
        path: dealParentPath(pItem.rightCode), // 主目录
        component: Layout,
        redirect: 'noredirect',
        name: pItem.rightCode,
        meta: {
          title: pItem.name,
          icon: pItem.iconStyle
        },
        children: []
      }
      for (let j = 0, clen = cItems.length; j < clen; j++) {
        const cItem = cItems[j]
        const crouter = {
          path: cItem.rightCode,
          name: cItem.rightCode,
          component: _import(cItem.url),
          meta: { title: cItem.name, icon: cItem.iconStyle, noCache: true, uplink: cItem.id, rightCode: cItem.rightCode }
        }
        router.children.push(crouter)
      }
      asyncRouterMap.push(router)
    } else {
      // 没有子级的情况
      const router = {
        path: '',
        component: Layout,
        redirect: 'noredirect',
        children: [{
          path: pItem.rightCode, // 'dashboard',
          component: _import(pItem.url), // _import('dashboard/index'), // 前端实际目录
          name: pItem.rightCode,
          meta: { title: pItem.name, icon: pItem.iconStyle, noCache: true, uplink: pItem.id, rightCode: pItem.rightCode }
        }]
      }
      asyncRouterMap.push(router)
    }
  }
  return asyncRouterMap
}
// function reSetBtnPermission(meta, btns = [], blackBtns = defBlackBtns) {
//   const btnPermission = Object.assign({}, defBtnPression)
//   blackBtns.map((item) => {
//     btnPermission[item] = btns.filter((btn) => {
//       return btn.rightCode === meta.rightCode + '_' + item
//     }).length > 0
//   })
//   return { value: btnPermission, btns, meta }
// }
function getBtnPerssion(meta, btnRoles, blackBtns) {
  const btns = btnRoles.filter((btn) => {
    return meta.uplink === btn.uplink
  })
  return btns
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    btnRoles: [],
    btnPermission: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_BTNROLES: (state, btnRoles) => {
      state.btnRoles = btnRoles
    },
    SET_BTNPERMISSION: (state, btnPermission) => {
      state.btnPermission = btnPermission
    }
  },
  actions: {
    getRoutesByMenu({ commit }, data) {
      const { menus } = data
      // console.log('getRoutesByMenu menus', menus)
      let accessedRouters
      return new Promise(resolve => {
        accessedRouters = transMenuToRouter(menus)
        // console.log('accessedRouters', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    addRoutersByRouter({ commit }, data) {
      const { router } = data
      // console.log('getRoutesByMenu menus', menus)
      let accessedRouters
      return new Promise(resolve => {
        accessedRouters = router // asyncRouterMap.concat(router)
        // console.log('accessedRouters', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    setBtnPermission({ commit }, data) {
      const { meta, btnRoles } = data
      commit('SET_BTNROLES', btnRoles)
      const btnPermission = getBtnPerssion(meta, btnRoles)
      return new Promise(resolve => {
        commit('SET_BTNPERMISSION', btnPermission)
        resolve()
      })
    }
    // 重新自定义权限校验按钮
    // reSetBtnPermission({ dispatch, commit, state }, blackBtns) {
    //   const { meta, btns } = state.btnPermission
    //   const btnPermission = reSetBtnPermission(meta, btns, blackBtns)
    //   return new Promise(resolve => {
    //     commit('SET_BTNPERMISSION', btnPermission)
    //     resolve()
    //   })
    // }
  }
}

export default permission
