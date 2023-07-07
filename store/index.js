import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import {
  info
} from '@/api/login.js';
import {
  appletsLogin
} from '@/api/login.js';
const store = new Vuex.Store({
  state: {
    userInfo: '',
    token: ''
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUserInfo(state, info) {
      state.userInfo = info;
    }
  },
  actions: {
    login({
      commit
    }) {
      commit('setToken', '')
      commit('setUserInfo', '')
      return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
          provider: 'weixin',
          success: function(loginRes) {
            appletsLogin({
                code: loginRes.code,
              })
              .then(res => {
                if (res.token) {
                  commit('setToken', res.token)
                  commit('setUserInfo', res)
                  resolve(res)
                } else {
                  reject()
                }
              })
              .catch(() => {
                reject()
              });
          },
          fail() {
            reject()
          },
        });
        // #endif
        // #ifndef MP-WEIXIN
        uni.showToast({
          title: '仅支持微信小程序端！',
          icon: 'error'
        })
        // #endif
      })
    },
    uinfo({
      commit
    }) {
      info()
        .then(res => {
          commit('setUserInfo', res)
        })
    }
  }
})
export default store