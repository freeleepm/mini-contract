#!/usr/bin/env node

/**
 * 同步产品名称到 JSON 配置文件
 * 
 * 从 config/app.config.uts 读取 APP_NAME，自动更新以下文件：
 *   - manifest.json  → "name" / web > "title"
 *   - pages.json     → globalStyle 及各页面的 "navigationBarTitleText"
 *   - package.json   → "name" / "description" 中的产品名称
 * 
 * 用法：
 *   node scripts/sync-app-name.js
 *   
 * 建议在修改 config/app.config.uts 中的 APP_NAME 后执行此脚本。
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const ROOT = path.resolve(__dirname, '..');

// ==================== 工具函数 ====================

/** 转义正则特殊字符 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 在文件内容中，按 key 替换 JSON 字符串值
 * 支持带注释的 JSON（manifest.json / pages.json）
 * 
 * @param {string} content 文件内容
 * @param {string} key JSON key 名（如 "name"、"title"）
 * @param {string} oldValue 旧值
 * @param {string} newValue 新值
 * @returns {{ content: string, count: number }}
 */
function replaceJsonValue(content, key, oldValue, newValue) {
  const regex = new RegExp(
    `("${escapeRegex(key)}"\\s*:\\s*")${escapeRegex(oldValue)}(")`,
    'g'
  );
  let count = 0;
  const result = content.replace(regex, (match, prefix, suffix) => {
    count++;
    return prefix + newValue + suffix;
  });
  return { content: result, count };
}

// ==================== 1. 从 app.config.uts 解析 APP_NAME ====================

function readAppName() {
  const configPath = path.join(ROOT, 'config', 'app.config.uts');
  const content = fs.readFileSync(configPath, 'utf-8');

  // 匹配 export const APP_NAME = 'xxx' 或 "xxx"
  const match = content.match(/export\s+const\s+APP_NAME\s*=\s*['"](.+?)['"]/);
  if (!match) {
    console.error('❌ 无法从 config/app.config.uts 中解析 APP_NAME');
    process.exit(1);
  }
  return match[1];
}

// ==================== 2. 探测当前名称 ====================

/**
 * 从 manifest.json 中提取当前 "name" 值（支持带注释的 JSON）
 */
function getCurrentName() {
  const content = fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf-8');
  const match = content.match(/"name"\s*:\s*"(.+?)"/);
  return match ? match[1] : null;
}

// ==================== 3. 更新各文件 ====================

function updateFile(relPath, replacements) {
  const fullPath = path.join(ROOT, relPath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let totalCount = 0;
  const details = [];

  for (const { key, oldValue, newValue } of replacements) {
    const { content: updated, count } = replaceJsonValue(content, key, oldValue, newValue);
    content = updated;
    if (count > 0) {
      totalCount += count;
      details.push(`${key} ×${count}`);
    }
  }

  if (totalCount > 0) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`  ✅ ${relPath} → ${details.join(', ')}`);
  } else {
    console.log(`  ⏭  ${relPath}（无需更新）`);
  }
}

function updateManifest(oldName, newName) {
  updateFile('manifest.json', [
    { key: 'name', oldValue: oldName, newValue: newName },
    { key: 'title', oldValue: oldName, newValue: newName },
  ]);
}

function updatePagesJson(oldName, newName) {
  updateFile('pages.json', [
    { key: 'navigationBarTitleText', oldValue: oldName, newValue: newName },
  ]);
}

function updatePackageJson(oldName, newName) {
  // package.json 是标准 JSON，可以用 JSON.parse
  const fullPath = path.join(ROOT, 'package.json');
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  let changed = false;
  const details = [];

  if (data.name && data.name === oldName) {
    data.name = newName;
    changed = true;
    details.push('name');
  }
  if (data.description && data.description.includes(oldName)) {
    data.description = data.description.replace(
      new RegExp(escapeRegex(oldName), 'g'),
      newName
    );
    changed = true;
    details.push('description');
  }

  if (changed) {
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`  ✅ package.json → ${details.join(', ')}`);
  } else {
    console.log('  ⏭  package.json（无需更新）');
  }
}

// ==================== 4. 主流程 ====================

function main() {
  const newName = readAppName();
  const oldName = getCurrentName();

  console.log('');
  console.log(`🔄 同步产品名称: "${oldName}" → "${newName}"`);
  console.log('');

  if (oldName === newName) {
    console.log('  ✅ 所有 JSON 配置已是最新，无需修改。');
    console.log('');
    return;
  }

  updateManifest(oldName, newName);
  updatePagesJson(oldName, newName);
  updatePackageJson(oldName, newName);

  console.log('');
  console.log('🎉 同步完成！');
  console.log('');
}

main();
