import Vue from 'vue'
import Vuex from 'vuex';

// 挂载
Vue.use(Vuex);

const store =  new Vuex.Store({
  state : {
    projectId:'',
  },
  mutations : {
    // 改变projectId
    setprojectId(state,value) {
      state.projectId = value
    },
  }
});

export default store;
