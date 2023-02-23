/*
 * @Description:
 * @LastEditTime: 2022-12-07 18:27:35
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-12-07 17:59:47
 */
import setting from '../common/setting.js';

export default {
  onShareAppMessage() {
    return {
      ...setting.share,
      success() {
        uni.showToast({
          title: '分享成功',
        });
      },
      fail() {
        uni.showToast({
          title: '分享失败',
          icon: 'none',
        });
      },
    };
  },
  onShareTimeline() {
    return {
      ...setting.share,
      success() {
        uni.showToast({
          title: '分享成功',
        });
      },
      fail() {
        uni.showToast({
          title: '分享失败',
          icon: 'none',
        });
      },
    };
  },
};
