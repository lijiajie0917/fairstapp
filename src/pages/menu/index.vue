<template>
  <div class="menu">
    <div class="menuTitle">智慧大棚</div>
    <div class="menuTxt">智慧农业信息化管理平台</div>
    <ul class="menuUl">
      <li class="menuLi" @click="goGreenhouse()">
        <img src="../../../static/images/logo.png">
        <div>数据分析</div>
      </li>
      <li class="menuLi" @click="goRealtimedata()">
        <img src="../../../static/images/logo.png">
        <div>实时数据</div>
      </li>
      <li class="menuLi" @click="goControl()">
        <img src="../../../static/images/logo.png">
        <div>设备控制</div>
      </li>
      <li class="menuLi" @click="goAutomatic()">
        <img src="../../../static/images/logo.png">
        <div>自动控制</div>
      </li>
      <li class="menuLi" @click="goTiming()">
        <img src="../../../static/images/logo.png">
        <div>定时任务</div>
      </li>
      <li class="menuLi" @click="goVideo()">
        <img src="../../../static/images/logo.png">
        <div>视频监控</div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  data () {
    return {
      prosItem:[],
      projectId:null
    }
  },
  created:function(){
    wx.hideShareMenu();//禁止出现转发按钮

  },
  mounted() {
    this.prosItem = wx.getStorageSync('prosItem');
    this.projectId = this.prosItem[0].id;
  },
  methods: {
    //跳转数据分析页
    goGreenhouse(){
      wx.navigateTo({
        url: `/pages/sub/greenhouse/main?projectId=${this.projectId}`,
      })
    },
    //跳转实时数据页
    goRealtimedata(){
      wx.navigateTo({
        url: `/pages/realtimedata/main?projectId=${this.projectId}`,
      })
    },
    //跳转设备控制页
    goControl(){
      wx.navigateTo({
        url: `/pages/control/main?projectId=${this.projectId}`,
      })
    },
    //跳转自动控制页
    goAutomatic(){
      wx.navigateTo({
        url: `/pages/automatic/main?projectId=${this.projectId}`,
      })
    },
    //跳转定时任务页
    goTiming(){
      wx.navigateTo({
        url: `/pages/timing/main?projectId=${this.projectId}`,
      })
    },
    //跳转视频监控页
    goVideo(){
      wx.navigateTo({
        url: `/pages/sub/video/main?projectId=${this.projectId}`,
      })
    }
  }
}
</script>

<style scoped>
.menuTitle{

}
.menuTxt{

}
.menuUl{
  width: 690rpx;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 50rpx 30rpx 30rpx;
  flex-wrap:wrap;
}
.menuLi{
  width: 200rpx;
  height: 200rpx;
  padding: 50rpx;
  background: #fff;
  border-radius: 10rpx;
  text-align: center;
}
.menuLi img{
  width: 50rpx;
  height: 50rpx;
}
</style>
