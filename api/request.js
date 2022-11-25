/*
 * @Description:
 * @LastEditTime: 2022-09-09 17:29:51
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
 */
import config from '../common/config.js';

function request(obj, method) {
  var data = Object.assign({}, obj.data),
    url = obj.url;
  // #ifdef MP-WEIXIN
  url = config.baseUrl + obj.url
  // #endif
  var headers = {
    'x-access-token': uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo').token : '',
    'content-type': 'application/json'
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: method,
      data,
      dataType: "json",
      header: headers,
      success: function(res) {
        if (res.data && res.data.flag) {
          resolve(res.data.data);
        } else {
          if (res.data.code == 1000) {
            uni.setStorageSync('eToken', '')
            uni.setStorageSync('userInfo', '')
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
          } else if (res.data.code == 1010 || res.data.code == 1051) { // 未登录或token过期
            uni.setStorageSync('eToken', '')
            // #ifdef MP-WEIXIN
            uni.login({
              provider: 'weixin',
              success: function(loginRes) {
                uni.request({
                  url: config.baseUrl + '/api/u/third-login',
                  method: 'post',
                  data: {
                    code: loginRes.code,
                  },
                  dataType: "json",
                  success: (res1 => {
                    if (res1.data.data.token) {
                      uni.setStorageSync('userInfo', res1.data.data)
                      resolve(request(obj, method))
                      return
                    } else {
                      reject()
                      uni.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1500
                      })
                      // uni.reLaunch({
                      //   url: '/pages/login/login'
                      // })
                    }
                  }),
                  fail() {
                    reject()
                  }
                })
              },
              fail() {
                reject()
              }
            })
            // #endif
            // #ifdef H5
            // uni.reLaunch({
            //   url: '/pages/login/login'
            // })
            // #endif
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

function post(obj) {
  return request(obj, 'POST');
}

function get(obj) {
  return request(obj, 'GET');
}

function put(obj) {
  return request(obj, 'PUT');
}

function del(obj) {
  return request(obj, 'DELETE');
}
export {
  post,
  get,
  put,
  del
}
