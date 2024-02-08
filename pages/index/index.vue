<!--
 * @Author: wudi
 * @Date: 2023-09-13 09:52:14
 * @LastEditors: wudi
 * @LastEditTime: 2023-12-15 16:25:22
 * @Description:
-->
<template>
  <view class="content">
    <!-- 欢迎页 -->
	<wxPrivacy ref="wxPrivacy" @agree="unit(param)"></wxPrivacy>
  </view>
</template>

<script>
import wxPrivacy from '@/components/wxPrivacy/index.vue'
import {
	wxToPromise,
	requirePrivacyAuthorize
} from '@/wxToPromise'
import { mapState, mapActions } from 'vuex';
export default {
	components: {
		wxPrivacy
	},
  data() {
    return {
		param: {}
	};
  },
  computed: {
    ...mapState(['token']),
  },
  onLoad(e) {
	let that = this;
	this.param = e
  const token = uni.getStorageSync('token') || '';
  if(token) {
    that.$store.commit('setToken', token);
  }
  if(wx.getPrivacySetting) {
    wx.getPrivacySetting({
	  	success: async (res) => {
	  		console.log(res)
	  		if (res.needAuthorization) {
	  			const requireVal = await requirePrivacyAuthorize()
	  			console.log('requireVal')
	  			console.log(requireVal)
	  			if (!requireVal) {
	  				that.$refs.wxPrivacy.showModal()
	  			} else {
            that.unit(that.param)
          }
	  		} else {
				that.unit(that.param)
			}
	  	}
	})
  } else {
    that.unit(that.param)
  }
    if(that.token) {
      that.uinfo()
    }
  },
  methods: {
    ...mapActions(['uinfo']),
	  unit(e) {
		  console.log(e);
		  console.log('this.userInfo :', this.userInfo)
		  // if(e.id) {
		  //     uni.redirectTo({
		  //        url: '/pages/login/login?id='+e.id + '&loginType=first',
		  //     });
		  //     return;
		  // }
      if (e.id) {
		        // 有合同 && 当前用户是签署方
		        uni.redirectTo({
		          url: '/pages/contract/detail/index?id=' + e.id + '&enterType=index',
		        });
		      } else {
		        uni.reLaunch({
		          url: '/pages/home/index',
		        });
		      }
		  // this.$store
		  //   .dispatch('login')
		  //   .then(res => {
		  //     if (e.id) {
		  //       // 有合同 && 当前用户是签署方
		  //       uni.redirectTo({
		  //         url: '/pages/contract/detail/index?id=' + e.id,
		  //       });
		  //     } else {
		  //       uni.reLaunch({
		  //         url: '/pages/home/index',
		  //       });
		  //     }
		  //   })
		  //   .finally(() => {
		  //     if (!e.id) {
		  //       uni.reLaunch({
		  //         url: '/pages/home/index',
		  //       });
		  //     }
		  //   });

      }
  }
};
</script>
