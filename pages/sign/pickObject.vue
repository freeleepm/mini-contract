<!--
 * @Description:
 * @LastEditTime: 2022-09-09 20:02:13
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-06 17:28:09
-->
<template>
  <view class="page-base">
    <view style="height: 144rpx"></view>
    <view class="search-box flex-ct">
      <view class="search flex-fs">
        <uni-icons type="search" size="24" class="icon-search flex-ct" color="#3277FF"></uni-icons>
        <input
          type="search"
          class="flex-1 text-28 color-base"
          :placeholder="type === 1 ? '请输入个人手机号' : '请输入企业名称'"
          v-model="name"
          @confirm="comfirm"
        />
        <uni-icons
          v-if="name"
          type="clear"
          size="22"
          class="flex-ct"
          color="#E6E6E6"
          @click="clear"
        ></uni-icons>
      </view>
    </view>

    <template v-if="list.length">
      <view v-if="type === 1" class="list">
        <view class="text-28 color-base bold">签署人</view>
        <view
          v-for="(item, index) in list"
          :key="index"
          class="flex flex-1 item"
          @click="pick(item, 1)"
        >
          <image
            class="img-avatar"
            :src="item.avatarUrl || '../../static/ImgDefAvatar.png'"
          ></image>
          <view class="flex-wrap">
            <view class="text-28 color-base bold width-full">
              {{ item.nickname || '未认证用户' }}
            </view>
            <view v-if="item.authentication" class="tag-auth tag-auth__auth flex-ct text-20">
              <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
              已实名
            </view>

            <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
              <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
              未实名
            </view>
          </view>
        </view>
      </view>

      <view v-if="type === 2" class="list">
        <view class="text-28 color-base bold">签署企业</view>
        <view
          v-for="(item, index) in list"
          :key="index"
          class="flex flex-1 item"
          @click="pick(item, 2)"
        >
          <image class="img-avatar" :src="'../../static/ImgDefEnterprise.png'"></image>
          <view class="flex-wrap">
            <view class="text-28 color-base bold width-full">
              {{ item.nickname || '未认证用户' }}
            </view>
            <view v-if="item.authentication" class="tag-auth tag-auth__enterauth flex-ct text-20">
              <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
              企业认证
            </view>

            <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
              <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
              未认证
            </view>

            <view class="text-enterprise text-26 color-base">
              {{ item.companyName || '阿萨法撒旦法萨芬是打发斯蒂芬斯蒂芬撒防晒啥的' }}
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-bar flex-ct padding-safe">
        <button class="btn-primary text-32" open-type="share">邀请注册</button>
      </view>
    </template>

    <view v-else class="container-empty">
      <BaseEmpty v-if="!list.length && !name" massage="暂无数据~"></BaseEmpty>
      <button class="btn-primary text-32" open-type="share" type="primary">邀请注册</button>
    </view>
  </view>
</template>

<script>
import { find, recent, findCompany } from '@/api/company.js';

export default {
  data() {
    return {
      name: '',
      list: [],
      type: null,
      inSearching: false,
      page: 1,
    };
  },
  onLoad(options) {
    this.type = Number(options.type);
    this.getRecent();
  },
  onShareAppMessage() {
    return {
      title: '嘿，有份合同要你签署一下',
      desc: '',
      path: '/pages/index/index',
      imageUrl: '',
    };
  },
  methods: {
    clear() {
      this.name = '';
      this.inSearching = false;
      if (this.type === 1) {
        // 查询个人
        this.getRecent();
      }
      if (this.type === 2) {
        // 查询企业
        this.getRecent();
      }
    },
    getRecent() {
      recent({
        role: this.type - 1,
      }).then(res => {
        this.list = res.rows || [];
      });
    },
    pick(item, type) {
      if (type === 1) {
        if (!item.authentication) {
          uni.showToast({
            title: '未认证用户不能签署',
            icon: 'none',
          });
          return;
        }

        item.userId = item.id;
        uni.$emit('getSignatory', item);
        uni.navigateBack();
      }
      if (type === 2) {
        if (!item.authentication) {
          uni.showToast({
            title: '未认证企业不能签署',
            icon: 'none',
          });
          return;
        }
        item.userId = item.id;
        uni.$emit('getSignatory', item);
        uni.navigateBack();
      }
    },
    comfirm() {
      if (!this.name.trim()) {
        uni.showToast({
          title: '请输入搜索关键词',
          icon: 'none',
        });
        return;
      }
      if (this.type === 1) {
        // 查询个人
        find({
          phone: this.name,
        }).then(data => {
          this.inSearching = true;
          if (data && data.id) {
            this.list = [];
            this.list.push(data);
          } else {
            this.list = [];
          }
        });
      }
      if (this.type === 2) {
        // 查询企业
        this.list = [];
        this.page = 1;
        this.findCompany();
      }
    },
    findCompany() {
      findCompany({
        content: this.name,
        pageNum: this.page,
        pageSize: 10,
      }).then(res => {
        this.inSearching = true;
        this.list = this.list.concat(res.rows);
        if (res.rows.length > 9) {
          this.page++;
          this.findCompany();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 144rpx;
  background: #ffffff;

  .search {
    box-sizing: border-box;
    padding: 0 21rpx;
    width: 686rpx;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
  }

  .icon-search {
    width: 39rpx;
    margin-right: 20rpx;
  }
}

.list {
  box-sizing: border-box;
  margin-top: 32rpx;
  padding: 32rpx;
  padding-bottom: 0;
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

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 188rpx;
  background: #ffffff;
  box-shadow: 0rpx -1px 20rpx 1px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  width: 598rpx;
  height: 88rpx;
  border-radius: 8rpx;
}

.container-empty {
  margin-top: 50rpx;

  .btn-primary {
    margin-top: 100rpx;
  }
}
</style>
