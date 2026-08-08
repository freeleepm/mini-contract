#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const requiredSubpackages = [
  'pages/kyc',
  'pages/enterprise',
  'pages/ai-draft',
  'pages/contract-audit',
  'pages/quota'
]
const maxRuntimeLogoBytes = 100 * 1024

function stripJsonComments(source) {
  let result = ''
  let inString = false
  let escaped = false

  for (let index = 0; index < source.length; index += 1) {
    const current = source[index]
    const next = source[index + 1]

    if (inString) {
      result += current
      if (escaped) {
        escaped = false
      } else if (current === '\\') {
        escaped = true
      } else if (current === '"') {
        inString = false
      }
      continue
    }

    if (current === '"') {
      inString = true
      result += current
      continue
    }

    if (current === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') {
        index += 1
      }
      result += '\n'
      continue
    }

    if (current === '/' && next === '*') {
      index += 2
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        index += 1
      }
      index += 1
      continue
    }

    result += current
  }

  return result
}

function readJsonWithComments(filePath) {
  return JSON.parse(stripJsonComments(fs.readFileSync(filePath, 'utf8')))
}

function fail(message) {
  console.error(`FAIL: ${message}`)
  process.exitCode = 1
}

function listPageFiles(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.posix.join(prefix, entry.name)
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      return listPageFiles(absolutePath, relativePath)
    }
    return entry.isFile() && entry.name.endsWith('.uvue')
      ? [relativePath.slice(0, -'.uvue'.length)]
      : []
  })
}

const pagesConfig = readJsonWithComments(path.join(root, 'pages.json'))
const manifest = readJsonWithComments(path.join(root, 'manifest.json'))
const subpackages = pagesConfig.subpackages || pagesConfig.subPackages || []
const subpackageRoots = subpackages.map((item) => item.root)

for (const requiredRoot of requiredSubpackages) {
  if (!subpackageRoots.includes(requiredRoot)) {
    fail(`missing subpackage ${requiredRoot}`)
  }
}

for (const subpackage of subpackages) {
  if (!requiredSubpackages.includes(subpackage.root)) {
    continue
  }
  const configuredPages = subpackage.pages.map((item) => item.path).sort()
  const sourcePages = listPageFiles(path.join(root, subpackage.root)).sort()
  if (configuredPages.join('\n') !== sourcePages.join('\n')) {
    fail(`${subpackage.root} page registration does not match its .uvue files`)
  }
}

const topLevelPages = pagesConfig.pages.map((item) => item.path)
for (const requiredRoot of requiredSubpackages) {
  const duplicatedPage = topLevelPages.find((pagePath) => pagePath.startsWith(`${requiredRoot}/`))
  if (duplicatedPage) {
    fail(`${duplicatedPage} is still included in the main package`)
  }
}

if (manifest['mp-weixin']?.optimization?.subPackages !== true) {
  fail('manifest.json must enable mp-weixin.optimization.subPackages')
}

const runtimeLogoPath = path.join(root, 'static', 'logo.png')
const runtimeLogoBytes = fs.statSync(runtimeLogoPath).size
if (runtimeLogoBytes > maxRuntimeLogoBytes) {
  fail(`static/logo.png is ${(runtimeLogoBytes / 1024).toFixed(1)}KB; expected at most 100KB`)
}

for (const unusedLogo of ['logo0.png', 'logo11.png']) {
  if (fs.existsSync(path.join(root, 'static', unusedLogo))) {
    fail(`unused static/${unusedLogo} is still copied into the main package`)
  }
}

for (const archivedLogo of ['logo-source-1254.png', 'logo0-legacy.png', 'logo11-legacy.png']) {
  if (!fs.existsSync(path.join(root, 'design-assets', 'brand', archivedLogo))) {
    fail(`missing archived design asset design-assets/brand/${archivedLogo}`)
  }
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log('PASS: WeChat main-package configuration and runtime asset budget are valid')
