import { get,post, put, del } from './request.js';
export function list(data){ // 印章列表
	return get({
		url:`/api/seal/v1`,
		data
	})
}
export function getCode(data){ // 获取认证链接
	return post({
		url:`/api/seal/v1/oauth2-index`,
		data
	})
}
export function createImage(data){ // 获取印章上传地址
	return post({
		url:`/api/seal/v1/create-image`,
		data
	})
}
export function getToken(data){ // 获取token
	return post({
		url:`/api/seal/v1/oauth2-access_token`,
		data
	})
}
export function setDefault(data){ // 设置默认印章
	return put({
		url:`/api/seal/v1/organizations/set-default?sealId=${data.sealId}&token=${data.token}`,
		data
	})
}
export function handleDelete(data){ // 删除印章
	return del({
		url:`/api/seal/v1/organizations/delete?sealId=${data.sealId}&token=${data.token}`,
		data
	})
}

export function pay(data){ // 支付
	return post({
		url:`/api/meal/v1/pay/meal`,
		data
	})
}

export function list2(data){ // 印章列表
	return get({
		url:`/api/seal/v1/organizations/list`,
		data
	})
}
