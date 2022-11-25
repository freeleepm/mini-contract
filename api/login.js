import { get,post } from './request.js';
export function register(data){ // 注册
	return post({
		url:`/api/u/register`,
		data
	})
}
export function getCode(data){ // 获取验证码 type:1 -> 登录, 2 -> 重置密码, 3 -> 注册  4 -> 企业解绑
	return get({
		url:`/api/u/${data.phone}/verification-code/${data.type}`
	})
}

export function login(data){ // 密码登录
	return post({
		url:`/api/u/login`,
		data
	})
}
export function loginBySms(data){ // 验证码登录
	return post({
		url:`/api/u/sms-login`,
		data
	})
}
export function reset(data){ // 用户重置密码
	return post({
		url:`/api/u/reset`,
		data
	})
}
export function info(data){ // 查询个人信息
	return get({
		url:`/api/u/info`,
		data
	})
}
export function appletsLogin(data){ // 通过小程序登录
	return post({
		url:`/api/u/third-login`,
		data
	})
}

export function bind(data){ // 绑定小程序
	return post({
		url:`/api/u/third-bind`,
		data
	})
}