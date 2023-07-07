/*
 * @Description:
 * @LastEditTime: 2022-09-09 17:29:51
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
 */
import config from '../config/config.js';
import store from '../store/index.js';

function request(obj) {
  var data = Object.assign({}, obj.data),
    url = obj.url;
  // #ifdef MP-WEIXIN
  url = config.baseUrl + obj.url
  // #endif
  var headers = {
    'x-access-token': store.state.token,
    'content-type': 'application/json'
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: obj.method,
      data,
      dataType: "json",
      header: headers,
      success: function(res) {
        if (res.data && res.data.flag) {
          resolve(res.data.data);
        } else {
          if (res.data.code == 1000) {
            store.commit('setToken', '')
            store.commit('setUserInfo', '')
            uni.showModal({
              title: '异地登录提醒',
              content: '您的账号在其他设备登录，如非本人请及时更换密码！',
              confirmText: '去登录',
              confirmColor: '#3277FF',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  uni.reLaunch({
                    url: '/pages/login/login?logout=1'
                  })
                }
              }
            })
            reject()
          } else if (res.data.code == 1010 || res.data.code == 1051) { // token过期
            this.$store.dispatch('login').then(res => {
              resolve(request(obj))
            })
          } else {
            reject()
            uni.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1500
            })
          }
        }
      },
      fail: function(res) {
        reject()
        uni.showToast({
          title: "网络异常，请检查网络！",
          icon: 'none'
        })
      }
    })
  })
}
export default request