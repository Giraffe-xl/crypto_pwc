
<template>   
    <div class="validation_content">
      <div class="validation_list_content">
        <div class="validation_top_search">
          <div>
            <span style="color:rgb(64, 64, 65);">Client Name:</span>
            <el-select v-model="client_search" placeholder="No Client Selected" @change="currentSel">
              <el-option
              v-for="item in client_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
            <span style="color:rgb(64, 64, 65);" v-if="this.project_title !==''">Project:</span>
            <span>{{project_title}}</span>
          </div>
        </div> 
      </div>
      <div class="validation_table_content">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionChange"  id="status_bg">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="No."  align="center" width="50"></el-table-column>

          <el-table-column label="Status" width="130" align="center">

            <template slot-scope="scope">

              <!-- <span v-if="tableData[scope.$index].status==='Validated'" style="color:green;">{{tableData[scope.$index].status}}</span>

              <span v-else-if="tableData[scope.$index].status==='Validation Failed'" style="color:rgb(163, 32, 32);">{{tableData[scope.$index].status}}</span>

              <span v-else style="color:rgb(254, 250, 245);">{{tableData[scope.$index].status}}</span> -->

              <div v-if="tableData[scope.$index].status==='Validated'" style="width:100%;background:green;color:rgb(254, 250, 245);">{{tableData[scope.$index].status}}</div>

              <div v-else-if="tableData[scope.$index].status==='Validation Failed'" style="width:100%;background:rgb(163, 32, 32);color:rgb(254, 250, 245);">{{tableData[scope.$index].status}}</div>

              <div v-else style="width:100%;background-color:#EB8C00;color:rgb(254, 250, 245); ">{{tableData[scope.$index].status}}</div>

            </template>

          </el-table-column>


          <!-- <el-table-column prop="status" label="Status" width="130" align="center" v-if="tableData[scope.$index].status==='Validated'" style="color:green;"></el-table-column>
          <el-table-column prop="status" label="Status" width="130" align="center" v-else-if="tableData[scope.$index].status==='Validation Failed'" style="color:red;"></el-table-column>
          <el-table-column prop="status" label="Status" width="130" align="center" v-else style="color:rgb(254, 250, 245);"></el-table-column> -->


          <el-table-column prop="currency" label="Currency" align="center"></el-table-column>
          <el-table-column prop="address" label="Public Address" align="center"></el-table-column>
          <el-table-column prop="ownership" label="Ownership"  align="center"></el-table-column>
          <el-table-column prop="public_key" label="Public Key"  align="center"></el-table-column>
          <el-table-column label="Multisig(M/N)" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="tableData[scope.$index].multi_signature===true">
                  <span>{{tableData[scope.$index].m}}</span>
                  <span>/</span>
                  <span>{{tableData[scope.$index].n}}</span>
              </span>

              <span v-else>
              <i style="display:block;margin:auto; width:20px;height:1px;background-color:rgb(64, 64, 65)"></i>
            </span>
            </template>
          </el-table-column>
          <el-table-column prop="message" label="Message" width="150" align="center"></el-table-column>

          <el-table-column prop="message" label="Message Expiry Date" align="center"></el-table-column>

          <el-table-column prop="signed_message" label="Signed-Message" width="220" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="validation_button_content" v-if="project_title !== ''" style="padding-left:13px;">
        <div class="message_button_content" >
          <div style="float: left;padding-right: 25px;width:200px;">
            <el-checkbox name="type" v-model="generateData" @change="generateCheck">Address No Message</el-checkbox>
          </div>
          <div>
            <el-button type="primary"  size="mini" @click="generate_message" class="consist_white">Generate Message</el-button>
          </div>
        </div>
       <div class="signmessage_button_content" >
          <div style="float: left;padding-right: 10px;width:200px;">
            <el-checkbox name="type" v-model="validatedData" @change="validatedCheck">Address Not Signed</el-checkbox>
          </div>
          <div style="float: left;padding-right: 10px;">

            <el-button type="primary" size="mini" @click="download_message" class="consist_white">Export Messages</el-button>
          </div>
          <div style="float: left;padding-right: 10px;">
            <el-upload
                class="upload-demo"
                ref="upload"
                accept=".xlsx"
                action="/cryptotool/message/signed/upload"
                :auto-upload="true"
                :limit="1"
                :show-file-list="false"
                :on-success="successFresh"
                :http-request="uploadMessage"
              >
                <el-button type="primary" size="mini" class="consist_white">Import Signatures</el-button>
              </el-upload>
          </div>

          
           <div class="upload_go" v-if="message_length>0">
                    <el-dialog
                        :visible.sync="messageDialogVisible">
                        <span>{{downMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="messageDialogVisible= false" class="consist_black">Cancel</el-button>
                            <el-button type="primary" @click="message_go()" class="consist_white">Download</el-button>
                        </span>
                    </el-dialog>
            </div>

        </div>

        <div class="fail_button_content" >
          <div style="float: left;padding-right:14px;width:200px;">
            <el-checkbox name="type" v-model="failData" @change="failCheck">Address Not Validated</el-checkbox>
          </div>
            <el-button type="primary" size="mini" @click="verify_key" class="consist_white">Verify Signed Message</el-button>
        </div>


        <div class="report_button_content">
          <div style="float: left;padding-right: 40px;width:200px;">
            <el-checkbox name="type" v-model="reportData" @change="reportCheck">Address Validated</el-checkbox>
          </div>
            <el-button type="primary" size="mini" @click="download_report" class="consist_white">Download Report</el-button>

            <div class="upload_go" v-if="countAll>0">
                    <el-dialog
                        :visible.sync="deleteDialogVisible">
                        <span>{{return_msg}}</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="deleteDialogVisible= false" class="consist_black">Cancel</el-button>
                            <el-button type="primary" @click="down_go()" class="consist_white">Download</el-button>
                        </span>
                    </el-dialog>
            </div>
    
        </div>
      </div>
     <br/><br/>
      <div class="message_log_content" v-if="(project_title !=='') && (record_data!=null)">
        <hr/>
        <h2>Operation Log</h2>
        <el-table
          :data="record_data"
          :default-sort = "{prop: 'date', order: 'descending'}"
          style="width:100%;color:rgb(64, 64, 65);"
          height="500"
          >

          <el-table-column
            prop="date"
            label="Time"
            width="180">
          </el-table-column>

          <el-table-column
            prop="operator"
            label="UserID"
            width="220">
          </el-table-column>
          
          <el-table-column
            prop="detail"
            label="Operation"
            width="800"
            >
            <template slot-scope="scope">
              <div style="color: #606266;" v-if="scope.row.has_link===false">
                {{scope.row.detail}}

              </div>
              <div style="color:rgb(163, 32, 32);" v-else>
                <el-button
               type="text" style="font-size:14px;text-decoration:underline" @click="record_address(scope.row)">{{scope.row.detail}}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div> 
</template>

<script>
import apiRequest from '../request/request'
import store from '../store/store'
export default {
  data() {
    return {
      tableData: [],
      client_search: "",
      project_title: "",
      client_name: "",
      client_options: [],
      selectData: [],

      // countAll:0,


      valition_client: "",
      clientSel_options: [],
      valition_project: "",
      valition_clientName: "",
      
      selectIndex:[],

      record_data: [],

      generateData:false,
      validatedData:false,
      reportData:false,
      failData:false,
      changeValue:[],

      changeGenerate:[],
      changeValidated:[],
      changeReport:[],
      changeFail:[],

      deleteDialogVisible:true,
      countAll:0,
      return_msg:'',

      messageDialogVisible:true,
      downMessage:'',
      message_length:0
    };
  },

  mounted() {
    if(store.readToken()===''){
        this.getUserName()
    }
    var username = store.readUserName()
    if(username ===''){
        store.deleteUserName()
        store.deleteToken()
        this.$router.push({ name: "user" });
        return
    }
    if (this.client_search === "") {
      this.client_name = ""
      this.project_title = "";
    }
    this.clientView();
    this.MessageLogView();
  },

  methods: {
    getUserName(){
      let global = this;
      apiRequest.sendRequest("get","/cryptotool/user/current/get").then(response=> {
         if(response){
            if (response.code === "0") {
              store.saveUserName(response.data.userName)
            }
         }
      });
    },
    clientView(){
      let global = this;
      apiRequest.sendRequest("post","/cryptotool/user/clients/view").then(function(response) {
        if(response){
          if (response.code === "0") {
            if(response.data.clientList!= null){
              global.validation_length=response.data.clientList.length;
              for (var i = 0; i < global.validation_length; i++) {
                var obj = {};
                obj.value = i;
                obj.label = response.data.clientList[i].clientName;
                obj.projecName = response.data.clientList[i].project_title;
                global.client_options.push(obj);
              }
            } 
          }
        }
      });
    },

    currentSel(index) {

      this.generateData=false;
      this.validatedData=false;
      this.reportData=false;
      this.failData=false;

      this.tableData = [];

      this.project_title = this.client_options[index].projecName;
      this.client_name = this.client_options[index].label;


      this.addressView();
      this.MessageLogView();
    },

    selectionChange(val) {

      this.changeValue=val;
      if(val==null){
         return
      }
      this.value_length=val.length;
      if(this.generateData===true){
        for(var i=0;i<this.value_length;i++){
            if(val[i].status!=='No Message'){
              this.generateData=false;
              return
            }
          }
      }
      if(this.validatedData===true){
        for(var i=0;i<this.value_length;i++){
            if(val[i].status!=='Not Signed'){
              this.validatedData=false;
              return
            }
          }
      }

       if(this.failData===true){
        for(var i=0;i<this.value_length;i++){
            if(val[i].status!=='Not Validated'){
                this.failData=false;
                return
            }
          }
      }
       if(this.reportData===true){
        for(var i=0;i<this.value_length;i++){
            if(val[i].status!=='Validated'){
                this.reportData=false;
                return
            }
          }
      }
      this.selectData = [];
      
      if (val !== null) {
        this.val_length=val.length;
        for (var i = 0; i < this.val_length; i++) {
          var obj = {};

          obj.address = val[i].address;
          obj.currency = val[i].currency;

          this.selectData.push(obj);
        }
      }
    },

    generateCheck(val){
      this.$refs.multipleTable.clearSelection();
      if(val===true){
        this.validatedData=false;
        this.reportData=false;
        this.failData=false;
        this.table_change=[];
        if(this.tableData !== null){
          this.table_length=this.tableData.length;

          for(var i=0;i<this.table_length;i++){
            if(this.tableData[i].status==='No Message'){
              this.table_change.push(this.tableData[i]);
            }
          };
        }

        this.changeGenerate=this.table_change;
        if(this.table_change){
          this.table_change.forEach(row=> {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        }
        else{
            this.$refs.multipleTable.clearSelection();
        }
      }
    },

    validatedCheck(val){
      this.$refs.multipleTable.clearSelection();
      if(val===true){
        this.generateData=false;
        this.reportData=false;
        this.failData=false;
        this.table_change=[];
     
        this.table_length=this.tableData.length;
        for(var i=0;i<this.table_length;i++){
          if(this.tableData[i].status==='Not Signed'){
            this.table_change.push(this.tableData[i]);
          }
        };
        this.changeValidated=this.table_change;
         if(this.table_change){
            this.table_change.forEach(row=> {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          }else{
              this.$refs.multipleTable.clearSelection();
          }
      }
    },

    failCheck(val){
      this.$refs.multipleTable.clearSelection();
      if(val===true){
        this.reportData=false;
        this.generateData=false;
        this.validatedData=false;
        this.table_change=[];
        this.table_length=this.tableData.length;

         for(var i=0;i<this.table_length;i++){
          if(this.tableData[i].status==='Not Validated'){
            this.table_change.push(this.tableData[i]);
          }
        };
        this.changeFail=this.table_change;
         if(this.table_change){
            this.table_change.forEach(row=> {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          }else{
              this.$refs.multipleTable.clearSelection();
          }

      }
    },

    reportCheck(val){
      this.$refs.multipleTable.clearSelection();
      if(val===true){
        this.generateData=false;
        this.validatedData=false;
        this.failData=false;

        this.table_change=[];
        this.table_length=this.tableData.length;
        for(var i=0;i<this.table_length;i++){
          if(this.tableData[i].status==='Validated'){
            this.table_change.push(this.tableData[i]);
          }
        };
        this.changeReport=this.table_change;
         if(this.table_change){
            this.table_change.forEach(row=> {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          }else{
              this.$refs.multipleTable.clearSelection();
          }
      }
    },

    uploadMessage(param){
      var fileObj = param.file;
      var formData = new FormData();  
      formData.append("file", fileObj);
      formData.append("clientName", this.client_name);
      formData.append("projectTitle", this.project_title);
      
      let global = this;
      apiRequest.UploadRequest("post","/cryptotool/message/signed/upload",formData).then(function(response){
         if(response){
           if(response.code==='0'){
              global.$message.success(response.msg);
           } else{
              global.$message.warning(response.msg);
           }
          global.$refs.upload.clearFiles();
          global.addressView();
          global.MessageLogView(); 
         }
          
      })
    },

    generate_message() {

      this.generate_count=[];
      var l=this.changeValue.length;
      if(l<=0){
        return this.$message.warning('No address selected');
      }else{
          for(var i=0;i<this.changeValue.length;i++){
            if(this.changeValue[i].status!=='No Message'){
              this.generate_count.push(this.changeValue[i]);
            }
          }
          if(this.generate_count.length == this.changeValue.length){
            return this.$message.warning('No address that can be generated');
          }
          if(this.generate_count.length){
            this.$message.warning('Skip re-generating messages for '+this.generate_count.length+'addresses that already have messages.');
          }
          
      }
      let global = this;
      apiRequest.sendRequest("post",
          "/cryptotool/message/generate",
          JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title,
            currencies: global.selectData
          })
        ).then(function(response) {
          if(response){
            if (response.code === "0") {
              global.$message.success(response.msg)
              global.addressView();
              global.MessageLogView();
            } else{
              global.$message.warning(response.msg)
            }
          }
        });
    },

    download_message() {

      this.messageDialogVisible =true;
      this.downMessage_count=[];
      this.downError_count=[];

      var l=this.changeValue.length;

      if(l<=0){
         this.message_length=0;
         return this.$message.warning('No address selected');
      }else{
            for(var i=0;i<l;i++){
              if(this.changeValue[i].status==='No Message'||this.changeValue[i].status==='Validated'){
                this.downMessage_count.push(this.changeValue[i]);
              }
            }

            // if(this.downMessage_count.length == this.changeValue.length){
            //     this.$message.warning('No downloadable address');
            //     return
            //     }
            if(this.downMessage_count.length){
              this.message_length=this.downMessage_count.length;
              this.downMessage=this.downMessage_count.length+' address(es) in status No Message or Validated will be ignored in the export. Click ‘Export’ to continue the operation, or click ‘Cancel’ to abort the operation.';
            }
            else{
                this.message_go();
            }
      }

    },

    message_go(){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var myTime = year + "-" + month + "-" + day;
      var h=date.getHours();       //获取当前小时数(0-23)  
      var m=date.getMinutes();     //获取当前分钟数(0-59)  
      var s=date.getSeconds();     //获取当前秒数(0-59) 
      var name=this.client_name;
      var project=this.project_title;
      name=name.replace(/[\\]/g,'');
      name=name.replace(/[\/]/g,'');
      project=project.replace(/[\\]/g,'');
      project=project.replace(/[\/]/g,'');
      let global = this;
       apiRequest.DownloadRequest("post","/cryptotool/message/download",JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title,
            currencies: global.selectData
          }),null,'message_'+name+'_'+project+'_'+myTime+h+m+s+'.xlsx'
       ).then(function(response) {
          if(response){
            if (response.code === "0") {
              global.$message.success(response.msg);
             
            } else{
              global.$message.warning(response.msg);
            }
             global.addressView();
              global.MessageLogView();
          }
        });
        global.messageDialogVisible= false;
    },

    successFresh(res){
      this.$refs.upload.clearFiles();

      this.addressView();
      this.MessageLogView();  

      if(res.code==='0'){
         return this.$message.success(res.msg);
      }
      if(res.code==='10001'){
          this.$message.warning('unexcepted service error，please contact administrator!');
          return
      }
       if(res.code==='20011'){
          return this.$message.warning('format of file has error');
      }
      else{
        this.$message.warning(res.msg);
      }
    },
    verify_key() {

      this.verify_count=[];
      var l=this.changeValue.length;
      if(l<=0){
         return this.$message.warning('No address selected');
      } else {
            for(var i=0;i<l;i++){
            if(this.changeValue[i].status!=='Not Validated'){
              this.verify_count.push(this.changeValue[i]);
            }
          }
          var verify_length=this.verify_count.length;

          if(verify_length){

            if(verify_length == this.changeValue.length){
              this.$message.warning('No verifiable address');
              return
            }
            this.$message.warning(verify_length+' address(es) that are not validated successfully are also included in the report.');
          }
      }

      let global = this;
      apiRequest.sendRequest("post",
          "/cryptotool/message/validate",
          JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title,
            currencies: global.selectData
          })
        ).then(function(response) {
          if(response){
            if (response.code === "0") {
              global.$message.success(response.msg);
              global.addressView();
              global.MessageLogView();
            } else{
              global.$message.warning(response.msg)
            } 
          }
        });
    },
    download_report() {
      this.deleteDialogVisible =true;
       this.report_message=[];
       this.report_signed=[];
       this.report_verify=[];
       this.report_validate=[];
      if(this.changeValue.length<=0){
        this.countAll=0;
         return this.$message.warning('No addresses are selected!');
      } else{

        for(var i=0;i<this.changeValue.length;i++){

            if(this.changeValue[i].status==='No Message'){
              this.report_message.push(this.changeValue[i]);
            }
            if(this.changeValue[i].status==='Not Signed'){
              this.report_signed.push(this.changeValue[i]);
            }
            if(this.changeValue[i].status==='Not Validated'){
              this.report_validate.push(this.changeValue[i]);
            }
            if(this.changeValue[i].status==='Validation Failed'){
              this.report_verify.push(this.changeValue[i]);
            }
          }
          if(this.report_message.length||this.report_signed.length||this.report_verify.length||this.report_validate){
            this.countAll=this.report_message.length+this.report_signed.length+this.report_verify.length+this.report_validate.length;
           // return this.$message.warning('There are '+this.countAll+' addresses that had no message/have no signed-message/not-validated if you would want to still download the report');
            this.return_msg=this.countAll+' addresses that are not validated successfully are also included in the report.';
          }
          else{
            this.down_go();
          }
        }
    },
    down_go(){ 
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var myTime = year + "-" + month + "-" + day;
      var h=date.getHours();       //获取当前小时数(0-23)  
      var m=date.getMinutes();     //获取当前分钟数(0-59)  
      var s=date.getSeconds();     //获取当前秒数(0-59) 
      var name=this.client_name;
      var project=this.project_title;
      name=name.replace(/[\\]/g,'');
      name=name.replace(/[\/]/g,'');
      project=project.replace(/[\\]/g,'');
      project=project.replace(/[\/]/g,'');
      let global = this;
      apiRequest.DownloadRequest("post","/cryptotool/message/validation/download",JSON.stringify({
            clientName: global.client_name,
            projectTitle: global.project_title,
            currencies: global.selectData
          }),null,'report_'+name+'_'+project+'_'+myTime+h+m+s+'.xlsx'
       ).then(function(response) {
        if(response){
            global.$message.success(response.msg);
        }
          global.addressView();
          global.MessageLogView();
      });
      
      global.deleteDialogVisible = false;
    },

    addressView(){
      let global = this;
      apiRequest.sendRequest("post",
        "/cryptotool/address/view",
        JSON.stringify({
          clientName: global.client_name,
          projectTitle: global.project_title
        })
      ).then(function(response) {
        if(response){
          if (response.code === "0") {
            global.tableData = response.data.addresslist;
          } else {
            global.$message.warning(response.msg)
          }
        }
      });
    },
     
    MessageLogView(){
       let global = this;
        apiRequest.sendRequest("post","/cryptotool/log/verify/view",
        JSON.stringify({
            clientName:global.client_name,
            projectTitle:global.project_title
          })).then(function(response){
            if(response){
              if(response.code==='0'){           
                if (response.data.loglist === null){
                  return
                }
                global.record_data=response.data.loglist;
                //this.recordData=[];
                for(var i=0;i<global.record_data.length;i++){
                  global.year=global.record_data[i].date.slice(0,4);
                  global.month=global.record_data[i].date.slice(4,6);
                  global.day=global.record_data[i].date.slice(6,8);
                  global.hour=global.record_data[i].date.slice(8,10);
                  global.miniter=global.record_data[i].date.slice(10,12);
                  global.seconds=global.record_data[i].date.slice(12,14);
                  global.record_data[i].date=global.year+'-'+global.month+'-'+global.day+' '+global.hour+':'+global.miniter+':'+global.seconds;
                }  
              } 
            }
        })
    },

    record_address(row) {
      this.$router.push({ name: "erroraddress",params:{id:row.id,name:this.client_name,project:this.project_title,operation:row.operation,operator:row.operator}});
     } 

  },
};
</script>


<style>
.validation_content{
  width: 80%;
  min-width: 800px;
  margin: auto;
  font-family: georgia,serif !important;
}

.validation_top_search {
  margin-top: 20px;
  padding-bottom: 10px;
}
.validation_list_content {
  margin: auto; 
}
.validation_table_content tbody tr{
  color:rgb(64, 64, 65);
  height: auto;
}

.validation_button_content .el-checkbox__label{
 color:rgb(64, 64, 65);
  font-size: 14px;
}
.message_button_content,.signmessage_button_content,.report_button_content{
  width: 100%;
  min-width:800px;
  padding: 10px 0;
}
.fail_button_content{
  clear: both;
  width: 100%;
  min-width:800px;
  padding-top:20px;
  padding-bottom: 10px;
  /* padding-left: 10px; */
}
.signmessage_button_content{
 padding: 10px 0;
}
.report_button_content{
   padding: 10px 0;
}
/* .message_log_content .el-table__header-wrapper{
  display: none;
} */
.message_log_content{
  text-align: center;
  margin-bottom: 30px;
}
.message_log_content h2{
  color:rgb(64, 64, 65);
    height:80px;
    line-height:80px;
}
.message_log_content td{
    border: 0;
    padding:4px 0;
}
.message_log_content button{
  padding: 0;
}
/* #status_bg .el-table__body-wrapper td:nth-child(3) .cell{
 background-color:#EB8C00; 
} */
/* #status_bg .el-table__body-wrapper .el-table_1_column_3 .cell{
      background-color:#EB8C00; 
    } */
.upload_go{
  min-width: 300px;

}
.upload_go .el-dialog__header{
  display: none;
}
.upload_go .el-dialog{
  width: 30%;
  min-width: 300px;
  text-align: center;
  padding-top: 10px;

}
.message_log_content .cell {
  line-height: 130%;
}
/* .el-table .cell{
  overflow: auto;
} */

</style>