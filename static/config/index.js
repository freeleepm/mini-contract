/**
 * 
 * 方便打包之后可以直接修改配置，所以公共配置纳入static内
 * envVersion：当前所在环境
 * 环可选值：mock、dev、test、testUat、uat、prod
 * 
 **/
import netConfit from '@/static/config/net.config.js';
let envVersion = 'dev'
// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
if (accountInfo.miniProgram.envVersion == 'develop') {
  // 开发版
  envVersion = 'dev'
}
if (accountInfo.miniProgram.envVersion == 'trial') {
  // 体验版
  envVersion = 'test'
}
if (accountInfo.miniProgram.envVersion == 'release') {
  // 正式版
  envVersion = 'prod'
}
// #endif
export default {
  baseUrl: netConfit.requestUrl[envVersion],
  manageAdminUrl: netConfit.manageAdminUrls[envVersion] || netConfit.manageAdminUrls['dev']
};