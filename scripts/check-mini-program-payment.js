#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const payPageSource = fs.readFileSync(path.join(root, 'pages/quota/pay.uvue'), 'utf8')

const checks = [
  {
    passed: /selectedChannel\s*===\s*['"]wx_lite['"][\s\S]*invokeMiniProgramPayment\(res\)/.test(payPageSource),
    message: '微信小程序待支付响应应进入原生收银台调用'
  },
  {
    passed: /JSON\.parse\(response\.displayContent\)/.test(payPageSource),
    message: '支付页应解析后端返回的 displayContent'
  },
  {
    passed: /wx\.requestPayment\(\{[\s\S]*timeStamp:[\s\S]*nonceStr:[\s\S]*package:\s*paymentParams\.packageValue[\s\S]*signType:[\s\S]*paySign:/.test(payPageSource),
    message: '应将后端微信支付参数完整传给 wx.requestPayment'
  },
  {
    passed: /\n\s*}\);\n\s*}\);\n\s*\/\/ #endif/.test(payPageSource),
    message: 'wx.requestPayment 和外层 Promise 都必须完整闭合'
  },
  {
    passed: /errMsg\.indexOf\(['"]cancel['"]\)[\s\S]*resolve\(false\)/.test(payPageSource),
    message: '用户取消微信支付时应返回可重试状态，而不是系统错误'
  },
  {
    passed: /const\s+paymentAccepted\s*=\s*await\s+this\.invokeMiniProgramPayment\(res\)[\s\S]*if\s*\(!paymentAccepted\)[\s\S]*return[\s\S]*this\.startPolling\(\)/.test(payPageSource),
    message: '只有收银台受理成功后才应启动支付状态轮询'
  }
]

const failures = checks.filter((check) => !check.passed)
if (failures.length > 0) {
  failures.forEach((failure) => console.error(`FAIL: ${failure.message}`))
  process.exit(1)
}

console.log('PASS: 微信小程序原生支付调起链路检查通过')
