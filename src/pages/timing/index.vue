<template>
  <div class="container">
    <div class="timing" :style="{'margin-top':(navH)+'px'}">
      <TitleBar :navTitle="title"></TitleBar>
      <SelectOption></SelectOption>
      <!-- <h1>{{equipment}}</h1>
      <h1>{{gatewayId}}</h1> -->
      <ul class="timedTask" :style="{
        'top':(navH+175)+'px',
        'height':isIphoneX||isIphoneX11?(screenHeight-350)+'px':(screenHeight-240)+'px'}"
        >
        <li class="timedTaskList" v-for="(item,index) in timedTaskList" :key="index" >
          <div class="timedHeader">
            <p class="timedName">{{item.timedName}}</p>
            <i-switch class="switchBtn"
              :value="item.onOff"
              @change="onChange(item.onOff)"
              slot="footer"
            >
                <view slot="open">开</view>
                <view slot="close">关</view>
            </i-switch>
            <img @click="delTask(item.timeID,item.timedName)" class="deleteBtn" src="../../../static/images/delete.png" alt="">
          </div>
          <ul class="taskUi">
            <li class="taskTilte">任务开启</li>
            <li>开始时间 <span>{{item.openingTime}}</span> </li>
            <li>执行类型 <span>{{item.perType}}</span> </li>
            <li>动作 <span>{{item.openMove}}</span> </li>
          </ul>
          <ul class="taskUi">
            <li class="taskTilte">任务结束</li>
            <li>结束时间 <span>{{item.endTime}}</span> </li>
            <li>动作 <span>{{item.endMove}}</span> </li>
          </ul>
        </li>
        <div class="addTiming" @click="goaddTiming()">
          添加定时任务
        </div>
        <img class="AddBtn" @click="goaddTiming()" src="../../../static/images/addBtn.png" alt="">
      </ul>
    </div>
  </div>
</template>

<script>

import TitleBar from "@/components/titleBar/index";
import SelectOption from "@/components/selectOption/index";

export default {
  components: {
    TitleBar,
    SelectOption
  },
  data () {
    return {
      title:'定时任务',
      navH:this.$store.state.navH,
      equipment:'', //设备名称
      gatewayId:'', //设备ID
      projectId:'', //项目ID
      timedTaskList:[ //定时任务列表初始化
        {
          timedName:"定时任务——1",
          openingTime:'08:00',
          perType:"每三天执行",
          openMove:'开启水阀——001',
          endTime:'12.00',
          endMove:'关闭水阀——001',
          onOff:true,
          timeID:'timeID1234567'
        },
        {
          timedName:"定时任务——2",
          openingTime:'08:00',
          perType:"每三天执行",
          openMove:'开启水阀——002',
          endTime:'12.00',
          endMove:'关闭水阀——002',
          onOff:false,
          timeID:'timeID123'
        },
      ],
      screenHeight: "",
      isIphoneX: this.globalData.isIphoneX, //适配iphonex
      isIphoneX11: this.globalData.isIphoneX11, //适配iphonex11
      switch1:false,
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
    // 定时任务开关操作
    onChange(switch1){
      console.log(switch1);
      // var switchflg = !switch1;
      // var cmd = switch1;
      // if (cmd == false) {
      //   cmd = 1;
      // } else {
      //   cmd = 0;
      // }
      // this.$httpWX.post({
      //   url: '/sensor/' + gatewayId + '/' + nodeId + '/' + cmd,
      //   data: {}
      // }).then(res => {
      //   // console.log(res)
      //   if (res.status == "200") {
      //     this.switch1 = switchflg;
      //   }
      // })
    },
    // 删除定时任务
    delTask(timeID,timedName){
      let confirm = ()=>{
      	this.$httpWX.showSuccessToast('删除成功')
      }
      this.$httpWX.alert('提示','确定删除"' + timedName + '"吗？',confirm,true);
    },
    goaddTiming(){
      wx.navigateTo({
        url: '/pages/addtiming/main',
      })
    }
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
  height: 316px;
  background: #fff;
  border-radius: 10px;
  margin: 0 0 15px 15px;
  padding: 10px 20px 0 20px;
  box-shadow:0px 5px 15px 0px rgba(167,197,242,0.3);
  /* overflow: hidden; */
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
.AddBtn{
  width: 51px;
  height: 51px;
  position: fixed;
  bottom: 40px;
  right: 15px;
  z-index: 5;
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
.switchBtn{
  position:absolute;
  right: 52px;
}
.deleteBtn{
  width: 12.5px;
  height: 12px;
  float: right;
  margin-top: 9px;
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
.taskUi li span{
  float: right;
  color: #333333;
}
.taskUi .taskTilte{
  font-size: 16px;
  color: #333333;
  font-weight: bold;
}
</style>
