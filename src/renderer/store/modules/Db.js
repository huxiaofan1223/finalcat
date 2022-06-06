import request from '../../utils/request'
const state = {
  dbList:[]
}

const mutations = {
  ADD_DB_CONFIG (state,config) {
    if(config !== null)
      state.dbList.push(config);
  },
  REMOVE_DB_CONFIG (state,config) {
    let index = state.dbList.map(item=>JSON.stringify(item)).indexOf(JSON.stringify(config));
    if(index !== -1){
      state.dbList.splice(index,1);
    }
  },
  CLEAR_DB_CONFIG (state) {
    state.dbList = []
  },
}

const actions = {
  valideDbConfig({ commit },config) {
    const data = config;
    return request.post('/valideconfig',data);
  },
  addDbConfig({ commit },config) {
    commit('ADD_DB_CONFIG',config);
  },
  removeDbConfig({ commit },config){
    commit('REMOVE_DB_CONFIG',config);
  },
  clearDbList({commit}){
    commit('CLEAR_DB_CONFIG');
  }
}

export default {
  state,
  mutations,
  actions
}
