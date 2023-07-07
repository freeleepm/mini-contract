import request from '@/utils/request.js';
export function list(data) { // 文件列表
  return request({
    url: `/v2/attachment`,
    method: "GET",
    data
  })
}
export function create(data) { // 用户新增文件
  return request({
    url: `/v2/attachment`,
    method: "POST",
    data
  })
}

export function remove(data) { // 删除文件
  return request({
    url: `/v2/attachment?id=` + data.id,
    method: "DELETE",
  })
}

export function templateList(data) { // 签署模板列表
  return request({
    url: `/contract-template`,
    method: "GET",
    data
  })
}

export function templateDetail(templateId) { // 签署模板详情
  return request({
    url: `/contract-template/${templateId}`,
    method: "GET",
  })
}