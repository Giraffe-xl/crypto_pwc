<template>
	<div id="business" @click="clicked">
    	<div class="nav_head">
            <div class="head_ul">

            <el-menu
                :default-active="this.$store.readIndex()"
                mode="horizontal"
                @select="handleSelect"
                background-color="#a32020"
                text-color="rgb(254, 250, 245)"
                id="header">
                    <el-menu-item index="0" style="display:none;"></el-menu-item>
                    <el-menu-item index="1">Client Management</el-menu-item>
                    <el-menu-item index="2">Address Management</el-menu-item>
                    <el-menu-item index="3">Address Validation</el-menu-item>
            </el-menu>

            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>

import store from '../store'
export default {
    name:'home',
    data() {
        return {
            activeIndex: '0',
            lTime: new Date().getTime(), // 最后一次点击的时间
            ctTime: new Date().getTime(), //当前时间
            tOut: 8 * 60 * 60 * 1000,   
            myVar:null,
        }
    },

    mounted(){

        if (store.readToken() === "" || store.readToken() === null) {
            this.$router.push({ name: "user" });
            return
        }
        if (store.readUserName() === "" || store.readUserName() === null) {
            this.getUserName();
        }
        if (store.readUserName() === "" || store.readUserName() === null) {    
            this.$router.push({ name: "user" });
            return;
		}

        this.myVar = window.setInterval(this.tTime, 1000);
        
    },

    methods: { 
        getUserName(){
            apiRequest.sendRequest("get","/cryptotool/user/current/get").then(response=> {
                if(response){
                    if (response.code === "0") {
                        store.saveUserName(response.data.userName)
                    }
                }
            });
        },

        handleSelect(key, keyPath) {
           if(key==="1"){
                this.$router.push({ name: "clientlist" });
            } else if(key==="2"){
                this.$router.push({ name: "manageaddress" });
            } else if(key==="3"){
                this.$router.push({ name: "validateaddress" });
            }
        },

        tTime() {
            this.ctTime = new Date().getTime()
            if (this.ctTime -this.lTime > this.tOut) {
                this.$router.push({ name: "user" });
                window.clearInterval(this.myVar)
            }
        },
        clicked() {
            this.lTime = new Date().getTime()  
        },

        // readPath(){

        //     this.href_path=window.location.href.split('#')[1];
        //     if(this.href_path){ 
        //         if(this.href_path==="/cryptoaudit/home/introduction"){
        //             this.activeIndex ="0";
        //         }else if(this.href_path==="/cryptoaudit/home/clientlist"){
        //             this.activeIndex="1";
        //         }else if(this.href_path==="/cryptoaudit/home/address/manage"){
        //             this.activeIndex="2";
        //         }else if(this.href_path==="/cryptoaudit/home/address/validate"){
        //             this.activeIndex="3";
        //         } else {
        //             this.activeIndex ="0";
        //         }
        //     }
        // },
    }
}
</script>

<style>
    body{
        padding: 0;
        margin: 0;
    }
    .nav_head{
        background-color: rgb(163, 32, 32);
        box-shadow: 0 2px 0 #bcbfc5;
        height:50px;
    }
    .nav_head ul{
        margin: 0;
    }
    .head_ul{
        width: 80%;
        min-width:800px;
        margin: auto;
        box-shadow: 0 2px 0 #bcbfc5;
    }

    .head_ul .el-menu{
        border: 0;
    }
    #header .el-menu-item{
        height: 50px;
        line-height: 50px;
    }
    .el-menu-item {
        font-family: georgia,serif;
        font-size: 1.125rem;
    }
    .el-menu--horizontal > .el-menu-item.is-active{
        background: #EB8C00 !important;
        color:rgb(254, 250, 245) !important;
        border-bottom-width: 0px;
    }
    #introduction_index{
        width: 0;
        height: 0;
        padding: 0;
    }
</style>