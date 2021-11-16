import request from '../../utils/request'
const state = {
  dbList:[]
}

const mutations = {
  ADD_DB_CONFIG (state,config) {
    state.dbList.push(config);
  },
  REMOVE_DB_CONFIG (state,config) {
    let index = state.map(item=>JSON.stringify(item)).indexOf(JSON.stringify(config));
    if(index !== -1){
      state.splice(index,1);
    }
  }
}

const actions = {
  valideDbConfig({ commit },config) {
    console.log("运行了");
    console.log("运行了");
    let data = config;
    console.log("运行了");
    request.post('valideconfig',data).then(res=>{
      console.log(res);
      commit('ADD_DB_CONFIG',config);
    }).catch(err=>{
      console.log("error",err);
    })
  },
  removeDbConfig({ commit },config){
    commit('REMOVE_DB_CONFIG',config);
  }
}

export default {
  state,
  mutations,
  actions
}
