// import Vue from 'vue'
// import Vuex from 'vuex';
//
// Vue.use(Vuex);
//
// export default new Vuex.Store({
//   state: {
//     count: 0
//   },
//   mutations: {
//     increment: (state) => {
//       state.count += 1
//     },
//     decrement: (state) => {
//       state.count -= 1
//     }
//   }
// });

import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={
     projectId:'7',
   };
const mutations = {
  setprojectId(state, pId) {
    state.projectId= pId;
  },
}
const store = new Vuex.Store({
  state,
  mutations
});

export default store;
