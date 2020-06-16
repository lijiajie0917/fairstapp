<template>
  <div>
    <!-- <div class="title_text">{{ navTitle }}</div> -->
    <img class="navBackground" src="../../../static/images/background.png" alt />
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
  </div>
</template>
<script>
export default {
    name: "selectOption",  //下拉选项组件
    props: [],
    data() {
    	return {
        navH: this.$store.state.navH, //导航栏高度
        areaText: "", //默认片区
        greenhouse: "", //默认大棚名称
        maskItems: [], //片区列表内容初始化
        downImage: true, //下拉样式初始化
        visible1: false, //片区弹窗初始化
        equipmentItems2: [], //设备列表初始化
        equipment: "-", //默认设备名字
        projectId:'',
      };
    },
    created:function(){
      wx.hideShareMenu(); //禁止出现转发按钮
    },
    mounted() {
      setTimeout(()=>{
        this.homePage(); //请求下拉框数据
      },200);
      this.projectId = this.$store.state.projectId;
      if (this.visible1 != false) {
        this.visible1 = false;
      }
    },
    methods:{
      // 显示选择片区弹框
      handleOpen1() {
        this.visible1 = true;
        this.downImage = false;
      },
      // 关闭选择片区弹窗
      closeMask() {
        this.visible1 = false;
        this.downImage = true;
      },
      // 片区请求
      homePage() {
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
                // 设置全局默认设备名称和ID
                this.$store.commit('setequipment',this.equipment);
                this.$store.commit('setgatewayId',this.gatewayId);
              }
            }
          });
      },
      // 选择大棚
      areaClick(area,greenhouseId,greenhouse) {
        this.equipmentList(area,greenhouseId,greenhouse);
        this.visible1 = false;
      },
      // 获取选择设备列表
      handleOpen2(e) {
        this.equipmentIndex = e.target.value;
        this.equipment = this.equipmentItems[e.target.value].nodeId;
        this.gatewayId = this.equipmentItems[e.target.value].gatewayId;
        // 改变全局设备名称和ID
        // this.$store.commit('setequipment',this.equipment);
        // this.$store.commit('setgatewayId',this.gatewayId);
        this.$store.commit('setequipment','1111');
        this.$store.commit('setgatewayId','2222');
      },
    }
};
</script>
<style scoped>
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
/* 选择片区的样式    ----  结束*/

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
/* 选择片区的弹窗内容样式    ----  结束*/
.navBackground {
  width: 100vw;
  height: 125px;
  position: relative;
  top: 0;
  left: 0;
}
</style>
