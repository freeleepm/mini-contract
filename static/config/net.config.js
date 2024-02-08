/**
 * 环境说明
 * mock：mock环境
 * dev：开发环境
 * test：测试环境
 * testUat: 测试用户体验环境
 * uat：用户体验环境
 * prod：生产环境
 *
 * **/
export default {
  // 接口域名配置
  requestUrl: {
    mock: '/api',
    dev: '/api',
    test: '/api',
    testUat: '/api',
    uat: '/api',
    prod: '/api',
  },
  // 业务管理端域名配置
  manageAdminUrls: {
    dev: '',
    test: '',
    prod: ''
  }
};