/*
 * @Description:
 * @LastEditTime: 2022-12-07 18:09:29
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
 */
import App from './App';
import store from './store/index.js'

// #ifndef VUE3
import Vue from 'vue';
import widthShare from './mixins/share';
Vue.config.productionTip = false;
Vue.mixin(widthShare)
App.mpType = 'app';
const app = new Vue({
  store,
  ...App,
});
app.$mount();
// #endif

import common from './utils/common.js';
import setting from './config/setting.js';
Vue.prototype.setting = setting;
Vue.prototype.common = common;
import * as filters from './filters/filters.js';
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// #ifdef VUE3
import {
  createSSRApp
} from 'vue';
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
    store
  };
}
// #endif