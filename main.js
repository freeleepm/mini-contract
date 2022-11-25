/*
 * @Description:
 * @LastEditTime: 2022-09-05 16:11:34
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
 */
import App from './App'
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

import common from './common/common.js'
import setting from './common/setting.js'
Vue.prototype.setting = setting
Vue.prototype.common = common
import * as filters from './filters/filters.js'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif