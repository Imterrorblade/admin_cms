const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  btnRoles: state => state.permission.btnRoles,
  errorLogs: state => state.errorLog.logs,
  btnPermission: state => state.permission.btnPermission,
  config: state => state.modelConfig.config,
  actions: state => state.modelConfig.actions,
  data: state => state.modelConfig.data
}
export default getters
