<template>
  <div class="realtimedata">
    <img class="navBackground" src="../../../static/images/background.png" alt="">
    <div class='nav' :style="{height:(navH)+'px'}">
      <div class='title_icon'>
        <img class="back" src="../../../static/images/backIcon.png" @click='navBack' alt="" mode='aspectFit'>
      </div>
      <div class="title_text">智慧农业大棚</div>
    </div>
    <div class="areaGreenhouseBox" :style="{'top':(navH+20)+'px'}">
      <div class="A_hook">
        <div class="hook"></div>
        <div class="hook"></div>
      </div>
      <div class="areaGreenhouse" @click="handleOpen1">
        <img class="areaDown" src="../../../static/images/area.png" alt="">
        {{areaText}}片区—{{greenhouse}}
        <img v-if="downImage" class="down" src="../../../static/images/down.png" alt="">
        <img v-else class="down" src="../../../static/images/top.png" alt="">
      </div>
      <div v-if="visible1" class="mask">
        <div class="asShow">
          <img @click="closeMask" src="../../../static/images/close.png" alt="">
          <ul class="maskUl">
            <li class="maskLi" v-for="(item,index) in maskItems" :key="index">
              <img class="homeLogo" :src="'https://krjrobot.cn/krjrobot/img/mini/' + item.url" alt="">
              <p class="maskArea">{{item.area}}片区</p>
              <img class="gray" src="../../../static/images/gray.png" alt="">
              <div class="maskList">
                <span v-for="(itemwrap,index1) in item.greenhouse"
                  :key="index1" @click=areaClick(item.area,itemwrap.greenhouseId,itemwrap.greenhouse)
                >{{itemwrap.greenhouse}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <i-toast id="toast" />
      <form :model="form" autocomplete="off">
        <picker class="areaGreenhouse"
          @change="handleOpen2"
          :value="equipmentIndex"
          :range-key="'nodeId'"
          :range="equipmentItems2"
        >
          <view class="picker">
            <img class="areaDown" src="../../../static/images/shebei.png" alt="">
            {{equipment+'号设备'}}
            <img class="down" src="../../../static/images/down.png" alt="">
          </view>
        </picker>
      </form>
      <!-- <div v-if="visible2" class="equipmentAlertList">
        <p v-for="(item,index2) in equipmentItems"
          :key="index2"
          @click=equipmentClick(item.nodeId,item.gatewayId)
        >{{item.nodeId}}号设备</p>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      projectId:7,
      screenWidth:'',
      screenHeight:'',
      navH: 0, //导航栏高度
      width: 0, //进度条宽度
      timeDate:'',
      informShow:true,
      greenhouseDevise:'',
      Tourist:"0",//默认非游客模式
    }
  },
  created:function(){
    wx.hideShareMenu();//禁止出现转发按钮
    this.getHeight();
    wx.getSystemInfo({
      success: res => {
        this.screenWidth = res.screenWidth;
        this.screenHeight = res.screenHeight;
      }
    })
  },
  mounted(){
    this.homePage()
  },
  methods: {
    /**标题栏返回按钮 */
    navBack(){
      wx.navigateBack({
        delta: 1
      })
    },
    /**测量屏幕高度,计算标题栏高度 */
    getHeight(){
      let that = this;
      wx.getSystemInfo({
        success: function(res) {
          // console.log(res)
          that.navH = res.statusBarHeight + 46;
          that.width = res.screenWidth;
        }
      })
    },
    // 进度条数值传入当前值，量程上限和量程下限
    solitNumber(num,max,min){
      let total = parseInt(max - min);//量程范围
      let nim = num-min;//当前值相对于量程所占总数
      let x = nim/total;//当前值随后赞量程百分比
      if(num == min){//当前值等于量程下限
        return 0;
      }else{
        if(x<1&&x>0){//当前值处于量程范围内属于正常值
        // console.log(x)
          let w = this.width * 0.3
          return x*w;
        }else{
          // console.log("x=>",x)
          if(x<0){
            // console.log("小于下限",num,min)
            return "Min";
          }
          if(x>1){
            // console.log("大于上限",num,max)
            return "Max";
          }
        }
      }
    },
    homePage () {
      // this.projectId = wx.getStorageSync("projectId");
      // let jsid = wx.getStorageSync("JSESSIONID");
      this.$httpWX.post({
        url: '/miniProgram/groupInfo/' + this.projectId,
        data: {
          'county': '修文县',
        },
        // header: {
        //   'content-type':'application/x-www-form-urlencoded',
        //   'cookie': jsid // 设置cookie
        // },
      }).then(res => {
        var data = res.data;
        if (data.level == 'area') {
          this.areaText = data.value[0].area; //默认区域
          this.greenhouse = data.value[0].greenhouse[0].greenhouse; //默认大鹏名字
          this.greenhouseId = data.value[0].greenhouse[0].greenhouseId; //默认大棚id
          this.maskItems = data.value; //片区和大棚下拉框
          // 获取默认设备列表
          this.equipmentList(this.areaText,this.greenhouseId,this.greenhouse)
          // setTimeout(, 2000);
        }
      })
    },
    equipmentList (area,greenhouseId,greenhouse) {
      this.$httpWX.post({
        url: '/miniProgram/groupInfo/' + this.projectId,
        data: {
          'county': '修文县',
          'area' : area,
          'greenhouseId' : greenhouseId
        }
      }).then(res => {
        var data = res.data;
        // console.log(data);
        if (data.level == 'nodeInfo') {
          if (data.value.length == 0) {
            wx.showToast({
                title: '暂无数据',
                icon: 'none',
                duration: 1000,
                mask:true
            })
          } else {
            this.areaText = area; //默认区域
            this.greenhouse = greenhouse; //默认大鹏名字
            this.equipment = data.value[0].nodeId; //默认设备名字
            this.gatewayId = data.value[0].gatewayId; //默认设备id
            this.equipmentItems = data.value; //设备下拉框
            this.equipmentItems2 = [];
            for (var i = 0; i < data.value.length; i++) {
              this.equipmentItems2.push({
                "nodeId" : data.value[i].nodeId + '号设备'
              });
            }
            // 请求图表数据
            // console.log('nodeId' + this.equipment);
            // console.log('gatewayId' + this.gatewayId);
            this.echartsAjax(this.equipment,this.gatewayId)
            // 获取7要素最新数据
            this.realTimeData(this.equipment,this.gatewayId);
            // 获取设备控制列表
            this.controlNode(greenhouseId,this.equipment);
          }
        }
      })
    },
    // 7要素最新数据
    realTimeData(nodeId,gatewayId) {
      this.$httpWX.get({
        url: '/miniProgram/lastStatus',
        data: {
          'nodeId': nodeId,
          'gatewayId' : gatewayId,
        }
      }).then(res => {
        var data = res.data;
        // console.log("7要素最新数据",data);
        this.timeDate = data.gatherTime;
        let list = data.lastStatus;
        // let colorlist = [
        //   "#50E2CD","#FDC061","#4950B2","#FB724D","#FDC061","#50E2CD","#41A1F2"
        // ]
        for(let i in list){
          //进度条百分比
          list[i].total = this.solitNumber(list[i].attachments.current,list[i].max,list[i].min)
          //进度条正常颜色
          list[i].color = "#6A97FF"
          //进度条报警颜色
          list[i].alertColor = "#FA0830"
          // for(let j in colorlist){
          //   list[i].color = colorlist[i];
          // }
        }
        //单位完善
        list[0].unit = "%RH";
        list[list.length-2].unit = "%RH";
        list[list.length-1].unit = "W/cm²";
        this.equipment = nodeId;
        // console.log("secai",list);
        this.realTimeItems = list;
      })
    },
  },
}
</script>

