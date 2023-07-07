import {
  compressImage
} from '@/utils/compress.js'
import request from '@/utils/request.js';
/***
  @param [fileList]
   参数示例：
   [{
      path: "http://tmp/6k7p2ZpyEzru43a2e0754a8175458dca10617de53558.png"
      size: 998099
    },
    ...其他参数自定义，上传成功后会照常返回
  ]
  @param 'field' 上传后返回的附件key值 默认url
***/
export function upload(fileList = [], field = 'url') {
  let len = fileList.length,
    backList = [],
    index = 0,
    d = new Date();
  let date = d.getFullYear() + '' + (d.getMonth() + 1) + '' + d.getDate()
  return new Promise((resolve, reject) => {
    request({ // 获取OSS配置
      url: `/upload`,
      method: "GET"
    }).then(oss => {
      if (!fileList.length) {
        resolve([]);
        return
      }

      function handleOss() {
        compressImage(fileList[index]).then(filePath => {
          let lastInx = filePath.lastIndexOf('/');
          let name = filePath.slice(lastInx + 1, filePath.length);
          let key = 'mp-weixin/' + date + '/' + d.getTime() + name
          let uploadTask = uni.uploadFile({
            url: oss.host,
            filePath: filePath,
            name: 'file',
            formData: {
              'policy': oss.policy,
              'key': key,
              'OSSAccessKeyId': oss.accessKeyId,
              'signature': oss.signature,
              'bucketName': oss.bucketName,
              'accessKeySecret': oss.accessKeySecret,
            },
            success: (res) => {
              if (res.statusCode == 204) {
                fileList[index][field] = oss.host + '/' + key
                backList.push(fileList[index])
                index++
                if (index == len) { // 上传完毕
                  resolve(backList);
                } else if (index < len) {
                  handleOss()
                }
              } else {
                reject()
                uni.showToast({
                  title: res.errMsg,
                  icon: 'none'
                })
              }
            },
            fail: (err) => {
              reject()
              uni.showToast({
                title: err.errMsg,
                icon: 'none'
              })
            }
          })
        }).catch(() => {
          reject()
        })
      }
      handleOss()
    })
  })
}