import { get,post } from './request.js';
export function list(data){ // 购买套餐列表
	return get({
		url:`/api/meal/v1`,
		data
	})
}