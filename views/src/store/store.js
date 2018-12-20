import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        globalName:'',

    },
    mutations: {
        changeName(state,name){
            state.globalName = name
        }
    }
});

var baseUrl =""
export default {
    store,
    readUserName(){
        return localStorage.getItem("globalName")
    },
    saveUserName(userName){
        
        store.commit('changeName',userName);

        localStorage.setItem("globalName",userName);
    },
    deleteUserName(){
        
        store.commit('changeName','');
        localStorage.removeItem("globalName")
    },
    readToken(){
        return localStorage.getItem("token")
    },
    saveToken(token){

        localStorage.setItem("token",token);
        return
    },
    deleteToken(){

        localStorage.removeItem("token")
    },
    setUrl(url){
        console.log(url)
        baseUrl = url;
    },
    readUrl(){
        return baseUrl;
    }

}