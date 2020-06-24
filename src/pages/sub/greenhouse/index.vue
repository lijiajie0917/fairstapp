<template>
  <div class="greenhouseWrap">
    <TitleBar :navTitle="title"></TitleBar>
    <SelectOption></SelectOption>
    <ul class="timedTask" :style="{
      'top':(navH+175)+'px',
      'height':isIphoneX||isIphoneX11?(screenHeight-350)+'px':(screenHeight-240)+'px'}"
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
            <div class="echarts-wrap" :style="{height: (screenHeight/2.7 + 'px')}">
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
    SelectOption,
    mpvueEcharts,
    TitleBar,
  },
  data () {
    return {
      title:'数据分析',
      navH:this.$store.state.navH,
      equipment:'', //设备名称
      gatewayId:'', //设备ID
      projectId:'', //项目ID

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
    wx.hideShareMenu();//禁止出现转发按钮
    wx.getSystemInfo({
      success: res => {
        this.screenHeight = res.screenHeight;
        this.screenWidth = res.screenWidth;
      }
    });
  },
  watch: {
    '$store.state.equipment': function (newVal) {
      this.equipment = newVal;
      this.date = this.$httpWX.formatTime();
      this.time = this.$httpWX.formatTime();
      this.selectedIndex = 0;
      this.columnKey = "air_temperature";
      this.columnName = '空气温度';
      this.unitName = '℃';
      this.echartsAjax(this.$store.state.gatewayId,this.equipment);
    },
    '$store.state.gatewayId': function (newVal) {
      this.gatewayId = newVal;
    }
  },
  mounted(){
    setTimeout(()=>{
      this.echartsAjax(this.$store.state.gatewayId,this.$store.state.equipment);
    },200);
  },
  methods: {
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
</style>
