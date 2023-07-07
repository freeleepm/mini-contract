<!--
 * @Description:
 * @LastEditTime: 2022-09-16 16:49:49
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-16 14:59:17
-->
<template>
  <view class="page-base">
    <view class="list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="flex flex-1 item"
        @click="checkIdentity(item)"
      >
        <template v-if="!item.alias">
          <image
            class="img-avatar"
            :src="person.avatarUrl || '../../static/ImgDefAvatar.png'"
          ></image>
          <view class="flex-wrap">
            <view class="text-28 color-base bold width-full">
              {{ person.nickname || '未认证用户' }}
            </view>
            <view v-if="person.authentication" class="tag-auth tag-auth__auth flex-ct text-20">
              <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
              已实名
            </view>

            <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
              <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
              未实名
            </view>
          </view>
        </template>
        <template v-else>
          <image class="img-avatar" src="/static/ImgDefEnterprise.png"></image>
          <view class="flex-wrap">
            <view class="text-28 color-base bold width-full">
              {{ person.nickname || '未认证用户' }}
            </view>
            <view
              v-if="item.authentication === 1 || item.authentication === true"
              class="tag-auth tag-auth__enterauth flex-ct text-20"
            >
              <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
              企业认证
            </view>

            <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
              <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
              未认证
            </view>

            <view class="text-enterprise text-26 color-base">
              {{ item.alias || '' }}
            </view>
          </view>
        </template>
      </view>
    </view>
    <BaseEmpty v-if="!list.length" massage="暂无身份~" style="margin-top: 300rpx"></BaseEmpty>
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      list: [],
      person: {},
    };
  },
  onLoad() {
    this.getEnterprises();
  },
  computed: {
    ...mapState(['userInfo']),
  },
  onPullDownRefresh() {
    this.getEnterprises();
  },
  methods: {
    getPerson() {
      this.person = this.userInfo;
      if (!this.person.companyId) return false;
      return { ...this.person, companyName: '', companyId: '' };
    },
    getEnterprises() {
      userInfoApi
        .enterpriseList({
          pageNum: 1,
          pageSize: 999,
        })
        .then(data => {
          const person = this.getPerson();
          const list = [...data.rows];
          person && list.unshift(person);

          this.list = list;
          uni.stopPullDownRefresh();
        });
    },
    checkIdentity(item) {
      if (item.authentication == 1 || item.authentication === true) {
        uni.showModal({
          content: '确认选择当前身份吗?',
          confirmText: '确认',
          cancelText: '取消',
          confirmColor: '#3277FF',
          cancelColor: '#999999',
          success: res => {
            if (res.confirm) {
              userInfoApi
                .IdentitySwitching(item.companyId || '')
                .then(res => {
                  uni.navigateBack({});
                })
                .catch(() => {
                  uni.showToast({
                    icon: 'none',
                    title: '更改失败',
                  });
                });
            }
          },
        });
      } else {
        uni.showToast({
          icon: 'none',
          title: '个人或企业实名认证未完成，请先实名认证',
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  box-sizing: border-box;
  margin-top: 32rpx;
  padding: 0 32rpx;
  width: 686rpx;
  background: #ffffff;
  border-radius: 12rpx;

  .item {
    padding: 32rpx 0;
    border-bottom: 1px solid #e6e6e6;

    &:last-child {
      border: none;
    }
  }

  .img-avatar {
    flex-shrink: 0;
    margin-right: 16rpx;
    width: 80rpx;
    height: 80rpx;
    border-radius: 8rpx;
  }

  .tag-auth {
    box-sizing: border-box;
    margin-top: 4rpx;
    padding: 0 10rpx;
    height: 36rpx;
    border-radius: 18rpx;
    border: 1px solid currentColor;
  }

  .tag-auth__unauth {
    color: #999999;
  }

  .tag-auth__auth {
    color: #3277ff;
  }

  .tag-auth__enterauth {
    color: #ff731d;
  }

  .icon-change {
    margin-top: 8rpx;
    width: 32rpx;
    height: 32rpx;
  }

  .icon-auth {
    width: 24rpx;
    height: 24rpx;
  }

  .icon-add {
    margin-right: 4rpx;
    width: 48rpx;
    height: 48rpx;
  }

  .text-enterprise {
    flex-basis: 100%;
    margin-top: 16rpx;
    width: 110%;
  }
  .text-28 {
    height: 40rpx;
  }
}
</style>
