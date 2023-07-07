import request from '@/utils/request.js';
export function list(data) { // 购买套餐列表
  return request({
    url: `/meal/v1`,
    method: "GET",
    data
  })
}
export function count(data) { // 查询用户套餐
  return request({
    url: `/v2/user-meal/count`,
    method: "GET",
    data
  })
}