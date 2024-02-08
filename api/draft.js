import request from '@/utils/request.js';
export function save(data) {
  return request({
    url: `/mgt/v1/draft`,
    method: 'POST',
    data,
  });
}
export function edit(data) {
  return request({
    url: `/mgt/v1/draft/${data.id}`,
    method: 'PUT',
    data,
  });
}
export function list(data) {
  return request({
    url: `/mgt/v1/draft`,
    method: 'GET',
    data,
  });
}
export function detail(id) {
  return request({
    url: `/mgt/v1/draft/${id}`,
    method: 'GET'
  });
}
export function del(id) {
  return request({
    url: `/mgt/v1/draft/${id}`,
    method: 'DELETE'
  });
}