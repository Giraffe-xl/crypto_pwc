<template>
  <div>
    <br>
    <br>
    <br>
    <div class="Login_Register_tab">
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="Login" name="first">
          <div>
            <br>
            <el-form
              :model="LoginForm"
              label-position="top"
              status-icon
              :rules="loginrules"
              ref="LoginForm"
              label-width="130px"
              
            >
              <el-form-item label="Email Address" prop="account">
                
                <el-input v-model="LoginForm.account" placeholder="Email Address"></el-input>
                
              </el-form-item>
              
              <el-form-item label="Password" prop="password">
                <el-input
                  type="password"
                  v-model="LoginForm.password"
                  placeholder="Password"
                  @keyup.enter.native="Login('LoginForm')"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <div class="forgetPwd_link">
                <router-link
                  to="/cryptoaudit/forgot_password"
                  class="nav_link"
                >Reset/Forgot Password</router-link>
              </div>
              <div class="warning_message">{{ this.loginWarningMessage }}</div>
              <div class="login_submit">
                <el-form-item>
                  <el-button
                    type="primary"
                   
                    size="small"
                    @click="Login('LoginForm')"
                    style="color:rgb(254,250,245)"
                  >Log In</el-button>
                </el-form-item>
              </div>
              <span style="color:#a32020;font-size:14px;">
                  * Access to the system is for authorized individuals only
              </span>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Register" name="second">
          <div>
            <br>
            <!-- <h2>Register</h2> -->
            <el-form :model="registerForm" label-position="top" :rules="rules" ref="registerForm" >
              <el-form-item label="User Email" prop="account">
                <el-input v-model="registerForm.account"></el-input>
              </el-form-item>
              <el-form-item label="Password" prop="password">
                <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
                <div
                  style="password_info"
                >Your password must contain a minimum of 8 characters. It must contain the following: an uppercase letter, a lowercase letter, a number.</div>
              </el-form-item>
              <el-form-item label="Confirm Password" prop="checkPass">
                <el-input type="password" v-model="registerForm.checkPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Verification Code" prop="code" id="register_code">
                <el-input
                  v-model="registerForm.code"
                  autocomplete="off"
                  style="margin-bottom:5px;"
                  placeholder='Click the "Send" button to get the verification code in your email.'
                  @keyup.enter.native="register('registerForm')"
                >></el-input>
                <el-button size="mini" :disabled="disabled" @click="getCode">Send</el-button>
                <span class="code_msg">{{send_text}}</span>
              </el-form-item>

              <div class="warning_message">{{registerWarningMessage}}</div>
              <el-form-item>
                <el-button
                  class="text_color"
                  type="primary"
                  size="small"
                  @click="register('registerForm')"
                  style="color:rgb(254,250,245)"
                >Register</el-button>
                <el-button size="small" @click="resetForm('registerForm')">Reset</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import apiRequest from "../request/request";
