import request from '@/utils/request.js';

let userInfo = {
  contractList: data => {
    //获取 合同列表
    return request({
      url: `/v2/contract`,
      method: 'GET',
      data,
    });
  },
  personalInformation: () => {
    //获取 个人信息
    return request({
      url: `/u/info`,
      method: 'GET',
    });
  },
  enterpriseList: data => {
    //获取企业列表
    return request({
      url: `/company/v1`,
      method: 'GET',
      data,
    });
  },
  IdentitySwitching: data => {
    //切换身份
    return request({
      url: `/company/role?companyId=${data}`,
      method: 'PUT',
    });
  },
  contractDetails: data => {
    // 合同详情
    return request({
      // url: `/contract/v1/detail/${data}`,
      url: `/v2/contract/${data.contractId}`,
      method: 'GET'
    });
  },
  balanceQuery: () => {
    // 合同详情
    return request({
      url: `/meal/v1/surplus`,
      method: 'GET',
    });
  },
  getCode(data) {
    // 获取验证码 type:1 -> 登录, 2 -> 重置密码, 3 -> 注册  4 -> 企业解绑   5-> 撤销合同
    return request({
      url: `/u/${data.phone}/verification-code/${data.type}`,
      method: 'GET',
    });
  },
  cancellationOfContract(data, contractId) {
    //撤销合同
    return request({
      // url: `/contract/v1/${contractId}/revoke`,
      url: `/v2/contract/${contractId}/revoke`,
      method: 'PUT',
      data,
    });
  },

  changeAvatar(avatarUrl) {
    return request({
      url: '/u/updateHeader?avatarUrl=' + avatarUrl,
      method: 'PUT',
    });
  },
};
export default userInfo;