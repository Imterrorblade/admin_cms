import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/authredirect']// 菜单权限白名单 在名单内的,无需权限验证

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // console.log('store.getters.addRouters', store.getters.addRouters)
      if (store.getters.addRouters.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          // console.log('GetUserInfo', res)
          store.dispatch('GetUserMenu').then(res => { // 获取用户菜单(权限)
            // console.log('GetUserMenu', res)
            if (res.data.success) {
              const menus = res.data.data
              store.dispatch('getRoutesByMenu', { menus }).then(() => { // 依据菜单 配置 路由表
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              })
            }
          })
          // store.dispatch('GetUserBtn').then(res => { // 获取用户按钮(权限)
          //   // console.log('GetUserBtn', res)
          //   if (res.data.success) {
          //     const btnRoles = res.data.data
          //     store.dispatch('setBtnPermission', { btnRoles })
          //     // .then(() => { // 依据菜单 配置 路由表
          //     //   // console.log('store.getters.btnRoles', store.getters.btnRoles)
          //     // })
          //   }
          // })
        }).catch((err) => {
          console.log(err)
          store.dispatch('FedLogOut').then(() => {
            // Message.error(err || 'Verification failed, please login again')
            Message.error('登陆超时，请重新登陆')
            next({ path: '/login' })
          })
        })
      } else {
        if (to.name) {
          store.dispatch('GetUserBtn').then(res => { // 获取用户按钮(权限)
            // console.log('GetUserBtn', res)
            if (res.data.success) {
              const btnRoles = res.data.data
              const meta = to.meta
              // const blackBtns = ['add', 'del']
              store.dispatch('setBtnPermission', { meta, btnRoles })
                .then(() => { // 依据菜单 配置 路由表
                  next()
                  console.log('dispatch setBtnPermission ', store.getters.btnPermission)
                }).catch(err => {
                  console.log(err)
                  next()
                })
            }
          }).catch(err => {
            console.log(err)
            next()
          })
        } else {
          next()
        }
        // store.dispatch('setRoute', { uplink: to.meta.uplink }).then(() => {
        //   next()
        // }).catch(() => {
        //   next()
        // })
      }
    }
  } else {
    // console.log('getToken false')
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
