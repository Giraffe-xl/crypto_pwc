import ClientRequest from './client'
import store from '../store'
import router from '../router'
import {Message} from 'element-ui'

const fileDownload = require('js-file-download')

export default {
    sendRequest(method,path,params,headers){
        const reqConfig = {
            method: method,
            url:path,
            headers: Object.assign(
                {
                    "Content-Type": "application/json",
                    "X-Token":store.readToken(),
                    "X-Frame-Options":"deny",
                },
                headers
            )
        };
        if (method === 'post'|| method === 'patch'){

            reqConfig.data = params;
            
        } else {
            reqConfig.params = params;
        }       

        return ClientRequest(reqConfig).then(response=>{

            if (response.status && response.status === 200 && response.data.code !== undefined) {

                if (response.data.code === "10003" || response.data.code === "10006") {
                    
                    store.deleteUserName()
                    store.deleteToken()
                    router.replace({
                        name: 'user'
                    })

                    Message.warning(response.data.msg);
                    return
                }
                return response.data;
            } else {
                Message.error("Unexcepted service error，please contact administrator!")
                return;
            }
        }).catch(error=>{
            Message.error(error.toString()+". Please contact administrator!")
            return;
        });
    },
    UploadRequest(method,path,params,headers){

        const reqConfig = {
            method: method,
            url:path,
            headers: Object.assign(
                {
                    "Content-Type": "multipart/form-data",
                    "X-Token":store.readToken(),
                    "X-Frame-Options":"deny",
                },
                headers
            ),
            data:params,
        };
        return ClientRequest(reqConfig).then(response=>{
    
            if (response.status && response.status === 200 && response.data.code !== undefined) {
                if (response.data.code === "10003" || response.data.code === "10006") {
                    router.replace({
                        name: 'user'
                    });
                    store.deleteUserName();
                    store.deleteToken();
                    Message.warning(response.data.msg);
                    return
                }
                return response.data;

            } else {
                Message.error("Unexcepted service error，please contact administrator!")
                return;
            }  
        }).catch(error=>{
            Message.error(error.toString()+". Please contact administrator!")
            return;
        });
    },
    DownloadRequest(method,path,params,headers,filename){

        const reqConfig = {
            method: method,
            url:path,
            headers: Object.assign(
                {
                    "Content-Type": "multipart/form-data",
                    "X-Token":store.readToken(),
                    "X-Frame-Options":"deny",
                },
                headers
            ),
            data:params,
            responseType: "arraybuffer"
        };
        return ClientRequest(reqConfig).then(response=>{
    
            if (response.status && response.status === 200 ) {

                if(response.headers['content-type'].match("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")!==null){
                    fileDownload(response.data, filename)
                } else if (response.headers['content-type'].match("application/json")!==null){

                    const text = Buffer.from(response.data).toString('utf8')
                    var json = JSON.parse(text)
                    if (json.code !== undefined) {
                        if (json.code === "10003" || json.code === "10006") {
                            
                            router.replace({
                                name: 'user'
                            });
                            store.deleteUserName();
                            store.deleteToken();
                            Message.warning(json.msg);
                            return
                        }
                        return Message.warning("Download error!");
                    } else {
                        Message.error("Unexcepted service error，please contact administrator!")
                        return;
                    }

                } else {
                    Message.error("Unexcepted service error，please contact administrator!")
                }
            } else {
                Message.error("Unexcepted service error，please contact administrator!")
                return;
            }
        }).catch(error=>{
            Message.error(error.toString()+". Please contact administrator!");
            return;
        });
    }
}
