(function() {
  var config = {
    useBtnsConfiguration: false, // 是否使用uc的按钮配置， 不使用时不进行按钮权限校验
    userMenusConfiguration: false// 是否使用uc 的菜单配置，不使用时使用自定义的菜单
  }

  window.permissionCheck = {
    getConfig: function() {
      return JSON.parse(JSON.stringify(config))
    },
    isCheckBtns: function() {
      return !!config.useBtnsConfiguration
    },
    isCheckMenus: function() {
      return !!config.userMenusConfiguration
    }
  }
})(window)
