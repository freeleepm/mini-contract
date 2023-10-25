/**
 * 使用 wxToPromise 方法，便于使用 await 处理相关接口
 */
const wxToPromise = (api, option) => {
    // API 存在判断
    if (!api) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
  
      return Promise.reject()
    }
  
    return new Promise((resolve) => {
      api({
        ...option,
        success (res) {
          resolve([res, undefined])
        },
        fail (err) {
          resolve([undefined, err])
        },
      })
    })
  }
  
  /**
   * 请求隐私授权
   * @return 是否已授权
   */
  const requirePrivacyAuthorize = async () => {
    if (typeof wx.requirePrivacyAuthorize === 'function') {
      const [res] = await wxToPromise(wx.requirePrivacyAuthorize)
      if (res) {
  		return true
  	  }
    } else {
      return true
    }
    return false
  }
module.exports = {
  wxToPromise,
  requirePrivacyAuthorize
};