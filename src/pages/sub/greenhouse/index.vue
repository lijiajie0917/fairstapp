<template>
  <div class="greenhouseWrap">
    <TitleBar :navTitle="title"></TitleBar>
      <img class="navBackground" :style="{'top':(navH)+'px'}" src="../../../../static/images/background.png" alt />
      <div class="areaGreenhouseBox" :style="{'top':(navH+20)+'px'}">
        <div class="A_hook">
          <div class="hook"></div>
          <div class="hook"></div>
        </div>
        <div class="areaGreenhouse" @click="handleOpen1">
          <img class="areaDown" src="../../../../static/images/area.png" alt />
          {{areaText}}片区—{{greenhouse}}
          <img
            v-if="downImage"
            class="down"
            src="../../../../static/images/down.png"
            alt
          />
          <img v-else class="down" src="../../../../static/images/top.png" alt />
        </div>
        <div v-if="visible1" class="mask">
          <div class="asShow">
            <img @click="closeMask" src="../../../../static/images/close.png" alt />
            <ul class="maskUl">
              <li class="maskLi" v-for="(item,index) in maskItems" :key="index">
                <img class="homeLogo" :src="'https://krjrobot.cn/krjrobot/img/mini/' + item.url" alt />
                <p class="maskArea">{{item.area}}片区</p>
                <img class="gray" src="../../../../static/images/gray.png" alt />
                <div class="maskList">
                  <span
                    v-for="(itemwrap,index1) in item.greenhouse"
                    :key="index1"
                    @click="areaClick(item.area,itemwrap.greenhouseId,itemwrap.greenhouse)"
                  >{{itemwrap.greenhouse}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <i-toast id="toast" />
        <form :model="form" autocomplete="off">
          <picker
            class="areaGreenhouse"
            @change="handleOpen2"
            :value="equipmentIndex"
            :range-key="'nodeId'"
            :range="equipmentItems2"
          >
            <view class="picker">
              <img class="areaDown" src="../../../../static/images/shebei.png" alt />
              <span>{{equipment+'号设备'}}</span>
              <img
                class="down"
                src="../../../../static/images/down.png"
                alt
              />
            </view>
          </picker>
        </form>
      </div>
    <ul class="timedTask" :style="{
      'top':(navH+175)+'px',
      'height':isIphoneX||isIphoneX11?(screenHeight-350)+'px':(screenHeight-240)+'px'}"
       v-show="informShow"
      >
        <li class="dataEcharts" :style="{height: (screenHeight/2.3 + 'px')}">
          <picker class="user"
              @change="handlePickerChange"
              :value="selectedIndex"
              :range-key="'name'"
              :range="myAnnual"
            >
              <view class="picker">
                {{myAnnual[selectedIndex].name}}
                <img class="userDown" src="../../../../static/images/down.png" alt="">
              </view>
            </picker>
            <picker class="user"
              mode="date"
              :value="date"
              start="2015-01-01"
              end="2030-09-01"
              @change="bindDateChangeOne"
            >
              <view class="picker">
                {{time}}
                <img class="userDown" src="../../../../static/images/down.png" alt="">
              </view>
            </picker>
            <div v-show="echartsShow" class="echarts-wrap" :style="{height: (screenHeight/2.7 + 'px')}">
              <mpvue-echarts :echarts="echarts" :onInit="dataEcharts" canvasId="demo-canvas" />
            </div>
        </li>
    </ul>
  </div>
</template>

<script>

import TitleBar from "@/components/titleBar/index";
import SelectOption from "@/components/selectOption/index";

import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'

let chart

