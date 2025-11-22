#!/bin/bash

# FontAwesome 6.5.1 本地字体文件下载脚本
# 此脚本用于下载最新版本的FontAwesome字体文件到本地

echo "🚀 开始下载 FontAwesome 6.5.1 字体文件..."

# 创建字体目录
mkdir -p static/fonts/fontawesome

# 下载Solid样式字体文件 (包含基础图标)
echo "📥 正在下载 FontAwesome Solid 字体文件..."
curl -L -o static/fonts/fontawesome/fontawesome-webfont.woff2 \
     "https://use.fontawesome.com/releases/v6.5.1/webfonts/fa-solid-900.woff2"

if [ $? -eq 0 ]; then
    SOLID_SIZE=$(stat -c%s static/fonts/fontawesome/fontawesome-webfont.woff2 2>/dev/null || stat -f%z static/fonts/fontawesome/fontawesome-webfont.woff2)
    echo "✅ Solid 字体文件下载成功! (大小: $SOLID_SIZE 字节)"
else
    echo "❌ Solid 字体文件下载失败!"
    exit 1
fi

# 下载Brands样式字体文件 (包含品牌图标，如支付宝、微信等)
echo "📥 正在下载 FontAwesome Brands 字体文件..."
curl -L -o static/fonts/fontawesome/fontawesome-brands.woff2 \
     "https://use.fontawesome.com/releases/v6.5.1/webfonts/fa-brands-400.woff2"

if [ $? -eq 0 ]; then
    BRANDS_SIZE=$(stat -c%s static/fonts/fontawesome/fontawesome-brands.woff2 2>/dev/null || stat -f%z static/fonts/fontawesome/fontawesome-brands.woff2)
    echo "✅ Brands 字体文件下载成功! (大小: $BRANDS_SIZE 字节)"
else
    echo "❌ Brands 字体文件下载失败!"
    exit 1
fi

echo ""
echo "🎯 FontAwesome 6.5.1 本地化配置完成!"
echo ""
echo "📱 接下来请:"
echo "   1. 重启你的 uni-app 项目"
echo "   2. 在登录页面查看图标是否正常显示"
echo "   3. 如有问题，请查看 static/fonts/fontawesome/README.md"
echo ""
echo "🎨 新版本支持的图标示例:"
echo "   <text class=\"fa-brands fa-weixin\"></text>      # 微信图标"
echo "   <text class=\"fa-brands fa-alipay\"></text>      # 支付宝图标 (官方!)"
echo "   <text class=\"fa-solid fa-user\"></text>         # 用户图标"
echo "   <text class=\"fa-solid fa-lock\"></text>         # 锁定图标"
echo ""
echo "🆕 FontAwesome 6.x 新特性:"
echo "   • 7000+ 图标 (相比 4.7 的 600+)"
echo "   • 官方支付宝图标支持"
echo "   • 更好的性能 (WOFF2 格式)"
echo "   • 更丰富的图标样式"
echo ""
echo "✨ 享受最新版本的 FontAwesome 图标吧!"