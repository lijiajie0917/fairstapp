<template>
  <div class="container">
    <div class="timing" :style="{'margin-top':(navH)+'px'}">
      <TitleBar :navTitle="title"></TitleBar>
      <!-- <SelectOption></SelectOption> -->
      <div class="timedTask" :style="{
        'top':(navH+15)+'px',
        'height':isIphoneX||isIphoneX11?(screenHeight-190)+'px':(screenHeight-80)+'px'}"
        >
        <div class="timedTaskList">
          <div class="timedHeader">
            <p class="timedName">任务开启</p>
          </div>
          <ul class="taskUi">
            <li class="taskTilte">名称：</li>
            <li> <input class="startTime" type="text" name="" value="手动输入任务名称"> </li>
            <li class="taskTilte">开始时间:</li>
            <picker mode="multiSelector" @change="startTimefun" :value="startIndex" :range="newMultiArray">
              <span>{{startTime}}</span>
              <img class="userDown" src="../../../static/images/down.png" alt="">
            </picker>
            <li class="taskTilte">执行类型:</li>
            <li class="perBox">
              <span class="perType">单次执行</span>
              <picker @change="bindPickerChange" :value="pickerindex" :range="array">
                <span class="perType">{{perName}}<img class="repDown" src="../../../static/images/down.png" alt=""></span>
              </picker>
            </li>
            <li class="taskTilte">动作:</li>
            <li class="perBox">
              <span class="perType moveType">水阀——001<img class="repDown" src="../../../static/images/down.png" alt=""></span>
              <span class="perType moveType">开启<img class="repDown" src="../../../static/images/down.png" alt=""></span>
            </li>
          </ul>
        </div>
        <div class="timedTaskList overTaskList">
          <div class="timedHeader">
            <p class="timedName">任务结束</p>
          </div>
          <ul class="taskUi">
            <li class="taskTilte">结束时间:</li>
            <picker mode="multiSelector" @change="overTimefun" :value="overIndex" :range="newMultiArray">
              <span>{{overTime}}</span>
              <img class="userDown" src="../../../static/images/down.png" alt="">
            </picker>
            <li class="taskTilte">动作:</li>
            <li class="perBox">
              <span class="perType moveType">水阀——001</span>
              <span class="perType moveType">开启<img class="repDown" src="../../../static/images/down.png" alt=""></span>
            </li>
          </ul>
        </div>
        <div class="addTiming">
          保存
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import TitleBar from "@/components/titleBar/index";

