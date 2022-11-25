<template>
	<view>
		<web-view :src="path"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				path:""
			};
		},
		onLoad(e) {
			if(e.path) this.path = decodeURIComponent(e.path)
			console.log(this.path)
		},
    onShareAppMessage() {
      return this.setting.share
    },
    onShareTimeline() {
      return this.setting.share
    }
	}
</script>

<style lang="scss">

</style>
