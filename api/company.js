import { get,post,del } from './request.js';
export function create(data){ // 新增企业
	return post({
		url:`/api/company/v1?name=`+data.name
	})
}
export function company(data){ // 我的企业列表
	return get({
		url:`/api/company/v1`,
		data: data
	})
}
export function detail(data){ // 我的企业详情
	return get({
		url:`/api/company/details?id=`+data.id,
		data
	})
}
export function remove(data){ // 移除企业
	return del({
		url:`/api/company/v1/`+data.id+'?verificationCode='+data.verificationCode,
		data
	})
}
export function seal(data){ // 印章列表
	return del({
		url:`/api/seal/v1?companyId=`+data.id
	})
}
export function auth(data){ // 用户认证
	return post({
		url:`/api/u/auth`,
		data
	})
}
export function backfill(data){ // 用户认证回填
	return post({
		url:`/api/u/backfill`,
		data
	})
}

export function ocr(data){ // ocr
	return post({
		url:`/api/company/ocr`,
		data
	})
}
export function companyAuth(data){ // 企业认证
	return post({
		url:`/api/company/auth`,
		data
	})
}

export function sign(data){ // 合同签订
	return post({
		url:`/api/contract/v1`,
		data
	})
}

export function delegate(data){ // 企业列表
	return get({
		url:`/api/company/v1/delegate`,
		data
	})
}

export function find(data){ // 根据手机号查询用户
	return get({
		url:`/api/u/find/${data.phone}`,
	})
}

export function findCompany(data){ // 根据手机号查询用户
	return get({
		url:`/api/company/v1/delegates`,
		data
	})
}

export function recent(data){ // 查询最近签署的个人/公司
	return get({
		url:`/api/contract/v1/recent/${data.role}`,
	})
}

