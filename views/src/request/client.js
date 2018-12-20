import axios from 'axios'
import {Message} from 'element-ui'

// axios.defaults.baseURL = "http://192.168.0.17:19893"//Vue.prototype.ApiUrl //

axios.defaults.timeout = 20000
axios.interceptors.request.use(config => {
   
    return config;
}, err => {
    Message.error(err.toString()+". Please contact administrator!");
    return Promise.resolve(err);
});

axios.interceptors.response.use(response => {

    return response;
}, (err) => { 
    Message.error(err.toString()+". Please contact administrator!");
    return Promise.resolve(err);
});

export default axios