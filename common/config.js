/*
 * @Description:
 * @LastEditTime: 2022-12-09 16:48:45
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
 */
let baseUrl = '';
import { mockUrl, devUrl, testUrl, prodUrl } from './net.config.js'
// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
if (accountInfo.miniProgram.envVersion == "develop") {// 开发版
  baseUrl = prodUrl;
}
if (accountInfo.miniProgram.envVersion == "trial") {  // 体验版
  baseUrl = prodUrl;
}
if (accountInfo.miniProgram.envVersion == "release") {// 正式版
  baseUrl = prodUrl;
}
// #endif

export default {
  baseUrl,
  imgUrl: 'https://esign.yi-types.com/r/'
};
