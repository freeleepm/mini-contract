/*
 * @Author: wudi
 * @Date: 2023-08-29 09:44:56
 * @LastEditors: wudi
 * @LastEditTime: 2023-09-21 09:53:39
 * @Description:
 */
let baseUrl = '';
import { devUrl, testUrl, prodUrl, uatUrl } from './net.config.js';
// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
if (accountInfo.miniProgram.envVersion == 'develop') {
  // 开发版
  baseUrl = devUrl;
}
if (accountInfo.miniProgram.envVersion == 'trial') {
  // 体验版
  baseUrl = testUrl;
}
if (accountInfo.miniProgram.envVersion == 'release') {
  // 正式版
  baseUrl = prodUrl;
}
// #endif

export default {
  baseUrl,
};
