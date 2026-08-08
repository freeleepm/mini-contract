#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const loginSource = fs.readFileSync(path.join(rootDir, 'pages/login/index.uvue'), 'utf8')
const registerSource = fs.readFileSync(path.join(rootDir, 'pages/register/index.uvue'), 'utf8')

let failed = false

function check(condition, message) {
  if (condition) {
    return
  }
  failed = true
  console.error(`FAIL: ${message}`)
}

function count(source, value) {
  return source.split(value).length - 1
}

for (const [pageName, source] of [
  ['密码登录页', loginSource],
  ['验证码登录页', registerSource]
]) {
  check(source.includes('agreementAccepted: false'), `${pageName}必须默认不勾选协议`)
  check(source.includes('我已阅读并同意'), `${pageName}必须展示主动勾选文案`)
  check(!source.includes('登录即表示您已同意'), `${pageName}不能再使用默认同意文案`)
  check(source.includes('ensureAgreementAccepted(): boolean'), `${pageName}必须提供统一的协议校验`)
  check(source.includes('!this.agreementAccepted'), `${pageName}主按钮必须受协议勾选状态控制`)
}

check(
  count(loginSource, 'if (!this.ensureAgreementAccepted()) return') >= 4,
  '密码登录页的密码、微信、手机号和支付宝入口都必须先校验协议'
)
check(
  loginSource.includes('v-if="agreementAccepted"') &&
    loginSource.includes('open-type="getPhoneNumber"') &&
    loginSource.includes('@tap="promptAgreement"'),
  '未勾选时不能挂载微信小程序手机号授权按钮'
)
check(
  count(registerSource, 'if (!this.ensureAgreementAccepted()) return') >= 2,
  '验证码发送和验证码登录都必须先校验协议'
)

if (failed) {
  process.exit(1)
}

console.log('PASS: 登录协议主动勾选和授权拦截检查通过')