export default {
  components: {
    TitleBar,
  },
  data () {
    return {
      title:'添加定时任务',
      navH:this.$store.state.navH,
      equipment:'', //设备名称
      gatewayId:'', //设备ID
      projectId:'', //项目ID
      screenHeight: "",
      isIphoneX: this.globalData.isIphoneX, //适配iphonex
      isIphoneX11: this.globalData.isIphoneX11, //适配iphonex11
      switch1:false,
      startTime: "请选择开始时间",
      overTime:'请选择结束时间',
      multiArray: [], //时间初始化
      startIndex: [0, 0, 0, 0, 0], //开始时间
      overIndex:[0, 0, 0, 0], //结束时间
      year:'',
      month:'',
      day:'',
      hour:'',
      minute:'',
      perName:'重复执行', //动作初始化
      pickerindex:0, //动作下标初始化
      array: ['永不', '每天', '每两天', '每三天','每周'], //动作数组
    }
  },
  computed: {
    newMultiArray: () => {
      let array = [];
      const date = new Date();
      const years = [];
      const months = [];
      const days = [];
      const hours = [];
      const minutes = [];
      for (let i = 2018; i <= date.getFullYear() + 10; i++) {
        years.push("" + i);
      }
      array.push(years);
      for (let i = 1; i <= 12; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        months.push("" + i);
      }
      array.push(months);
      for (let i = 1; i <= 31; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        days.push("" + i);
      }
      array.push(days);
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        hours.push("" + i);
      }
      array.push(hours);
      for (let i = 0; i < 60; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minutes.push("" + i);
      }
      array.push(minutes);
      return array;
    }
  },
  created:function(){
    wx.hideShareMenu();//禁止出现转发按钮
    wx.getSystemInfo({
      success: res => {
        this.screenHeight = res.screenHeight;
      }
    });
  },
  watch: {
    '$store.state.equipment': function () {
      this.equipment = this.$store.state.equipment;
    },
    '$store.state.gatewayId': function () {
      this.gatewayId = this.$store.state.gatewayId;
    }
  },
  mounted(){
    this.projectId = this.$store.state.projectId;
  },
  methods:{
    initTime(index){
      this.year = this.newMultiArray[0][index[0]];
      this.month = this.newMultiArray[1][index[1]];
      this.day = this.newMultiArray[2][index[2]];
      this.hour = this.newMultiArray[3][index[3]];
      this.minute = this.newMultiArray[4][index[4]];
    },
    startTimefun(e) {
      // 开始时间
      this.startIndex = e.target.value;
      const index = this.startIndex;
      this.initTime(index)
      this.startTime = this.year + " 年 " + this.month + " 月 " + this.day + " 日  " + this.hour + ":" + this.minute;
    },
    overTimefun(e){
      // 结束时间
      this.overIndex = e.target.value;
      const index = this.overIndex;
      this.initTime(index)
      this.overTime = this.year + " 年 " + this.month + " 月 " + this.day + " 日  " + this.hour + ":" + this.minute;
    },
    // 选择动作
    bindPickerChange(e) {
      this.pickerindex = e.target.value
      this.perName = this.array[this.pickerindex];
    },
  }
}
</script>

<style scoped>
.container {
  background-color: #f3f5f8;
  position: fixed;
  width:100%;
  height: 100%;
}
.timedTask{
  position: absolute;
  overflow-y: auto;
}
.timedTaskList{
  width: 305px;
  height: 360px;
  background: #fff;
  border-radius: 10px;
  margin: 0 0 15px 15px;
  padding: 10px 20px 0 20px;
  box-shadow:0px 5px 15px 0px rgba(167,197,242,0.3);
  /* overflow: hidden; */
}
.overTaskList{
  height: 205px;
}
.addTiming{
  width: 195px;
  height: 39px;
  background: #3370FF;
  color: #fff;
  font-size: 16px;
  border-radius: 6px;
  line-height: 39px;
  text-align: center;
  margin: 73px 0 40px 90px;
}
.timedHeader{
  overflow: hidden;
  margin-bottom: 9.5px;
}
.timedName{
  font-size: 16px;
  color: #092A75;
  font-weight: bold;
  float: left;
  margin-top: 5px;
}
.taskUi{
  border-top: 1px solid #E5E5E5;
  padding-top: 15px;
}
.taskUi li{
  margin-bottom: 15px;
  font-size: 15px;
  color: #999999;
}
.taskUi .startTime{
  border-bottom: 1px solid #E5E5E5;
}
.taskUi .taskTilte{
  font-size: 16px;
  color: #333333;
  font-weight: bold;
}
picker{
  font-size: 15px;
  color: #333333;
  margin-bottom: 15px;
}
.userDown{
  width: 12px;
  height: 6.5px;
  float: right;
  margin: 7.5px 0;
}
.perBox{
  overflow: hidden;
}
.perBox .repDown{
  width: 12px;
  height: 6.5px;
  position: absolute;
  top: 13px;
  right: 6px;
}
.perType{
  float: left;
  width: 132.5px;
  height: 32.5px;
  line-height: 32.5px;
  text-align: center;
  background: rgba(243,245,250,1);
  font-size: 15px;
  color: #333333;
  border:1px solid #D8D8D8;
  border-radius:4px;
  position: relative;
}
.perBox .moveType{
  text-align: left;
  text-indent: 5px;
}
.perType:last-child{
  float: right;
}
</style>
