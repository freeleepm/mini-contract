/*
 * @Author: wudi
 * @Date: 2023-08-29 09:44:38
 * @LastEditors: wudi
 * @LastEditTime: 2023-12-12 16:15:25
 * @Description:
 */
import request from '@/utils/request.js';

export function register(data) {
  // 注册
  return request({
    url: `/u/register`,
    method: 'POST',
    data,
  });
}
export function getCode(data) {
  // 获取验证码 type:1 -> 登录, 2 -> 重置密码, 3 -> 注册  4 -> 企业解绑
  return request({
    url: `/u/${data.phone}/verification-code/${data.type}`,
    method: 'GET',
  });
}

export function login(data) {
  // 密码登录
  return request({
    url: `/u/login`,
    method: 'POST',
    data,
  });
}
export function loginBySms(data) {
  // 验证码登录
  return request({
    url: `/u/sms-login`,
    method: 'POST',
    data,
  });
}
export function reset(data) {
  // 用户重置密码
  return request({
    url: `/u/reset`,
    method: 'POST',
    data,
  });
}
export function info() {
  // 查询个人信息
  return request({
    url: `/v3/u/info`,
    method: 'GET',
  });
}
export function appletsLogin(data) {
  // 通过小程序登录
  return request({
    url: `/u/third-login`,
    method: 'POST',
    data,
  });
}

export function bind(data) {
  // 绑定小程序
  return request({
    url: `/u/third-bind`,
    method: 'POST',
    data,
  });
}

export function logout() {
  // 退出登录
  return request({
    url: `/v3/u/logout`,
    method: 'POST',
    // data,
  });
}
