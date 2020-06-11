<template>
  <div class="container">
    <TitleBar :navTitle="title"></TitleBar>
    <ul class="equipmentInfor" :style="{'margin-top':(navH + 15)+'px'}">
      <li @click='showModal2'>
        <span class="liTitle">设备名称：</span>
        <span>{{videoName}}</span>
      </li>
      <li>
        <span class="liTitle">序列号：</span>
        <span>{{num}}</span>
      </li>
      <li>
        <span class="liTitle">当前版本：</span>
        <span>V5.5.5 15485</span>
      </li>
    </ul>
    <button class="unbind" @click="unbind()" type="button" name="button">解绑摄像机</button>
    <modal :hidden="hiddenModal2" title="请输入设备名" confirm-text="确定" cancel-text="取消" @confirm="model2confirm" @cancel="model2cancel">
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
      hiddenModal2:true,
      input:''
    }
  },
  mounted(){
    this.num = this.$root.$mp.query.num
    this.videoName = this.$root.$mp.query.videoName
  },
  created(){

  },
  methods: {
    // 解绑摄像机
    unbind(){
      let confirm = ()=>{
      	this.$httpWX.showSuccessToast('解绑成功')
      }
      this.$httpWX.alert('提示','确定解除设备绑定吗？',confirm,true);
    },
    showModal2(){
      this.hiddenModal2 = false;
    },
    model2confirm(e) {
      this.hiddenModal2 = true;
      this.$httpWX.showSuccessToast('修改成功')
      // this.videoName = this.input;
    },
    model2cancel(e) {
      this.hiddenModal2 = true;
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
</style>
