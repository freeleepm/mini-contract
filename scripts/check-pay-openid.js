const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const quotaApiSource = fs.readFileSync(path.join(root, 'api/quota/index.uts'), 'utf8')
const payPageSource = fs.readFileSync(path.join(root, 'pages/quota/pay.uvue'), 'utf8')

const checks = [
  {
    passed: /interface\s+PayChannelExtras[\s\S]*openid\?:\s*string/.test(quotaApiSource),
    message: '支付 API 应定义包含 openid 的 PayChannelExtras'
  },
  {
    passed: /submitPayOrder\([\s\S]*channelExtras:\s*PayChannelExtras\s*\|\s*null/.test(quotaApiSource),
    message: 'submitPayOrder 应接收可选 channelExtras'
  },
  {
    passed: /channelExtras:\s*channelExtras/.test(quotaApiSource),
    message: '支付请求体应将 channelExtras 传给后端'
  },
  {
    passed: /getSocialUser\(/.test(payPageSource),
    message: '支付页应从当前登录用户的社交绑定查询 openid'
  },
  {
    passed: /wx_pub[\s\S]*SocialType\.WECHAT_MP/.test(payPageSource)
      && /wx_lite[\s\S]*SocialType\.WECHAT_MINI_PROGRAM/.test(payPageSource),
    message: '公众号和小程序支付渠道应映射到正确的社交类型'
  },
  {
    passed: /submitPayOrder\([\s\S]*channelExtras/.test(payPageSource),
    message: '支付页提交订单时应传入 channelExtras'
  }
]

const failures = checks.filter((check) => !check.passed)
if (failures.length > 0) {
  failures.forEach((failure) => console.error(`FAIL: ${failure.message}`))
  process.exit(1)
}

console.log('PASS: 微信支付 openid 提交链路检查通过')
