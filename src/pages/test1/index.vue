<template>
  <div class="insetWrap">
    <img class="insetLogo" src="../../../static/images/inset.jpg" alt="">
    <p class="insetTitle">智慧农业信息化<br/>管理平台</p>
    <div class="projectWrap">
      <div class="project-down" @click="handleOpen2">
        <img class="projectIcon" src="../../../static/images/project.png" alt="">
        {{projectName}}
        <img class="downIcon" :src="iconDown ? prodown : protop" alt="">
      </div>
      <img v-if="visible2" class="eqImg" src="../../../static/images/sj.png" alt="">
      <div v-if="visible2" class="equipmentAlertList">
        <p v-for="(item,index2) in prosItem" :key="index2" @click=equipmentClick(item.name,item.id)>{{item.name}}</p>
      </div>
    </div>
    <!-- <a href="/pages/greenhouse/main"> -->
      <div @click="navigateTo(1)" class="insetBtn">
        智慧大棚
      </div>
    <!-- </a> -->
    <!-- <a href="/pages/test2/main"> -->
      <div @click="navigateTo(2)" class="insetBtn insetBtnGray">
        瓜果蔬菜数字工厂
      </div>
    <!-- </a> -->
  </div>
</template>

<script>

export default {
  // computed: {
  //   count() {
  //     return globalStore.state.count;
  //   }
  // },
  mounted(){
    wx.hideShareMenu();//禁止出现转发按钮
    this.prosItem = wx.getStorageSync('prosItem');
    this.projectId = this.prosItem[0].id;
    // this.$store.commit('setprojectId',this.projectId);
    this.projectName = this.prosItem[0].name;
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      isActive: false,
      showPass:false,
      errorBlock:false,
      iconDown:true,
      prodown:require("../../../static/images/prodown.png"),
      protop:require("../../../static/images/protop.png"),
      visible2:false,
      prosItem:[],
      projectName:'',
      projectId:'',
    }
  },

  methods: {

    handleOpen2 () {
      this.visible2 = !this.visible2;
      this.iconDown = !this.iconDown;
    },
    equipmentClick(name,projectId){
      this.projectName = name;
      this.projectId = projectId;
      // console.log(this.projectId);
      this.$store.commit('setprojectId',this.projectId);
      this.visible2 = false;
      this.iconDown = true;
    },
    navigateTo(num){
      if(this.visible2 != false){
        this.visible2 = false;
      }
      if (num == 1) {
        wx.navigateTo({
          url: `/pages/greenhouse/main?projectId=${this.projectId}`,
        })
      }
    },
    // hanleIncrement() {
    //   globalStore.commit("increment");
    // },
    //
    // hanleDecrement() {
    //   globalStore.commit("decrement");
    // },
    formSubmit (e) {
      // console.log('...');
      console.log(e.mp.detail.value);
    },
    takePhoto() {
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          this.setData({
            src: res.tempImagePath
          })
        }
      })
    },
    error(e) {
      console.log(e.detail)
    },
    saoma() {
      wx.scanCode({
        success: (res) => {
          console.log(res)
        }
      })
    },
  }
};
</script>

<style scoped>
.insetWrap .insetLogo{
  width: 211px;
  height: 170.5px;
  margin: 40px 0 43.5px 81.5px;
}
.insetWrap .insetTitle{
  color: #333333;
  font-size: 24px;
  width: 196.5px;
  height: 53px;
  text-align: center;
  line-height: 35px;
  letter-spacing:2px;
  margin-left: 88.5px;
  margin-bottom:70px;
}
.insetWrap .insetBtn{
  width: 275px;
  height: 44px;
  line-height: 44px;
  font-size: 17px;
  background: #FFFFFF;
  border-radius: 50px;
  color: #0057FF;
  margin-top: 25px;
  box-shadow: 0px 0px 20px #e6f0fe;
  text-align:center;
  margin-left:50px;
}
.insetWrap .insetBtnGray{
  color: #8da7ff;
}
navigator{
  background:#fff;
}
.project-down{
  width: 275px;
  height: 44px;
  line-height: 44px;
  background: #0057FF;
  border-radius: 50px;
  margin-left: 50px;
  color: #fff;
  font-size: 17px;
}
.projectWrap{
  position: relative;
}
.project-down .projectIcon{
  width: 13.5px;
  height: 12px;
  margin: 16.5px 15px 0 22px;
}
.project-down .downIcon{
  width: 14.5px;
  height: 8px;
  float: right;
  margin: 18.5px 22px 0 0;
}
.equipmentAlertList{
  width: 93px;
  /* height: 117.5px; */
  background:rgba(85,85,85,1);
  border-radius:4px;
  /* background-image: url("../../../static/images/back.png");
  background-size: 100% 100%; */
  position: absolute;
  right:55px;
  top: 52.5px;
  z-index:1000;
  padding: 6px 17.5px 6px 20.5px;
  overflow: auto;
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
.eqImg{
  width: 12.5px;
  height: 7.5px;
  position: absolute;
  right:81px;
  top: 45px;
  z-index: 1000;
}
</style>
