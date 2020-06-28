<template>
  <div class="insetWrap">
    <TitleBar :navTitle="this.$root.$mp.query.videoName"></TitleBar>
    <video direction="0"
    :src="videoUrl"
    controls="true"
    objectFit="cover"
    autoplay
    :show-play-btn="false"
    :style="{'margin-top':(navH)+'px'}"
    >
    </video>
    <div class="controlBtn">
      <div class="quartercircle divLeft" @longpress="Change(2)" @touchend="stopMove(2)" @click="clickChange(2)">
        <img src="../../../../static/images/controlUp.png" alt="">
      </div>
      <div class="quartercircle divTop" @longpress="Change(0)" @touchend="stopMove(0)" @click="clickChange(0)">
        <img class="styleAge" src="../../../../static/images/controlRight.png" alt="">
      </div>
      <div class="quartercircle divRight" @longpress="Change(3)" @touchend="stopMove(3)" @click="clickChange(3)">
        <img src="../../../../static/images/controlDown.png" alt="">
      </div>
      <div class="quartercircle divBottom" @longpress="Change(1)" @touchend="stopMove(1)" @click="clickChange(1)">
        <img class="styleAge" src="../../../../static/images/controlLeft.png" alt="">
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
      num:'',
      videoUrl:'',
      navH:'',
      channelNo:'',
    }
  },
  mounted(){
    this.num = this.$root.$mp.query.num
    this.getVideoUrl();
  },
  created(){
    this.navH = wx.getStorageSync('navH');
  },
  methods: {
    // 获取视频监控地址
    getVideoUrl(){
      this.$httpWX.get({
        url: '/ys/live/video',
        data: {
          deviceSerial: this.num,
        }
      }).then(res => {
        var data = res.data;
        console.log(data);
        this.channelNo = data.channelNo;
        this.videoUrl = data.hdAddress;
      })
    },
    // 控制摄像头转动
    Change(direction){
      console.log("开始动作！" + direction);
      this.startChange(direction);
    },
    startChange(direction){
      this.$httpWX.post({
        url: '/ys/ptz/start',
        data: {
          deviceSerial : this.num,
          channelNo : this.channelNo,
          direction : direction,
          // speed : ,
        }
      }).then(res => {
        var data = res.data;
      })
    },
    stopMove(direction){
      console.log("动作结束！" + direction);
      this.$httpWX.post({
        url: '/ys/ptz/stop',
        data: {
          deviceSerial : this.num,
          channelNo : this.channelNo,
        }
      }).then(res => {
        var data = res.data;
      })
    },
    // 单次点击
    clickChange(direction){
      this.startChange(direction)
    },
  }
};
</script>

<style scoped>
.insetWrap{
  background-color: #f3f5f8;
  position: fixed;
  width:100%;
  height: 100%;
}
video{
  width: 100%;
  height: 211px;
}
.controlBtn{
  width: 167px;
  height: 167px;
  margin: 68px 0 0 104px;
  background: url("../../../../static/images/controlBtn.png");
  background-size: 100% 100%;
  position: relative;
}
.quartercircle{
  position:absolute;width: 83.5px;height: 83.5px;-webkit-border-radius: 83.5px 0 0 0;
}
.divLeft{
    top: 25%;left: -10%; transform:rotate(-45deg);background-color: transparent ;
}
.divTop{
    top: -10%;left: 25%; transform:rotate(45deg);background-color: transparent ;
}
.divRight{
    top: 25%;left: 60%;transform:rotate(135deg);background-color: transparent ;
}
.divBottom{
    top: 60%;left: 25%;transform:rotate(-135deg);background-color: transparent ;
}
.controlBtn div img{
  width: 23.5px;
  height: 14.5px;
  position: absolute;
  top: 30px;
  left: 30px;
}
.controlBtn div .styleAge{
  width: 14.5px;
  height: 23.5px;
}
.controlBtn .divLeft img{
  transform: rotate(-45deg);
  left: 26px;
  top: 33px;
}
.controlBtn .divTop img{
  transform: rotate(-135deg);
  left: 33px;
  top: 26px;
}
.controlBtn .divRight img{
  transform: rotate(135deg);
  left: 26px;
  top: 28px;
}
.controlBtn .divBottom img{
  transform: rotate(45deg);
  left: 27px;
  top: 26px;
}
</style>
