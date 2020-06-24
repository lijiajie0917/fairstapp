<template>
  <div class="container">
    <TitleBar :navTitle="title"></TitleBar>
    <ul class="equipmentInfor" :style="{'margin-top':(navH + 15)+'px'}">
      <li @click='showModal'>
        <span class="liTitle">设备名称：</span>
        <span class="devicename">{{videoName}}</span>
        <img class="rightIcon" src="../../../../static/images/rightIcon.png" alt="">
      </li>
      <li>
        <span class="liTitle">序列号：</span>
        <span>{{num}}</span>
      </li>
      <li>
        <span class="liTitle">当前版本：</span>
        <span>{{videoVersion}}</span>
      </li>
    </ul>
    <button class="unbind" @click="unbind()" type="button" name="button">解绑摄像机</button>
    <modal :hidden="deviceModal" title="请输入设备名" confirm-text="确定" cancel-text="取消" @confirm="modelconfirm" @cancel="modelcancel">
        <input placeholder='请输入内容' v-model="input"/>
    </modal>
  </div>
</template>

<script>

import TitleBar from "@/components/titleBar/index";

export default {
  components: {
    TitleBar
  },
  data () {
    return {
      num:'',
      videoName:'',
      title:'设备信息',
      navH:this.$store.state.navH,
      deviceModal:true,
      input:'',
      videoVersion:''
    }
  },
  mounted(){
    // 获取视频列表序列号
    this.num = this.$root.$mp.query.num
    // 获取视频列表设备名称
    this.videoName = this.$root.$mp.query.videoName
    // 获取视频版本号
    this.videoVersion = this.$root.$mp.query.Version
  },
  created(){

  },
  methods: {
    // 解绑摄像机
    // unbind(){
    //   let confirm = ()=>{
    //   	this.$httpWX.showSuccessToast('解绑成功')
    //   }
    //   this.$httpWX.alert('提示','确定解除设备绑定吗？',confirm,true);
    // },
    // 点击设备名称弹框显示
    showModal(){
      this.input = '';
      this.deviceModal = false;
    },
    // 确认修改回调
    modelconfirm(e) {
      this.deviceModal = true;
      this.$httpWX.put({
        url: '/ys/device/info',
        data: {
          deviceSerial: this.num,
          deviceName:this.input
        }
      }).then(res => {
        var data = res;
        this.$httpWX.showSuccessToast('修改成功')
        this.videoName = this.input;
        this.$store.commit('setdeviceName',this.input + "!@#$%^&");
      })
    },
    // 取消修改回调
    modelcancel(e) {
      this.deviceModal = true;
    }
  }
};
</script>

<style scoped>
.equipmentInfor{
  width: 305px;
  height: 170.5px;
  box-shadow:0px 5px 15px 0px rgba(167,197,242,0.3);
  border-radius:10px;
  background: #fff;
  padding: 0 20px;
  margin-left: 15px;
}
.equipmentInfor li{
  border-bottom: 1px solid #E5E5E5;
  height: 55px;
  line-height: 55px;
  font-size: 16px;
  position: relative;
}
.equipmentInfor li:last-child{
  border: none;
}
.equipmentInfor li .liTitle{
  color: #333333;
  font-weight: 500;
}
.equipmentInfor li span:nth-child(2){
  float: right;
  color: #656565;
}
.unbind{
  width: 195px;
  height: 39px;
  background: #fff;
  color: #EF3D35;
  border: none;
  box-shadow:0px 5px 15px 0px rgba(167,197,242,0.3);
  border-radius:6px;
  position: absolute;
  left: 90px;
  bottom: 100px;
}
.container {
  background-color: #f3f5f8;
  position: fixed;
  width:100%;
  height: 100%;
}
.devicename{
  width: 192px;
  overflow: auto;
  white-space: nowrap;
  text-align: right;
  margin-right: 24px;
}
.rightIcon{
  width: 8px;
  height: 14.5px;
  position: absolute;
  right: 0;
  top: 21px;
}
</style>
