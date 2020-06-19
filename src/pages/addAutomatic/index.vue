<template>
  <div class="addAutomatic">
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
      <div class="title_text">添加自动控制</div>
    </div>
    <div class="addAutoBox" :style="{'top':-(navH+navH)+'px'}">
      <div class="addAuto">
        <div class="maticName">
          <p class="maticNameP">名称：</p>
          <input
            type="text"
            v-model="maticName"
            placeholder-style="color:#B1B0B0;"
            placeholder="手动输入控制名称"
          />
        </div>
        <div class="automaticItem">
          <p>选择条件：</p>
          <div class="content">
            当
            <i-toast id="toast" />
            <form :model="form" autocomplete="off">
              <picker
                class="areaGreenhouse"
                @change="spanChange1"
                :value="spanN1"
                :range-key="'localId'"
                :range="spanTxt1"
              >
                <div class="spanTxt1">
                  <div>{{spanT1}}</div>
                  <img class="choice" src="../../../static/images/down.png" alt />
                </div>
              </picker>
            </form>
            <i-toast id="toast" />
            <form :model="form" autocomplete="off">
              <picker
                class="areaGreenhouse"
                @change="spanChange2"
                :value="spanN2"
                :range-key="'localId'"
                :range="spanTxt2"
              >
                <div class="spanTxt2">
                  <div>{{spanT2}}</div>
                  <img class="choice" src="../../../static/images/down.png" alt />
                </div>
              </picker>
            </form>
            数值
            <div class="maticNum">
              <input type="digit" v-model="maticNum" />
            </div>
          </div>
        </div>
        <div class="automaticItem">
          <p>选择动作：</p>
          <div class="content">
            则
            <i-toast id="toast" />
            <form :model="form" autocomplete="off">
              <picker
                class="areaGreenhouse"
                @change="spanChange3"
                :value="spanN3"
                :range-key="'name'"
                :range="spanTxt3"
              >
                <div class="spanTxt3">
                  <div>{{spanT3}}</div>
                  <img class="choice" src="../../../static/images/down.png" alt />
                </div>
              </picker>
            </form>
            <i-toast id="toast" />
            <form :model="form" autocomplete="off">
              <picker
                class="areaGreenhouse"
                @change="spanChange4"
                :value="spanN4"
                :range-key="'localId'"
                :range="spanTxt4"
              >
                <div class="spanTxt4">
                  <div>{{spanT4}}</div>
                  <img class="choice" src="../../../static/images/down.png" alt />
                </div>
              </picker>
            </form>
          </div>
        </div>
      </div>
      <div class="addAutoBtn" @click="submit()">保存</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectId: '',
      Tourist: "0", //默认非游客模式
      navH: 0, //导航栏高度
      screenHeight: null, //屏幕总高
      maticName: "", //任务名称
      maticNum: "", //限额数值
      spanT1:'空气湿度',//七要素默认值
      spanN1:0,//七要素index
      spanTxt1:[
        {"localId":"空气湿度",
          "name":"airHumidity"
        },
        {"localId":"空气温度",
          "name":"airTemperature"
        },
        {"localId":"光照强度",
          "name":"lux"
        },
        {"localId":"二氧化碳",
          "name":"CO2"
        },
        {"localId":"土壤温度",
          "name":"soilTemperature"
        },
        {"localId":"土壤湿度",
          "name":"soilHumidity"
        },
        {"localId":"土壤ph值",
          "name":"ph"
        }
      ],//七要素
      spanT2:'大于',//大于或小于默认值
      spanN2:0,//大于或小于index
      spanTxt2:[
        {"localId":"大于"},
        {"localId":"小于"}
      ],//大于或小于
      spanT3:'',//设备列表默认值
      spanN3:0,//设备列表index
      spanTxt3:[],//设备列表
      spanT4:'关闭',//关闭或开启默认值
      spanN4:0,//关闭或开启index
      spanTxt4:[
        {"localId":"关闭",
          "state":"CLOSE"
        },
        {"localId":"开启",
          "state":"OPEN"
        }
      ],//关闭或开启
      gatewayId:'',//温室宝gatewayId
      nodeId:'',//温室宝nodeId
      localId:'',//温室宝localId
    };
  },
  created: function() {
    wx.hideShareMenu(); //禁止出现转发按钮
    this.getHeight();
  },
  mounted() {
    this.projectId = wx.getStorageSync('projectId')
    this.getList();
  },
  onLoad (option) {
    this.gatewayId = option.gatewayId
    this.nodeId = option.nodeId
    this.localId = option.localId
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
          that.screenHeight = res.screenHeight;
          that.navH = res.statusBarHeight + 46;
          that.width = res.screenWidth;
        }
      });
    },
    getList() {//获取设备列表
      this.$httpWX
        .get({
          url: "/miniProgram/controlNode",
          data:{
            greenhouseId:123
          }
        })
        .then(res => {
          console.log("自动控制设备列表", res);
          let data = res.data;
          this.spanTxt3 = data;
          this.spanT3 = data[0].name
        });
    },
    submit(){//提交任务内容
      if(this.maticName == ''|| this.maticName.length<=0){
        wx.showToast({
          title: '任务名不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if(this.maticNum == ''|| this.maticNum.length<=0){
        wx.showToast({
          title: '数值不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      let submitData = {}
      if(this.spanT2 == '大于'){
        submitData = {
          "localId": this.spanTxt3[this.spanN3].localId,
          "name": this.spanTxt3[this.spanN3].name,
          'rule':{
            gatewayId:this.gatewayId,
            nodeId:this.nodeId,
            localId:this.localId,
            field:this.spanTxt1[this.spanN1].name,
            'lowWater':{
              'name':this.maticName,
              'limit':this.maticNum,
              'action':this.spanTxt4[this.spanN4].state,
              'isOpen':true
            }
          }
        }
      }else{
        submitData = {
          "localId": this.spanTxt3[this.spanN3].localId,
          "name": this.spanTxt3[this.spanN3].name,
          'rule':{
            gatewayId:this.gatewayId,
            nodeId:this.nodeId,
            localId:this.localId,
            field:this.spanTxt1[this.spanN1].name,
            'highWater':{
              'name':this.maticName,
              'limit':this.maticNum,
              'action':this.spanTxt4[this.spanN4].state,
              'isOpen':true
            }
          }
        }
      }
      this.$httpWX
        .post({
          url: "/miniProgram/autoControl",
          data: submitData
        })
        .then(res => {
          console.log("保存", res);
        });
    },
    spanChange1 (e) {//七要素切换
      // console.log(e)
      this.spanN1 = e.target.value
      this.spanT1 = this.spanTxt1[e.target.value].localId;
    },
    spanChange2 (e) {//大于或小于切换
      // console.log(e)
      this.spanN2 = e.target.value
      this.spanT2 = this.spanTxt2[e.target.value].localId;
    },
    spanChange3 (e) {//设备切换
      // console.log(e)
      this.spanN3 = e.target.value
      this.spanT3 = this.spanTxt3[e.target.value].name;
    },
    spanChange4 (e) {//关闭或开启切换
      // console.log(e)
      this.spanN4 = e.target.value
      this.spanT4 = this.spanTxt4[e.target.value].localId;
    },
  }
};
</script>

<style scoped>
.addAutomatic {
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
}
/*标题栏背景图 */
.navBackground {
  width: 100vw;
  height: 189px;
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
.addAutoBox {
  width: 100%;
  height: 100%;
  padding: 30rpx;
  position: relative;
  top: 0;
  left: 0;
  background: #f3f5f8;
}
.addAuto {
  width: 630rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10rpx 30rpx 0px rgba(167, 197, 242, 0.3);
  border-radius: 20rpx;
  padding: 40rpx 30rpx 60rpx;
}
.maticName {
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(204, 204, 204, 1);
}
.maticNameP {
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 30rpx;
}
.maticName input {
  color: rgba(51, 51, 51, 1);
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 400;
}
.automaticItem {
  padding-top: 45rpx;
}
.automaticItem p {
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 40rpx;
}
.content {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.spanTxt1 {
  width: 213rpx;
  height: 56rpx;
  padding: 0 10rpx;
  background: rgba(243, 245, 250, 1);
  border-radius: 8rpx;
  font-size: 30rpx;
  line-height: 56rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 14rpx;
  margin-right: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spanTxt2 {
  width: 113rpx;
  height: 56rpx;
  background: rgba(243, 245, 250, 1);
  border-radius: 8rpx;
  font-size: 30rpx;
  line-height: 56rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-right: 30rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.choice {
  width: 24rpx;
  height: 14rpx;
}
.maticNum {
  width: 110rpx;
  padding-left: 13rpx;
  color: rgba(51, 51, 51, 1);
  border-bottom: 1rpx solid #ccc;
}
.spanTxt3 {
  width: 213rpx;
  padding: 0 10rpx;
  height: 56rpx;
  background: rgba(243, 245, 250, 1);
  border-radius: 8rpx;
  font-size: 30rpx;
  line-height: 56rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 14rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spanTxt4 {
  width: 213rpx;
  padding: 0 10rpx;
  height: 56rpx;
  background: rgba(243, 245, 250, 1);
  border-radius: 8rpx;
  font-size: 30rpx;
  line-height: 56rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addAutoBtn{
  width:390rpx;
  height:78rpx;
  background:rgba(51,112,255,1);
  box-shadow:0px 10rpx 30rpx 0px rgba(167,197,242,0.3);
  border-radius:12rpx;
  line-height: 76rpx;
  margin: 0 auto;
  text-align: center;
  position: absolute;
  left: 180rpx;
  bottom: 200px;
  font-size:34rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
}
</style>
