#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const pagesSource = fs.readFileSync(path.join(root, 'pages.json'), 'utf8')
const authSource = fs.readFileSync(path.join(root, 'api/auth.uts'), 'utf8')
const homeSource = fs.readFileSync(path.join(root, 'pages/index/index.uvue'), 'utf8')
const loginSource = fs.readFileSync(path.join(root, 'pages/login/index.uvue'), 'utf8')
const contractSource = fs.readFileSync(path.join(root, 'pages/contract-manage/index.uvue'), 'utf8')
const profileSource = fs.readFileSync(path.join(root, 'pages/profile/index.uvue'), 'utf8')

let failed = false

function check(condition, message) {
  if (condition) return
  failed = true
  console.error(`FAIL: ${message}`)
}

function count(source, value) {
  return source.split(value).length - 1
}

const firstPageMatch = pagesSource.match(/"pages"\s*:\s*\[\s*\{\s*"path"\s*:\s*"([^"]+)"/)
check(firstPageMatch?.[1] === 'pages/index/index', 'pages.json 的首个页面必须是首页')

check(
  authSource.includes('export function requireLogin('),
  '认证工具必须提供统一的 requireLogin 登录守卫'
)
check(
  authSource.includes('redirectUrl: string ='),
  '现有 checkAuthAndRedirect 必须兼容登录后回跳目标'
)
check(
  homeSource.includes('isLoggedIn: false') && homeSource.includes('initializeHome(): Promise<void>'),
  '首页必须显式区分游客态与登录态初始化'
)
check(
  homeSource.includes('requireLogin('),
  '首页业务入口必须通过统一登录守卫'
)
check(
  homeSource.includes('syncHomeTabBar(): void') &&
    homeSource.includes('uni.hideTabBar(') &&
    homeSource.includes('class="guest-tab-bar"'),
  '游客首页必须隐藏原生 TabBar，使用可在跳页前鉴权的游客导航'
)
check(
  homeSource.includes("handleGuestTabClick('/pages/contract-manage/index')") &&
    homeSource.includes("handleGuestTabClick('/pages/profile/index')") &&
    homeSource.includes('requireLogin(path, false)'),
  '游客点击合同或个人中心时必须直接进入登录页，不能先切换受保护 Tab'
)
check(
  loginSource.includes('isTabBarPage(') && loginSource.includes('uni.switchTab({ url: targetPath })'),
  '登录回跳必须识别并切换到 TabBar 页面'
)
check(
  count(contractSource, "checkAuthAndRedirect(false, '/pages/contract-manage/index')") === 1 &&
	contractSource.includes('authenticatedInitialized: false') &&
	contractSource.includes('uni.showTabBar('),
	'合同管理只能在 onShow 导航登录，并支持登录后的首次初始化'
)
check(
  count(profileSource, "checkAuthAndRedirect(false, '/pages/profile/index')") === 1 &&
	profileSource.includes('authenticatedInitialized: false') &&
	profileSource.includes('uni.showTabBar('),
	'个人中心只能在 onShow 导航登录，并支持登录后的首次初始化'
)

if (failed) process.exit(1)

console.log('PASS: 游客首页、按需登录和登录回跳检查通过')
