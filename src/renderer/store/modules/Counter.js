const state = {
  main: 0
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  someAsyncTask({ commit }) {
    console.log("yunxingle");
    commit('INCREMENT_MAIN_COUNTER');
  },
  INCREMENT_MAIN_COUNTER({commit}){
    commit('INCREMENT_MAIN_COUNTER');
  }
}

export default {
  state,
  mutations,
  actions
}
