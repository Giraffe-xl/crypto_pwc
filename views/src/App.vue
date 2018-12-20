<template>
  <div id="app">
    <div class="topBar">
      <div class="container">
        <div class="topBarLeft">
          <router-link to="/">
            <img src="./assets/pwc-logo.png" alt="logo_s">
          </router-link>
          <span>| PwC Crypto Audit Tool</span>
        </div>
        <div class="topBarRight" v-if="this.$store.readUserName() !=null ">
          <div class="rightFont" style=" line-height: 40px;">
            <router-link to="/cryptoaudit/home">
              <a type="text" style="text-decoration:underline;color: #404041;float:right">Help</a>
            </router-link>
            <span style="float:right">|</span>
            <el-button
              type="text"
              @click="loginOut"
              style="text-decoration:underline;color: #404041;float:right"
            >Log out</el-button>
          </div>
          <div class="rightFont">Welcome, {{ this.$store.readUserName()}}</div>
        </div>
      </div>
    </div>

    <router-view></router-view>

    <!-- <div class="footer">
            <br/>
            <footer class="copyright">
              © 2018 - 2019 PwC. All rights reserved. 
            </footer>
    </div>-->
  </div>
</template>

<script>
import apiRequest from "./request/request";
import store from "./store";

export default {
  name: "App",
  data() {
    return {
      userName: store.readUserName()
    };
  },
  created() {
    this.getConfigJson();
  },
  mounted() {
    this.getConfigJson();

    if (store.readToken() === "" || store.readToken() === null) {
      this.$router.push({ name: "user" });
      return;
    }
    this.getUserName();
    if (store.readUserName() === "" || store.readUserName() === null) {
      this.$router.push({ name: "user" });
      return;
    }
    this.userName = store.readUserName();
  },
  methods: {
    loginOut() {
      let global = this;
      apiRequest
        .sendRequest("post", "/cryptotool/user/logout")
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.$message.success(response.msg);
            } else {
              global.$message.warning(response.msg);
            }
            store.deleteUserName();
            store.deleteToken();
            global.$router.push({ name: "user" });
          }
        });
    },
    getUserName() {
      let global = this;
      apiRequest
        .sendRequest("get", "/cryptotool/user/current/get")
        .then(response => {
          if (response) {
            if (response.code === "0") {
              store.saveUserName(response.data.userName);
            }
          }
        });
    },
    guideOut() {
      this.$router.push({ name: "home" });
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === "/cryptoaudit/user") {
        store.deleteUserName();
        store.deleteToken();
      }
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app {
  /* font-family: georgia,serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
.topBar {
  width: 100%;
  /* width: 100vw; */
  background: #fff;
  height: 85px;
  border-bottom: 1px solid #f3f3f3;
  font-family: georgia, serif;
}
.container {
  width: 80%;
  min-width: 800px;
  height: 100%;
  color: rgb(64, 64, 65);
  margin: auto;
}

.topBarLeft {
  float: left;
  margin-top: 12px;
}
.topBarLeft span {
  float: right;
  margin-top: 32px;
  height: 100%;
}
.topBarRight {
  float: right;
  height: 100%;
  padding-top: 10px;
}
.rightFont {
  height: 40px;
  vertical-align: bottom;
  /* font-size: small */
}
.el-button {
  font-family: georgia, serif;
}

.el-button--text {
  font-family: georgia, serif;
}
.el-input {
  font-size: 16px;
  font-family: georgia, serif !important;
  /* width: 100%; */
}
.el-textarea {
  font-size: 16px;
  font-family: georgia, serif;
}

.el-range-input {
  font-size: 14px !important;
  font-family: georgia, serif;
}
.el-date-editor .el-range-separator {
  font-size: 16px !important;
  font-family: georgia, serif !important;
}
.el-date-editor--datetimerange.el-input__inner {
  width: 80%;
  font-family: georgia, serif;
}
.el-select-dropdown__item {
  color: rgb(64, 64, 65);
  font-size: 14px;
  font-family: georgia, serif;
}
.el-checkbox__inner {
  width: 16px !important;
  height: 16px !important;
}
.el-autocomplete-suggestion li {
  color: rgb(64, 64, 65);
  font-size: 16px;
  font-family: georgia, serif;
}
.el-table {
  font-family: Arial, Helvetica, sans-serif !important;
  font-size: 12px;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}

.footer {
  width: 80%;
  margin: auto;
}

.copyright {
  font-size: 12px;
  text-align: center;
  padding: 10px;
  color: #909399;
}
.el-input__inner {
  color: #909399;
  font-family: georgia, serif;
}
/* input:-moz-placeholder{
  color: #909399;
} */
/* .el-scrollbar */
.el-select-dropdown__wrap {
  color: rgb(64, 64, 65);
  overflow-y: auto;
  max-height: 300px;
}
.el-table .cell {
  line-height: 120%;
}
.el-table__empty-block {
  height: 60px;
  line-height: 60px;
}
.el-dialog {
  color: rgb(64, 64, 65);
}
.el-dialog__body {
  color: rgb(64, 64, 65);
}
.consist_white {
  color: rgb(254, 250, 245);
}
.consist_black {
  color: rgb(64, 64, 65);
}
</style>