import store from "../store";
// import Vue from 'vue'
export default {
  name: "user",
  data() {
    var checkAccount = (rule, value, callback) => {
      value = value.toLowerCase();
      const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      if (value === "") {
        callback(new Error("Email is required."));
      } else if (!reg.test(value)) {
        return callback(new Error("Email address is invalid."));
      } else {
        callback();
      }
    };
    var loginvalidatePassword = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("Password is required."));
      }
      callback();
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("Password is required."));
      }
      var pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!,.?\"\'\\\/()\[\]<>-]{8,120}$/;

      if (!pwd.test(value)) {
        callback(new Error("Password is invalid."));
      }
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Confirm password is required."));
      } else if (value !== this.registerForm.password) {
        callback(new Error("Your password and confirm password do not match."));
      } else {
        callback();
      }
    };

    var checkCode = (rule, value, callback) => {
      if (value === "") {
        callback(
          new Error(
            "Check your email for the verification code. If it doesn't appear within a few minutes, check your spam folder, or re-click the 'Send' button."
          )
        );
      } else {
        callback();
      }
    };

    return {
      activeName: "first",
      loginWarningMessage: "",
      registerWarningMessage: "",
      disabled: false,
      send_text: "",

      LoginForm: {
        password: "",
        account: ""
      },
      registerForm: {
        password: "",
        checkPass: "",
        account: "",
        code: ""
      },
      loginrules: {
        account: [{ validator: checkAccount, trigger: "blur" }],
        password: [{ validator: loginvalidatePassword, trigger: "blur" }]
      },
      rules: {
        password: [{ validator: validatePassword, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }]
      }
    };
  },
  mounted() {
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
    store.saveIndex("0")
  },
  methods: {
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
    Login(formName) {
      let global = this;
      this.$refs[formName].validate(valid => {
        this.LoginForm.account = this.LoginForm.account.toLowerCase();
        if (valid) {
          apiRequest
            .sendRequest(
              "post",
              "/cryptotool/user/login",
              JSON.stringify({
                userName: global.LoginForm.account,
                password: global.LoginForm.password
              })
            )
            .then(function(response) {
              if (response) {
                if (response.code === "0") {
                  global.$message.success(response.msg);
                  store.saveUserName(global.LoginForm.account);
                  store.saveToken(response.data.token);
                  global.$router.push({ name: "home" });
                } 
                else{
                  global.loginWarningMessage = "login failed";
                  global.LoginForm.password = "";
                }
              }
            });
        }
      });
    },

    getCode() {
      this.send_text ="";
      this.registerWarningMessage="";
      let global = this;
      global.registerWarningMessage = "";
      if (global.registerForm.account === "") {
        global.registerWarningMessage = "Email is required first.";
      } else {
        global.disabled = true;
        global.send_text = "Sending...";
        apiRequest
          .sendRequest(
            "post",
            "/cryptotool/user/code/send",
            JSON.stringify({
              userName: global.registerForm.account,
              codeType: "register"
            })
          )
          .then(function(response) {

              if (response) {
                if (response.code === "10010") {
                  global.registerWarningMessage = response.msg;
                  global.disabled = false;
                  global.send_text = "";
                } else if (response.code === "0") {
                  global.send_text = "Sent successfully";
                  global.disabled = false;
                } else {
                  global.$message.warning(response.msg);
                  global.disabled = false;
                  global.send_text = "";
                }
            }
            else{
              global.disabled = false;
              global.send_text = "";
            }

          });
      }
    },

    register(formName) {
      this.registerWarningMessage="";
      let global = this;
      this.$refs[formName].validate(valid => {
        this.registerForm.account = this.registerForm.account.toLowerCase();
        if (valid) {
          global.registerWarningMessage = "";

          apiRequest
            .sendRequest(
              "post",
              "/cryptotool/user/register",
              JSON.stringify({
                userName: global.registerForm.account,
                password: global.registerForm.password,
                code: global.registerForm.code
              })
            )
            .then(function(response) {
              if (response) {
               if (response.code === "0") {
                    setTimeout(() => {
                    global.$message.success(response.msg);
                    }, 2000);
                  
                  global.$router.push({ name: "user" });

                  //页面刷新
                  location.reload();

                } else if (response.code === "10015") {
                  global.registerWarningMessage =
                    "The verification code is incorrect";
                  return false;
                }
              }
            });
        } else {
          return false;
        }
      });
    },
    handleClick(tab, event) {
      this.resetForm("registerForm");
      this.resetForm("LoginForm");
      (this.loginWarningMessage = ""), (this.registerWarningMessage = "");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.disabled = false;
      this.registerForm.password = "";
      this.send_text = "";
      this.registerWarningMessage="";
      // this.warning_message="";
    }
  }
};
</script>

<style>
.Login_Register_tab {
  background-color: #f2f2f2;
  padding: 20px;
  width: 40%;
  margin: auto;
}
.Login_Register_tab .el-input__inner {
  color: #909399;
}

.el-tabs__item {
  color: rgb(64, 64, 65);
  font-size: 22px;
  text-align: center;
  font-family: georgia, serif;
}
.el-tabs__active-bar {
  height: 6px;
}

.Login_Register_tab h2 {
  color: #909399;
}
.forgetPwd_link {
  padding: 5px;
}

.Login_Register_tab a {
  font-size: 1.142rem;
  color: rgb(64, 64, 65);
  font-family: georgia, serif;
}
.login_submit {
  padding-top: 20px;
}
.el-form {
  font-family: georgia, serif;
}
.el-form-item__label {
  color: rgb(64, 64, 65);
  font-size: 18px;
}
.warning_message {
  text-align: center;
  color: #e0301e;
  height: 40px;
}
.el-form-item__content {
  font-size: 12px;
  line-height: normal;
}
.code_msg {
  margin-top: 10px;
  color: #909399;
}
.Login_Register_tab .el-button {
  color: rgb(64, 64, 65);
}
</style>