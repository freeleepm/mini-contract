export function compressImage(file) {
	return new Promise((resolve, reject) => {
		console.log('压缩前大小：'+file.size/1024/1024+'M')
		let Quality = 80
		if(file.size > 2097152){ // 2M
			Quality = 50
		}
		if(file.size > 5242880){ // 5M
			Quality = 20
		}
		if(file.size > 8388608){ // 8M
			Quality = 10
		}
		if(file.size > 10485760){ // 上限
			uni.showToast({
				title: '文件最大10M',
				icon: 'none'
			})
			reject()
			return
		}
		uni.compressImage({
			src: file.path,
			quality: Quality,
			success(res2) {
				let filePath = ''
				if(uni.getSystemInfoSync().platform == 'devtools'){
					console.log('模拟器无压缩，该图上传原图！')
					filePath = file.path
				}else{
					console.log('压缩成功：'+Quality)
					filePath = res2.tempFilePath
				}
				resolve(filePath)
			},
			fail: function(res) {
				console.log('压缩失败，可能原因：1，该文件不是图片；2，该情景是模拟器')
				resolve(file.path)
			}
		})
	})
}