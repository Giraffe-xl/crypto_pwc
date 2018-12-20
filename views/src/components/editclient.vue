<template>
  <div class="createclient_content">
    <div class="createclient_header">Edit Client</div>
    <br>
    <div class="createclient_form">
      <el-form :model="clientData" :rules="rules" ref="EditClientForm">
        <el-form-item label="Client Name" prop="clientName">
          <el-input v-model="clientData.clientName" placeholder="Client Name"></el-input>
        </el-form-item>
        <el-form-item label="Project Title" prop="projectTitle">
          <el-input v-model="clientData.projectTitle" placeholder="Project Title"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input type="textarea" v-model="clientData.description" placeholder="Description"></el-input>
        </el-form-item>
        <el-form-item label="Time Zone" prop="timeZone">
          <el-select v-model="clientData.timeZone" placeholder="Time Zone">
            <el-option
              v-for="item in timezone_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Audit Period" prop="date">
          <el-date-picker
            v-model="clientData.date[0]"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="Start Time"
            default-time="00:00:00"
          ></el-date-picker>

          <span class="date_span">to</span>

          <el-date-picker
            v-model="clientData.date[1]"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="End Time"
            default-time="23:59:59"
          ></el-date-picker>
        </el-form-item>
        <hr>
        <h3>Users List</h3>
        <el-table :data="clientData.accessList" class="table_color">
          <el-table-column prop="userName" label="Email" align="center"></el-table-column>

          <el-table-column label="Access Level" prop="level" align="center">
            <template slot-scope="scope" class="access_level">
              <el-select v-model="clientData.accessList[scope.$index].level">
                <el-option label="Owner" value="owner"></el-option>
                <el-option label="Team Member" value="teamMember"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="Operation" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="isDelete(scope.$index,scope.row)"
              ></el-button>
              <el-dialog
                title="Delete User"
                :visible.sync="editDeleteDialogVisible"
                :append-to-body="true"
                width="30%"
              >
                <span>Are you sure to</span>
                <span>delete
                  <span>{{user_username}}</span> ？
                </span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="editDeleteDialogVisible = false">Cancel</el-button>
                  <el-button
                    type="primary"
                    @click="deleteUser(scope.$index,clientData.accessList)"
                  >Delete</el-button>
                </span>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-button
            class="user_addBtn"
            type="primary"
            size="mini"
            @click="editDialogVisible = true"
          >
            <i class="el-icon-plus"></i>
          </el-button>
          <el-dialog
            title="Add User"
            :visible.sync="editDialogVisible"
            :before-close="handleClose"
          >
            <el-form :model="addUserData">
              <el-form-item label="Email">
                <el-input v-model="addUserData.userName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Access Level">
                <el-select v-model="addUserData.level">
                  <el-option label="Owner" value="owner"></el-option>
                  <el-option label="Team Member" value="teamMember"></el-option>
                </el-select>
              </el-form-item>
              <div class="warning_message">{{user_message}}</div>
              <div style="text-align:center;">
                <el-button size="mini" @click="handleClose()" class="consist_black">Cancel</el-button>
                <el-button size="mini" type="primary" @click="addUser()" class="consist_white">Add</el-button>
              </div>
            </el-form>
          </el-dialog>
        </div>
        <div class="warning_message">{{prop_message}}</div>
        <div class="create_btn">
          <el-form-item>
            <el-button size="small" @click="returnHome()">Cancel</el-button>
            <el-button type="primary" size="small" @click="Edit_Client('EditClientForm')">Save</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import apiRequest from "../request/request";
import store from "../store";

