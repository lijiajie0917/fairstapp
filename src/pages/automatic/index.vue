<template>
  <div class="automatic">
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
      <div class="title_text">自动控制</div>
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
    <div class="automaticKong" v-if="0">
      <img src="../../../static/images/automaticjpg.png" alt />
      <p>当前无自动控制任务！</p>
      <div class="addTaskOne">添加自动控制</div>
    </div>
    <img class="addBtn" src="../../../static/images/add.png" alt/>
    <ul class="automaticUl">
      <li class="automaticli">
        <div class="automaticName">
          <i-switch
            class="switchBtn"
            :value="switch1"
            slot="footer"
          >
            <view slot="open">开</view>
            <view slot="close">关</view>
          </i-switch>
          <div>设置水阀上限—002</div>
          <img src="../../../static/images/off.png" alt>
        </div>
        <div class="automaticTxt">
          <div class="automaticItem">
            当<div class="spanTxt1">土壤温度</div>
            大于<div class="spanTxt2">26000RH</div>
          </div>
          <div class="automaticItem">
            则<div class="spanTxt2">水阀—001</div>
            <div class="spanTxt3">开启</div>
          </div>
        </div>
      </li>
      <li class="automaticli">
        <div class="automaticName">
          <i-switch
            class="switchBtn"
            :value="switch1"
            slot="footer"
          >
            <view slot="open">开</view>
            <view slot="close">关</view>
          </i-switch>
          <div>设置水阀下限—002</div>
          <img src="../../../static/images/off.png" alt>
        </div>
        <div class="automaticTxt">
          <div class="automaticItem">
            当<div class="spanTxt1">土壤温度</div>
            大于<div class="spanTxt2">26000RH</div>
          </div>
          <div class="automaticItem">
            则<div class="spanTxt2">水阀—001</div>
            <div class="spanTxt3">关闭</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isIphoneX: this.globalData.isIphoneX, //适配iphonex
      isIphoneX11: this.globalData.isIphoneX11, //适配iphonex11
      projectId: 7,
      equipment: "-", //默认设备名字
      gatewayId: "", //默认设备
      equipmentItems: [], //设备下拉框
      equipmentItems2: [],
      Tourist: "0", //默认非游客模式
      areaText: "", //默认区域
      greenhouse: "", //默认大鹏名字
      greenhouseId: "",
      navH: 0, //导航栏高度
      screenHeight: null, //屏幕总高

    }
  },
  created:function(){
    wx.hideShareMenu(); //禁止出现转发按钮
    this.getHeight();
  },
  mounted(){
    this.homePage();

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
    homePage() {
      // this.projectId = wx.getStorageSync("projectId");
      // let jsid = wx.getStorageSync("JSESSIONID");
      this.$httpWX
        .post({
          url: "/miniProgram/groupInfo/" + this.projectId,
          data: {
            county: "修文县"
          }
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
              // 获取设备控制列表
              // this.controlNode(greenhouseId, this.equipment);
            }
          }
        });
    },
  },
}
</script>

<style scoped>
.automatic{
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
  position: absolute;
  top: 0;
  left: 30rpx;
  border-radius: 10px;
  background: #fff;
  padding: 40rpx 30rpx 10rpx;
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
.automaticKong{
  position: relative;
  top: 170rpx;
  left: 0;
  text-align: center;
}
.automaticKong img{
  width: 436rpx;
  height: 272rpx;
  margin-bottom: 69rpx;
}
.automaticKong p{
  font-size:30rpx;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(102,102,102,1);
  text-align: center;
  margin-bottom: 106rpx;
}
.addTaskOne{
  width:390rpx;
  height:78rpx;
  background:rgba(51,112,255,1);
  border-radius:12rpx;
  line-height: 78rpx;
  font-size:34rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
  text-align: center;
  margin: 0 auto;
}
.automaticUl{
  margin-top: 150rpx;
  padding: 0 30rpx;
}
.automaticli{
  width:610rpx;
  background:rgba(255,255,255,1);
  box-shadow:0px 10rpx 30rpx 0px rgba(167,197,242,0.3);
  border-radius:20rpx;
  padding: 30rpx 40rpx 0;
  margin-bottom: 30rpx;
}
.automaticName{
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 60rpx;
  border-bottom: 1rpx solid rgba(0,0,0,0.14);
  font-size:32rpx;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(9,42,117,1);
}
.automaticName img{
  width: 20rpx;
  height: 20rpx;
}
.switchBtn{
  position: absolute;
  right: 47rpx;
  top: 0;
}
.addBtn{
  position: fixed;
  bottom: 50rpx;
  right: 30rpx;
  width:102rpx;
  height:102rpx;
  background:rgba(51,112,255,1);
  box-shadow:0px 8rpx 29rpx 0px rgba(36,89,213,0.4);
  border-radius:50%;
}
.automaticTxt{
  padding-top: 40rpx;
}
.automaticItem{
  display: flex;
  align-items: center;
  font-size:30rpx;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(153,153,153,1);
  padding-bottom: 40rpx;
}
.spanTxt1{
  width:233rpx;
  height:56rpx;
  background:rgba(243,245,250,1);
  border-radius:8rpx;
  font-size:30rpx;
  line-height: 56rpx;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  margin-left: 14rpx;
  margin-right: 30rpx;
  text-align: center;
}
.spanTxt2{
  width:233rpx;
  height:56rpx;
  background:rgba(243,245,250,1);
  border-radius:8rpx;
  font-size:30rpx;
  line-height: 56rpx;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  margin-left: 14rpx;
  text-align: center;
}
.spanTxt3{
  width:233rpx;
  height:56rpx;
  background:rgba(243,245,250,1);
  border-radius:8rpx;
  font-size:30rpx;
  line-height: 56rpx;
  font-family:PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  margin-left: 100rpx;
  text-align: center;
}
</style>
