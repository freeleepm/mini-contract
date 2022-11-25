import { get, post, put, del } from './request.js';

let userInfo = {
  contractList: data => {
    //获取 合同列表
    return get({
      url: `/api/contract/v1`,
      data,
    });
  },
  personalInformation: () => {
    //获取 个人信息
    return get({
      url: `/api/u/info`,
    });
  },
  enterpriseList: data => {
    //获取企业列表
    return get({
      url: `/api/company/v1`,
      data,
    });
  },
  IdentitySwitching: data => {
    //切换身份
    return put({
      url: `/api/company/role?companyId=${data}`,
    });
  },
  contractDetails: data => {
    // 合同详情
    return get({
      url: `/api/contract/v1/detail/${data}`,
    });
  },
  balanceQuery: () => {
    // 合同详情
    return get({
      url: `/api/meal/v1/surplus`,
    });
  },
  getCode(data) {
    // 获取验证码 type:1 -> 登录, 2 -> 重置密码, 3 -> 注册  4 -> 企业解绑   5-> 撤销合同
    return get({
      url: `/api/u/${data.phone}/verification-code/${data.type}`,
    });
  },
  cancellationOfContract(data, contractId) {
    //撤销合同
    return put({
      url: `/api/contract/v1/${contractId}/revoke`,
      data,
    });
  },

  changeAvatar(avatarUrl) {
    return put({
      url: '/api/u/updateHeader?avatarUrl=' + avatarUrl,
    });
  },
};
export default userInfo;
