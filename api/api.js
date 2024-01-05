/*
 * @Author: wudi
 * @Date: 2023-08-29 09:44:38
 * @LastEditors: wudi
 * @LastEditTime: 2023-12-12 16:15:16
 * @Description:
 */
import request from '@/utils/request.js';

let userInfo = {
  contractList: data => {
    //获取 合同列表
    return request({
      url: `/v4/contract`,
      method: 'GET',
      data,
    });
  },
  personalInformation: () => {
    //获取 个人信息
    return request({
      url: `/v3/u/info`,
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
      url: `/v3/u/switch-identities`,
      method: 'PUT',
      data,
    });
  },
  contractDetails: data => {
    // 合同详情
    return request({
      // url: `/contract/v1/detail/${data}`,
      url: `/v4/contract/${data.contractId}`,
      method: 'GET',
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
      url: `/v3/contract/${contractId}/revoke`,
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
  // 获取认证状态
  getAuthState(data) {
    return request({
      url: `/v3/u/auth/state?params=${data.params ?? ''}&type=${data.type}`,
      method: 'GET',
    });
  },
  // 用户签署方记录列表查询
  signerRecordList: data => {
    return request({
      url: `/v1/u/con-signer`,
      method: 'GET',
      data,
    });
  },

  // 删除用户签署方记录
  delSignerRecord: data => {
    return request({
      url: `/v1/u/con-signer/` + data.id,
      method: 'DELETE',
    });
  },

  // 查询已认证的用户
  getAuthPersonList(data) {
    return request({
      url: `/v3/u/auth/list`,
      method: 'GET',
      data,
    });
  },
};

export default userInfo;