<style scoped>
.realtimedata{
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
  background: #F3F5F8;
}
/*标题栏背景图 */
.navBackground{
  width: 100vw;
  height:189px;
  position: relative;
  top: 0;
  left: 0;
}
/* 自定义导航 */
.nav {
  width: 100%;
  overflow: hidden;
  position: fixed;
  background: rgba(0,0,0,0);
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



/* 内容区 */
.areaGreenhouseBox{
  width:315px;
  height:105px;
  position: absolute;
  top: 0;
  left: 15px;
  border-radius: 10px;
  background: #fff;
  padding: 20px 15px 0;
  box-shadow:0px 5px 15px 0px rgba(167,197,242,0.3);
}
.A_hook{
  width:315px;
  height: 14px;
  padding: 0 15px;
  position: absolute;
  top: -10px;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.A_hook .hook{
  width:7px;
  height:14px;
  border-radius: 3px;
  background:rgba(255,255,255,1);
  box-shadow:3px 3px 0px 0px rgba(207,217,232,0.7);
}
.areaGreenhouse{
  width: 315px;
  height: 40px;
  line-height: 40px;
  background:rgba(243,245,250,1);
  border-radius:10px;
  margin-bottom: 10px;
  font-size: 15px;
}
.areaGreenhouse .areaDown{
  width: 14.5px;
  height: 14.5px;
  margin-left: 15px;
  margin-right: 19px;
}
.areaGreenhouse .down{
  width: 12px;
  height: 6.5px;
  float: right;
  margin-top: 17px;
  margin-right: 15px;
}

.information{
  height: 493px;
  position: absolute;
  top: 222.5px;
  left: 0;
  overflow-y: auto;
}
.greenhouseWrap .isIphoneX-class{
  height: 618px!important;
}
.greenhouseWrap .isIphoneX11-class{
  height: 645px!important;
}
.information .tabBox{
  width: 100vw;
  height: 28.5px;
  border-radius: 20px;
  padding: 7.5px 0 5px 66px;
  position: fixed;
  left: 0;
  top: calc(100vh – 280px);
  /* top: 280px; */
  z-index: 1;
  background: #F3F5F8;
}
.information .tabBox .tabs{
  width: 82px;
  height: 28.5px;
  line-height: 28.5px;
  text-align: center;
  float: left;
  border-radius: 20px;
  position: relative;
  font-size:15px;
  font-family:PingFang SC;
  font-weight:500;
}
.information .tabBox .tabs .tabs-border{
  width: 32.5px;
  height: 2.5px;
  position: absolute;
  top: 30px;
  left: 27px;
  display: none;
}
.information .tabBox .active{
  font-size:15px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(34,34,34,1);
}
.information .tabBox .active .tabs-border{
  display: block;
}
.Update_time{
  width:315px;
  height:40px;
  padding: 0 15px;
  background:rgba(255,255,255,1);
  box-shadow:0px 5px 15px 0px rgba(167,197,242,0.3);
  border-radius:10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.Update_time .timeTxt{
  font-size:15px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
}
.Update_time .f5Btn{
  width: 23px;
  height: 23px;
}
.tabCountent {
  width: 100vw;
  padding-left: 15px;
  /* max-height: 100%; */
  overflow-x: hidden;
  /* overflow-y: auto; */
  position: relative;
  height: calc(100vh – 310px);
  top: 50px;
  left: 0;
  display: flex;
  justify-content: space-between;
  flex-wrap:wrap;
}
.tabCountent .tab1{
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  height: 100%;
  padding-bottom: 50px;
}
/* .tabCountent .tab2{ */
  /* padding-bottom: 10px; */
/* } */
.information .tabCountent .tabUl,.information .tabCountent .tabUl2{
  width: 360px;
  display: flex;
  justify-content: space-between;
  flex-wrap:wrap;
}
.information .tabCountent .tabUl .tabList{
  width: 165px;
  height: 117px;
  background: #fff;
  border-radius: 10px;
  margin-right: 15px;
  margin-bottom: 15px;
  box-shadow: 0px 0px 20px #e6f0fe;
  position: relative;
  display: inline-block;
  color: #0F3DA8;
}
.information .tabCountent .tabUl .tabList .tabImg{
  width: 29.5px;
  height: 41.5px;
  position: absolute;
  top: 23px;
  left: 10px;
}
.information .tabCountent .tabUl .tabList .tabTitle{
  font-size: 14px;
  margin: 17.5px 0 20px 50px;
  height: 13px;
}
.information .tabCountent .tabUl .tabList .tabNumber{
  font-size: 19px;
  margin-left: 50px;
  font-weight:bold;
}
.information .tabCountent .tabUl .tabList .tabRange{
  width: 100%;
  height: 45px;
  position: relative;
  left: 0;
  bottom: 0;
}
.tabRange .range_bottomSolid{
  width:145px;
  height:1.5px;
  opacity:0.4;
  position: relative;
  left: 10px;
  top: 10px;
}
.tabRange .range_topSolid{
  width:115px;
  height:4px;
  border-radius: 2px;
  position: relative;
  left: 25px;
  top: 8px;
}
.tabRange .range_alert{
  position: absolute;
  top: 0;
  width:21.5px;
  height:21.5px;
}
.leftMin{
  left: 0;
}
.rightMax{
  right:0;
}
.tabRange .range_centerSolid{
  position: relative;
  left: 25px;
  top: -1px;
  width:1px;
  height:15px;
}
.range_centerSolid .range_circular{
  position: absolute;
  left: 0;
  top: 3.5px;
  width:5px;
  height:5px;
  border:2.5px solid rgba(255,255,255,1);
  /* box-shadow:0px 1.5px 4.5px 0px rgba(251,114,77,0.68); */
  border-radius:50%;
}
.tabRange .range_txt{
  width: 145px;
  padding: 0 10px;
  position: relative;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size:10px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(153,153,153,1);
}
.information .tabCountent .tabUl2 .equipmentList{
  width: 345px;
  height: 76px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 15px;
  padding-top: 21px;
  position: relative;
}
.Tourist{
  margin: 70px 0 0 42.5px;
  width:260px;
  height:53px;
  background:rgba(119,119,119,1);
  border-radius:4px;
  text-align: center;
  padding-top: 18px;
}
.Tourist img{
  width: 17px;
  height: 17px;
  margin-right: 15px;
  vertical-align: middle;
}
.Tourist span{
  font-size:17px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
  vertical-align: middle;
}
.information .tabCountent .dataEcharts{
  width: 335px;
  background: #fff;
  border-radius: 10px;
  padding: 15px 0 0 15px;
  /* height: 350px; */
  /* overflow:scroll; */
}
.information .tabCountent .dataEcharts .formBox{
  position: absolute;
}
.information .tabCountent .dataEcharts .formBox .user{
  width: 109px;
  height: 27.5px;
  line-height: 27.5px;
  padding-left: 5.5px;
  background: #F3F5FA;
  border: 1px solid #D8D8D8;
  border-radius: 5px;
  float: left;
  margin-right: 15px;
  font-size: 14px;
  color: #666666;
}
.information .tabCountent .dataEcharts .formBox .user .userDown{
  width: 12px;
  height: 6.5px;
  float: right;
  margin: 10.5px 5px;
}
.information .tabCountent .dataEcharts .formBox .exportBtn{
  width: 56px;
  height: 27.5px;
  line-height: 25px;
  text-align: center;
  color: #175CFF;
  font-size: 13px;
  border-radius: 50px;
  float: right;
  background: transparent;
  border: 1px solid #175CFF;
  margin-right: 15px;
}
.equipmentList .equipmentImg{
  width: 50px;
  height: 50px;
  margin: 0 31px 0 25px;
  float: left;
}
.equipmentList .equipmentTitle{
  font-size: 15px;
  color: #0F3DA8;
  height: 14.5px;
  line-height: 14px;
  margin-bottom: 30.5px;
}
.equipmentStatus .statusTitle{
  font-size: 14px;
  color: #333333;
}
.equipmentStatus .statusTitle img{
  width: 10px;
  height: 10px;
  margin-right: 10px;
}
.equipmentStatus .statusTitle .spantz{
  color: #F91062;
  font-weight:bold;
}
.equipmentStatus .statusTitle .spankq{
  color: #0DC0A6;
  font-weight:bold;
}
.equipmentStatus .statusTitle .switchBtn{
  position: absolute;
  right: 25px;
  bottom: 10px;
}
.mask{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:rgba(0,0,0,.7);
  z-index:900;
  transition:all .2s ease-in-out;
  opacity:1;
}
.mask .asShow{
  position:fixed;
  width:100%;
  box-sizing:border-box;
  left:0;
  right:0;
  bottom:0;
  background:#f7f7f7;
  transform:translate3d(0,0,0);
  transform-origin:center;
  transition:all .2s ease-in-out;
  z-index:900;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 537px;
  background: #F9FAFC;
  padding: 30px 15px 0 15px;
}
.mask .asShow>img{
  width: 19px;
  height: 19px;
  position: absolute;
  top: 15px;
  right: 15px;
}
.maskLi{
  margin-bottom: 16px;
  position: relative;
}
.maskLi .homeLogo{
  width: 32.5px;
  height: 32.5px;
  margin-right: 15.5px;
  float: left;
}
.maskLi .gray{
  width: 1px;
  height: 56.5px;
  position: absolute;
  left:16.5px;
  top:50px;
}
.maskLi .maskArea{
  font-size: 15px;
  color: #0F3DA8;
  font-weight: bold;
  margin-bottom: 10px;
}
.maskLi .maskList{
  width: 282px;
  height: 67.5px;
  border-radius: 10px;
  background: #fff;
  color: #666666;
  font-size: 14px;
  box-shadow: 0px 0px 20px #e6f0fe;
  margin-left: 48px;
  padding-top: 10px;
  padding-left: 15px;
}
.maskLi .maskList span{
  float: left;
  width: 79px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-right: 15px;
  /* background: #175CFF; */
  border-radius: 20px;
  margin-bottom: 10px;
}
.echarts-wrap {
  width: 100%;
  /* height: 315px; */
  margin-top: 45px;
}
.sjImg{
  width: 12.5px;
  height: 7.5px;
  position: absolute;
  right:42.5px;
  top: -7px;
}
</style>
