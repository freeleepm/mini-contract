<template>
  <view class="group">
    <text class="text-26 color-grey-minor">签署方</text>
    <view class="row" v-for="(item, i) in signers" :key="i">
      <view v-if="item.type === ''" class="flex-ct width-full">
        <view
          class="flex-ct add-item"
          @click="
            current = i;
            $refs.addSignerRef.open(0);
          "
        >
          <image class="icon-add" src="@/static/IconMan.png"></image>
          <text class="text-26 color-base">添加个人</text>
        </view>
        <view class="line-vertical"></view>
        <view
          class="flex-ct add-item"
          @click="
            current = i;
            $refs.addSignerRef.open(1);
          "
        >
          <image class="icon-add" src="@/static/IconEnterprise2.png"></image>
          <text class="text-26 color-base">添加企业</text>
        </view>
      </view>
      <view v-else class="flex-sb">
        <!-- 企业 -->
        <view v-if="item.type === 1" class="flex flex-1">
          <image class="img-avatar" src="/static/ImgDefEnterprise.png"></image>
          <view class="flex-1">
            <view class="text-28 color-base bold width-full">
              {{ item.company.agentName }}
            </view>
            <view class="text-28 color-grey-minor" style="margin: 10rpx 0">
              {{ item.company.agentMobile }}
            </view>
            <view class="text-28 color-base">
              {{ item.company.name }}
            </view>
          </view>
        </view>
        <!-- 个人 -->
        <view v-if="item.type === 0" class="flex flex-1">
          <image class="img-avatar" src="/static/ImgDefAvatar.png"></image>
          <view class="flex-wrap">
            <view class="text-28 color-base bold width-full">
              {{ item.person.name }}
            </view>
            <view class="text-28 color-grey-minor" style="margin: 10rpx 0 0">
              {{ item.person.mobile }}
            </view>
          </view>
        </view>

        <view @click="del(i)" class="flex-col" style="padding-left: 20rpx">
          <image class="icon-change" src="@/static/IconDelete.png"></image>
          <view class="text-24 color-base-minor">删除</view>
        </view>
      </view>
    </view>

    <view class="add-btn color-primary text-28" @click="addSign" v-if="signers.length < 10">
      +添加签署方
    </view>
    <addSigner ref="addSignerRef" @change="onChange" :messageInfo="messageInfo" />
  </view>
</template>

<script>
import { addSigner } from './addSigner';
import { mapState } from 'vuex';
export default {
  components: { addSigner },
  data() {
    return {
      current: -1,
      signers: [
        // {
        //   type: '', // 类型(0:个人;1:公司;)
        //   person: {
        //     name: '', // 用户名
        //     mobile: '', // 手机号
        //   },
        //   company: {
        //     name: '', // 公司名
        //     agentName: '', // 经办人姓名
        //     agentMobile: '', // 经办人手机
        //   },
        // },
      ],
    };
  },
  props: {
    currentSigner: {
      type: Array,
      default: () => [],
    },
    messageInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(['token']),
  },
  methods: {
    del(i) {
      var that = this;
      uni.showModal({
        content: '确认删除当前签署方吗?',
        confirmText: '确认',
        cancelText: '取消',
        confirmColor: '#dd524d',
        cancelColor: '#999999',
        success: function (res) {
          if (res.confirm) {
            that.signers.splice(i, 1);
            that.$emit('change', that.signers);
          }
        },
      });
    },
    onChange(e) {
      let flag = false;
      if (this.signers.length) {
        this.signers.forEach(item => {
          console.log('item.company.agentMobile :', item.company.agentMobile);
          console.log('item.person.mobile :', item.person.mobile);
          console.log('e.company.agentMobile :', e.company.agentMobile);
          console.log('e.person.mobile :', e.person.mobile);
          if (
            (item.company.agentMobile === e.company.agentMobile &&
              item.company.agentMobile &&
              e.company.agentMobile) ||
            (item.person.mobile === e.company.agentMobile &&
              item.person.mobile &&
              e.company.agentMobile) ||
            (item.company.agentMobile === e.person.mobile &&
              item.company.agentMobile &&
              e.person.mobile) ||
            (item.person.mobile === e.person.mobile && item.person.mobile && e.person.mobile)
          ) {
            flag = true;
          }
        });
      }
      if (flag) {
        uni.showToast({
          title: '当前签署方已存在',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      if (this.current === -1) {
        this.signers.push(e);
      } else {
        this.signers[this.current] = e;
      }
      this.signers = [...this.signers, ...[]];

      this.$emit('change', this.signers);
    },
    addSign() {
      // this.signers.push({
      //   type: '', // 类型(0:个人;1:公司;)
      //   person: {
      //     name: '', // 用户名
      //     mobile: '', // 手机号
      //   },
      //   company: {
      //     name: '', // 公司名
      //     agentName: '', // 经办人姓名
      //     agentMobile: '', // 经办人手机
      //   },
      // });
      // this.$emit('change', this.signers);
      if (!this.token) {
        this.common.toLogin();
        return;
      }
      this.current = -1;
      this.$refs.addSignerRef.open(0);
    },
  },
  watch: {
    companyName(val) {
      console.log('val :', val);
      if (val) {
        this.$refs.addSignerRef.open(1);
      }
    },
    currentSigner(val) {
      this.signers = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.line-vertical {
  width: 1px;
  height: 24rpx;
  background: #e6e6e6;
}
.add-item {
  flex: 1;
  padding: 10rpx 0;
}
.icon-add {
  margin-right: 4rpx;
  width: 48rpx;
  height: 48rpx;
}
.add-btn {
  text-align: center;
  padding: 30rpx;
}
.icon-change {
  margin-top: 8rpx;
  width: 32rpx;
  height: 32rpx;
}
.img-avatar {
  flex-shrink: 0;
  margin-right: 16rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
}
</style>