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
          :value="wsbIndex"
          :range-key="'localId'"
          :range="equipmentItems2"
        >
          <view class="picker">
            <img class="areaDown" src="../../../static/images/wsb.png" alt />
            {{wsbId+'号温室宝'}}
            <img class="down" src="../../../static/images/down.png" alt />
          </view>
        </picker>
      </form>
    </div>
    <div class="automaticKong" v-if="kong == true">
      <img src="../../../static/images/automaticjpg.png" alt />
      <p>当前无自动控制任务！</p>
      <div class="addTaskOne" @click="addmatic()">添加自动控制</div>
    </div>
    <img
      class="addBtn"
      v-if="kong == false"
      @click="addmatic()"
      src="../../../static/images/add.png"
      alt
    />

    <div v-if="kong == false"
      class="automaticBox"
      :style="{
        'top':isIphoneX||isIphoneX11?'260px':'',
        'height':isIphoneX||isIphoneX11?(screenHeight-350)+'px':(screenHeight-220)+'px'
      }"
    >
      <ul class="automaticUl">
        <li class="automaticli" v-for="(item,index) in deciveItems" :key="index">
          <div class="automaticName">
            <i-switch
              class="switchBtn"
              :value="item.WisOpen"
              slot="footer"
              @change="onChange(index,item.localId,item.WisOpen,item.isHight)"
            >
              <view slot="open">开</view>
              <view slot="close">关</view>
            </i-switch>
            <div>{{item.Wname}}</div>
            <img
              @click="delBtn(item.isHight,item.localId)"
              src="../../../static/images/off.png"
              alt
            />
          </div>
          <div class="automaticTxt">
            <div class="automaticItem">
              当
              <div class="spanTxt1">{{item.Wfield}}</div>大于
              <div class="spanTxt2">{{item.Wlimit}}</div>
            </div>
            <div class="automaticItem">
              则
              <div class="spanTxt2">{{item.name}}</div>
              <div class="spanTxt3">{{item.Waction}}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="Tourist" v-if="Tourist == '1'" @click="Touristips()">
      <div class="tipsBox" v-if="tipsBox">
        <img src="../../../static/images/tips.png" alt />
        <span>体验账号无设备控制权限</span>
      </div>
    </div>
    <div class="delTips" v-if="delTips">
      <div class="deleteTips">
        <p>确定删除此控制吗？</p>
        <div class="delTipsBtn">
          <div class="delTipsBtnL" @click="cencelDel()">取消</div>
          <div class="delTipsBtnR" @click="trueDel()">确定</div>
        </div>
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
      projectId: wx.getStorageSync("projectId"),
      areaText: "", //默认区域
      greenhouse: "", //默认大鹏名字
      maskItems: [], //大棚下拉框数据
      greenhouseId: "",
      wsbId: "", //默认温室宝localId
      wsbIndex: 0,
      equipmentItems: [], //设备下拉框数据列表
      wsbList: [], //温室宝下拉框数据列表
      equipmentItems2: [], //温室宝下拉框名称列表
      Tourist: "0", //默认非游客模式
      tipsBox:false,//是否显示体验者提示框
      count: '',// 倒计时
      navH: 0, //导航栏高度
      screenHeight: null, //屏幕总高
      switch1: false,
      deciveItems: [], //自动控制任务列表
      kong: false, //任务列表为空
      downImage: true,
      visible1: false,
      delTips: false, //删除弹框是否显示
      delId: "", //删除设备的localId
      isHight: false, //删除设备是否高水位
      isGetItem:false,//是否执行onShow周期中的函数
    };
  },
  created: function() {
    wx.hideShareMenu(); //禁止出现转发按钮
    this.getHeight();
  },
  mounted() {
    this.projectId = wx.getStorageSync("projectId");//获取项目id
    this.Tourist = wx.getStorageSync('Tourist')//获取是否为体验者模式
    this.homePage();
  },
  onShow: function() {
    console.log("onShow",this.isGetItem)
    if(this.isGetItem == true){
      // console.log("11",this.isGetItem)
      this.deciveItems = [];
      this.getList(this.wsbId);
    }else{
      this.deciveItems = [];
    }
  },
  methods: {
    //2秒后提示框消失
    goChoicePeople() {
      const TIME_COUNT = 2
      if (!this.timer) {
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.tipsBox = false;
          }
        }, 1000)
      }
    },
    Touristips(){//体验模式提示
      this.tipsBox = true;
      this.goChoicePeople()
    },
    //显示删除弹框
    delBtn(isHight, id) {
      this.isHight = isHight;
      this.delId = id;
      this.delTips = true;
    },
    // 取消删除
    cencelDel() {
      this.isHight = false;
      this.delId = "";
      this.delTips = false;
    },
    //确定删除
    trueDel() {
      let acTxt = "lowerWater";
      if (this.isHight == true) {
        acTxt = "highWater";
      }
      // console.log(acTxt);
      this.$httpWX
        .post({
          url: "/miniProgram/del/autoControl",
          data: {
            localId: this.delId,
            action: acTxt
          }
        })
        .then(res => {
          // console.log("删除", res);
          if(res.status == '200'){
            this.delTips = false;
            this.deciveItems[i].remove();
            this.isHight = false;
            this.delId = "";
          }else{
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
            return;
          }
        });
    },
    /**标题栏返回按钮 */
    navBack() {
      this.isGetItem = false;
      wx.navigateBack({
        delta: 1
      });
    },
    /**测量屏幕高度,计算标题栏高度 */
    getHeight() {
      let that = this;
      wx.getSystemInfo({
        success: function(res) {
          that.screenHeight = res.screenHeight;
          that.navH = res.statusBarHeight + 46;
          that.width = res.screenWidth;
        }
      });
    },
    //关闭或开启该条任务
    onChange(i, localId, isOpen,isHight) {
      // console.log(i, localId, isOpen);
      let acTxt = "lowerWater";
      if (this.isHight == true) {
        acTxt = "highWater";
      }
      this.$httpWX
        .post({
          url: '/miniProgram/autoControl/ifOpen',
          data: {
            localId:localId,
            isOpen:!isOpen,
            config:acTxt
          }
        })
        .then(res => {
          // console.log(res)
          if (res.status == "200") {
            this.deciveItems[i].WisOpen = !isOpen;
          }
        });
    },
    //获取大棚信息
    homePage() {
      this.$httpWX
        .post({
          url: "/miniProgram/groupInfo/" + this.projectId,
          data: {
            county: "修文县"
          }
        })
        .then(res => {
          // console.log("/*/*/*/", res);
          var data = res.data;
          if (data.level == "area") {
            this.areaText = data.value[0].area; //默认区域
            this.greenhouse = data.value[0].greenhouse[0].greenhouse; //默认大鹏名字
            this.greenhouseId = data.value[0].greenhouse[0].greenhouseId; //默认大棚id
            this.maskItems = data.value; //片区和大棚下拉框
            //获取温室宝
            this.realTimeData(
              this.projectId,
              data.value[0].area,
              data.value[0].greenhouse[0].greenhouseId
            );
          }
        });
    },
    // 温室宝数据
    realTimeData(id, txt, gid) {
      // console.log(id);
      this.$httpWX
        .post({
          url: "/miniProgram/group/sensorInfo",
          data: {
            greenhouseId: gid,
            nodeType: "9"
          }
        })
        .then(res => {
          let data = res.data.rows;
          // console.log("温室宝数据", data);
          this.wsbList = data;
          this.wsbId = data[0].localId;
          this.equipmentItems2 = [];
          for (let j = 0; j < data.length; j++) {
            this.equipmentItems2.push({
              localId: data[j].localId + "号温室宝"
            });
          }
          // 获取自动任务列表
          this.getList(data[0].localId);
        });
    },
    //获取自动任务列表
    getList(id) {
      this.$httpWX
        .get({
          url: "/miniProgram/autoControl/" + id
        })
        .then(res => {
          // console.log("自动控制任务列表", res.data);
          let data = res.data;
          if (data.length > 0) {
            this.kong = false;
            let spanTxt1 = [
              {
                localId: "空气湿度",
                name: "airHumidity",
                company: "%RH"
              },
              {
                localId: "空气温度",
                name: "airTemperature",
                company: "℃"
              },
              {
                localId: "光照强度",
                name: "lux",
                company: "lux"
              },
              {
                localId: "二氧化碳",
                name: "CO2",
                company: "ppm"
              },
              {
                localId: "土壤温度",
                name: "soilTemperature",
                company: "℃"
              },
              {
                localId: "土壤湿度",
                name: "soilHumidity",
                company: "%RH"
              },
              {
                localId: "土壤ph值",
                name: "ph",
                company: "W/cm²"
              }
            ];
            for (let i in data) {
              if (data[i].rule.lowWater.action == "OPEN") {
                data[i].rule.lowWater.action = "开启";
              } else {
                data[i].rule.lowWater.action = "关闭";
              }
              for (let j in spanTxt1) {
                if (spanTxt1[j].name == data[i].rule.field) {
                  data[i].rule.field = spanTxt1[j].localId;
                  data[i].rule.lowWater.limit =
                    data[i].rule.lowWater.limit + spanTxt1[j].company;
                }
              }
              if (
                data[i].rule.highWater == null ||
                data[i].rule.highWater == "null"
              ) {
                data[i] = {
                  isHight: false,
                  frequency: data[i].frequency,
                  localId: data[i].localId,
                  modifyTime: data[i].modifyTime,
                  name: data[i].name,
                  Wfield: data[i].rule.field,
                  WgatewayId: data[i].rule.gatewayId,
                  WlocalId: data[i].rule.localId,
                  Waction: data[i].rule.lowWater.action,
                  WisOpen: data[i].rule.lowWater.isOpen,
                  Wlimit: data[i].rule.lowWater.limit,
                  Wname: data[i].rule.lowWater.name,
                  WnodeId: data[i].rule.nodeId,
                  nullRule: data[i].rule.nullRule,
                  ruleJson: data[i].ruleJson,
                  serialId: data[i].serialId,
                  version: data[i].version
                };
              } else {
                data[i] = {
                  isHight: true,
                  frequency: data[i].frequency,
                  localId: data[i].localId,
                  modifyTime: data[i].modifyTime,
                  name: data[i].name,
                  Wfield: data[i].rule.field,
                  WgatewayId: data[i].rule.gatewayId,
                  WlocalId: data[i].rule.localId,
                  Waction: data[i].rule.highWater.action,
                  WisOpen: data[i].rule.highWater.isOpen,
                  Wlimit: data[i].rule.highWater.limit,
                  Wname: data[i].rule.highWater.name,
                  WnodeId: data[i].rule.nodeId,
                  nullRule: data[i].rule.nullRule,
                  ruleJson: data[i].ruleJson,
                  serialId: data[i].serialId,
                  version: data[i].version
                };
              }
              this.deciveItems = this.deciveItems.concat(data[i]);
              // console.log("数据处理后", this.deciveItems);
            }
          } else {
            this.kong = true;
            this.deciveItems = [];
          }
        });
    },
    /**跳转添加自动任务页 */
    addmatic() {
      // console.log(11111)
      this.isGetItem = true;
      wx.navigateTo({
        url:
          `/pages/addAutomatic/main` +
          `?gatewayId=` +
          this.wsbList[this.wsbIndex].gatewayId +
          `&nodeId=` +
          this.wsbList[this.wsbIndex].nodeId +
          `&localId=` +
          this.wsbList[this.wsbIndex].localId
      });
    },
    handleOpen1() {
      //大鹏下拉
      this.visible1 = true;
      this.downImage = false;
    },
    handleOpen2(e) {
      //温室宝下拉
      this.deciveItems = [];
      this.wsbIndex = e.target.value;
      this.wsbId = this.wsbList[e.target.value].localId;
      this.getList(this.wsbList[e.target.value].localId);
    },
    closeMask() {
      this.visible1 = false;
      this.downImage = true;
    }
  }
};
</script>

