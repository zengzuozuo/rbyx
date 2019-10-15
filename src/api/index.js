import axios from "axios";
import qs from 'qs';
import store from "../store/store.js";
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';

axios.defaults.timeout = 10000;   //请求超时时间

axios.interceptors.request.use((config) => {
    config.data.tokenID = localStorage.getItem("zzz") || "";
    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    console.log("传参错误");
});

//添加响应拦截器
axios.interceptors.response.use(function(response){
    //对响应数据做些事
    store.commit("closeWait");
    if(response.data.ztm == 22 || response.data.ztm == 33) {
        localStorage.removeItem("zzz");
        Confirm({
            title: response.data.msg,
            mes: "是否立即登录？",
            opts: () => {
                location.href = "#/login?back=1";
            }
        });
    }
    return response.data;
  },function(error){
    //请求错误时做些事
    if(error.response){
        Alert({mes: '请求失败,错误：' + error.response.status})
    }else {
        Alert({mes: '请求超时请检查网络'})
    }
    
    store.commit("closeWait");
    return Promise.reject(error);
  });

export default axios;
