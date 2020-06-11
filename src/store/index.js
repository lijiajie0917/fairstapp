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
    // 改变projectId
    setprojectId(state,value) {
      state.projectId = value
    },
    setnavH(state,value) {
      state.navH = value
    },
  }
});

export default store;
