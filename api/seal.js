/*
 * @Author: wudi
 * @Date: 2023-08-29 09:44:38
 * @LastEditors: wudi
 * @LastEditTime: 2023-10-25 14:07:51
 * @Description:
 */
import request from '@/utils/request.js';

export function list(data) {
  // 印章列表
  return request({
    url: `/seal/v1`,
    method: 'GET',
    data,
  });
}
export function getCode(data) {
  // 获取认证链接
  return request({
    url: `/seal/v1/oauth2-index`,
    method: 'POST',
    data,
  });
}
export function createImage(data) {
  // 获取印章上传地址
  return request({
    url: `/seal/v1/create-image`,
    method: 'POST',
    data,
  });
}
export function getToken(data) {
  // 获取token
  return request({
    url: `/seal/v1/oauth2-access_token`,
    method: 'POST',
    data,
  });
}
export function setDefault(data) {
  // 设置默认印章
  return request({
    url: `/seal/v1/organizations/set-default?sealId=${data.sealId}&token=${data.token}`,
    method: 'PUT',
    data,
  });
}
export function handleDelete(data) {
  // 删除印章
  return request({
    url: `/seal/v1/organizations/delete?sealId=${data.sealId}&token=${data.token}`,
    method: 'DELETE',
    data,
  });
}

export function pay(data) {
  // 支付
  return request({
    url: `/v2/meal/buy`,
    method: 'POST',
    data,
  });
}

export function list2(data) {
  // 印章列表
  return request({
    url: `/seal/v1/organizations/list`,
    method: 'GET',
    data,
  });
}

export function meallist(data) {
  // 查询套餐列表
  return request({
    url: `/v2/meal`,
    method: 'GET',
  });
}

export function getSealAuthUrl(seal) {
  // 获取印章授权链接
  return request({
    url: `/v3/company/member/${seal.id}/sealAuthUrl/${seal.sealId}`,
    method: 'GET',
  });
}
