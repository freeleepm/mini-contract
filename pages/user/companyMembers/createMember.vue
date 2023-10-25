<template>
  <view class="page-base">
    <view class="card width-full">
      <view class="row flex-sb">
        <view class="text-28 color-base text-required">姓名</view>
        <input
          class="text-28 color-base flex-1"
          v-model="form.name"
          :maxlength="5"
          placeholder="请输入姓名"
          placeholder-class="place"
        />
      </view>
      <view class="row flex-sb">
        <view class="text-28 color-base text-required">一合通账号</view>
        <input
          class="text-28 color-base flex-1"
          type="number"
          v-model="form.account"
          :maxlength="11"
          placeholder="请输入手机号"
          placeholder-class="place"
        />
      </view>
      <!-- <view class="row">
        <view class="text-28 color-base text-required">角色管理</view>
        <view class="role-list">
          <view
            class="role-item"
            v-for="(item, i) in roleList.filter(s => s.show)"
            :key="i"
            @click="check(i)"
          >
            <view class="checkmarkempty-box flex-ct" :class="{ active: item.checked }">
              <uni-icons type="checkmarkempty" size="12"></uni-icons>
            </view>
            <view class="flex-1">
              <view class="text-28 color-base" color="#999999">
                {{ item.label }}
              </view>
              <view class="text-24 color-grey-minor">{{ item.desc }}</view>
            </view>
          </view>
        </view>
      </view> -->
    </view>
    <view class="btn-primary" @click="submit">确定</view>
    <view class="btn-cancel" v-if="form.id" @click="del">删除成员</view>
  </view>
</template>

<script>
import reg from '@/utils/reg.js';
import { memberCreate, memberInfo, memberUpdate, memberDel } from '@/api/company.js';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      fastClick: true,
      form: {
        id: '',
        name: '',
        account: '',
        companyId: '',
        // role: [],
      },
      roleList: [
        {
          label: '普通成员',
          value: 1,
          desc: '用企业盖章需要管理员审批',
          checked: false,
          show: true,
        },
        {
          label: '印章保管员',
          value: 2,
          desc: '直接使用企业盖章,可以对企业印章进行创建、删除、修改、查询等操作',
          checked: false,
          show: true,
        },
        {
          label: '成员管理员',
          value: 3,
          desc: '直接使用企业盖章，审批普通成员盖章,可以对企业成员进行添加、移除、修改、查询等操作',
          checked: false,
          show: true,
        },
        {
          label: '模板管理员',
          value: 4,
          desc: '可以对模板进行新增、删除、开启、关闭、查询等操作',
          checked: false,
          show: true,
        },
        // { label: '企业管理员', value: 99, desc: '', checked: false, show: true },
        // { label: '企业法人', value: 98, desc: '', checked: false, show: false },
      ],
    };
  },
  computed: {
    ...mapState(['userInfo']),
  },
  onLoad(e) {
    if (e.id) {
      this.form.id = e.id;
      this.roleList[5].show = true; // 法人可编辑但不可添加
      uni.setNavigationBarTitle({
        title: '编辑成员',
      });
      this.getMemberInfo();
    } else {
      this.form.companyId = this.userInfo.companyId;
    }
  },
  methods: {
    getMemberInfo() {
      memberInfo(this.form.id).then(res => {
        if (res.role && res.role.length) {
          const roleList = res.role.split(',');
          this.roleList.forEach(item => {
            if (roleList.find(k => k == item.value)) item.checked = true;
          });
          this.roleList = [].concat(this.roleList);
        }
        this.form = res;
      });
    },
    check(i) {
      this.roleList[i].checked = !this.roleList[i].checked;
      this.roleList = [].concat(this.roleList);
      // this.form.role = this.roleList
      //   .filter(i => i.checked === true)
      //   .map(i => {
      //     return i.value;
      //   })
      //   .join(',');
    },
    del() {
      var that = this;
      uni.showModal({
        title: '删除警告',
        content: '成员删除后将不可恢复，是否继续？',
        confirmColor: '#dd524d',
        confirmText: '确定删除',
        cancelText: '取消',
        cancelColor: '#999999',
        success: function (res) {
          if (res.confirm) {
            memberDel(that.form.id).then(() => {
              uni.showToast({
                title: '删除成功！',
                icon: 'none',
              });
              uni.navigateBack();
            });
          }
        },
      });
    },
    submit() {
      if (!this.fastClick) return;
      if (!this.form.name.trim()) {
        return uni.showToast({
          title: '请输入姓名',
          icon: 'none',
        });
      }
      if (!this.form.account.trim()) {
        return uni.showToast({
          title: '请输入一合通账号',
          icon: 'none',
        });
      }
      if (!reg.phone.test(this.form.account)) {
        return uni.showToast({
          title: '手机号格式有误',
          icon: 'none',
        });
      }
      // if (!this.roleList.find(i => i.checked === true)) {
      //   return uni.showToast({
      //     title: '请至少添加一个角色',
      //     icon: 'none',
      //   });
      // }
      this.fastClick = false;
      if (this.form.id) {
        memberUpdate(this.form).then(() => {
          uni.showToast({
            title: '更新成功！',
            icon: 'none',
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 600);
        });
      } else {
        memberCreate(this.form).then(() => {
          uni.showToast({
            title: '添加成功！',
            icon: 'none',
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 600);
        });
      }
      setTimeout(() => {
        this.fastClick = true;
      }, 1500);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-base {
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom)) !important;
  .card {
    padding: 0 32rpx;
    background: #ffffff;
    border-radius: 12rpx;
    .row {
      padding: 32rpx 0;
      border-bottom: 1px solid $uni-border-color;
      &:last-child {
        border: none;
      }
      input {
        text-align: right;
      }
      .role-list {
        padding-top: 16rpx;
        .role-item {
          display: flex;
          padding: 16rpx 0;
          .text-28 {
            padding-bottom: 6rpx;
          }
          .flex-1 {
            padding-left: 20rpx;
          }
          .checkmarkempty-box {
            width: 30rpx;
            height: 30rpx;
            border-radius: 4rpx;
            border: 1px solid #999999;
            position: relative;
            top: 4rpx;
            padding-bottom: 2rpx;
            /deep/ .uniui-checkmarkempty {
              color: $uni-color-primary !important;
              display: none;
            }
            &.active {
              border: 1px solid $uni-color-primary;
              /deep/ .uniui-checkmarkempty {
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
}

.btn-primary {
  margin-top: 60rpx;
  width: 598rpx;
  height: 88rpx;
  border-radius: 8rpx;
}
.btn-cancel {
  margin-top: 60rpx;
  width: 598rpx;
  height: 88rpx;
  border-radius: 8rpx;
  opacity: 0.8;
}
</style>
