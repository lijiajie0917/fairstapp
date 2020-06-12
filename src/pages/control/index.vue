<template>
  <div class="control">
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
      <div class="title_text">设备控制</div>
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
    <div
      class="tabBox"
      :style="{
        'top':isIphoneX||isIphoneX11?'260px':'',
        'height':isIphoneX||isIphoneX11?(screenHeight-350)+'px':(screenHeight-220)+'px'
      }"
      :class="{'isIphoneX-class': isIphoneX,'isIphoneX11-class': isIphoneX11}"
    >
      <div class="tabUl"></div>
      <ul class="tabUl2" v-if="Tourist == '0'">
        <li class="equipmentList" v-for="(item,index) in deciveItems" :key="index">
          <img class="equipmentImg" :src="'https://krjrobot.cn/krjrobot/img/mini/' + item.url" alt />
          <p class="equipmentTitle">{{item.typeName}}</p>
          <div class="equipmentStatus">
            <div class="statusTitle" v-if="item.nodeType == '11'">
              状态：
              <div :class="item.STATUS == '0' ? 'spottz' : (item.STATUS == '1'? 'spotkq' : 'spotdj')"></div>
              <div
                :class="item.STATUS == '0' ? 'spantz' : 'spankq'"
              >{{item.isDamage == '0'? '停止' :(item.STATUS == '1'? '开启' : '待机')}}</div>
            </div>
          </div>
          <i-switch
            class="switchBtn"
            :value="switch1"
            @change="onChange(item.gatewayId,item.nodeId,switch1)"
            slot="footer"
          >
            <view slot="open">开</view>
            <view slot="close">关</view>
          </i-switch>
        </li>
        <li class="equipmentList" v-for="(item,index) in deciveItems" :key="index">
          <img class="equipmentImg" :src="'https://krjrobot.cn/krjrobot/img/mini/' + item.url" alt />
          <p class="equipmentTitle">{{item.typeName}}</p>
          <div class="equipmentStatus">
            <div class="statusTitle" v-if="item.nodeType == '11'">
              状态：
              <div :class="item.STATUS == '0' ? 'spottz' : (item.STATUS == '1'? 'spotkq' : 'spotdj')"></div>
              <span
                :class="item.STATUS == '0' ? 'spantz' : (item.STATUS == '1'? 'spankq' : 'spandj')"
              >{{item.isDamage == '0'? '停止' :(item.STATUS == '1'? '运行' : '待机')}}</span>
            </div>
          </div>
          <div class="switchBtnBox">
            <img class="switchBtnup" src="../../../static/images/up1.png" alt>
            <img class="switchBtning" v-if="item.STATUS == '0'" src="../../../static/images/stop.png" alt>
            <img class="switchBtning" v-if="item.STATUS == '1'" src="../../../static/images/ing.png" alt>
            <img class="switchBtndown" src="../../../static/images/down1.png" alt>
          </div>
        </li>
      </ul>
      <div class="Tourist" v-if="Tourist == '1'">
        <img src="../../../static/images/tips.png" alt />
        <span>体验账号无设备控制权限</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
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
      deciveItems: [],
      maskItems: [],
      switch1: false,
      informShow: true,
      downImage: true,
      visible1: false
    };
  },
  created: function() {
    wx.hideShareMenu(); //禁止出现转发按钮
    this.getHeight();
  },
  mounted() {
    this.homePage();
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
              this.controlNode(greenhouseId, this.equipment);
            }
          }
        });
    },
    controlNode(greenhouseId, nodeId) {
      this.$httpWX
        .get({
          url: "/miniProgram/controlNode",
          data: {
            greenhouseId: greenhouseId,
            nodeId: ""
          }
        })
        .then(res => {
          // console.log("设备状态",res)
          var data = res.data;
          this.deciveItems = data;
        });
    },
    onChange(gatewayId, nodeId, switch1) {
      // console.log(switch1);
      var switchflg = !switch1;
      var cmd = switch1;
      if (cmd == false) {
        cmd = 1;
      } else {
        cmd = 0;
      }
      this.$httpWX
        .post({
          url: "/sensor/" + gatewayId + "/" + nodeId + "/" + cmd,
          data: {}
        })
        .then(res => {
          // console.log(res)
          if (res.status == "200") {
            this.switch1 = switchflg;
          }
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
      this.equipmentClick(
        this.equipment,
        this.equipmentItems[e.target.value].gatewayId
      );
    },
    closeMask() {
      this.visible1 = false;
      this.downImage = true;
      this.informShow = true;
    },
    equipmentClick(nodeId, gatewayId) {
      this.equipment = nodeId;
      this.gatewayId = gatewayId;
      this.controlNode(this.greenhouseDevise, this.equipment);
    }
  }
};
</script>

