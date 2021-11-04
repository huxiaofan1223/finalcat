import axios from 'axios'
import { Message} from 'element-ui';

let baseURL = 'http://127.0.0.1:3000'
const service = axios.create({
  baseURL,
  timeout: 10000
});

service.interceptors.request.use(config => {
  //  let token = localStorage.getItem("token");
  //  if(token!==undefined&&token!==""&&token!==null){
  //     token = "Bearer " + token;
  //     config.headers.Authorization= token;
  //   }
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(response => {
  if(response.data.code === 200){
    return response.data;
  } else {
    let msg = response.data.msg;
    if(typeof msg !== 'string')
      msg = JSON.stringify(msg);
    Message({
      type:"error",
      duration:3000,
      showClose:true,
      message:msg
    });
    return Promise.reject(response);
  }
}, error => {
  if (error && error.response) {
    if(error.response.status === 401){
      localStorage.setItem("token","");
      Message.error("请重新登录");
    }
    Message.error(error.response.data.msg);
    return Promise.reject(error.response)
  }
  if(window.navigator.onLine){
    Message.error("服务器出问题了");
  }else{
      Message.error("请检查本地网络");
  }
  return Promise.reject(error);
})
const get = function(url,params){
  const method = "GET";
  return service({
    url,
    method,
    params
  })
}

const post = function(url,data){
  const method = "POST";
  return service({
    url,
    method,
    data
  })
}
export default {
  get,
  post
}