export default {
  data() {
    var validateClient = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Client name is required"));
      } else {
        callback();
      }
    };
    var validateProject = (rule, value, callback) => {
        
      if (value === "") {
        callback(new Error("Project title is required"));
      } else {
        callback();
      }
    };
    var validateZone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Time zone is required"));
      } else {
        callback();
      }
    };
    var validateDate = (rule, value, callback) => {
      if (value[0] == null || value[1] == null) {
        callback(new Error("Date is required"));
      } else if (value[0] > value[1]) {
        callback(new Error("Start time cannot be greater than end time"));
      } else {
        callback();
      }
    };
    return {
      clientName: "",
      clientData: {
        clientName: "",
        projectTitle: "",
        description: "",
        timeZone: "",
        date: [],
        accessList: []
      },
      timezone_options: [
        { value: "UTC-12", label: "UTC-12（IDL）" },
        { value: "UTC-11", label: "UTC-11（MIT）" },
        { value: "UTC-10", label: "UTC-10（HST）" },
        { value: "UTC-9:30", label: "UTC-9:30（MSIT）" },
        { value: "UTC-9", label: "UTC-9（AKST）" },
        { value: "UTC-8", label: "UTC-8（PST）" },
        { value: "UTC-7", label: "UTC-7（MST）" },
        { value: "UTC-6", label: "UTC-6（CST）" },
        { value: "UTC-5", label: "UTC-5（EST）" },
        { value: "UTC-4", label: "UTC-4（AST）" },
        { value: "UTC-3:30", label: "UTC-3:30（NST）" },
        { value: "UTC-3", label: "UTC-3（SAT）" },
        { value: "UTC-2", label: "UTC-2（BRT）" },
        { value: "UTC-1", label: "UTC-1（CVT）" },
        { value: "UTC", label: "UTC（WET，GMT）" },
        { value: "UTC+1", label: "UTC+1（CET）" },
        { value: "UTC+2", label: "UTC+2（EET）" },
        { value: "UTC+3", label: "UTC+3（MSK）" },
        { value: "UTC+3:30", label: "UTC+3:30（IRT）" },
        { value: "UTC+4", label: "UTC+4（META）" },
        { value: "UTC+4:30", label: "UTC+4:30（AFT）" },
        { value: "UTC+5", label: "UTC+5（METB）" },
        { value: "UTC+5:30", label: "UTC+5:30（IDT）" },
        { value: "UTC+5:45", label: "UTC+5:45（NPT）" },
        { value: "UTC+6", label: "UTC+6（BHT）" },
        { value: "UTC+6:30", label: "UTC+6:30（MRT）" },
        { value: "UTC+7", label: "UTC+7（IST）" },
        { value: "UTC+8", label: "UTC+8（EAT/BJT）" },
        { value: "UTC+9", label: "UTC+9（FET）" },
        { value: "UTC+9:30", label: "UTC+9:30（ACST）" },
        { value: "UTC+10", label: "UTC+10（AEST）" },
        { value: "UTC+10:30", label: "UTC+10:30（FAST）" },
        { value: "UTC+11", label: "UTC+11（VTT）" },
        { value: "UTC+11:30", label: "UTC+11:30（NFT）" },
        { value: "UTC+12", label: "UTC+12（PSTB）" },
        { value: "UTC+12:45", label: "UTC+12:45（CIT）" },
        { value: "UTC+13", label: "UTC+13（PSTC）" },
        { value: "UTC+14", label: "UTC+14（PSTD）" }
      ],
      editDeleteDialogVisible: false,
      editDialogVisible: false,
      user_username: "",
      addUserData: {
        userName: "",
        level: "owner"
      },
      user_message: "",
      prop_message: "",

      rules: {
        clientName: [{ validator: validateClient, trigger: "blur" }],
        projectTitle: [{ validator: validateProject, trigger: "blur" }],
        timeZone: [{ validator: validateZone, trigger: "blur" }],
        date: [{ validator: validateDate, trigger: "blur" }]
      },

      deleteIndex:0
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
    store.saveIndex("1")
    this.clientName = this.$route.params.clientName;
    this.ViewClient(this.clientName);
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
    ViewClient(clientName) {
      let global = this;
      apiRequest
        .sendRequest(
          "post",
          "/cryptotool/client/view",
          JSON.stringify({
            clientName: clientName
          })
        )
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.clientData.clientName = response.data.clientName;
              global.clientData.projectTitle = response.data.projectTitle;
              global.clientData.description = response.data.description;
              global.clientData.accessList = response.data.accessList;
              global.viewProject();
            } else {
              global.prop_message = response.msg;
            }
          }
        });
    },
    viewProject() {
      let global = this;
      apiRequest
        .sendRequest(
          "post",
          "/cryptotool/project/view",
          JSON.stringify({
            clientName: global.$route.params.clientName,
            projectTitle: global.clientData.projectTitle
          })
        )
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.clientData.timeZone = response.data.timeZone;
              var arr = [];
              arr.push(response.data.startDate);
              arr.push(response.data.endDate);
              global.clientData.date = arr;
            } else {
              global.prop_message = response.msg;
            }
          }
        });
    },

    isDelete(index, row) {
      this.deleteIndex = index
      this.user_username = row.userName;
      this.editDeleteDialogVisible = true;
    },
    deleteUser(index, rows) {
      rows.splice(this.deleteIndex, 1);
      this.editDeleteDialogVisible = false;
    },
    addUser() {
      let global = this;
      global.user_message = "";

      if (global.addUserData.userName == "" || global.addUserData.level == "") {
        global.user_message = "the data cannot be empty";
        return;
      } 
      global.addUserData.userName = global.addUserData.userName.toLowerCase();
      const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      if(!reg.test(global.addUserData.userName)){
        global.user_message = "email address is invalid";
        return;
      }else {
        apiRequest
          .sendRequest(
            "post",
            "/cryptotool/user/verify",
            JSON.stringify({
              username: global.addUserData.userName
            })
          )
          .then(function(response) {
            if (response) {
              if (response.code === "0") {
                for (var i = 0; i < global.clientData.accessList.length; i++) {
                  if (
                    global.addUserData.userName ===
                    global.clientData.accessList[i].userName
                  ) {
                    global.user_message = "user has existed";
                    return;
                  }
                }

                if (global.clientData.accessList.length == 0) {
                  global.clientData.accessList = [
                    {
                      level: global.addUserData.level,
                      userName: global.addUserData.userName
                    }
                  ];
                } else {
                  global.clientData.accessList.push({
                    level: global.addUserData.level,
                    userName: global.addUserData.userName
                  });
                }
                global.user_message = "";
                global.editDialogVisible = false;
                global.addUserData.userName = "";
                global.addUserData.level = "owner";
                return;
              } else if (response.code === "10013") {
                global.user_message = "user is not registered";
                return;
              } else {
                global.user_message = response.msg;
                return;
              }
            }
          });
      }
    },
    handleClose() {
      this.user_message = "";
      this.editDialogVisible = false;
      this.addUserData.userName = "";
      this.addUserData.level = "owner";
    },
    Edit_Client(formName) {
      let global = this;
      global.$refs[formName].validate(valid => {
        if (valid) {
          var hasOwner = false;
          for (var k = 0; k < global.clientData.accessList.length; k++) {
            if (global.clientData.accessList[k].level === "owner") {
              hasOwner = true;
              break;
            }
          }
          if (!hasOwner) {
            global.prop_message = "Must have an owner permission";
            return;
          }
          var newName = "";
          if (global.clientName != global.clientData.clientName) {
            newName = global.clientData.clientName;
          }
          apiRequest
            .sendRequest(
              "post",
              "/cryptotool/client/withproject/edit",
              JSON.stringify({
                clientName: global.clientName,
                newName: newName,
                description: global.clientData.description,
                projectTitle: global.clientData.projectTitle,
                timeZone: global.clientData.timeZone,
                startDate: global.clientData.date[0],
                endDate: global.clientData.date[1],
                accessList: global.clientData.accessList
              })
            )
            .then(function(response) {
              if (response) {
                if (response.code === "0") {
                  global.$message.success(response.msg);
                  global.$router.push({ name: "clientlist" });
                } else {
                  global.$message.warning(response.msg);
                }
              }
            });
        }
      });
    },
    returnHome() {
      this.$router.push({ name: "clientlist" });
    }
  }
};
</script>

<style>
.createclient_content {
  width: 40%;
  min-width: 700px;
  margin: auto;
  padding: 10px 20px 20px 20px;
  margin-top: 20px;
  background-color: #f2f2f2;
  font-family: georgia, serif;
}
.createclient_header {
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: center;
  font-size: 22px;
  border-bottom: 4px solid #a32020;
}
.createclient_form {
  font-size: 16px !important;
}
.el-select > .el-input {
  font-size: 14px !important;
  font-family: georgia, serif !important;
}
.create_btn {
  text-align: center;
}
.date_span {
  margin: 0 5px;
}
.el-date-editor {
  font-size: 15px;
}
.el-date-editor .el-input {
  width: 120px;
  display: inline-block;
}
.warning_message {
  text-align: center;
  color: #a32020;
  margin-bottom: 15px;
}
.table_color {
  color: rgb(64, 64, 65);
}
.consist_white {
  color: rgb(254, 250, 245);
}
.consist_black {
  color: rgb(64, 64, 65);
}
</style>
