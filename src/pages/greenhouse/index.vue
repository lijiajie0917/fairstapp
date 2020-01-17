<template>
  <div class="greenhouseWrap">
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
                <span v-for="(itemwrap,index1) in item.greenhouse" :key="index1" @click=areaClick(item.area,itemwrap.greenhouseId,itemwrap.greenhouse)>{{itemwrap.greenhouse}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <i-toast id="toast" />
      <div class="areaGreenhouse" @click="handleOpen2">
        <img class="areaDown" src="../../../static/images/shebei.png" alt="">
        {{equipment}}号设备
        <img v-if="downImage2" class="down" src="../../../static/images/down.png" alt="">
        <img v-else class="down" src="../../../static/images/top.png" alt="">
      </div>
      <div v-if="visible2" class="equipmentAlertList">
        <img v-if="visible2" class="sjImg" src="../../../static/images/sj.png" alt="">
        <p v-for="(item,index2) in equipmentItems" :key="index2" @click=equipmentClick(item.nodeId,item.gatewayId)>{{item.nodeId}}号设备</p>
      </div>
    </div>
    <div class="information" v-show="informShow"
      :class="{'isIphoneX-class': isIphoneX,'isIphoneX11-class': isIphoneX11}" @click="closeEquipment"
    >
      <div class="tabBox">
        <div class="tabs" @click="cur=0" :class="{active:cur==0}">实时数据
          <img class="tabs-border" src="../../../static/images/border.png" alt="">
        </div>
        <div class="tabs" @click="cur=2" :class="{active:cur==2}">数据分析
          <img class="tabs-border" src="../../../static/images/border.png" alt="">
        </div>
        <div class="tabs" @click="cur=1" :class="{active:cur==1}">设备控制
          <img class="tabs-border" src="../../../static/images/border.png" alt="">
        </div>
      </div>
      <div class="tabCountent">
        <div v-show="cur==0" class='tab1'>
          <div class="Update_time">
            <div class="timeTxt">上次采集时间：{{timeDate.timeHH}}:{{timeDate.timeMM}}:{{timeDate.timeSS}}</div>
            <img class="f5Btn" @click="realTimeData(equipment,gatewayId)" src="../../../static/images/f5.png" alt="">
          </div>
          <ul class="tabUl">
            <li class="tabList" v-for="(item,index3) in realTimeItems" :key="index3">
              <img class="tabImg" :src="'https://krjrobot.cn/krjrobot/img/mini/' + item.url" alt="">
              <p class="tabTitle">{{item.name}}</p>
              <p class="tabNumber">{{item.attachments.current}}{{item.unit}}</p>
              <div class="tabRange">
                <div class="range_bottomSolid" :style="{background:(item.color)}"></div>
                <div class="range_topSolid"
                  :style="{background:(item.total != 'Min' && item.total != 'Max'?item.color:item.alertColor)}"
                ></div>
                <img class="range_alert leftMin"
                  alt=""
                  src="../../../static/images/alert.gif"
                  v-if="item.total == 'Min'"
                >
                <img class="range_alert rightMax"
                  alt=""
                  src="../../../static/images/alert.gif"
                  v-if="item.total == 'Max'"
                >
                <div class="range_centerSolid"
                  v-if="item.total != 'Min' && item.total != 'Max'"
                  :style="{background:(item.color), left:(item.total+28)+'px'}"
                >
                  <div class="range_circular"
                    :style="{background:(item.color), left:(-0.01*width)+'px'}"
                  ></div>
                </div>
                <div class="range_txt"
                  :style="{top:(item.total != 'Min' && item.total != 'Max'?'0':'16px')}"
                >
                  <div>{{item.min}}{{item.unit}}</div>
                  <div>{{item.max}}{{item.unit}}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-show="cur==2" class='tab2'>
          <div class="dataEcharts">
            <form :model="form" autocomplete="off" class="formBox">
              <picker class="user" @change="handlePickerChange" :value="selectedIndex" :range-key="'name'" :range="myAnnual">
                <view class="picker">{{myAnnual[selectedIndex].name}}
                  <img class="userDown" src="../../../static/images/down.png" alt="">
                </view>
              </picker>
              <picker class="user" mode="date" :value="date" start="2015-01-01" end="2020-09-01" @change="bindDateChange">
                <view class="picker">
                  {{time}}
                  <img class="userDown" src="../../../static/images/down.png" alt="">
                </view>
              </picker>
              <!-- <button class="exportBtn" type="button" name="button">导出</button> -->
            </form>
            <div class="echarts-wrap" :style="{height: (screenHeight/2.7 + 'px')}">
              <mpvue-echarts :echarts="echarts" :onInit="dataEcharts" canvasId="demo-canvas" />
            </div>
          </div>
        </div>
        <div v-show="cur==1" class='tab1'>
          <ul class="tabUl2">
            <li class="equipmentList" v-for="(item,index4) in deciveItems" :key="index4">
              <img class="equipmentImg" :src="'https://krjrobot.cn/krjrobot/img/mini/' + item.url" alt="">
              <p class="equipmentTitle">{{item.typeName}}</p>
              <div class="equipmentStatus">
                <p class="statusTitle">
                  状态：
                  <img :src="item.STATUS == '0' ? tingzhi : kaiqi" alt="">
                  <span :class="item.STATUS == '0' ? 'spantz' : 'spankq'">{{item.isDamage == '0'? '停止' :(item.STATUS == '1'? '开启' : '待机')}}</span>
                  <i-switch class="switchBtn" :value="switch1" @change="onChange(item.gatewayId,item.nodeId,switch1)" slot="footer">
                      <view slot="open">开</view>
                      <view slot="close">关</view>
                  </i-switch>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'

let chart

export default {
  components: {
    mpvueEcharts
  },
  data () {
    return {
      echarts,
      areaText:'',
      greenhouse:'',
      equipment:'选择设备',
      cur:0, //默认选中第一个tab
      projectId:7,
      switch1:false,
      visible1:false,
      visible2:false,
      maskItems:[],
      greenhouseId:'',
      gatewayId:'',
      equipmentItems:[],
      realTimeItems:[],
      deciveItems:[],
      tingzhi:require('../../../static/images/icon3.png'),
      kaiqi:require('../../../static/images/icon1.png'),
      isIphoneX: this.globalData.isIphoneX, //适配iphonex
      isIphoneX11:this.globalData.isIphoneX11, //适配iphonex11
      downImage:true,
      downImage2:true,
      form: {
        item: '',
        time: ''
      },
      selectedIndex: 0,
      myAnnual: [
        {name : "空气温度" , key : "air_temperature",unit : "℃"},
        {name : "空气湿度" , key : "air_humidity"},
        {name : "光照度" , key : "lux",unit : "lux"},
        {name : "co2浓度" , key : "CO2",unit : "ppm"},
        {name : "土壤温度" , key : "soil_temperature",unit : "℃"},
        {name : "土壤湿度" , key : "soil_humidity"},
        {name : "酸碱度" , key : "ph"},
      ],
      date: '',
      sysType:1,
      pId:'72845e87-eabb-41dc-8157-5f62a7d2721e',
      nodeId:6,
      time:'',
      timeAge:[],
      dataAge:[],
      startLength:'',
      columnKey:'air_temperature',
      columnName:'空气温度',
      unitName:'℃',
      screenWidth:'',
      screenHeight:'',
      navH: 0, //导航栏高度
      width: 0, //进度条宽度
      timeDate:{},
      informShow:true,
    }
  },
  created:function(){
    this.getHeight();
    this.homePage();
    wx.hideShareMenu();//禁止出现转发按钮
    this.date = this.$httpWX.formatTime();
    this.time = this.$httpWX.formatTime();

    wx.getSystemInfo({
      success: res => {
        this.screenWidth = res.screenWidth;
        this.screenHeight = res.screenHeight;
      }
    })
  },
  mounted(){
    this.projectId = this.$root.$mp.query.projectId;
    // let pages = getCurrentPages();
    // let currentPage = pages[pages.length-1]
    // console.log("currentPage",currentPage)
    if(this.visible1 != false){
      this.visible1 = false
    }
    if(this.visible2 != false){
      this.visible2 = false
    }
    if(this.cur != 0){
      this.cur = 0
    }
  },
  methods: {
    // 初始化echarts
    dataEcharts (canvas, width, height) {
      // 初始化宽高
      chart = echarts.init(canvas, null, {
        width: this.screenWidth - 50,
        height: this.screenHeight/2.8,
        // width:width,
        // height:300,
      });

      canvas.setChart(chart);

      // 请求图表数据
      this.echartsAjax();

      // 返回动态触摸效果
      return chart

    },
    echartsAjax(){
      this.$httpWX.post({
        // this.gatewayId 改为 this.pId 查看已有数据
        url: '/miniProgram/history',
        data: {
          gatewayId:this.gatewayId,
          nodeId:this.equipment,
          time:this.time,
          field:this.columnKey,
        }
      }).then(res => {
        var data = res.data;
        this.timeAge = [];
        this.dataAge = [];
        for (var i = 0; i < data.length; i++) {
          this.timeAge.push(data[i].gatherTime);
          this.dataAge.push(data[i].field);
        }
        // 设置图表样式及数据
        chart.setOption(this.getBarOption(this.timeAge,this.dataAge))
      })
    },
    getBarOption(timeAge,dataAge){
      if (dataAge.length > 40) {
        this.startLength = 100 - (4000/dataAge.length)
      } else {
        this.startLength = 0;
      }
      return {
        title: {
                text: this.unitName,
                textStyle:{
                  fonnSize :'11'
                }
            },
            // tooltip: {
            //     trigger: 'axis'
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data:[this.columnName]
            },
            dataZoom : [
              {
                   type: 'slider',//图表下方的伸缩条
                   show : true,  //是否显示
                   realtime : true,  //
                   start : this.startLength,  //伸缩条开始位置（1-100），可以随时更改
                   end : 100,  //伸缩条结束位置（1-100），可以随时更改
              },
           ],
            grid: {
                left: '0',
                right: '15px',
                top: '50px',
                bottom: '45px',
                containLabel: true
            },
            toolbox: {
                feature: {
                  restore: {show: true},
                }
            },
            xAxis: {
                type: 'category',
                axisLabel:{
                  interval:5,
                  margin: 15,
                  textStyle: {
                     color: '#444444'
                 },
                },
                axisLine: {  //设置x轴坐标线的样式
                    lineStyle: {
                        color: '#D1D1D1',//x轴坐标线的颜色
                    }
                },
                boundaryGap: false,
                data:timeAge,
            },
            yAxis: {
                // 背景线
                splitLine:{
                  lineStyle:{
                    type:'dashed',
                    color:'#D1D1D1'
                  }
                },
                axisLabel:{
                  margin: 10,
                  textStyle: {
                     color: '#444444'
                 },
                },
                axisTick:{ //y轴刻度线
        		       show:false
                },
                axisLine:{ //y轴
            	    show:false
                },
            },
            series: [
                {
                    name:this.columnName,
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:dataAge,
                    lineStyle:{
                     color:'#175CFF'
                    },
                    itemStyle : {
                              normal : {
                                color:'#175CFF'
                              }
                    },
                    areaStyle: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#175CFF'
                      }, {
                        offset: 1,
                        color: '#fff'
                      }])
                    },
                },
            ]
      }
    },
    // 选择七要素
    handlePickerChange (e) {
      this.selectedIndex = e.target.value
      this.columnKey = this.myAnnual[e.target.value].key
      this.columnName = this.myAnnual[e.target.value].name;
      this.unitName = this.myAnnual[e.target.value].unit;
      this.echartsAjax();
    },
    // 选择时间
    bindDateChange: function(e) {
      // console.log(e.target.value)
      this.date = e.target.value;
      this.time = this.date;
      this.echartsAjax();
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
          this.equipmentList(this.areaText,this.greenhouseId,this.greenhouse);
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
        // let y = time.getFullYear();
        // let m = time.getMonth()+1;
        // let d = time.getDate();
        let h = new Date().getHours();
        let m = new Date().getMinutes();
        let s = new Date().getSeconds();
        // console.log("时间戳",h,mm,s)
        if(h<10){
          h = '0'+h;
        }
        if(m<10){
          m = '0'+m;
        }
        if(s<10){
          s = '0'+s;
        }
        let time = {
          timeHH: h,
          timeMM: m,
          timeSS: s,
        };
        this.timeDate = time;
        var data = res.data;
        // console.log("7要素最新数据",data);
        let list = data;
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
    controlNode(greenhouseId,nodeId) {
      this.$httpWX.get({
        url: '/miniProgram/controlNode',
        data: {
          'greenhouseId': greenhouseId,
          'nodeId' : '',
        }
      }).then(res => {
        // console.log("设备状态",res)
        var data = res.data;
        this.deciveItems = data;
      })
    },
    equipmentClick(nodeId,gatewayId){
      this.realTimeData(nodeId,gatewayId);
      this.equipment = nodeId;
      this.gatewayId = gatewayId;
      this.echartsAjax();
      this.visible2 = false;
      this.downImage2 = true;
    },
    areaClick(area,greenhouseId,greenhouse) {
      this.equipmentList(area,greenhouseId,greenhouse);
      this.visible1 = false;
    },
    onChange(gatewayId,nodeId,switch1){
      // console.log(switch1);
      var switchflg = !switch1;
      var cmd = switch1;
      if (cmd == false) {
        cmd = 1;
      } else {
        cmd = 0;
      }
      this.$httpWX.post({
        url: '/sensor/' + gatewayId + '/' + nodeId + '/' + cmd,
        data: {}
      }).then(res => {
        // console.log(res)
        if (res.status == "200") {
          this.switch1 = switchflg;
        }
      })
    },
    handleOpen1 () {
      this.visible1 = true;
      this.visible2 = false;
      this.downImage = false;
      this.downImage2 = true;
      this.informShow = false;
    },
    handleOpen2 () {
      this.visible2 = !this.visible2;
      this.downImage2 = !this.downImage2;
    },
    closeEquipment () {
      this.visible2 = false;
      this.downImage2 = true;
    },
    closeMask () {
      this.visible1 = false;
      this.downImage = true;
      this.informShow = true;
    },
  }
}
</script>

<style scoped>
.greenhouseWrap{
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
/* html { overflow-x: hidden; overflow-y: hidden; } */

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
  top: 220px;
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
.tabCountent .tab2{
  /* padding-bottom: 10px; */
}
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
.equipmentAlertList{
  width: 93px;
  height: 92px;
  /* background-image: url("../../../static/images/back.png");
  background-size: 100% 100%; */
  background: #555555;
  border-radius: 5px;
  position: fixed;
  right:15px;
  top: 190px;
  z-index:1000;
  padding: 6px 17.5px 6px 20.5px;
  /* overflow: auto; */
}
.equipmentAlertList p{
  color: #fff;
  font-size: 14px;
  height: 37px;
  line-height: 37px;
  text-align: center;
  border-bottom: 1px solid #5E5E5E;
}
.equipmentAlertList :last-child{
  border:none;
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