<style scoped>
.control {
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
.tabBox {
  width: 690rpx;
  position: absolute;
  top: 420rpx;
  left: 30rpx;
  overflow-y: auto;
  padding-top: 20rpx;
}
.tabUl {
  width: 690rpx;
  height: 20rpx;
  background: #f3f5f8;
  position: fixed;
  left: 30rpx;
  top: 420rpx;
  z-index: 1;
}
.equipmentList {
  width: 345px;
  height: 76px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 15px;
  padding-top: 21px;
  position: relative;
}
.equipmentImg {
  width: 50px;
  height: 50px;
  margin: 0 31px 0 25px;
  float: left;
}
.equipmentTitle {
  font-size:15px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(15,61,168,1);
  height: 14.5px;
  line-height: 14px;
  margin-bottom: 30.5px;
}
.equipmentStatus {
  position: relative;
}
.statusTitle {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  display: flex;
  align-items: center;
}
.statusTitle img {
  width: 10px;
  height: 10px;
  margin-right: 10px;
}
.statusTitle .spottz {
  width: 8px;
  height: 8px;
  display: inline-block;
  background: rgba(240, 62, 53, 1);
  border: 2px solid rgba(252, 216, 215, 1);
  border-radius: 50%;
  margin-right: 20rpx;
}
.statusTitle .spotkq {
  width: 8px;
  height: 8px;
  display: inline-block;
  background: rgba(23, 92, 255, 1);
  border: 2px solid rgba(209, 222, 255, 1);
  border-radius: 50%;
  margin-right: 20rpx;
}
.statusTitle .spotdj {
  width: 8px;
  height: 8px;
  display: inline-block;
  background: rgba(13, 192, 166, 1);
  border: 2px solid rgba(207, 242, 237, 1);
  border-radius: 50%;
  margin-right: 20rpx;
}
.statusTitle .spantz {
  color: #f03e35;
}
.statusTitle .spankq {
  color: #175cff;
}
.statusTitle .spandj {
  color: #0dc0a6;
}
.switchBtn {
  position: absolute;
  right: 50rpx;
  top: 71rpx;
}
.switchBtnBox{
  position: absolute;
  right: 30rpx;
  top: 54rpx;
  width:257rpx;
  height:87rpx;
  background:rgba(243,245,248,1);
  border:1rpx solid rgba(216,216,216,1);
  border-radius:4rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.switchBtnup{
  width: 38rpx;
  height: 50rpx;
}
.switchBtning{
  width: 54rpx;
  height: 54rpx;
}
.switchBtndown{
  width: 38rpx;
  height: 50rpx;
}
.Tourist {
  margin: 70px 0 0 42.5px;
  width: 260px;
  height: 53px;
  background: rgba(119, 119, 119, 1);
  border-radius: 4px;
  text-align: center;
  padding-top: 18px;
}
.Tourist img {
  width: 17px;
  height: 17px;
  margin-right: 15px;
  vertical-align: middle;
}
.Tourist span {
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  vertical-align: middle;
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
