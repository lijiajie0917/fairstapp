<template>
  <div class="container">
    <div class="video" :style="{'margin-top':(navH)+'px','overflow':'hidden'}">
      <TitleBar :navTitle="title"></TitleBar>
      <div class="videoList" v-for="(item,index) in videoList" :key="index" @click="video(item.deviceName,item.deviceSerial)">
        <img src="../../../../static/images/monitoring.png" alt="" class="videoImg">
        <p class="videoName">{{item.deviceName}}</p>
        <p class="number">{{item.deviceSerial}}</p>
        <span class="details" @click="videoDetails(item.deviceName,item.deviceSerial,item.deviceVersion)">详情</span>
      </div>
    </div>
  </div>
</template>

<script>

import TitleBar from "@/components/titleBar/index";

export default {
  components: {
    TitleBar
  },
  data () {
    return {
      title:'视频监控',
      navH:this.$store.state.navH,
      videoList:[],
    }
  },
  created(){
    wx.hideShareMenu();//禁止出现转发按钮
  },
  mounted(){
    this.$httpWX.get({
      url: '/ys/device/list'
    }).then(res => {
      var data = res.data;
      this.videoList = data;
      console.log(data);
    })
  },
  methods:{
    // 跳转视频监控页面
    video(videoName,num){
      wx.navigateTo({
        url: '/pages/sub/video/main?num='+num+'&videoName='+videoName,
      })
    },
    // 跳转设备信息详情
    videoDetails(videoName,num,Version){
      wx.navigateTo({
        url: '/pages/sub/videoDetails/main?num='+num+'&videoName='+videoName+'&Version='+Version,
      })
    }
  }
};
</script>

<style scoped>
.videoList{
  width: 345px;
  height: 68.5px;
  margin: 15px 0 15px 15px;
  padding-top: 15px;
  background: #fff;
  border-radius: 10px;
  box-shadow:0px 5px 15px 0px rgba(167,197,242,0.3);
  position: relative;
}
.videoList .videoImg{
  width:21px;
  height:26px;
  margin: 9px 25.5px 28.5px 20px;
  float: left;
}
.videoList .videoName{
  font-size: 16px;
  font-weight: bold;
  color: #222222;
  margin-bottom: 14px;
}
.videoList .number{
  font-size: 15px;
  font-weight: 400;
  color: #999999;
}
.videoList .details{
  font-size: 15px;
  color:#666666;
  position: absolute;
  right: 36px;
  top: 32.5px;
  z-index: 1000;
}
.container {
  background-color: #f3f5f8;
  position: fixed;
  width:100%;
  height: 100%;
}
</style>
