import request from '@/utils/request.js';

export function create(data) {
  // 新增企业
  return request({
    url: `/company/v1?name=` + data.name,
    method: 'POST',
  });
}
export function company(data) {
  // 我的企业列表
  return request({
    url: `/company/v1`,
    method: 'GET',
    data: data,
  });
}
export function detail(data) {
  // 我的企业详情
  return request({
    url: `/company/details?id=` + data.id,
    method: 'GET',
    data,
  });
}
export function remove(data) {
  // 移除企业
  return request({
    url: `/company/v1/` + data.id + '?verificationCode=' + data.verificationCode,
    method: 'DELETE',
    data,
  });
}
export function seal(data) {
  // 印章列表
  return request({
    url: `/seal/v1?companyId=` + data.id,
    method: 'DELETE',
  });
}
export function auth(data) {
  // 用户认证
  return request({
    url: `/v3/u/auth`,
    method: 'POST',
    data,
  });
}
export function authRecord(data) {
  // 公司认证记录
  return request({
    url: `/v3/company/auth/record`,
    method: 'GET',
  });
}
export function authUserRecord(data) {
  // 个人认证记录
  return request({
    url: `/v3/u/auth/record`,
    method: 'GET',
  });
}
export function backfill(data) {
  // 用户认证回填
  return request({
    url: `/u/backfill`,
    method: 'POST',
    data,
  });
}

export function ocr(data) {
  // ocr
  return request({
    url: `/v3/company/ocr?fileUrl=` + data.license,
    method: 'GET',
  });
}
export function companyAuth(data) {
  // 企业认证
  return request({
    url: `/v3/company/auth`,
    method: 'POST',
    data,
  });
}

export function sign(data) {
  // 合同签订
  return request({
    url: `/v3/contract`,
    method: 'POST',
    data,
  });
}

export function delegate(data) {
  // 企业列表
  return request({
    url: `/company/v1/delegate`,
    method: 'GET',
    data,
  });
}

export function find(data) {
  // 根据手机号查询用户
  return request({
    url: `/u/find/${data.phone}`,
    method: 'GET',
  });
}

export function findCompany(data) {
  // 根据手机号查询用户
  return request({
    url: `/company/v1/delegates`,
    method: 'GET',
    data,
  });
}

export function recent(data) {
  // 查询最近签署的个人/公司
  return request({
    url: `/contract/v1/recent/${data.role}`,
    method: 'GET',
  });
}

export function memberList() {
  // 企业成员列表查询
  return request({
    url: `/v3/company/member/list`,
    method: 'GET',
  });
}

export function memberCreate(data) {
  // 企业成员添加
  return request({
    url: `/v3/company/member`,
    method: 'POST',
    data,
  });
}
export function memberUpdate(data) {
  // 企业成员修改数据
  return request({
    url: `/v2/company/member/${data.id}`,
    method: 'PUT',
    data,
  });
}
export function memberInfo(id) {
  // 企业成员数据
  return request({
    url: `/v2/company/member/${id}`,
    method: 'GET',
  });
}
export function memberDel(id) {
  // 企业成员删除
  return request({
    url: `/v3/company/member/` + id,
    method: 'DELETE',
  });
}

export function getSealList(id) {
  // 印章管理列表
  return request({
    url: `/v3/company/member/${id}/seal`,
    method: 'GET',
  });
}

export function sealAuth(data) {
  // 印章管理列表
  return request({
    url: `/v3/company/member/${data.id}/sealAuth`,
    method: 'POST',
    data,
  });
}

export function unSealAuth(data) {
  // 印章管理列表
  return request({
    url: `/v3/company/member/${data.id}/unSealAuth`,
    method: 'DELETE',
    data,
  });
}

export function getCompanyState(data) {
  // 获取公司认证状态
  return request({
    url: `/v3/company/auth/state?params=${data.params ?? ''}&type=${data.type}`,
    method: 'GET',
  });
}

export function isAdmin() {
  // 判断是否是管理员
  return request({
    url: `/v3/company/member/cm/admin`,
    method: 'GET',
  });
}

export function getAuthCompanyList(data) {
  // 查询已认证的企业列表
  return request({
    url: `/v3/company/auth/list`,
    method: 'GET',
    data,
  });
}
