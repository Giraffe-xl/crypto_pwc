<template>
  <div>
    <br>
    <br>
    <br>
    <div class="forget_password">
      <div class="forget_header">Reset Password</div>
      <br>
      <el-form :model="forget_data" status-icon :rules="forget_rules" ref="forget_data">
        <el-form-item label="Email Address" prop="account">
          <el-input v-model="forget_data.account"></el-input>
        </el-form-item>

        <el-form-item label="New Password" prop="password">
          <el-input type="password" v-model="forget_data.password" autocomplete="off"></el-input>
          <div
            style="password_info"
          >Your password must contain a minimum of 8 characters. It must contain the following: an uppercase letter, a lowercase letter, a number.</div>
        </el-form-item>

        <el-form-item label="Confirm Password" prop="checkPass">
          <el-input type="password" v-model="forget_data.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Verification Code" prop="code">
          <el-input
            type="code"
            v-model="forget_data.code"
            autocomplete="off"
            style="margin-bottom:5px;"
            @keyup.enter.native="submitNewPassword('forget_data')"
            placeholder='Click the "Send" button to get the verification code in your email.'
          ></el-input>
          <el-button
            size="mini"
            class="btn-color"
            v-bind:disabled="disabled"
            @click="getCode"
            id="getCode"
          >Send</el-button>
          <span class="code_msg">{{send_text}}</span>
        </el-form-item>

        <div class="warning_message">{{warningMessage}}</div>

        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="submitNewPassword('forget_data')"
            id="submit-btn"
          >Submit</el-button>
          <el-button size="small" class="btn-color" @click="returnLogin()">Return</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import apiRequest from "../request/request";
import store from "../store";

export default {
  name: "forgot_password",
  data() {
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Email is required."));
      }
      value = value.toLowerCase();
      var email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

      setTimeout(() => {
        if (!email.test(value)) {
          
          callback(new Error("Email address is invalid."));
          this.send_text = "";
        } else {
          callback();
        }
      }, 200);
    };

    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("Password is required."));
      }
      var pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!,.?\"\'\\\/()\[\]<>-]{8,120}$/;

      if (!pwd.test(this.forget_data.password)) {
        callback(new Error("Password is invalid."));
      }
      callback();
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Confirm password is required."));
      } else if (value !== this.forget_data.password) {
        callback(
          new Error("Your password and confirmation password do not match.")
        );
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
      forget_data: {
        account: "",
        password: "",
        checkPass: "",
        code: ""
      },
      forget_rules: {
        account: [{ validator: checkAccount, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }]
      },
      warningMessage: "",
      disabled: false,
      send_text: ""
    };
  },
  mounted() {
    if (store.readToken() !== "") {
      store.deleteToken()
    }
    if (store.readUserName() !== "") {
      store.deleteUserName()
    }
    store.saveIndex("0")
  },
  methods: {
    getCode() {
      this.send_text ="";
      let global = this;
      global.warningMessage="";
      if (global.forget_data.account === "") {
        global.warningMessage = "Please enter your email";
      } else {
        //this.send_text = "";
        global.disabled = true;
        global.send_text = "sending...";
        apiRequest
          .sendRequest(
            "post",
            "/cryptotool/user/code/send",
            JSON.stringify({
              userName: global.forget_data.account,
              codeType: "resetPassword"
            })
          )
          .then(function(response) {
            if (response) {
              if (response.code === "10010") {
                global.warningMessage = response.msg;
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
    submitNewPassword(formName) {
      this.warningMessage="";
      let global = this;
      global.$refs[formName].validate((valid) => {
          if (valid) {
            global.forget_data.account=global.forget_data.account.toLowerCase();
            global.warningMessage = "";
            apiRequest.sendRequest("post",'/cryptotool/user/verify',JSON.stringify({
              username:global.forget_data.account
            })).then(function(response){
              if(response){
                if(response.code==='0'){
                  global.forgetPassword()
                } else {
                  global.warningMessage = response.msg;
                }
              }
            });
        } else {
          return false;
        }
      });
    },
    forgetPassword() {
      let global = this;
      apiRequest
        .sendRequest(
          "post",
          "/cryptotool/user/password/forget",
          JSON.stringify({
            userName: global.forget_data.account,
            password: global.forget_data.password,
            code: global.forget_data.code
          })
        )
        .then(function(response) {
          if (response) {
            if (response.code === "10015") {
              global.warningMessage = "Incorrect code, please check it";
              return false;
            } else if (response.code === "0") {
              global.$message.success(response.msg);
              global.$router.push({ name: "user" });
            } else {
              global.$message.warning(response.msg);
            }
          }
        });
    },
    returnLogin() {
      this.$router.push({ name: "user" });
    }
  }
};
</script>


<style>
.forget_password {
  background-color: #f2f2f2;
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  width: 40%;
  margin: auto;
}
.forget_header {
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: center;
  color: rgb(64, 64, 65);
  font-size: 22px;
  border-bottom: 4px solid #a32020;
}
.el-form-item__label {
  font-size: 18px;
  color: rgb(64, 64, 65);
}
.code_msg {
  margin-top: 10px;
  color: #909399;
}

.btn-color {
  color: rgb(64, 64, 65);
}
.forget_password .el-button--primary {
  color: rgb(254, 250, 245);
}
</style>      