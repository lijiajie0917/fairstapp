import Vue from 'vue'
import Vuex from 'vuex';

// 挂载
Vue.use(Vuex);

const store =  new Vuex.Store({
  state : {
    projectId:'',
    navH:''
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
  }
});

export default store;
