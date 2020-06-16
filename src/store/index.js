import Vue from 'vue'
import Vuex from 'vuex';

// 挂载
Vue.use(Vuex);

const store =  new Vuex.Store({
  state : {
    projectId:'', //项目ID
    navH:'',  //获取屏幕高度
    equipment:'', //全局设备名字
    gatewayId:'' //全局设备ID
  },
  mutations : {
    // 改变项目ID
    setprojectId(state,value) {
      state.projectId = value
    },
    // 改变标题栏高度
    setnavH(state,value) {
      state.navH = value
    },
    // 改变全局设备名字
    setequipment(state,value) {
      state.equipment = value
    },
    // 改变全局设备ID
    setgatewayId(state,value) {
      state.gatewayId = value
    },
  }
});

export default store;
