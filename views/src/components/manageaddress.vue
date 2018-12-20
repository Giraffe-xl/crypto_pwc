<template>
  <div class="management_content">
    <div class="management_list_content">
      <div class="management_top_search">       
          <span>Client Name:</span>
          <el-autocomplete
              v-model="client_search"
              :fetch-suggestions="querySearch"
              @select="currentSel"
              @keyup.enter.native="searchClient"
              placeholder="Please Enter Client"
          ></el-autocomplete>
          <span style="color:rgb(64, 64, 65);">Project Title:</span>
          <el-autocomplete
              placeholder="No Project Selected"
              v-model="project_title"
              :disabled="true"
          ></el-autocomplete>
          <el-button
              type="primary"
              title="Create a New Client"
              size="small"
              @click="searchClient"
              style="color:rgb(254, 250, 245)"
          >Choose <i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
      </div>
    </div>
    <div v-if="this.hasClient===true">
      <div class="address_table_content" style="color:rgb(64, 64, 65);">
        <el-table :data="tableData" :highlight-current-row="true">
          <el-table-column type="index" label="No." align="center"></el-table-column>
          <el-table-column label="Status" width="130" align="center">
            <template slot-scope="scope">
              <div v-if="tableData[scope.$index].status==='Validation Passed'" style="width:100%;background:#4E9385;color:#fff;padding:2px;">{{tableData[scope.$index].status}}</div>
              <div v-else-if="tableData[scope.$index].status==='Validation Failed'" style="width:100%;background:#A12023;color:#fff;padding: 2px;">{{tableData[scope.$index].status}}</div>
              <div v-else-if="tableData[scope.$index].status!==''">{{tableData[scope.$index].status}}</div>
              <div v-else>——</div>
            </template> 
          </el-table-column>
          <el-table-column  label="Currency" align="center">
            <template slot-scope="scope">
              <span v-if="tableData[scope.$index].currency===''">
                  ——
              </span>
                  <span v-else>
                  {{tableData[scope.$index].currency}}
                  </span>
          </template>
          </el-table-column>
          <el-table-column label="Address" align="center">
            <template slot-scope="scope">
              <span v-if="tableData[scope.$index].address===''">
                  ——
              </span>
                  <span v-else>
                  {{tableData[scope.$index].address}}
                  </span>
          </template>
          </el-table-column>
          <el-table-column label="Public Key" align="center">
            <template slot-scope="scope">
              <span v-if="tableData[scope.$index].public_key===''">
                ——
              </span>
                <span v-else>
                {{tableData[scope.$index].public_key}}
                </span>
            </template>
          </el-table-column>
          <el-table-column prop="ownership" label="Ownership" align="center"></el-table-column>
          <el-table-column label="Multisig(M/N)" align="center">
            <template slot-scope="scope">
              <span v-if="tableData[scope.$index].n>0">
                <span>{{tableData[scope.$index].m}}</span>
                <span>/</span>
                <span>{{tableData[scope.$index].n}}</span>
              </span>
              <span v-else>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Operations" align="center">
            <template slot-scope="scope">
              <div id="edit_address_content">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-edit"
                  v-if="tableData[scope.$index].status=='Message Required'"
                  @click="editAddress(scope.$index, scope.row)"
                ></el-button>
                <el-button type="warning" size="mini" icon="el-icon-edit" v-else disabled></el-button>
                
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-delete"
                  v-if="tableData[scope.$index].status=='Message Required'"
                  @click="deleteDialog(scope.$index, scope.row)"
                ></el-button>
                <el-button type="primary" size="mini" icon="el-icon-delete" v-else disabled></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="dialog_content">
        <el-dialog
          title="Edit Address"
          :visible.sync="editDialogVisible"
          :before-close="handleClose"
          align="center"
        >
          <el-form
            :model="editAddressData"
            label-width="150px"
            ref="EditAddress"   
          >
            <el-form-item label="Currency">
              <el-select v-model="editAddressData.currency" disabled>
                <el-option
                  v-for="item in currency_option"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Address">
              <el-input v-model="editAddressData.address" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="Public Key" v-if="editAddressData.currency==='Ripple(XRP)'">
              <el-input
                v-model="editAddressData.public_key"
                style="color: #909399;"
              ></el-input>
            </el-form-item>
  
            <el-form-item label="Ownership">
              <el-select v-model="editAddressData.ownership" placeholder="Choose ownership">
                <el-option
                  v-for="item in ownership_option"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Multisig">
              <el-switch v-model="edit_multi_signature" @change="edit_switch"></el-switch>
            </el-form-item>
            
            <el-form-item
              v-if="edit_multi_signature=== true"
              id="addressEdit"
              label="M/N"
            >
              <el-select v-model="editAddressData.m" placeholder="M">
                  <el-option
                        v-for="item in counts"
                        :key="item"
                        :label="item"
                        :value="item">
                  </el-option>
              </el-select>
              <span>/</span>
              <el-select v-model="editAddressData.n" placeholder="N">
                      <el-option
                        v-for="item in counts"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
              </el-select>
            </el-form-item>       
            <div class="warning_message">{{edit_message}}</div>
            <div class="add_btn_content">
              <el-button size="mini" @click="handleClose()" class="consist_black">Cancel</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="saveEdit()"
                class="consist_white"
              >Save</el-button>
            </div>
          </el-form>
        </el-dialog>
        <el-dialog title="Delete Address" :visible.sync="deleteDialogVisible" width="30%">
          <span>Are you sure to delete？</span>
          <br/><br/>
          <span>currency:
            <span>{{deleteRow.currency}}</span>
          </span>
          <br/><br/>
          <span>{{deleteRow.address}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false" class="consist_black">Cancel</el-button>
            <el-button
              type="primary"
              @click="deleteAddress(deleteRow.currency,deleteRow.address)"
              class="consist_white"
            >Delete</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="management_button_content" v-if="project_title !== ''">
        <div class="add_address_content">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="addDialogVisible = true"
            class="consist_white"
          >Add Address</el-button>
          <el-dialog
            title="Add Address"
            :visible.sync="addDialogVisible"
            :before-close="handleClose"
            align="center"
          >
            <el-form :model="addAddressData" label-width="150px" ref="addNewAddress">
              <el-form-item label="Currency">
                <el-select v-model="addAddressData.currency">
                  <el-option v-for="item in currency_option" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Address">
                <el-input
                  v-model="addAddressData.address"
                  autocomplete="off"
                  style="color: #909399;"
                  placeholder="Public Address"
                ></el-input>
              </el-form-item>
              <el-form-item label="Public Key" v-if="addAddressData.currency==='Ripple(XRP)'">
                <el-input
                  v-model="addAddressData.public_key"
                  style="color: #909399;"
                  placeholder="Public Key"
                ></el-input>
              </el-form-item>
              <el-form-item label="Ownership">
                <el-select
                  v-model="addAddressData.ownership"
                  style="color: #909399;"
                  placeholder="Choose ownership"
                >
                  <el-option v-for="item in ownership_option" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Multisig">
                <el-switch v-model="addAddressData.multi_signature" @change="add_switch"></el-switch>
              </el-form-item>
              <el-form-item
                id="addressAdd"
                v-if="addAddressData.multi_signature === true"
                label="M/N"
              >
                <el-select v-model="addAddressData.m" placeholder="M">
                <el-option
                  v-for="item in counts"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>

                <span>/</span>
              <el-select v-model="addAddressData.n" placeholder="N">
                <el-option
                  v-for="item in counts"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
               
              </el-form-item>
              <div class="warning_message">{{add_message}}</div>
              <div class="add_btn_content">
                <el-button size="mini" @click="handleClose()" class="consist_black">Cancel</el-button>
                <el-button size="mini" type="primary" @click="addAddress()" class="consist_white">Add</el-button>
              </div>
            </el-form>
          </el-dialog>
        </div>
        <div class="upload_address_content">
          <el-upload
            ref="upload"
            accept=".xlsx"
            action="/cryptotool/address/upload"
            :auto-upload="true"
            :limit="1"
            :http-request="uploadAddress"
          >
            <el-button type="primary" size="small" class="consist_white">Import Addresses
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </div>
        <div class="download_template_content">
          <el-button type="text" @click="downExcel" id="down_link">Download the Excel Template</el-button>
        </div>
      </div>
      <br>
      <br>
      <div class="address_log_content" v-if="(project_title !== '') && (record_data != null) && (record_data != []) && (record_data.length != 0)">
        <hr>
        <div class="event_header">
          <h4 style="text-align:left;padding-bottom:10px">Events</h4>
        </div>
        <el-table
          :data="record_data"
          max-height="300"
          :default-sort="{prop: 'date', order: 'descending'}"
          style="width:100%;color:rgb(64, 64, 65);"
        >
          <el-table-column prop="operator" width="200"></el-table-column>
          <el-table-column width="40" align="right">
              <template slot-scope="scope">  
                  <div v-if="scope.row.status===0">     
                      <i class="el-icon-error"></i>
                  </div>
                  <div v-else-if="scope.row.status===1">     
                      <i class="el-icon-success"></i>
                  </div>
                  <div v-else-if="scope.row.status===2">     
                      <i class="el-icon-warning"></i>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="detail"></el-table-column>
          <el-table-column prop="date" key="1" width="150"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import apiRequest from "../request/request";
import store from "../store";
export default {
  data() {
    return {
      addDialogVisible: false,
      deleteDialogVisible: false,
      editDialogVisible: false,

      tableData: [],
      client_search: "",
      project_title: "",
      client_name: "",
      addAddressData: {
        address: "",
        currency: "",
        multi_signature: false,
        m: "",
        n: "",
        ownership: "",
        public_key:""
      },
      editAddressData: {
        address: "",
        currency: "",
        m: "",
        n: "",
        ownership: "",
        public_key:"",
      },
      add_message: "",
      edit_message: "",
      record_data: [],
      clientList:[],
      hasClient:false,
      deleteRow:[],
      counts:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
      edit_multi_signature:false
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
    store.saveIndex("2")

    if (this.client_search === "") {
      this.client_name = "";
      this.project_title = "";
    }
   
    this.clientView();
    this.currencyView();
    this.ownershipView();
  },

  methods: {
    add_switch(val){
      if(val===false){
        this.addAddressData.m =0;
        this.addAddressData.n =0;
      }
    },
    edit_switch(val){
      if(val===false){
          this.editAddressData.m =0;
          this.editAddressData.n =0;
        }
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
    clientView() {
      let global = this;
      apiRequest
        .sendRequest("post", "/cryptotool/user/clients/view")
        .then(function(response) {
          
          if (response) {
            global.clientList =[]
            if (response.code === "0" && response.data.clientList != null) {
              for (var i = 0; i < response.data.clientList.length; i++) {
                var obj = {};
                obj.value = response.data.clientList[i].clientName;
                obj.projectTitle = response.data.clientList[i].project_title;
                global.clientList.push(obj);
              }
            } else {
              global.$message.warning(
                "service exceptional，please contract with manager!"
              );
            }
          }
        });
    },
    currencyView() {
      let global = this;
      apiRequest
        .sendRequest("get", "/cryptotool/info/curreny/view")
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.currency_option = response.data.currencies;
              global.addAddressData.currency=global.currency_option[0];
            } else {
              global.$message.warning(
                "service exceptional，please contract with manager!"
              );
            }
          }
        });
    },
    ownershipView() {
      let global = this;
      apiRequest
        .sendRequest("get", "/cryptotool/info/ownership/view")
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.ownership_option = response.data.ownerships;
            } else {
              global.$message.warning(
                "service exceptional，please contract with manager!"
              );
            }
          }
        });
    },
    addressView() {
      let global = this;
      apiRequest
        .sendRequest(
          "post",
          "/cryptotool/address/view",
          JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title
          })
        )
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.tableData = response.data.addresslist;
            } else if (response.code === "10001" || response.code === "10005") {
              global.$message.warning("no data");
            } else {
              global.$message.warning(response.msg);
            }
          }
        });
    },
    currentSel(index) {
      this.tableData = [];
      this.project_title = index.projectTitle;
      this.client_name = index.value;
    },
    querySearch(queryString, cb) {
      
      var clientList = this.clientList;
      var results = queryString
          ? clientList.filter(this.createFilter(queryString))
          : clientList;
      cb(results);

      if(this.client_search){
        var list=results;
        var list_arr=[];
        for(var i=0;i<list.length;i++){
            if(this.client_search===list[i].value){
                this.project_title=list[i].projectTitle;
                this.client_name = this.client_search
                list_arr.push(list[i].value);
            }
        }
        if(list_arr.length<=0){
            this.client_name =''
            this.project_title='';
        }
      }

    },
    createFilter(queryString) {
        return clientList => {
            return clientList.value.indexOf(queryString) >= 0;
        };
    },
    handleClose() {
      this.add_message = "";
      this.edit_message = "";
      this.addDialogVisible = false;
      this.editDialogVisible = false;
      this.addAddressData.address = "";
      this.addAddressData.currency = this.currency_option[0];
      this.addAddressData.multi_signature = false;
      this.addAddressData.m = 0;
      this.addAddressData.n = 0;
      this.addAddressData.ownership = "";
      this.addAddressData.public_key="";
    },
    addAddress() {

      if (this.addAddressData.address == "" ||
        this.addAddressData.currency == "" ||
        this.addAddressData.ownership == "") 
      {
        this.add_message = "Information cannot be empty!";
        return;
      }
      if( (this.addAddressData.currency==='Ripple(XRP)') && (this.addAddressData.public_key=="")){

        this.add_message = "Information cannot be empty!";
        return;
      }
      if (this.addAddressData.multi_signature ===true){
        if(this.addAddressData.m===0||this.addAddressData.n===0){
          this.add_message = "M/N must be greater than 0!";
          return
        }
         if (this.addAddressData.m > this.addAddressData.n) {
            this.add_message = "M must be less than N!";
            return;
        }
      }
      // else if (this.addAddressData.multi_signature ===false) {
      //       this.addAddressData.m =0;
      //       this.addAddressData.n =0;
      // }

      let global = this;
      apiRequest
        .sendRequest(
          "post",
          "/cryptotool/address/add",
          JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title,
            AddressInfo: {
              address: global.addAddressData.address,
              currency: global.addAddressData.currency,
              ownership: global.addAddressData.ownership,
              public_key:global.addAddressData.public_key,
              m: parseInt(global.addAddressData.m),
              n: parseInt(global.addAddressData.n)
              
            }
          })
        )
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.$message.success(response.msg);
              global.handleClose();
              global.addressView();
            } else if (response.code === "20013") {
              global.add_message = "the address has existed";
            } else {
              global.add_message = response.msg;
            }
            global.addressLogView();
          }
        });
     
    },
    deleteAddress(currency,address) {
      let global = this;
      apiRequest
        .sendRequest(
          "post",
          "/cryptotool/address/delete",
          JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title,
            address:address,
            currency:currency
          })
        )
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.$message.success(response.msg);
              global.addressView();
            } else {
              global.$message.warning(response.msg);
            }
            global.addressLogView();
          }
        });
      global.deleteDialogVisible = false;
      
    },
    deleteDialog(index,row){
      this.deleteDialogVisible=true
      this.deleteRow = row
    },
    editAddress(index, row) {
      this.editDialogVisible = true;
      this.editAddressData=row;
      // this.editAddressData.address=row.address;
      // this.editAddressData.currency=row.currency;
      // this.editAddressData.ownership =row.ownership;
      // this.editAddressData.m=row.m;
      // this.editAddressData.n=row.n;
      // this.editAddressData.public_key=row.public_key;
      
      if(this.editAddressData.n!==0){
        this.edit_multi_signature=true;
      }else if(this.editAddressData.n===0){
        this.edit_multi_signature=false;
      }
    },
    saveEdit() {
      if (
        this.editAddressData.address == "" ||
        this.editAddressData.currency == "" ||
        this.editAddressData.ownership == ""
      ) {
        this.edit_message = "Information cannot be empty!";
        return;
      }
      if( (this.addAddressData.currency==='Ripple(XRP)') && (this.editAddressData.public_key=="")){
        this.edit_message = "Information cannot be empty!";
        return;
      }
      if(this.edit_multi_signature === true){
        if(this.editAddressData.m ===0|| this.editAddressData.n ===0){
          this.edit_message="M/N must be greater than 0!";
          return
        }

        if (this.editAddressData.m > this.editAddressData.n) {
            this.edit_message = "M must be less than N!";
            return;
          }
      }
      // else if (this.edit_multi_signature == false) {
      //   this.editAddressData.m = 0;
      //   this.editAddressData.n =0;
      // }
      let global = this;
      apiRequest
        .sendRequest(
          "post",
          "/cryptotool/address/edit",
          JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title,
            addressInfo: {
              address: global.editAddressData.address,
              currency: global.editAddressData.currency,
              ownership: global.editAddressData.ownership,
              m: global.editAddressData.m,
              n: global.editAddressData.n,
              public_key:global.editAddressData.public_key
            }
          })
        )
        .then(function(response) {
          if (response) {

            if (response.code === "0") {
              global.$message.success(response.msg);
              global.handleClose();
              global.addressView();
              global.editDialogVisible=false;
            } else {
              global.edit_message = response.msg;
            }
            global.addressLogView();
          }
        });
      
    },
    uploadAddress(param) {
      var fileObj = param.file;
      var formData = new FormData();
      formData.append("file", fileObj);
      formData.append("clientName", this.client_name);
      formData.append("projectTitle", this.project_title);

      let global = this;
      apiRequest
        .UploadRequest("post", "/cryptotool/address/upload", formData)
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.$message.success(response.msg);
            } else {
              global.$message.warning(response.msg);
            }
            global.$refs.upload.clearFiles();
            global.addressLogView();
            global.addressView();
          }
        });
    },

    downExcel() {
      let global = this;
      apiRequest.DownloadRequest("get","/cryptotool/address/template/download",null,null,"Wallet Address List.xlsx")
        .then(function(response) {
          if(response){
            global.$message.warning(response.msg)
            global.addressLogView();
          }
        });
      
    },

    addressLogView() {
      let global = this;
      apiRequest
        .sendRequest(
          "post",
          "/cryptotool/log/address/view",
          JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title
          })
        )
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.record_data = response.data.loglist;
              if (global.record_data != null) {
                global.record_length = global.record_data.length;
                
              } else {
                global.record_length = 0;
              }
            } else {
              global.$message.warning(response.msg);
            }
          }
        });
    },

    searchClient() {

      this.tableData=[];
      if(this.client_search===""){
          this.client_name = ""
          this.project_title = "";
           this.hasClient = false
          this.$message.warning("no client selected")
          return
      }

      if(this.client_name ==""){
        this.$message.warning("The client does not exist!")
        this.hasClient = false;
        return
      }

      if(this.project_title ==""){
        this.$message.warning("The project does not exist!")
        this.hasClient = false
        return
      }
      this.client_name=this.client_search;

      this.hasClient = true
      this.addressView();
      this.addressLogView();
    },
  }
};
</script>

