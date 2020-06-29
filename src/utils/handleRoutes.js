import Layout from '@/layouts'

/**
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
export function filterAllRoutes(constantRoutes) {
  return constantRoutes.filter((route) => {
    if (route.title) delete route.title
    if (route.icon) delete route.icon
    if (route.name == '') delete route.name
    if (route.redirect == 'noRedirect') delete route.redirect
    route.hidden = !!route.hidden
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'EmptyLayout') {
        route.component = (resolve) =>
          require(['@/layouts/EmptyLayout'], resolve)
      } else {
        const path = 'views/' + route.component
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAllRoutes(route.children)
    }
    if (route.children && route.children.length === 0) {
      delete route.children
    }
    return true
  })
}

/**
 * @description 判断当前路由是否包含权限
 * @param permissions
 * @param route
 * @returns {boolean|*}
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some((role) => route.meta.permissions.includes(role))
  } else {
    return true
  }
}

/**
 * @description intelligence模式根据permissions数组拦截路由
 * @param routes
 * @param permissions
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, permissions) {
  const finallyRoutes = []
  routes.forEach((route) => {
    const item = { ...route }
    if (hasPermission(permissions, item)) {
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, permissions)
      }
      finallyRoutes.push(item)
    }
  })
  return finallyRoutes
}
