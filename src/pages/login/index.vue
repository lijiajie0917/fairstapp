<template>
  <div class="container" @click="clickHandle">
    <img class="logoImange" src="../../../static/images/logo.png" alt="">
    <p class="bannerName">智慧农业大棚监测系统</p>
    <form :model="form" autocomplete="off" class="formBox">
      <div class="boxShadow userName">
        <img class="titleImg" src="../../../static/images/username.png" alt="">
        <input class="user"
          @input="show()"
          type="text"
          v-model="form.username"
          placeholder="用户名"
        >
      </div>
      <div class="boxShadow password">
        <img class="titleImg" src="../../../static/images/password.png" alt="">
        <input v-if="showPass"
          type="text"
          class="user"
          @input="show()"
          v-model="form.password"
          placeholder="密码"
        >
        <input v-else
          type="password"
          class="user"
          @input="show($event)"
          v-model="form.password"
          placeholder="密码"
        >
        <img class="eyes"
          :src="showPass ? openeyesImg : closeeyesImg"
          @click="showPass = !showPass"
          alt=""
        >
      </div>
      <button class="butLogin"
        @click="btnLogin"
        :class="{'active':isActive}"
        type="button"
        name="button"
      >登录</button>
      <view class="Tourist"
        @click="btnTourist"
      >体验模式登陆</view>
    </form>
    <p class="errorAlert" v-show="errorBlock">
      密码输入错误！
    </p>
    <footer>北京科瑞杰科技发展有限公司</footer>
  </div>
</template>

<script>

export default {
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
  created:function(){
    wx.hideShareMenu();//禁止出现转发按钮
    // this.$httpWX.setStorage("Tourist", "0")
    // 检查浏览器缓存中是否有账户信息，若有则请求校验
    if(wx.getStorageSync('JSESSIONID')){
      this.checkName(this.$httpWX.getStorage('JSESSIONID'))
    }
  },
  methods: {
    //游客模式按钮
    btnTourist(){
      this.$httpWX.post({
          url: '/mini/signIn',
          data: {
            'username': "guest",
            'password' : "guest",
          },
        }).then(res => {
          if (res.status === '200') {
            // 存入项目列表
            this.$httpWX.setStorage("prosItem",res.data.pros);
            // 改变默认请求头projectId
            this.$store.commit('setprojectId',res.data.pros[0].id);
            // 存入用户token
            this.$httpWX.setStorage('JSESSIONID',res.msg);
            // 存入游客登录标识
            this.$httpWX.setStorage("Tourist", "1");
            // 跳转
            wx.navigateTo({
              url: '/pages/option/main',
            })
          }
        })
    },
    async checkName(token){
      this.$httpWX.post({
        url: '/logined',
        header: {
          'content-Type': 'application/json',
          'Authorization': token
        },
      }).then(res => {
        // console.log("检验登录状态",res)
        var data = res.data;
        if (res.status === '200') {
          // 改变默认请求头projectId
          this.$store.commit('setprojectId',wx.getStorageSync('prosItem')[0].id);
          wx.navigateTo({
            url: '/pages/option/main',
          })
        }
      })
    },
    // 用户名密码输入时触发
    show:function(){
      if (this.form.username != '' && this.form.password != '') {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    },
    // 登录按钮
    btnLogin() {
      if (this.form.username == '' || this.form.password == '') {
        wx.showToast({
            title: '请输入用户名或密码',
            icon: 'none',
            duration: 1000,
            mask:true
        })
      } else {
        this.$httpWX.post({
          url: '/mini/signIn',
          data: {
            'username': this.form.username,
            'password' : this.form.password,
          },
        }).then(res => {
          if (res.status === '200') {
            // 判断输入的用户名是否为游客
            if(this.form.username == 'guest'){
              this.$httpWX.setStorage("Tourist", "1");
            }else{
              this.$httpWX.setStorage("Tourist", "0");
            }
            // 存入项目列表
            this.$httpWX.setStorage("prosItem", res.data.pros);
            // 存入用户token
            this.$httpWX.setStorage('JSESSIONID',res.msg);
            // 改变默认请求头projectId
            this.$store.commit('setprojectId',res.data.pros[0].id);
            // 跳转
            wx.navigateTo({
              url: '/pages/option/main',
            })
          }
        })
      }
    },
  }
}
</script>

<style scoped>
.message {
  color: red;
  padding: 10px;
  text-align: center;
}
.navlink {
  text-decoration: underline;
}
.logoImange{
  width: 70px;
  height: 69px;
  margin: 45.5px 0px 34px 152.5px;
}
.bannerName{
  color: #0057FF;
  font-size: 22px;
  margin-left: 78px;
  margin-bottom: 62px;
}
.formBox .boxShadow{
  width: 294.5px;
  height: 46.5px;
  box-shadow: 0px 0px 20px #e6f0fe;
  border-radius: 50px;
  margin: 0 0 40px 40px;
  position: relative;
}
.formBox .boxShadow .titleImg{
  width: 11.5px;
  height: 13.5px;
  margin: 16.5px 8.5px 0 23.5px;
  float: left;
}
.formBox .boxShadow .user{
  color: #999999;
  font-size: 16px;
  padding-top: 12px;
  width: 210px;
}
.formBox .butLogin{
  width: 294.5px;
  height: 46.5px;
  line-height: 46.5px;
  border: none;
  background: #0057FF;
  border-radius: 50px;
  color: #fff;
  margin-bottom: 28px;
}
.formBox .active{
  color: #fff;
}
footer{
  color: #999999;
  font-size: 12px;
  position: absolute;
  bottom: 29.5px;
  left: 110.5px;
}
.boxShadow .eyes{
  width: 13.5px;
  height: 11.5px;
  position: absolute;
  top: 17.5px;
  right: 23px;
}
.Tourist{
  text-align: center;
  font-size: 18px;
  color: #444;
  background: url("../../../static/images/Tourist.png") no-repeat center center;
  background-size:200px 1px;
}
.errorAlert{
  color: #FFFFFF;
  font-size: 18px;
  width: 180px;
  height: 42px;
  text-align: center;
  border-radius: 5px;
  line-height: 42px;
  position: absolute;
  top: 360px;
  left: 97.5px;
  background: #333333;
}
</style>