<style scoped>
.automatic {
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
  z-index: 999;
  background: rgba(0, 0, 0, 0);
  top: 0;
  left: 0;
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
/* 体验模式 */
.Tourist {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 900;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tipsBox {
  width: 260px;
  height: 53px;
  background: rgba(119, 119, 119, 1);
  border-radius: 4px;
  text-align: center;
  padding-top: 18px;
}
.tipsBox img {
  width: 17px;
  height: 17px;
  margin-right: 15px;
  vertical-align: middle;
}
.tipsBox span {
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  vertical-align: middle;
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

.automaticKong {
  position: relative;
  top: 170rpx;
  left: 0;
  text-align: center;
}
.automaticKong img {
  width: 436rpx;
  height: 272rpx;
  margin-bottom: 69rpx;
}
.automaticKong p {
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  text-align: center;
  margin-bottom: 106rpx;
}
.addTaskOne {
  width: 390rpx;
  height: 78rpx;
  background: rgba(51, 112, 255, 1);
  border-radius: 12rpx;
  line-height: 78rpx;
  font-size: 34rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  margin: 0 auto;
}
.automaticBox {
  width: 690rpx;
  padding: 0 30rpx;
  position: absolute;
  left: 0;
  top: 420rpx;
  height: 100%;
  overflow-y: auto;
}
.automaticUl {
  width: 690rpx;
  overflow-y: auto;
  margin-top: 30rpx;
}
.automaticli {
  width: 610rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10rpx 30rpx 0px rgba(167, 197, 242, 0.3);
  border-radius: 20rpx;
  padding: 30rpx 40rpx 0;
  margin-bottom: 30rpx;
}
.automaticName {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 60rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.14);
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(9, 42, 117, 1);
}
.automaticName img {
  width: 20rpx;
  height: 20rpx;
}
.switchBtn {
  position: absolute;
  right: 47rpx;
  top: 0;
}
.addBtn {
  position: fixed;
  z-index: 99;
  bottom: 50rpx;
  right: 30rpx;
  width: 102rpx;
  height: 102rpx;
  background: rgba(51, 112, 255, 1);
  box-shadow: 0px 8rpx 29rpx 0px rgba(36, 89, 213, 0.4);
  border-radius: 50%;
}
.automaticTxt {
  padding-top: 40rpx;
}
.automaticItem {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  padding-bottom: 40rpx;
}
.spanTxt1 {
  width: 233rpx;
  height: 56rpx;
  background: rgba(243, 245, 250, 1);
  border-radius: 8rpx;
  font-size: 30rpx;
  line-height: 56rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 14rpx;
  margin-right: 24rpx;
  text-align: center;
}
.spanTxt2 {
  width: 233rpx;
  height: 56rpx;
  background: rgba(243, 245, 250, 1);
  border-radius: 8rpx;
  font-size: 30rpx;
  line-height: 56rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 14rpx;
  text-align: center;
}
.spanTxt3 {
  width: 233rpx;
  height: 56rpx;
  background: rgba(243, 245, 250, 1);
  border-radius: 8rpx;
  font-size: 30rpx;
  line-height: 56rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 100rpx;
  text-align: center;
}
.delTips {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background: rgba(51, 51, 61, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.deleteTips {
  width: 690rpx;
  height: 300rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10rpx 30rpx 0px rgba(167, 197, 242, 0.3);
  border-radius: 20rpx;
  font-size: 34rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(33, 33, 33, 1);
  text-align: center;
}
.deleteTips p {
  margin: 60rpx 0;
}
.delTipsBtn {
  display: flex;
  justify-content: space-around;
  align-self: center;
  font-size: 34rpx;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 86rpx;
}
.delTipsBtnL {
  width: 290rpx;
  height: 88rpx;
  border: 1rpx solid rgba(209, 209, 209, 1);
  border-radius: 12rpx;
  color: rgba(51, 51, 51, 1);
}
.delTipsBtnR {
  width: 290rpx;
  height: 88rpx;
  background: rgba(51, 111, 255, 1);
  border-radius: 12rpx;
  color: rgba(255, 255, 255, 1);
}
</style>
