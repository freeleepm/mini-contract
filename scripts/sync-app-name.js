#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const configPath = path.join(root, 'config', 'app.config.uts')

function readFile(file) {
  return fs.readFileSync(file, 'utf8')
}

function extractConst(source, name) {
  const match = source.match(new RegExp(`export\\s+const\\s+${name}\\s*=\\s*['"]([^'"]+)['"]`))
  if (!match) {
    throw new Error(`Cannot find ${name} in config/app.config.uts`)
  }
  return match[1]
}

const config = readFile(configPath)
const appName = extractConst(config, 'APP_NAME')
const appDescription = extractConst(config, 'APP_SUBTITLE')

const manifestPath = path.join(root, 'manifest.json')
let manifest = readFile(manifestPath)
manifest = manifest
  .replace(/("name"\s*:\s*")[^"]*(")/, `$1${appName}$2`)
  .replace(/("description"\s*:\s*")[^"]*(")/, `$1${appDescription}$2`)
  .replace(/("mode"\s*:\s*")[^"]*(")/, '$1history$2')
  .replace(/("title"\s*:\s*")[^"]*(")/, `$1${appName}$2`)
fs.writeFileSync(manifestPath, manifest)

const packagePath = path.join(root, 'package.json')
let packageJson = readFile(packagePath)
packageJson = packageJson
  .replace(/("name"\s*:\s*")[^"]*(")/, `$1${appName}$2`)
  .replace(/("description"\s*:\s*")[^"]*(")/, `$1${appName}电子合同应用$2`)
fs.writeFileSync(packagePath, packageJson)

const pagesPath = path.join(root, 'pages.json')
let pages = readFile(pagesPath)
pages = pages.replace(/("navigationBarTitleText"\s*:\s*")Contract\.Pro(")/g, `$1${appName}$2`)
fs.writeFileSync(pagesPath, pages)

console.log(`Synced app name: ${appName}`)
