<template>
  <div class="container">
    <div class="timing" :style="{'margin-top':(navH)+'px'}">
      <TitleBar :navTitle="title"></TitleBar>
      <SelectOption :navTitle="title"></SelectOption>
      <!-- <h1>{{localId}}</h1> -->
      <ul class="timedTask" :style="{
        'top':(navH+175)+'px',
        'height':isIphoneX||isIphoneX11?(screenHeight-350)+'px':(screenHeight-240)+'px'}"
        >
        <li class="timedTaskList" v-show="timedTaskShow">
          <div class="timedHeader">
            <p class="timedName">{{timedTaskList.name}}</p>
            <i-switch class="switchBtn"
              :value="timedTaskList.isOpen"
              @change="onChange(
                timedTaskList.isOpen,
                timedTaskList.localId,
                timedTaskList.name,
                timedTaskList.actions[0].startTime,
                timedTaskList.isRepeat,
                timedTaskList.actions[0].action,
                timedTaskList.actions[1].endTime,
                timedTaskList.actions[1].endAction,
                )"
              slot="footer"
            >
                <view slot="open">开</view>
                <view slot="close">关</view>
            </i-switch>
            <img @click="delTask(timedTaskList.localId,timedTaskList.name)" class="deleteBtn" src="../../../static/images/delete.png" alt="">
          </div>
          <ul class="taskUi" v-for="(item2,index2) in timedTaskList.actions" :key="index2">
            <li class="taskTilte">{{item2.action == "OPEN"? "任务开启":"任务结束"}}</li>
            <li>{{item2.action == "OPEN"? "开始":"结束"}}时间 <span>{{item2.startTime}}</span> </li>
            <li v-show="item2.action == 'OPEN'? true:false ">执行类型 <span>{{timedTaskList.period}}</span> </li>
            <li v-show="item2.action == 'OPEN'? true:false ">是否重复 <span>{{timedTaskList.isRepeat}}</span> </li>
            <li>动作 <span>{{item2.action == "OPEN"? "开启":"关闭"}}——{{equipmentName}}</span> </li>
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
      timedTaskList:[], //定时任务列表初始化
      screenHeight: "",
      isIphoneX: this.globalData.isIphoneX, //适配iphonex
      isIphoneX11: this.globalData.isIphoneX11, //适配iphonex11
      switch1:false,
      localId:'',
      equipmentName:'',
      timedTaskShow:false,
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
    '$store.state.localId': function (newVal) {
      this.localId = newVal;
      this.scheduleControl(this.localId);
    },
    '$store.state.equipmentName': function (newVal) {
      this.equipmentName = newVal;
    },
    '$store.state.addTimingFlag': function (newVal) {
      this.scheduleControl(this.localId);
    }
  },
  mounted(){
    this.projectId = this.$store.state.projectId;
    setTimeout(()=>{
      this.scheduleControl(this.$store.state.localId);
    },500);
  },
  methods:{
    // 获取定时任务列表
    scheduleControl(localId){
      this.$httpWX.get({
        url: '/miniProgram/scheduleControl',
        data: {
          localId : localId,
        }
      }).then(res => {
        let data = res.data;
        console.log(res)
        if (data.actions.length == 0) {
          this.timedTaskShow = false;
        } else {
          this.timedTaskShow = true;
          this.timedTaskList = data;
        }
      })
    },
    // 定时任务开关操作
    onChange(switch1,localId,name,startTime,isRepeat,action,endTime,endAction){
      // console.log(switch1);
      var switchflg = !switch1;
      var cmd = switch1;
      if (cmd == false) {
        cmd = 1;
      } else {
        cmd = 0;
      }
      this.$httpWX.put({
        url: '/miniProgram/scheduleControl',
        data: {
          localId : localId,
          name : name,
          startTime : startTime,
          isRepeat : isRepeat,
          action : action,
          endTime : endTime,
          endAction : endAction,
          isOpen : cmd,
        }
      }).then(res => {
        console.log(res)
        // this.switch1 = switchflg;
      })
    },
    // 删除定时任务
    delTask(localId,name){
      let confirm = ()=>{
        this.$httpWX.post({
          url: '/miniProgram/del/scheduleControl',
          data: {
            localId : localId,
          }
        }).then(res => {
          let data = res.data;
          console.log(res)
          if (res.status == "200") {
            this.$httpWX.showSuccessToast('删除成功')
            this.scheduleControl(this.localId);
          }
        })
      }
      this.$httpWX.alert('提示','确定删除"' + name + '"吗？',confirm,true);
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
  height: 340px;
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
