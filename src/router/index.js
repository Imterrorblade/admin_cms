import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  { path: '/test', component: _import('test/index'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'content_release/scenic_area_management'
    // children: [{
    //   path: 'dashboard',
    //   component: _import('dashboard/index'),
    //   name: 'dashboard',
    //   meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    // }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/charts',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'charts',
  //   meta: {
  //     title: 'charts',
  //     icon: 'chart'
  //   },
  //   children: [
  //     { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
  //     { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
  //     { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
  //   ]
  // },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table/complex-table',
  //   name: 'example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: '/example/table',
  //       component: _import('example/table/index'),
  //       redirect: '/example/table/complex-table',
  //       name: 'Table',
  //       meta: {
  //         title: 'Table',
  //         icon: 'table'
  //       },
  //       children: [
  //         { path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
  //         { path: 'drag-table', component: _import('example/table/complexTable'), name: 'dragTable', meta: { title: 'dragTable' }}
  //       ]
  //     },
  //     { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
  //   ]
  // }

  // {
  //   path: '/form',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'form',
  //   // hidden: true,
  //   meta: {
  //     title: 'form',
  //     icon: 'form'
  //   },
  //   children: [
  //     { path: 'create-form', component: _import('form/create'), name: 'createForm', meta: { title: 'createForm', icon: 'table' }},
  //     { path: 'edit-form', component: _import('form/edit'), name: 'editForm', meta: { title: 'editForm', icon: 'table' }}
  //   ]
  // }
  //, { path: '*', redirect: '/404', hidden: true }
]
