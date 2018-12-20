<template>   
    <div class="validation_content">
        <div class="validation_list_content">
            <div class="validation_top_search">
                
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
            <div v-if="this.hasClient===true">
                <div class="validation_button_content">
                    <div style="float: right;padding-right: 5px;padding-bottom: 10px; ">
                        <el-tooltip placement="top-start" effect="light" :visible-arrow=false>
                            <div slot="content">Verify message signatures of selected addresses in status <br/>- For All Addresses With Validation Required, or <br/>- For All Addresses With Validation Failed</div>
                            <el-dropdown split-button size="mini" type="primary"  @click="verify_signature_for_select_dialog">Verify Signatures
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="verify_signature_for_validation_required">For All Addresses With Validation Required</el-dropdown-item>
                                    <el-dropdown-item @click.native="verify_signature_for_validation_failed">For All Addresses With Validation Failed </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-tooltip>
                    </div>
                    <div style="float: right;padding-right: 5px;padding-bottom: 10px; ">
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
                            <el-tooltip placement="top-start" effect="light" :visible-arrow=false>
                                <div slot="content">Import message signatures </div>
                                <el-button size="mini" type="primary" >Import Signatures
                                    <i class="el-icon-upload el-icon--right"></i>
                                </el-button>
                            </el-tooltip>
                        </el-upload>
                    </div>
                    <div style="float: right;padding-right: 5px;padding-bottom: 10px; ">
                        <el-tooltip placement="top-start" effect="light" :visible-arrow=false>
                            <div slot="content">Export messages of selected addresses in status<br/>- For All Addresses Signature Required <br/>- For All Addresses Validation Required <br/>- For All Addresses Validation Failed </div>
                            <el-dropdown split-button size="mini" type="primary"  @click="download_message_for_selected_dialog">Export Messages
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="download_message_for_signature_required">For All Addresses Signature Required</el-dropdown-item>
                                    <el-dropdown-item @click.native="download_message_for_validation_required">For All Addresses Validation Required</el-dropdown-item>
                                    <el-dropdown-item @click.native="download_message_for_validation_failed">For All Addresses Validation Failed</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-tooltip>
                    
                    </div>
                    <div style="float: right;padding-right: 5px;padding-bottom: 10px; ">
                        <!-- <el-button type="primary"  size="mini" @click="generate_message">Generate Message</el-button> -->
                        <el-tooltip placement="top-start" effect="light" :visible-arrow=false>
                            <div slot="content">Generate messages for selected addresses in status<br/>- For All Addresses With Message Required, or <br/>- For All Addresses With Expired Message </div>
                            <el-dropdown split-button size="mini" type="primary"  @click="generate_message_for_selected_dialog" >Generate Messages
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="generate_message_for_message_required">For All Addresses With Message Required</el-dropdown-item>
                                    <el-dropdown-item @click.native="generate_message_for_expired_message">For All Addresses With Expired Message</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-tooltip>
                    </div>
                </div>
                <div class="dialog_content">
                    <el-dialog
                    title="Generate Message Warning"
                    :visible.sync="generateMessageVisible"
                    width="40%"
                    :before-close="handleClose">
                    <div class="font-size: 14px;">
                        <span>Addresses in following status are selected. Confirm they are intended before continue.</span>
                        <div v-if="Signature_Required_Count!==0">
                            <p>- Signature Required</p>
                            <p style="padding-left:1em">Continue will generate new messages for these addresses and overwrite old messages. However, clients may be generating signatures for old messages. Please remember to export and pass new messages to clients.</p>
                        </div>
                        <div v-if="Validation_Failed_Count!==0">
                            <p>- Validation Failed</p>
                            <p style="padding-left:1em">Continue will generate new messages for these addresses and overwrite old messages. However, clients may be generating signatures for old messages. Please remember to export and pass new messages to clients.</p>
                        </div>
                        <div v-if="Validation_Required_Count!= 0">
                            <p>- Validation Required</p>
                            <p style="padding-left:1em">Continue will generate new messages for these addresses and overwrite old messages. However, the current signatures are for old messages. Please remember to export and pass new messages to clients.</p>
                        </div>
                        <div v-if="Validation_Passed_Count != 0">
                            <p>- Validation_Passed</p>
                            <p style="padding-left:1em"> Continue will exclude these addresses. Validation for these addresses has been passed, and re-generating messages for them is not allowed.</p>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="mini" @click="generateMessageVisible = false">Cancal</el-button>
                        <el-button size="mini" type="primary" @click="generate_message_for_selected()">Continue</el-button>
                    </span>
                    </el-dialog>

                    <el-dialog
                    title="Download Message Warning"
                    :visible.sync="DownloadMessageVisible"
                    width="40%"
                    :before-close="handleClose">
                    <div class="font-size: 14px;">
                        <span>Addresses in the following status are selected, but will be excluded in the export. Confirm they are intended before continue.</span>
                        <div v-if="Message_Required_Count!==0">
                            <p>- Message Required</p>
                            <p style="padding-left:1em">No message has been generated for these addresses. Please remember to use "Generate Messages" for them.</p>
                        </div>
                        <div v-if="Validation_Passed_Count!==0">
                            <p>- Validation Passed</p>
                            <p style="padding-left:1em">Validation for these addresses has been passed. No message export is required for them.</p>
                        </div>
                        <div v-if="Validation_Required_Count!= 0">
                            <p>- Message Expired</p>
                            <p style="padding-left:1em">Message for these addresses have expired. Please remember to use "Generate Messages" to re-generate messages for them.</p>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="mini" @click="DownloadMessageVisible = false">Cancal</el-button>
                        <el-button size="mini" type="primary" @click="download_message_for_selected()">Continue</el-button>
                    </span>
                    </el-dialog>

                    <el-dialog
                    title="Verify Signatures Warning"
                    :visible.sync="VerifySignaturesVisible"
                    width="40%"
                    :before-close="handleClose">
                    <div class="font-size: 14px;">
                        <span>Addresses in the following status are selected, but will be excluded in the verification. Confirm they are intended before continue.</span>
                        <div v-if="Message_Required_Count!==0">
                            <p>- Message Required</p>
                            <p style="padding-left:1em">No message has been generated for these addresses. Please remember to use "Generate Message" for them.</p>
                        </div>
                        <div v-if="Signature_Required_Count!==0">
                            <p>- Signature Required</p>
                            <p style="padding-left:1em">No signature has been imported for these addresses. Please remember to use "Import Signatures" for them.</p>
                        </div>
                        <div v-if="Validation_Passed_Count!==0">
                            <p>- Validation Passed</p>
                            <p style="padding-left:1em">Validation for these addresses has been passed. No more validation is required for them.</p>
                        </div>
                        <div v-if="Validation_Required_Count!= 0">
                            <p>- Message Expired</p>
                            <p style="padding-left:1em">Messages for these addresses have expired. Please remember to use "Generate Message" for them.</p>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="mini" @click="VerifySignaturesVisible = false">Cancal</el-button>
                        <el-button size="mini" type="primary" @click="verify_signature_for_select()">Continue</el-button>
                    </span>
                    </el-dialog>
                    <el-dialog
                    title="Download Report Warning"
                    :visible.sync="DownloadReportVisible"
                    width="40%"
                    :before-close="handleClose">
                    <div class="font-size: 14px;">
                        <span>Addresses in the following status are selected and will be included in the report. Confirm they are intended before continue.</span>
                        <div v-if="Message_Required_Count!==0">
                            <p>- Message Required</p>
                        </div>
                        <div v-if="Signature_Required_Count!==0">
                            <p>- Signature Required</p>
                        </div>
                        <div v-if="Message_Expired_Count!==0">
                            <p>- Message Expired</p>
                        </div>
                        <div v-if="Validation_Passed_Count!==0">
                            <p>- Validation Passed</p>
                        </div>
                        <div v-if="Validation_Failed_Count!==0">
                            <p>- Validation Failed</p>
                        </div>
                        <div v-if="Validation_Required_Count!= 0">
                            <p>- Message Expired</p>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="mini" @click="DownloadReportVisible = false">Cancal</el-button>
                        <el-button size="mini" type="primary" @click="download_report()">Continue</el-button>
                    </span>
                    </el-dialog>
                </div>
                <div class="validation_table_content">
                    
                    <el-table :data="tableData" ref="multipleTable" @selection-change="selectionChange" :highlight-current-row="true" id="status_bg">
                    <el-table-column type="selection" fixed></el-table-column>
                    <el-table-column type="index" label="No."  align="center" width="45"></el-table-column>
                    <el-table-column label="Status" width="130" align="center">
                        <template slot-scope="scope">
                        <div v-if="tableData[scope.$index].status==='Validation Passed'" style="width:100%;background:#4E9385;color:#fff;padding: 2px;">{{tableData[scope.$index].status}}</div>
                        <div v-else-if="tableData[scope.$index].status==='Validation Failed'" style="width:100%;background:#A12023;color:#fff;padding: 2px;">{{tableData[scope.$index].status}}</div>
                        <div v-else-if="tableData[scope.$index].status!==''">{{tableData[scope.$index].status}}</div>
                        <div v-else>——</div>
                        </template>
                        <!-- <template slot-scope="scope">
                        <div v-if="tableData[scope.$index].status==='Validation Passed'" style="width:100%;color:#4E9385;">{{tableData[scope.$index].status}}</div>
                        <div v-else-if="tableData[scope.$index].status==='Validation Failed'" style="width:100%;background:#A12023;color:#fff">{{tableData[scope.$index].status}}</div>
                        <div v-else-if="tableData[scope.$index].status==='Validation Required'" style="width:100%;color:#968C6E;">{{tableData[scope.$index].status}}</div>
                        <div v-else-if="tableData[scope.$index].status==='Signature Required'" style="width:100%;color:#5F2322;">{{tableData[scope.$index].status}}</div>
                        <div v-else-if="tableData[scope.$index].status==='Message Required'" style="width:100%;color:#E98B22;">{{tableData[scope.$index].status}}</div>
                        <div v-else-if="tableData[scope.$index].status==='Message Expired'" style="width:100%;color:#DD3228;">{{tableData[scope.$index].status}}</div>
                        <div v-else>——</div>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="currency" label="Currency" align="center"></el-table-column>
                    <el-table-column prop="address" label="Address"  align="center"></el-table-column>
                    <el-table-column label="Public Key"  width="130" align="center">
                        <template slot-scope="scope">
                            <span v-if="tableData[scope.$index].public_key===''">
                                ——
                            </span>
                             <span v-else>
                                {{tableData[scope.$index].public_key}}
                             </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ownership" label="Ownership"  align="center"></el-table-column>
                    <el-table-column label="Multisig(M/N)" align="center" width="80">
                        <template slot-scope="scope">
                        <span v-if="tableData[scope.$index].n>0">
                            <span>{{tableData[scope.$index].m}}</span>
                            <span>/</span>
                            <span>{{tableData[scope.$index].n}}</span>
                        </span>
                        <span v-else>
                            ——
                        </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Message" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="tableData[scope.$index].message===''">
                            ——
                        </span>
                            <span v-else>
                            {{tableData[scope.$index].message}}
                            </span>
                    </template>
                    </el-table-column>
                    <el-table-column label="Expiry" width="120" align="center">
                        <template slot-scope="scope">
                            <span v-if="tableData[scope.$index].expiry===''">
                                ——
                            </span>
                                <span v-else>
                                {{tableData[scope.$index].expiry}}
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="signed_message" label="Signature" width="200" align="center">
                        <template slot-scope="scope">
                            <span v-if="tableData[scope.$index].signed_message===''">
                                ——
                            </span>
                             <span v-else>
                                {{tableData[scope.$index].signed_message}}
                             </span>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
                <div class="validation_button_content">
                    <div style="float: right;" >
                        <el-tooltip placement="top-start" effect="light" :visible-arrow=false>
                            <div slot="content">Generate the verification report for selected addresses </div>
                            <el-button size="small" type="primary" @click="download_report_dialog" >Export Report</el-button>
                        </el-tooltip>
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
                <div class="message_log_content" v-if="record_data!=null  && (record_data != []) && (record_data.length != 0)">
                    <hr/>
                     <div class="event_header">
                        <h4 style="text-align:left;padding-bottom:10px">Events</h4>
                    </div>
                    <el-table
                    :data="record_data"
                     max-height="300"
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    style="width:100%;color:rgb(64, 64, 65);">

                        <el-table-column
                            prop="operator"
                            width="200">   
                        </el-table-column>

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
                        
                        <el-table-column
                            prop="detail"
                            >
                            <template slot-scope="scope">                          
                                <div  v-if="scope.row.has_link===false">
                                {{scope.row.detail}}
                                </div>
                                <div v-else>
                                    <el-button type="text" style="font-size:12px;text-decoration:underline;color: black;font-family: Arial,Helvetica,sans-serif !important;" @click="record_address(scope.row)">{{scope.row.detail}}</el-button>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="date"
                            width="150">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import apiRequest from '../request/request'
