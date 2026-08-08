#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const indexSource = fs.readFileSync(path.join(root, 'pages/ai-draft/index.uvue'), 'utf8')
const chatSource = fs.readFileSync(path.join(root, 'pages/ai-draft/chat.uvue'), 'utf8')

const indexRequiredFragments = [
  'class="ai-disclosure-card"',
  '人工智能生成服务',
  '本功能使用人工智能生成合同内容',
  '生成结果仅供参考',
  '不构成法律意见'
]

const chatRequiredFragments = [
  'class="chat-ai-disclosure"',
  'AI生成内容',
  '本对话使用人工智能生成合同内容',
  '生成结果仅供参考',
  '不构成法律意见',
  '请核对确认后使用'
]

const indexMissing = indexRequiredFragments.filter((fragment) => !indexSource.includes(fragment))
const chatMissing = chatRequiredFragments.filter((fragment) => !chatSource.includes(fragment))
if (indexMissing.length > 0 || chatMissing.length > 0) {
  if (indexMissing.length > 0) {
    console.error(`FAIL: AI 起草首页缺少微信审核要求的显著说明: ${indexMissing.join(', ')}`)
  }
  if (chatMissing.length > 0) {
    console.error(`FAIL: AI 对话页缺少微信审核要求的显著说明: ${chatMissing.join(', ')}`)
  }
  process.exit(1)
}

console.log('PASS: AI 起草首页和对话页均已显著说明人工智能生成属性')
