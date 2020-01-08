<template>
  <!-- <div class="container btns">
    <div class="btnwrap">
      <button class="calbtn" @click="hanleDecrement">-</button>
      <span class="calnum">{{count}}</span>
      <button class="calbtn" @click="hanleIncrement">+</button>
    </div>
    <div class="fromBtn">
      <form @submit="formSubmit">
        <view class="section section_gap">
          <view class="section__title">switch</view>
          <switch name="switch"/>
        </view>
        <view class="section section_gap">
          <view class="section__title">slider</view>
          <slider name="slider" show-value ></slider>
        </view>
        <view class="btn-area">
          <button formType="submit">Submit</button>
          <button formType="reset">Reset</button>
        </view>
      </form>
    </div>
    <div class="">
      <camera device-position="back" flash="off" @error="error" style="width: 100%; height: 300px;"></camera>
      <button type="primary" @tap="takePhoto">拍照</button>
      <view>预览</view>
      <image mode="widthFix" :src="src"></image>
    </div>
    <button @click="saoma" type="button" name="button">扫码</button>
  </div> -->
  <div class="insetWrap">
    <img class="insetLogo" src="../../../static/images/inset.jpg" alt="">
    <p class="insetTitle">智慧农业信息化<br/>管理平台</p>
    <a href="/pages/greenhouse/main">
      <div class="insetBtn">
        智慧农业大棚
      </div>
    </a>
    <a href="#">
      <div class="insetBtn insetBtnGray">
        瓜果蔬菜数字工厂
      </div>
    </a>
  </div>
</template>

<script>
import globalStore from "../../stores/global-store";

export default {
  computed: {
    count() {
      return globalStore.state.count;
    }
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
      closeeyesImg:require("../../../static/images/closeeyes.png"),
      openeyesImg:require("../../../static/images/openeyes.png"),
    }
  },

  methods: {
    hanleIncrement() {
      globalStore.commit("increment");
    },

    hanleDecrement() {
      globalStore.commit("decrement");
    },
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
  margin: 67px 0 43.5px 81.5px;
}
.insetWrap .insetTitle{
  color: #333333;
  font-size: 19px;
  width: 196.5px;
  height: 53px;
  text-align: center;
  line-height: 35px;
  letter-spacing:2px;
  margin-left: 88.5px;
}
.insetWrap .insetBtn{
  width: 294.5px;
  height: 46.5px;
  line-height: 46.5px;
  font-size: 17px;
  background: #FFFFFF;
  border-radius: 50px;
  color: #0057FF;
  margin-top: 50px;
  box-shadow: 0px 0px 20px #e6f0fe;
  text-align:center;
  margin-left:40px;
}
.insetWrap .insetBtnGray{
  color: #8da7ff;
}
navigator{
  background:#fff;
}
</style>
