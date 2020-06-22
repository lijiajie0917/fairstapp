<template>
  <div class="realtimedata">
    <img class="navBackground" src="../../../static/images/background.png" alt />
    <div class="nav" :style="{height:(navH)+'px'}">
      <div class="title_icon">
        <img
          class="back"
          src="../../../static/images/backIcon.png"
          @click="navBack"
          alt
          mode="aspectFit"
        />
      </div>
      <div class="title_text">实时数据</div>
    </div>
    <div class="areaGreenhouseBox" :style="{'top':(navH+20)+'px'}">
      <div class="A_hook">
        <div class="hook"></div>
        <div class="hook"></div>
      </div>
      <div class="areaGreenhouse" @click="handleOpen1">
        <img class="areaDown" src="../../../static/images/area.png" alt />
        {{areaText}}片区—{{greenhouse}}
        <img
          v-if="downImage"
          class="down"
          src="../../../static/images/down.png"
          alt
        />
        <img v-else class="down" src="../../../static/images/top.png" alt />
      </div>
      <div v-if="visible1" class="mask">
        <div class="asShow">
          <img @click="closeMask" src="../../../static/images/close.png" alt />
          <ul class="maskUl">
            <li class="maskLi" v-for="(item,index) in maskItems" :key="index">
              <img class="homeLogo" :src="'https://krjrobot.cn/krjrobot/img/mini/' + item.url" alt />
              <p class="maskArea">{{item.area}}片区</p>
              <img class="gray" src="../../../static/images/gray.png" alt />
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
      <!-- <i-toast id="toast" /> -->
      <form :model="form" autocomplete="off">
        <picker
          class="areaGreenhouse"
          @change="handleOpen2"
          :value="equipmentIndex"
          :range-key="'nodeId'"
          :range="equipmentItems2"
        >
          <view class="picker">
            <img class="areaDown" src="../../../static/images/shebei.png" alt />
            {{equipment+'号设备'}}
            <img
              class="down"
              src="../../../static/images/down.png"
              alt
            />
          </view>
        </picker>
      </form>
    </div>
    <div
      class="tabBox"
      :style="{
        'top':isIphoneX||isIphoneX11?'260px':'',
        'height':isIphoneX||isIphoneX11?(screenHeight-350)+'px':(screenHeight-220)+'px'
      }"
      :class="{'isIphoneX-class': isIphoneX,'isIphoneX11-class': isIphoneX11}"
    >
      <div class="realtime" :style="{'top':isIphoneX||isIphoneX11?'250px':''}">
        <div class="Update_time">
          <div class="timeTxt">上次采集时间：{{timeDate}}</div>
          <img
            class="f5Btn"
            @click="realTimeData(equipment,gatewayId)"
            src="../../../static/images/f5 (2).png"
            alt
          />
        </div>
      </div>
      <ul class="tabUl">
        <li class="tabList" v-for="(item,index) in realTimeItems" :key="index">
          <!-- <img class="tabImg" :src="'https://krjrobot.cn/krjrobot/img/mini/' + item.url" alt=""> -->
          <img class="tabImg" :src="'https://dev.krjrobot.cn/krjrobot/img/mini/' + item.url" alt />
          <p class="tabTitle">{{item.name}}</p>
          <p class="tabNumber">{{item.attachments.current}}{{item.unit}}</p>
          <div class="tabRange">
            <div class="range_bottomSolid" :style="{background:(item.color)}"></div>
            <div
              class="range_topSolid"
              :style="{background:(item.total != 'Min' && item.total != 'Max'?item.color:item.alertColor)}"
            ></div>
            <img
              class="range_alert leftMin"
              alt
              src="../../../static/images/alert.gif"
              v-if="item.total == 'Min'"
            />
            <img
              class="range_alert rightMax"
              alt
              src="../../../static/images/alert.gif"
              v-if="item.total == 'Max'"
            />
            <div
              class="range_centerSolid"
              v-if="item.total != 'Min' && item.total != 'Max'"
              :style="{background:(item.color), left:(item.total+28)+'px'}"
            >
              <div
                class="range_circular"
                :style="{background:(item.color), left:(-0.01*width)+'px'}"
              ></div>
            </div>
            <div
              class="range_txt"
              :style="{top:(item.total != 'Min' && item.total != 'Max'?'0':'16px')}"
            >
              <div>{{item.min}}{{item.unit}}</div>
              <div>{{item.max}}{{item.unit}}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isIphoneX: this.globalData.isIphoneX, //适配iphonex
      isIphoneX11: this.globalData.isIphoneX11, //适配iphonex11
      projectId: '',
      screenWidth: "",
      navH: 0, //导航栏高度
      screenHeight: null,//屏幕总高
      width: 0, //进度条宽度
      timeDate: "",
      informShow: true,
      greenhouseDevise: "",
      Tourist: "0", //默认非游客模式
      areaText: "", //默认区域
      greenhouse: "", //默认大鹏名字
      greenhouseId: "",
      maskItems: [],
      equipment: "-", //默认设备名字
      gatewayId: "", //默认设备
      equipmentItems: [], //设备下拉框
      equipmentItems2: [],
      downImage: true,
      visible1: false,
      realTimeItems: [],
    };
  },
  created: function() {
    wx.hideShareMenu(); //禁止出现转发按钮
    this.getHeight();
  },
  mounted() {
    this.projectId = wx.getStorageSync('projectId')
    // setTimeout(()=>{
      this.homePage();
    // },200);
    // this.projectId = this.$store.state.projectId;
    if (this.visible1 != false) {
      this.visible1 = false;
    }
  },
  methods: {
    /**标题栏返回按钮 */
    navBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    /**测量屏幕高度,计算标题栏高度 */
    getHeight() {
      let that = this;
      wx.getSystemInfo({
        success: function(res) {
          console.log("------", res);
          that.screenHeight = res.screenHeight;
          that.navH = res.statusBarHeight + 46;
          that.width = res.screenWidth;
        }
      });
    },
    // 进度条数值传入当前值，量程上限和量程下限
    solitNumber(num, max, min) {
      let total = parseInt(max - min); //量程范围
      let nim = num - min; //当前值相对于量程所占总数
      let x = nim / total; //当前值随后赞量程百分比
      if (num == min) {
        //当前值等于量程下限
        return 0;
      } else {
        if (x < 1 && x > 0) {
          //当前值处于量程范围内属于正常值
          // console.log(x)
          let w = this.width * 0.3;
          return x * w;
        } else {
          // console.log("x=>",x)
          if (x < 0) {
            // console.log("小于下限",num,min)
            return "Min";
          }
          if (x > 1) {
            // console.log("大于上限",num,max)
            return "Max";
          }
        }
      }
    },
    homePage() {
      console.log("this.projectId",this.projectId)
      this.$httpWX
        .post({
          url: "/miniProgram/groupInfo/" + this.projectId,
          data: {
            county: "修文县"
          }
          // header: {
          //   'content-type':'application/x-www-form-urlencoded',
          //   'cookie': jsid // 设置cookie
          // },
        })
        .then(res => {
          var data = res.data;
          if (data.level == "area") {
            this.areaText = data.value[0].area; //默认区域
            this.greenhouse = data.value[0].greenhouse[0].greenhouse; //默认大鹏名字
            this.greenhouseId = data.value[0].greenhouse[0].greenhouseId; //默认大棚id
            this.maskItems = data.value; //片区和大棚下拉框
            // 获取默认设备列表
            this.equipmentList(
              this.areaText,
              this.greenhouseId,
              this.greenhouse
            );
            // setTimeout(, 2000);
          }
        });
    },
    equipmentList(area, greenhouseId, greenhouse) {
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
              this.areaText = area; //默认区域
              this.greenhouse = greenhouse; //默认大鹏名字
              this.equipment = data.value[0].nodeId; //默认设备名字
              this.gatewayId = data.value[0].gatewayId; //默认设备id
              this.equipmentItems = data.value; //设备下拉框
              this.equipmentItems2 = [];
              for (var i = 0; i < data.value.length; i++) {
                this.equipmentItems2.push({
                  nodeId: data.value[i].nodeId + "号设备"
                });
              }
              // 获取7要素最新数据
              this.realTimeData(this.equipment, this.gatewayId);
            }
          }
        });
    },
    areaClick(area,greenhouseId,greenhouse) {
      this.equipmentList(area,greenhouseId,greenhouse);
      this.visible1 = false;
      this.informShow = true;
    },
    // 7要素最新数据
    realTimeData(equipment,gatewayId) {
      this.$httpWX
        .get({
          url: "/miniProgram/lastStatus",
          data: {
            nodeId: equipment,
            gatewayId: gatewayId
          }
        })
        .then(res => {
          var data = res.data;
          // console.log("7要素最新数据", data);
          this.timeDate = data.gatherTime;
          let list = data.lastStatus;
          for (let i in list) {
            //进度条百分比
            list[i].total = this.solitNumber(
              list[i].attachments.current,
              list[i].max,
              list[i].min
            );
            //进度条正常颜色
            list[i].color = "#6A97FF";
            //进度条报警颜色
            list[i].alertColor = "#FA0830";
          }
          //单位完善
          list[0].unit = "%RH";
          list[list.length - 2].unit = "%RH";
          list[list.length - 1].unit = "W/cm²";
          // this.equipment = nodeId;
          this.realTimeItems = list;
        });
    },
    handleOpen1() {
      this.visible1 = true;
      this.downImage = false;
      this.informShow = false;
    },
    handleOpen2(e) {
      this.equipmentIndex = e.target.value;
      // console.log(e);
      this.equipment = this.equipmentItems[e.target.value].nodeId;
      this.gatewayId = this.equipmentItems[e.target.value].gatewayId;
      this.realTimeData(this.equipment,this.gatewayId);
    },
    closeMask() {
      this.visible1 = false;
      this.downImage = true;
      this.informShow = true;
    },
    equipmentClick(nodeId,gatewayId){
      this.equipment = nodeId;
      this.gatewayId = gatewayId;
      this.realTimeData(nodeId,gatewayId);
    },
  }
};
</script>