export default {
  components: {
    mpvueEcharts,
    TitleBar,
  },
  data () {
    return {
      title:'数据分析',
      navH:'',
      equipment:'', //设备名称
      gatewayId:'', //设备ID
      projectId:'', //项目ID

      areaText: "", //默认片区
      greenhouse: "", //默认大棚名称
      downImage: true, //下拉样式初始化
      visible1: false, //片区弹窗初始化
      maskItems: [], //片区列表内容初始化
      equipmentIndex:0,
      equipmentItems:[],
      equipmentItems2: [], //设备列表初始化
      equipment: "-", //默认设备名字
      informShow:true,
      echartsShow:true,

      echarts,
      isIphoneX: this.globalData.isIphoneX, //适配iphonex
      isIphoneX11:this.globalData.isIphoneX11, //适配iphonex11
      time:'',
      date:'',
      timeAge:[],
      dataAge:[],
      startLength:'',
      myAnnual: [
        {name : "空气温度" , key : "air_temperature",unit : "℃"},
        {name : "空气湿度" , key : "air_humidity"},
        {name : "光照度" , key : "lux",unit : "lux"},
        {name : "co2浓度" , key : "CO2",unit : "ppm"},
        {name : "土壤温度" , key : "soil_temperature",unit : "℃"},
        {name : "土壤湿度" , key : "soil_humidity"},
        {name : "酸碱度" , key : "ph"},
      ],
      columnKey:'air_temperature',
      columnName:'空气温度',
      unitName:'℃',
      screenWidth:'',
      screenHeight:'',
      selectedIndex: 0,
    }
  },
  created:function(){
    this.navH = wx.getStorageSync('navH');
    wx.hideShareMenu();//禁止出现转发按钮
    this.projectId = wx.getStorageSync('projectId')
    wx.getSystemInfo({
      success: res => {
        this.screenHeight = res.screenHeight;
        this.screenWidth = res.screenWidth;
      }
    });
    this.date = this.$httpWX.formatTime();
    this.time = this.$httpWX.formatTime();
  },
  mounted(){
    this.homePage(); //请求下拉框数据
    if (this.visible1 != false) {
      this.visible1 = false;
    }
  },
  methods: {
    // 显示选择片区弹框
    handleOpen1() {
      this.visible1 = true;
      this.downImage = false;
      this.informShow = false;
    },
    // 关闭选择片区弹窗
    closeMask() {
      this.visible1 = false;
      this.downImage = true;
      this.informShow = true;
    },
    // 片区请求
    homePage() {
      this.$httpWX.post({
          url: "/miniProgram/groupInfo/" + this.projectId,
          data: {
            county: "修文县"
          }
        }).then(res => {
          var data = res.data;
          if (data.level == "area") {
            this.areaText = data.value[0].area; //默认区域
            this.greenhouse = data.value[0].greenhouse[0].greenhouse; //默认大鹏名字
            this.greenhouseId = data.value[0].greenhouse[0].greenhouseId; //默认大棚id
            this.maskItems = data.value; //片区和大棚下拉框
            if (this.navTitle == '定时任务') {
              // 获取控制设备列表
              this.controlNode(this.greenhouseId)
            } else {
              // 获取默认设备列表
              this.equipmentList(this.areaText,this.greenhouseId,this.greenhouse);
            }
          }
        });
    },
    // 获取默认设备列表
    equipmentList(area, greenhouseId, greenhouse) {
      // 设备请求
      this.$httpWX
        .post({
          url: "/miniProgram/groupInfo/" + this.projectId,
          data: {
            county: "修文县",
            area: area,
            greenhouseId: greenhouseId
          }
        })
        .then(res => {
          var data = res.data;
          if (data.level == "nodeInfo") {
            if (data.value.length == 0) {
              wx.showToast({
                title: "暂无数据",
                icon: "none",
                duration: 1000,
                mask: true
              });
            } else {
              this.equipment = data.value[0].nodeId; //默认设备名字
              this.gatewayId = data.value[0].gatewayId; //默认设备id
              this.equipmentItems2 = [];
              this.equipmentItems = data.value;
              for (var i = 0; i < data.value.length; i++) {
                this.equipmentItems2.push({
                  nodeId: data.value[i].nodeId + "号设备"
                });
              }
              this.echartsAjax(this.gatewayId,this.equipment);
              // this.$store.commit('setequipment',this.equipment);
              // this.$store.commit('setgatewayId',this.gatewayId);
            }
          }
        });
    },
    dataEcharts(canvas,width,height){
      chart = echarts.init(canvas, null, {
        width: this.screenWidth - 50,
        height: this.screenHeight/2.8,
      });
      canvas.setChart(chart);

      return chart
    },
    echartsAjax(gatewayId,nodeId){
      this.$httpWX.post({
        url: '/miniProgram/history',
        data: {
          gatewayId:gatewayId,
          nodeId:nodeId,
          time:this.time,
          field:this.columnKey,
        }
      }).then(res => {
        var data = res.data.data;
        if (data.length == 0) {
          this.$httpWX.showErrorToast('暂无数据')
          this.echartsShow = false;
        } else {
          this.echartsShow = true;
          var frequency = (60/res.data.frequency)-1;
          this.timeAge = [];
          this.dataAge = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].gatherTime == "") {
              this.timeAge.push("");
              this.dataAge.push(data[i].field);
            } else {
              this.dataAge.push(data[i].field);
              this.timeAge.push(data[i].gatherTime);
            }
          }
          // 设置图表样式及数据
          chart.setOption(this.getBarOption(this.timeAge,this.dataAge,frequency))
        }
      })
    },
    getBarOption(timeAge,dataAge,frequency){

      if (dataAge.length > 40) {
        if (frequency <= "5") {
          this.startLength = 100 - (6000/dataAge.length)
        } else {
          this.startLength = 100 - (10000/dataAge.length)
        }
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
            tooltip:{
              trigger: 'axis',
              confine: true,
              axisPointer: {
                  type: 'line',
              },
              formatter: function (params, ticket, callback) {
                  //x轴名称
                  var name = params[0].name
                  // //图表title名称
                  var seriesName = params[0].seriesName
                  // //值
                  var value = params[0].value
                  if (name == "") {
                    return' 此时间点暂无数据 ';
                  } else {
                    return '采集时间：' + name + '\n' + seriesName + '：' + value
                  }
              },
              backgroundColor: 'rgba(0,0,0,0.3)', // 背景
            },
            // tooltip: {
            //   trigger: 'axis',
            //   axisPointer: {
            //       type: 'line'
            //   },
            //   formatter: "采集时间：{b}\n{a0}：{c0}",
            //   backgroundColor: 'rgba(0,0,0,0.3)', // 背景
            // },
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
                // splitNumber: 24,
                splitLine: {
                    show: false
                },
                axisLabel:{
                  interval:frequency,
                  margin: 15,
                  textStyle: {
                     color: '#444444'
                  },
                  formatter: function (value,index) {
                    var newstring= value.substring(0,2);

                    return newstring;

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
                    // symbol: "none",
                    type:'line',
                    // stack: '总量',
                    // smooth: true,
                    // showAllSymbol: true, //标注所有数据点,
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
    // 选择时间
    bindDateChangeOne: function(e) {
      this.date = e.target.value;
      this.time = this.date;
      this.echartsAjax(this.gatewayId,this.equipment);
    },
    // 选择七要素
    handlePickerChange (e) {
      this.selectedIndex = e.target.value
      this.columnKey = this.myAnnual[e.target.value].key
      this.columnName = this.myAnnual[e.target.value].name;
      this.unitName = this.myAnnual[e.target.value].unit;
      this.echartsAjax(this.gatewayId,this.equipment);
    },
    // 选择大棚
    areaClick(area,greenhouseId,greenhouse) {
      this.equipmentList(area,greenhouseId,greenhouse);
      this.visible1 = false;
      this.informShow = true;
    },
    // 获取选择设备列表
    handleOpen2(e) {
      this.equipmentIndex = e.target.value;
      this.equipment = this.equipmentItems[e.target.value].nodeId;
      this.gatewayId = this.equipmentItems[e.target.value].gatewayId;
      this.echartsAjax(this.gatewayId,this.equipment);
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
.timedTask{
  position: absolute;
  overflow-y: auto;
  margin-left: 15px;
}
.greenhouseWrap .isIphoneX-class{
  height: 618px!important;
}
.greenhouseWrap .isIphoneX11-class{
  height: 645px!important;
}
.timedTask .dataEcharts{
  width: 330px;
  background: #fff;
  border-radius: 10px;
  padding: 15px 0 0 15px;
  /* margin-bottom: 15px; */
  position: relative;
}
.timedTask .dataEcharts .echartsTitle{
  font-size: 18px;
  color: #333333;
  height: 42px;
}
.timedTask .dataEcharts .user{
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
.timedTask .dataEcharts .user .userDown{
  width: 12px;
  height: 6.5px;
  float: right;
  margin: 10.5px 5px;
}
.timedTask .dataEcharts .exportBtn{
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
.echarts-wrap {
  width: 100%;
  margin-top: 45px;
}
/* ************************** */
.navBackground {
  width: 100vw;
  height: 125px;
  position: relative;
  left: 0;
}
/* 内容区 */
.areaGreenhouseBox {
  z-index: 5;
  width: 630rpx;
  height: 105px;
  position: absolute;
  top: 0;
  left: 30rpx;
  border-radius: 10px;
  background: #fff;
  padding: 40rpx 30rpx 0;
  box-shadow: 0px 5px 15px 0px rgba(167, 197, 242, 0.3);
}
/* 日历样式 */
.A_hook {
  width: 630rpx;
  height: 14px;
  padding: 0 30rpx;
  position: absolute;
  top: -10px;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.A_hook .hook {
  width: 7px;
  height: 14px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 3px 3px 0px 0px rgba(207, 217, 232, 0.7);
}
/* 选择片区的样式    ----  开始*/
.areaGreenhouse {
  width: 315px;
  height: 40px;
  line-height: 40px;
  background: rgba(243, 245, 250, 1);
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 15px;
}
.areaGreenhouse .areaDown {
  width: 14.5px;
  height: 14.5px;
  margin-left: 15px;
  margin-right: 19px;
}
.areaGreenhouse .down {
  width: 12px;
  height: 6.5px;
  float: right;
  margin-top: 17px;
  margin-right: 15px;
}
.areaGreenhouse .areaDown {
  width: 14.5px;
  height: 14.5px;
  margin-left: 15px;
  margin-right: 19px;
}
.areaGreenhouse .down {
  width: 12px;
  height: 6.5px;
  float: right;
  margin-top: 17px;
  margin-right: 15px;
}
/* 选择片区的弹窗内容样式    ----  开始*/
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 900;
  transition: all 0.2s ease-in-out;
  opacity: 1;
}
.mask .asShow {
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f7f7f7;
  transform: translate3d(0, 0, 0);
  transform-origin: center;
  transition: all 0.2s ease-in-out;
  z-index: 900;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 537px;
  background: #f9fafc;
  padding: 30px 15px 0 15px;
}
.mask .asShow > img {
  width: 19px;
  height: 19px;
  position: absolute;
  top: 15px;
  right: 15px;
}
.maskLi {
  margin-bottom: 16px;
  position: relative;
}
.maskLi .homeLogo {
  width: 32.5px;
  height: 32.5px;
  margin-right: 15.5px;
  float: left;
}
.maskLi .gray {
  width: 1px;
  height: 56.5px;
  position: absolute;
  left: 16.5px;
  top: 50px;
}
.maskLi .maskArea {
  font-size: 15px;
  color: #0f3da8;
  font-weight: bold;
  margin-bottom: 10px;
}
.maskLi .maskList {
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
.maskLi .maskList span {
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
</style>
