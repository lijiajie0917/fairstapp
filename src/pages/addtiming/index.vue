<template>
  <div class="container">
    <div class="timing">
      <TitleBar :navTitle="title"></TitleBar>
      <!-- <SelectOption></SelectOption> -->
      <div class="timedTask" :style="{
        'top':(navH + 20)+'px',
        'height':isIphoneX||isIphoneX11?(screenHeight-190)+'px':(screenHeight-80)+'px'}"
        >
        <div class="timedTaskList">
          <div class="timedHeader">
            <p class="timedName">任务开启</p>
          </div>
          <ul class="taskUi">
            <li class="taskTilte">名称：</li>
            <li>
              <input class="startTime" placeholder='手动输入任务名称' v-model="input"/>
            </li>
            <li class="taskTilte">开始时间:</li>
            <picker mode="multiSelector" @change="startTimefun" :value="startIndexTime" :range="newMultiArray">
              <span>{{startTime}}</span>
              <img class="userDown" src="../../../static/images/rightIcon.png" alt="">
            </picker>
            <li class="taskTilte">执行类型:</li>
            <li class="perBox">
              <span class="perType" :class="{'active':isActive}" @click="oneExecute">
                单次执行
                <img v-show="isActive" class="checkIcon" src="../../../static/images/checkIcon.png" alt="">
              </span>
              <picker @change="bindPickerChange" :value="pickerindex" :range="array">
                <span class="perType">{{perName}}<img class="repDown" src="../../../static/images/down.png" alt=""></span>
              </picker>
            </li>
            <li class="taskTilte">动作:</li>
            <li class="perBox">
              <picker class="equipmentFlot"
                @change="equipmentAction"
                :value="equipmentIndex"
                :range-key="'typeName'"
                :range="equipmentarray">
                <span class="perType moveType">{{equipmentName}}<img class="repDown" src="../../../static/images/down.png" alt=""></span>
              </picker>
              <picker @change="startAction" :value="startIndex" :range="startarray">
                <span class="perType moveType">{{startperName}}<img class="repDown" src="../../../static/images/down.png" alt=""></span>
              </picker>
            </li>
          </ul>
        </div>
        <div class="timedTaskList overTaskList">
          <div class="timedHeader">
            <p class="timedName">任务结束</p>
          </div>
          <ul class="taskUi">
            <li class="taskTilte">结束时间:</li>
            <picker mode="multiSelector" @change="overTimefun" :value="overIndexTime" :range="newMultiArray">
              <span>{{overTime}}</span>
              <img class="userDown" src="../../../static/images/rightIcon.png" alt="">
            </picker>
            <li class="taskTilte">动作:</li>
            <li class="perBox">
              <span class="perType moveType">{{equipmentName}}</span>
              <picker @change="overAction" :value="overIndex" :range="overarray">
                <span class="perType moveType">{{overperName}}<img class="repDown" src="../../../static/images/down.png" alt=""></span>
              </picker>
            </li>
          </ul>
        </div>
        <div class="addTiming" @click="savePage()">
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
      navH:'',
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
      startIndexTime: [0, 0, 0, 0, 0], //开始时间
      formattingstartTime:'',
      overIndexTime:[0, 0, 0, 0], //结束时间
      formattingoverTime:'',
      year:'',
      month:'',
      day:'',
      hour:'',
      minute:'',
      perName:'永不', //动作初始化
      startperName:'关闭',
      overperName:'关闭',
      pickerindex:0, //动作下标初始化
      startIndex:0,
      overIndex:0,
      equipmentIndex:0,
      array: ['永不', '每天', '每两天', '每三天','每周'], //动作数组
      startarray:['关闭','开启'],
      overarray:['关闭','开启'],
      equipmentarray:[],
      input:'',
      localId:'',
      equipmentName:'',
      isActive:true,
      isRepeat:false, //是否重复 默认否
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
    this.navH = wx.getStorageSync('navH');
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
    },
    '$store.state.equipmentName': function (newVal) {
      this.equipmentName = newVal;
    }
  },
  mounted(){
    this.projectId = this.$store.state.projectId;
    this.equipmentarray = wx.getStorageSync('deviceList')
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
      this.startIndexTime = e.target.value;
      const index = this.startIndexTime;
      this.initTime(index);
      this.formattingstartTime = this.year + "-" + this.month + "-" + this.day + " " + this.hour + ":" + this.minute + ":00"
      this.startTime = this.year + " 年 " + this.month + " 月 " + this.day + " 日  " + this.hour + ":" + this.minute;
    },
    overTimefun(e){
      // 结束时间
      this.overIndexTime = e.target.value;
      const index = this.overIndexTime;
      this.initTime(index)
      this.formattingoverTime = this.year + "-" + this.month + "-" + this.day + " " + this.hour + ":" + this.minute + ":00"
      this.overTime = this.year + " 年 " + this.month + " 月 " + this.day + " 日  " + this.hour + ":" + this.minute;
    },
    // 选择是否重复执行
    bindPickerChange(e) {
      this.pickerindex = e.target.value
      this.perName = this.array[this.pickerindex];
      switch(this.perName){
        case "永不":
            this.isActive = true;
            this.isRepeat = false;
            break;
        default:
            this.isActive = false;
            this.isRepeat = true;
            break;
      }
    },
    // 选择开始动作
    startAction(e){
      this.startIndex = e.target.value
      this.startperName = this.startarray[this.startIndex];
    },
    // 选择结束动作
    overAction(e){
      this.overIndex = e.target.value
      this.overperName = this.overarray[this.overIndex];
    },
    // 添加定时设备选择
    equipmentAction(e){
      this.equipmentIndex = e.target.value
      this.localId = this.equipmentarray[this.equipmentIndex].localId;
      this.equipmentName = this.equipmentarray[this.equipmentIndex].typeName;
    },
    // oneExecute(){
    //   this.isRepeat = false;
    // },
    // 保存
    savePage(){

      let startPage;
      let overPage;
      let perPage;

      if (this.input == '') {
        this.$httpWX.showErrorToast('请填写任务名称');
      } else if (this.formattingstartTime == '') {
        this.$httpWX.showErrorToast('请选择开始时间');
      } else if (this.formattingoverTime == '') {
        this.$httpWX.showErrorToast('请选择结束时间');
      } else {
        if (this.startperName == "关闭" && this.overperName == "关闭") {
          this.$httpWX.showErrorToast('动作重复')
        } else if (this.startperName == "开启" && this.overperName == "开启") {
          this.$httpWX.showErrorToast('动作重复')
        } else {
          switch(this.perName){
            case "永不":
                perPage = "0";
                this.isRepeat = false;
                break;
            case "每天":
                perPage = "1";
                break;
            case "每两天":
                perPage = "2";
                break;
            case "每三天":
                perPage = "3";
                break;
            default:
                perPage = "5";
                break;
          }
          startPage = this.startperName == "开启"? "OPEN" : "CLOSE" ;
          overPage = this.overperName == "关闭"? "CLOSE" : "OPEN" ;
          this.$httpWX.post({
            url: '/miniProgram/scheduleControl',
            data: {
              localId : this.localId, //唯一ID
              name : this.input, //定时任务名称
              startTime : this.formattingstartTime, //开始时间
              endTime : this.formattingoverTime, //结束时间
              action : startPage, //开启动作
              endAction : overPage, //结束动作
              period : perPage, //周期
              isRepeat : this.isRepeat, //是否重复
            }
          }).then(res => {
            let data = res.data;
            console.log(res)
            if (res.status == "001001") {
              this.$httpWX.showErrorToast(res.msg);
            } else {
              this.$store.commit('setlocalId',this.localId);
              console.log(this.dateOne);
              let dateOne = Date.parse(new Date());
              this.$store.commit('setaddTimingFlag',dateOne);
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
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
  width: 6.55px;
  height: 11.7px;
  float: right;
  margin: 5px 0;
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
.perBox .active{
  border:1px solid #3370FF;
}
.perBox .moveType{
  text-align: left;
  text-indent: 5px;
}
.perType:last-child{
  float: right;
}
.equipmentFlot{
  float: left;
}
.checkIcon{
  width: 15px;
  height: 15.5px;
  position: absolute;
  right: 0;
  bottom: 0
}
</style>