<style lang="wxss">
/* page {
  overflow-y: auto !important;
} */
.realtimedata {
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
  background: #f3f5f8;
}
/*标题栏背景图 */
.navBackground {
  width: 100vw;
  height: 189px;
  position: relative;
  top: 0;
  left: 0;
}
/* 自定义导航 */
.nav {
  width: 100%;
  overflow: hidden;
  position: fixed;
  background: rgba(0, 0, 0, 0);
  top: 0;
  left: 0;
  z-index: 10;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);
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
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}

.title_icon {
  position: absolute;
  bottom: 10rpx;
  left: 10rpx;
  border-radius: 70rpx;
  box-sizing: border-box;
  display: flex;
  z-index: 20;
}

.title_icon image {
  display: inline-block;
  overflow: hidden;
  padding: 16rpx 32rpx;
  text-align: center;
  width: 20px;
  height: 14px;
}

.title_icon view {
  height: 18px;
  border-left: 1px solid #eaeaea;
  margin-top: 6px;
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
.realtime{
  width: 690rpx;
  height: 60rpx;
  background: #f3f5f8;
  padding-top: 20rpx;
  position: fixed;
  left: 30rpx;
  top: 420rpx;
  z-index: 1;

}
.Update_time {
  width: 630rpx;
  height: 40px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 15px 0px rgba(167, 197, 242, 0.3);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.Update_time .timeTxt {
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.Update_time .f5Btn {
  width: 23px;
  height: 23px;
}
.tabBox {
  width: 690rpx;
  position: absolute;
  top: 420rpx;
  left: 30rpx;
  overflow-y: auto;
}
.tabUl {
  width: 690rpx;
  display: flex;
  overflow-y: auto;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  left: 0;
  top: 100rpx;
  padding-top: 20rpx;
  padding-bottom: 50rpx;
}
.tabList {
  width: 165px;
  height: 117px;
  background: #fff;
  border-radius: 10px;
  /* margin-right: 10px; */
  margin-bottom: 30rpx;
  box-shadow: 0px 0px 20px #e6f0fe;
  position: relative;
  /* display: inline-block; */
  color: #0f3da8;
}

.tabList .tabImg {
  width: 29.5px;
  height: 41.5px;
  position: absolute;
  top: 23px;
  left: 10px;
}
.tabList .tabTitle {
  font-size: 14px;
  margin: 17.5px 0 20px 50px;
  height: 13px;
}
.tabList .tabNumber {
  font-size: 19px;
  margin-left: 50px;
  font-weight: bold;
}
.tabList .tabRange {
  width: 100%;
  height: 45px;
  position: relative;
  left: 0;
  bottom: 0;
}
.tabRange .range_bottomSolid {
  width: 145px;
  height: 1.5px;
  opacity: 0.4;
  position: relative;
  left: 10px;
  top: 10px;
}
.tabRange .range_topSolid {
  width: 115px;
  height: 4px;
  border-radius: 2px;
  position: relative;
  left: 25px;
  top: 8px;
}
.tabRange .range_alert {
  position: absolute;
  top: 0;
  width: 21.5px;
  height: 21.5px;
}
.leftMin {
  left: 0;
}
.rightMax {
  right: 0;
}
.tabRange .range_centerSolid {
  position: relative;
  left: 25px;
  top: -1px;
  width: 1px;
  height: 15px;
}
.range_centerSolid .range_circular {
  position: absolute;
  left: 0;
  top: 3.5px;
  width: 5px;
  height: 5px;
  border: 2.5px solid rgba(255, 255, 255, 1);
  border-radius: 50%;
}
.tabRange .range_txt {
  width: 145px;
  padding: 0 10px;
  position: relative;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
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
