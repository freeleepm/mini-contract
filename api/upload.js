/*
 * @Description:
 * @LastEditTime: 2022-09-09 16:34:38
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
 */
import { get } from './request.js';
import config from '../common/config.js';
export function upload(file, url = '/api/upload/v1') {
  // #ifdef MP-WEIXIN
  url = config.baseUrl + url;
  // #endif
  let Quality = 80;
  if (file.size > 2097152) {
    // 2M -> 1M
    Quality = 50;
  }
  if (file.size > 5242880) {
    // 5M -> 2.5M
    Quality = 20;
  }
  if (file.size > 10485760) {
    // 10M-> 1M
    Quality = 10;
  }
  if (file.size > 10485760) {
    // 上限
    uni.showToast({
      title: '文件最大10M',
      icon: 'none',
    });
    resolve(false);
    return;
  }
  return new Promise((resolve, reject) => {
    // #ifdef H5
    uni.uploadFile({
      url: url,
      filePath: file.path,
      name: 'file',
      dataType: 'json',
      header: {
        'x-access-token': uni.getStorageSync('userInfo').token,
      },
      success: function (uploadFileRes) {
        if (uploadFileRes.data) {
          if (typeof uploadFileRes.data == 'string')
            uploadFileRes.data = JSON.parse(uploadFileRes.data);
          if (uploadFileRes.data.data) resolve(uploadFileRes.data.data);
          else {
            reject();
            uni.showToast({
              title: uploadFileRes.data?.message,
              icon: 'none',
            });
          }
        } else {
          reject();
          uni.showToast({
            title: '上传失败！',
            icon: 'none',
          });
        }
      },
      fail() {
        reject();
      },
    });
    // #endif
    // #ifndef H5
    uni.compressImage({
      src: file.path,
      quality: Quality,
      success(res2) {
        let filePath = '';
        if (uni.getSystemInfoSync().platform == 'devtools') {
          filePath = file.path;
        } else {
          filePath = res2.tempFilePath;
        }
        uni.uploadFile({
          url: url,
          filePath: filePath,
          name: 'file',
          dataType: 'json',
          header: {
            'x-access-token': uni.getStorageSync('userInfo').token,
          },
          success: function (uploadFileRes) {
            if (uploadFileRes.data) {
              if (typeof uploadFileRes.data == 'string')
                uploadFileRes.data = JSON.parse(uploadFileRes.data);
              if (uploadFileRes.data.data) resolve(uploadFileRes.data.data);
              else {
                reject();
                uni.showToast({
                  title: uploadFileRes.data?.message,
                  icon: 'none',
                });
              }
            } else {
              reject();
              uni.showToast({
                title: '上传失败！',
                icon: 'none',
              });
            }
          },
          fail: function (res) {
            console.log('fail');
            reject();
            console.log(res);
          },
        });
      },
      fail: function (res) {
        uni.uploadFile({
          url: url,
          filePath: file.path,
          name: 'file',
          dataType: 'json',
          header: {
            'x-access-token': uni.getStorageSync('userInfo').token,
          },
          success: function (uploadFileRes) {
            if (uploadFileRes.data) {
              if (typeof uploadFileRes.data == 'string')
                uploadFileRes.data = JSON.parse(uploadFileRes.data);
              if (uploadFileRes.data.data) resolve(uploadFileRes.data.data);
              else {
                reject();
                uni.showToast({
                  title: uploadFileRes.data?.message || '上传失败！',
                  icon: 'none',
                });
              }
            } else {
              reject();
              uni.showToast({
                title: '上传失败！',
                icon: 'none',
              });
            }
          },
          fail() {
            reject();
          },
        });
      },
    });
    // #endif
  });
}