<style>
/* 调字体 */

.el-textarea__inner {
  color: #909399;
  font-family: georgia, serif;
}

/* 结束 */
.management_content {
  width: 80%;
  min-width: 800px;
  margin: auto;
  font-family: georgia, serif !important;
}
.management_top_search {
  text-align: left;
  margin-top: 20px;
  padding-bottom: 30px;
}
.management_list_content {
  margin: auto;
}
#down_link span {
  display: block;
  margin-top: 10px;
}
.management_button_content {
  padding: 10px;
}
.project_content {
  color: rgb(64, 64, 65);
  padding-left: 20px;
}
.add_address_content {
  float: left;
  padding-right: 10px;
}

.add_address_content .el-dialog,
.dialog_content .el-dialog {
  width: 40%;
  min-width: 500px;
}

.add_address_content .el-select,
.dialog_content .el-select {
  width: 100%;
  float: left;
}
.add_address_content .el-switch,
.dialog_content .el-switch {
  float: left;
  display: block;
  margin-top: 10px;
}

#addressAdd .el-select,
#addressEdit .el-select {
  width: 25%;
  float: left;
}

#addressAdd span,
#addressEdit span {
  float: left;
  font-size: 24px;
  font-weight: 500;
  margin: 0 5px 0 5px;
}
.upload_address_content {
  float: left;
  padding-right: 5px;
}
.download_template_content {
  vertical-align: bottom;
}
.download_template_content .el-button--text {
  font-size: 14px;
  color: #a32020;
  text-decoration: underline;
}
.el-switch {
  vertical-align: bottom;
}
.add_btn_content {
  text-align: center;
}
.warning_message {
  width: 100%;
  height: 40px;
  font-size: 16px;
  color: red;
  text-align: center;
  padding: 5px;
}

.address_log_content {
  text-align: center;
  margin-bottom: 30px;
}

.address_log_content td {
  border: 0;
  padding: 4px 0;
  font-size: 12px;
}

.address_log_content .cell {
  line-height: 130%;
}
.consist_white {
  color: rgb(254, 250, 245);
}
.consist_black {
  color: rgb(64, 64, 65);
}
.address_log_content .el-table__header-wrapper{
  display: none;
}
</style>
