function navigateTo(url) {
  uni.navigateTo({
    url: url
  })
}

function showToast(txt) {
  uni.showToast({
    title: txt,
    icon: 'none'
  })
}

function toLogin(txt) {
  uni.showModal({
    title: '温馨提示',
    content: '请先登录/注册，方可进行下一步操作',
    confirmText: '去登录',
    cancelText: '取消',
    confirmColor: '#3277FF',
    cancelColor: '#999999',
    success: res => {
      if (res.confirm) {
        navigateTo('/pages/login/login?logout=1');
      }
    },
  });
}

export default {
  navigateTo,
  showToast,
  toLogin
}