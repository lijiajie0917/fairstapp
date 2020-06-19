import Vue from 'vue'
import Vuex from 'vuex';

// 挂载
Vue.use(Vuex);

const store =  new Vuex.Store({
  state : {
    projectId:'', //项目ID
    navH:'',  //获取屏幕高度
    equipment:'', //全局设备名字
    gatewayId:'', //全局设备ID
    localId:'', //全局设备控制唯一ID
    equipmentName:'', //设备唯一名称
    addTimingFlag:'' //添加定时任务刷新列表
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
    // 改变全局控制设备唯一ID
    setlocalId(state,value) {
      state.localId = value
    },
    // 改变全局控制设备唯一ID名称
    setequipmentName(state,value) {
      state.equipmentName = value
    },
    // 添加定时任务刷新列表
    setaddTimingFlag(state,value) {
      state.addTimingFlag = value
    },
  }
});

export default store;
