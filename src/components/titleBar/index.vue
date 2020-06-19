<template>
  <div class='nav' :style="{height:(navH)+'px',}">
    <img class="navBackground" src="../../../static/images/titlebg.jpg" alt />
    <div class='title_icon'>
      <img class="back" src="../../../static/images/backIcon.png" @click='navBack' alt="" mode='aspectFit'>
    </div>
    <div class="title_text">{{ navTitle }}</div>
  </div>
</template>
<script>
export default {
    name: "titleBar",   //导航栏组件
    props: ["navTitle"],
    data() {
    	return {
          navH: this.$store.state.navH, //导航栏高度
      };
    },
    created:function(){

    },
    methods:{
      /**标题栏返回按钮 */
      navBack(){
        wx.navigateBack({
          delta: 1
        })
      },
    }
};
</script>
<style scoped>
/* 自定义导航 */

.nav {
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  border-bottom: 0.5px solid rgba(255,255,255,.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.title_text {
  width: 100%;
  line-height: 23px;
  text-align: center;
  position: absolute;
  bottom: 10px;
  left: 0;
  z-index: 10;
  font-size:17px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(255,255,255,1);
}

.title_icon {
  position: absolute;
  bottom: 10rpx;
  left: 10rpx;
  border-radius: 70rpx;
  box-sizing: border-box;
  /* border: 0.5px solid #eaeaea; */
  display: flex;
  z-index: 20;
  /* background: #fff; */
}

.title_icon image {
  display: inline-block;
  overflow: hidden;
  padding: 16rpx 32rpx;
  text-align: center;
  width:20px;
  height:14px;
}

.title_icon view {
  height: 18px;
  border-left: 1px solid #eaeaea;
  margin-top: 6px;
}
.navBackground {
  width: 100vw;
  height: 64px;
  position: relative;
  top: 0;
  left: 0;
}
</style>
