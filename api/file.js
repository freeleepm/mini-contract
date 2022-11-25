import { get,post,del } from './request.js';
export function list(data){ // 文件列表
	return get({
		url:`/api/attachment/v1`,
		data
	})
}
export function create(data){ // 用户新增文件
	return post({
		url:`/api/attachment/v1`,
		data
	})
}

export function remove(data){ // 删除文件
	return del({
		url:`/api/attachment/v1?id=`+data.id
	})
}