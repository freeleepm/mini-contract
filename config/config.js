let baseUrl = '';
import {
  mockUrl,
  devUrl,
  testUrl,
  prodUrl
} from './net.config.js'
// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
if (accountInfo.miniProgram.envVersion == "develop") { // 开发版
  baseUrl = devUrl;
}
if (accountInfo.miniProgram.envVersion == "trial") { // 体验版
  baseUrl = prodUrl;
}
if (accountInfo.miniProgram.envVersion == "release") { // 正式版
  baseUrl = prodUrl;
}
// #endif

export default {
  baseUrl,
};