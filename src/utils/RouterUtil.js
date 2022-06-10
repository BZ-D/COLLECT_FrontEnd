export const toMainPage = (to) => {
  return to.path.startsWith("/worker") || to.path.startsWith("/boss") || to.path.startsWith("/admin")
}

export const hasLogin = () => {
  return sessionStorage.getItem('userid') !== null;
}

export const isWorker = () => {
  return sessionStorage.getItem('role') === 'worker';
}
export const isBoss = () => {
  return sessionStorage.getItem('role') === 'boss';
}
export const isAdmin = () => {
  return sessionStorage.getItem('role') === 'admin';
}

export const guard = (to, from, next) => {
  document.title = 'COLLECT协作众测平台';
  const LOGINED = hasLogin();

  // 未登录，禁止进入主页
  if (!LOGINED && toMainPage(to)) {
    next({ name: 'login' });
  }

  // 已登录，禁止进入其他身份的页面
  if (LOGINED) {
    // 禁止进入其他身份的页面
    if (isWorker() && (to.path.startsWith('/boss') || to.path.startsWith('/admin'))) {
      next({ path: '/worker' });
    } else if (isBoss() && (to.path.startsWith('/worker') || to.path.startsWith('/admin'))) {
      next({ path: '/boss/mytasksIntro' });
    } else if (isAdmin() && (to.path.startsWith('/boss') || to.path.startsWith('/worker'))) {
      next({ path: '/admin/plaza' });
    }

    // 禁止进入登录页，除非退出登录
    if (to.name === 'login') {
      next({ path: '/' + sessionStorage.getItem('role') + '/profile' });
    }
  }

  next();
}
