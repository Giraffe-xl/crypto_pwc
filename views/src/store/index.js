import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        globalName:'',
        activeIndex: '0',
        authToken:'',
    },
    mutations: {
        changeName(state,name){
            state.globalName = name
        },
        changeToken(state,token){
            state.authToken = token
        },
        changeIndex(state,index){
            state.activeIndex = index
        },       
    }
});

export default {
    store,
    readUserName(){
        if(store.state.globalName===''){
            store.commit('changeName',localStorage.getItem("globalName"));
        }
        return store.state.globalName
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
        if(store.state.authToken===''){
            store.commit('changeToken',localStorage.getItem("authToken"));
        }
        return localStorage.getItem("authToken")
    },
    saveToken(token){
        store.commit('changeToken',token);
        localStorage.setItem("authToken",token);
        return
    },
    deleteToken(){
        store.commit('changeToken','');
        localStorage.removeItem("authToken");
    },
    readIndex(){
        return store.state.activeIndex
    },
    saveIndex(index){
        store.commit('changeIndex',index);
    }
}