import store from '../store'
export default {
    data() {
        return {
            tableData: [],
            client_search: "",
            project_title: "",
            client_name: "",
            selectData: [],
            clientList:[],
            clientData:[],
            hasClient:false,
            countAll:0,
            record_data:[],
            requestData:[],

            generate_message_enable: true,
            export_message_enable: true,
            verify_signature_enable: true,

            Message_Required_Count: 0,
            Signature_Required_Count: 0,
            Message_Expired_Count: 0,
            Validation_Passed_Count: 0,
            Validation_Failed_Count:0,
            Validation_Required_Count:0,

            generateMessageVisible:false,
            DownloadMessageVisible:false,
            VerifySignaturesVisible:false,
            DownloadReportVisible:false,

        }
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
        store.saveIndex("3")
        if (this.client_search === "") {
            this.client_name = ""
            this.project_title = "";
        }
        this.clientView();
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
                this.hasClient = false;
                return
            }
            this.client_name=this.client_search;
            this.hasClient = true
            this.addressView();
            this.MessageLogView();
        },
        currentSel(index) {
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
                        this.client_name = this.client_search
                        this.project_title=list[i].projectTitle;
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
        clientView() {
            let global = this;
            apiRequest
                .sendRequest("post", "/cryptotool/user/clients/view")
                .then(function(response) {
                if (response) {
                    if (response.code === "0") {
                        global.clientData = response.data.clientList;
                        for (var i = 0; i < global.clientData.length; i++) {
                            var obj = {};
                            obj.value = global.clientData[i].clientName;
                            obj.projectTitle = global.clientData[i].project_title;
                            global.clientList.push(obj);
                        }
                    } else {
                        global.$message.warning(response.msg);
                    }
                }
            });
        },
        //generate_messag
        generate_message_for_selected_dialog(){
            this.requestData = [] //this.selectData
            if(this.selectData===[]|| this.selectData===null|| this.selectData.length===0){
                return this.$message.warning('No address selected');
            }
            this.Validation_Passed_Count = 0
            this.Validation_Failed_Count = 0
            this.Validation_Required_Count =0
            this.Signature_Required_Count= 0
            for(var i=0;i<this.selectData.length;i++){
                var obj = {};
                obj.address = this.selectData[i].address;
                obj.currency = this.selectData[i].currency;
                
                if(this.selectData[i].status ==="Validation Passed"){
                    this.Validation_Passed_Count++
                } else if(this.selectData[i].status ==="Validation Failed"){
                    this.Validation_Failed_Count++
                    this.requestData.push(obj)
                } else if(this.selectData[i].status ==="Validation Required"){
                    this.Validation_Required_Count++
                    this.requestData.push(obj)
                } else if(this.selectData[i].status ==="Signature Required"){
                    this.Signature_Required_Count++
                    this.requestData.push(obj)
                } else {
                    this.requestData.push(obj)
                } 
            }
            if(this.Validation_Passed_Count == 0 && this.Validation_Failed_Count == 0 && this.Validation_Required_Count ==0&&this.Signature_Required_Count== 0){
                this.generate_message_for_selected()
                return
            }
            this.generateMessageVisible = true
        },
        generate_message_for_selected(){
            this.generateMessageVisible =false
            
            if(this.requestData===[]|| this.requestData===null|| this.requestData.length===0){
                return this.$message.warning('No need to generate messages');
            }
            this.generate_message(this.requestData)

        },
        generate_message_for_message_required(){
            this.requestData = []
            if(this.tableData === []|| this.tableData===null || this.tableData.length===0){
                return this.$message.warning('No Address With Expired Message');
            }
            for(var i=0;i<this.tableData.length;i++){
               
                if(this.tableData[i].status ==="Message Required"){
                    var obj = {};
                    obj.address = this.tableData[i].address;
                    obj.currency = this.tableData[i].currency;
                    this.requestData.push(obj)
                }
            }
            if(this.requestData===null|| this.requestData===[]|| this.requestData.length===0){
                 return this.$message.warning('No Address With Message Required ');
            }
            this.generate_message(this.requestData)
        },
        generate_message_for_expired_message(){
            this.requestData = []
            if(this.tableData === []|| this.tableData===null || this.tableData.length===0){
                return this.$message.warning('No Address With Expired Message');
            }
          
            for(var i=0;i<this.tableData.length;i++){
               
                if(this.tableData[i].status ==="Message Expired"){
                    var obj = {};
                    obj.address = this.tableData[i].address;
                    obj.currency = this.tableData[i].currency;
                    this.requestData.push(obj)
                }
            }
            if(this.requestData===null|| this.requestData===[]|| this.requestData.length===0){
                 return this.$message.warning('No Address With Expired Message');
            }
            this.generate_message(this.requestData)
        },
        generate_message(requestData) {
            
            let global = this;
            apiRequest.sendRequest("post",
                "/cryptotool/message/generate",
                JSON.stringify({
                    clientName: global.client_name,
                    projectTitle: global.project_title,
                    currencies: requestData
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
        //download_message
        download_message_for_selected_dialog(){
            this.requestData = [] //this.selectData
            if(this.selectData===[]|| this.selectData===null|| this.selectData.length===0){
                return this.$message.warning('No address selected');
            }
            var warningMessage = ""
            this.Validation_Passed_Count = 0
            this.Message_Required_Count = 0
            this.Message_Expired_Count =0
            this.Signature_Required_Count= 0
            for(var i=0;i<this.selectData.length;i++){
                var obj = {};
                obj.address = this.selectData[i].address;
                obj.currency = this.selectData[i].currency;
                
                if(this.selectData[i].status ==="Validation Passed"){
                    this.Validation_Passed_Count++
                } else if(this.selectData[i].status ==="Message Required"){
                    this.Message_Required_Count++
                } else if(this.selectData[i].status ==="Message Expired"){
                    this.Message_Expired_Count++
                } else {
                    this.requestData.push(obj)
                } 
            }
            if(this.Validation_Passed_Count == 0 && this.Message_Required_Count == 0 && this.Message_Expired_Count ==0 && this.Signature_Required_Count ==0){
                this.download_message_for_selected()
                return
            }
            this.DownloadMessageVisible = true
        },
        download_message_for_selected(){
            this.DownloadMessageVisible =false
        
            if(this.requestData===[]|| this.requestData===null|| this.requestData.length===0){
                return this.$message.warning('No messages will be exported');
            }
            this.download_message(this.requestData)
        },
        download_message_for_signature_required(){
            this.requestData = []
            if(this.tableData === []|| this.tableData===null || this.tableData.length===0){
                return this.$message.warning('No messages will be exported');
            }
          
            for(var i=0;i<this.tableData.length;i++){
               
                if(this.tableData[i].status ==="Signature Required"){
                    var obj = {};
                    obj.address = this.tableData[i].address;
                    obj.currency = this.tableData[i].currency;
                    this.requestData.push(obj)
                }
            }
            if(this.requestData===null|| this.requestData===[]|| this.requestData.length===0){
                 return this.$message.warning('No messages will be exported');
            }
            this.download_message(this.requestData)
        },
        download_message_for_validation_required(){
            this.requestData = []
            if(this.tableData === []|| this.tableData===null || this.tableData.length===0){
                return this.$message.warning('No messages will be exported');
            }
          
            for(var i=0;i<this.tableData.length;i++){
               
                if(this.tableData[i].status ==="Validation Required"){
                    var obj = {};
                    obj.address = this.tableData[i].address;
                    obj.currency = this.tableData[i].currency;
                    this.requestData.push(obj)
                }
            }
            if(this.requestData===null|| this.requestData===[]|| this.requestData.length===0){
                 return this.$message.warning('No Address With Validation Required');
            }
            this.download_message(this.requestData)
        },
        download_message_for_validation_failed(){
            this.requestData = []
            if(this.tableData === []|| this.tableData===null || this.tableData.length===0){
                return this.$message.warning('No Address With Validation Failed');
            }
          
            for(var i=0;i<this.tableData.length;i++){
               
                if(this.tableData[i].status ==="Validation Failed"){
                    var obj = {};
                    obj.address = this.tableData[i].address;
                    obj.currency = this.tableData[i].currency;
                    this.requestData.push(obj)
                }
            }
            if(this.requestData===null|| this.requestData===[]|| this.requestData.length===0){
                 return this.$message.warning('No Address With Validation Failed');
            }
            this.download_message(this.requestData)            
        },
        download_message(requestData) {
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
                    currencies: requestData
                }),null,'message_'+name+'_'+project+'_'+myTime+h+m+s+'.xlsx'
            ).then(function(response) {
                if(response){
                    if (response.code === "0") {
                        global.$message.success(response.msg)
                        global.addressView();
                        global.MessageLogView();
                    } else{
                        global.$message.warning(response.msg)
                    }
                    global.addressView();
                    global.MessageLogView();
                }
                });
                global.messageDialogVisible= false;
                global.MessageLogView();
        },
        //uploadMessage
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
        //verify signature
        verify_signature_for_select_dialog(){
            this.requestData = [] //this.selectData
            if(this.selectData===[]|| this.selectData===null|| this.selectData.length===0){
                return this.$message.warning('No address selected');
            }
            var warningMessage = ""
            this.Message_Required_Count = 0
            this.Signature_Required_Count = 0
            this.Validation_Passed_Count= 0
            this.Message_Expired_Count = 0

            for(var i=0;i<this.selectData.length;i++){
                var obj = {};
                obj.address = this.selectData[i].address;
                obj.currency = this.selectData[i].currency;
                
                if(this.selectData[i].status ==="Validation Passed"){
                    this.Validation_Passed_Count++
                } else if(this.selectData[i].status ==="Message Required"){
                    this.Message_Required_Count++
                } else if(this.selectData[i].status ==="Signature Required"){
                    this.Signature_Required_Count++
                } else if(this.selectData[i].status ==="Message Expired"){
                    this.Message_Expired_Count++
                } else {
                    this.requestData.push(obj)
                } 
            }
            
            if(this.Message_Required_Count == 0 && this.Signature_Required_Count == 0 && this.Validation_Passed_Count ==0 && this.Message_Expired_Count ==0){
                this.verify_signature_for_select()
                return
            }
            this.VerifySignaturesVisible = true
        },
        verify_signature_for_select(){
            
            this.VerifySignaturesVisible =false
        
            if(this.requestData===[]|| this.requestData===null|| this.requestData.length===0){
                return this.$message.warning('No signatures will be verified');
            }
            this.verify_signature(this.requestData)
        },
        verify_signature_for_validation_required(){
            this.requestData = []
            if(this.tableData === []|| this.tableData===null || this.tableData.length===0){
                return this.$message.warning('No Address With Validation Required');
            }
          
            for(var i=0;i<this.tableData.length;i++){
               
                if(this.tableData[i].status ==="Validation Required"){
                    var obj = {};
                    obj.address = this.tableData[i].address;
                    obj.currency = this.tableData[i].currency;
                    this.requestData.push(obj)
                }
            }
            if(this.requestData===null|| this.requestData===[]|| this.requestData.length===0){
                 return this.$message.warning('No Address With Validation Required');
            }
            this.verify_signature(this.requestData)
        },
        verify_signature_for_validation_failed(){
            this.requestData = []
            if(this.tableData === []|| this.tableData===null || this.tableData.length===0){
                return this.$message.warning('No Address With Validation Failed');
            }
          
            for(var i=0;i<this.tableData.length;i++){
               
                if(this.tableData[i].status ==="Validation Failed"){
                    var obj = {};
                    obj.address = this.tableData[i].address;
                    obj.currency = this.tableData[i].currency;
                    this.requestData.push(obj)
                }
            }
            if(this.requestData===null|| this.requestData===[]|| this.requestData.length===0){
                 return this.$message.warning('No Address With Validation Failed');
            }
            this.verify_signature(this.requestData)
        },
        verify_signature(requestData) {

            let global = this;
            apiRequest.sendRequest("post",
                "/cryptotool/message/validate",
                JSON.stringify({
                    clientName: global.client_name,
                    projectTitle: global.project_title,
                    currencies: requestData
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
        selectionChange(val) {

            this.generate_message_enable=true
            this.export_message_enable= true
            this.verify_signature_enable=true
            this.changeValue=val;
            if(val==null){
                this.generate_message_enable=true
                this.export_message_enable= true
                this.verify_signature_enable=true
                return
            }
            this.value_length=val.length;
            this.selectData = [];
            for(var i=0;i<this.value_length;i++){
                this.selectData.push(val[i])
                if(val[i].status==='Validation Passed'){
                    this.generate_message_enable=false
                    this.export_message_enable= false
                    this.verify_signature_enable=false
                } else if(val[i].status==='Message Required'){
                    this.export_message_enable= false
                    this.verify_signature_enable=false
                } else if(val[i].status==='Signature Required'){
                    this.verify_signature_enable=false
                } else if(val[i].status==='Message Expired'){
                    this.export_message_enable= false
                    this.verify_signature_enable=false
                }
            }
        },
        download_report_dialog(){
            this.requestData = [] //this.selectData
            if(this.selectData===[]|| this.selectData===null|| this.selectData.length===0){
                return this.$message.warning('No address selected');
            }
            var warningMessage = ""
            this.Message_Required_Count = 0
            this.Signature_Required_Count = 0
            this.Validation_Required_Count = 0
            this.Validation_Failed_Count = 0
            this.Validation_Passed_Count= 0
            this.Message_Expired_Count = 0

            for(var i=0;i<this.selectData.length;i++){
                var obj = {};
                obj.address = this.selectData[i].address;
                obj.currency = this.selectData[i].currency;
                this.requestData.push(obj)

                if(this.selectData[i].status ==="Validation Passed"){
                    this.Validation_Passed_Count++
                } else if(this.selectData[i].status ==="Message Required"){
                    this.Message_Required_Count++
                } else if(this.selectData[i].status ==="Signature Required"){
                    this.Signature_Required_Count++
                } else if(this.selectData[i].status ==="Message Expired"){
                    this.Message_Expired_Count++
                } else if(this.selectData[i].status ==="Validation Required"){
                    this.Validation_Required_Count++
                } else if(this.selectData[i].status ==="Validation Failed"){
                    this.Validation_Failed_Count++
                }
            }
            this.DownloadReportVisible = true
        },
        download_report() {
            
            this.DownloadReportVisible =false
        
            if(this.requestData===[]|| this.requestData===null|| this.requestData.length===0){
                return this.$message.warning('No result will be exported');
            }
            this.down_go();
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
                } 
                }
            })
        },
        handleClose(){
            this.generateMessageVisible=false
            this.DownloadMessageVisible=false
            this.VerifySignaturesVisible=false
            this.DownloadReportVisible=false
        },
        record_address(row) {
            this.$router.push({ name: "erroraddress",params:{id:row.logId,name:this.client_name,project:this.project_title,operation:row.operation,operator:row.operator}});
        } 
    }
}
</script>

<style>
.validation_content {
  width: 80%;
  min-width: 800px;
  margin: auto;
  font-family: georgia,serif !important;
}

.validation_top_search {
  text-align: left;
  margin-top: 20px;
  padding-bottom: 30px;
}

.validation_list_content {
  margin: auto;
}

.validation_table_content tbody tr{
  color:rgb(64, 64, 65);
  /* height: auto; */
}
.validation_button_content{
    padding-top: 10px; 
    padding-bottom: 10px; 
}

.validation_button_content .el-checkbox__label{
 color:rgb(64, 64, 65);
  font-size: 14px;
}

.el-dropdown-menu--mini .el-dropdown-menu__item{
    font-size: 14px;
}
.message_log_content{
  text-align: center;
  margin-bottom: 30px;
}
.message_log_content td{
    border: 0;
    padding:4px 0;
    font-size: 12px;
}
.message_log_content button{
  padding: 0;
}

.message_log_content .el-table__header-wrapper{
  display: none;
}

.dialog_content{
    font-size: 12px;
}
</style>