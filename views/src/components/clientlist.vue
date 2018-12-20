<template>
  <div class="clientlist_content">
    <div class="list_content">
      <div class="top_button">
        <div class="search_client_content">
          <span>Client Name:</span>
          <el-autocomplete
            class="inline-input"
            id="list_font"
            v-model="clientSearch_name"
            :fetch-suggestions="querySearch"
            @keyup.enter.native="searchClient"
            placeholder="Please Enter Client"
          ></el-autocomplete>
          <el-button
            type="primary"
            title="Create a New Client"
            icon="el-icon-search"
            size="small"
            @click="searchClient"
            style="color:rgb(254, 250, 245)"
          >Search</el-button>
        </div>
        <div class="create_client_content">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="client_create"
            style="color:rgb(254, 250, 245)"
          >Create Client</el-button>
        </div>
      </div>
    </div>
    <div class="table_sort">
      <el-table
        :data="currenttableData"
        :highlight-current-row="true"
        :default-sort="{prop: 'createDate', order: 'descending'}"
        style="width: 100%;color:rgb(64, 64, 65)"
      >
        <el-table-column prop="clientName" label="Client Name" align="center" width="300"></el-table-column>
        <el-table-column prop="project_title" label="Project Title" align="center"></el-table-column>
        <el-table-column prop="description" label="Description" align="center"></el-table-column>
        <el-table-column label="Operation" align="center">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-edit"
              @click="client_edit(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_content" v-if="currenttableData != null && currenttableData != [] && currenttableData.length !=0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        style="color:rgb(64, 64, 65)"
      ></el-pagination>
    </div>
    <br>
    <br>
    <div class="client_log_content" v-if="record_data!=null && (record_data != []) && (record_data.length != 0)">
      <hr>
      <div class="event_header">
        <h4 style="text-align:left;padding-bottom:10px">Events</h4>
      </div>
      <el-table
        :data="record_data"
        max-height="300"
        :default-sort="{prop: 'date', order: 'descending'}"
        style="width:100%; color:rgb(64, 64, 65);"
        height="500"
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
        <el-table-column prop="detail" ></el-table-column>
        <el-table-column prop="date" key="1" width="150" fixed="right"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import apiRequest from "../request/request";
import store from "../store";

export default {
  name: "client_list",

  data() {
    return {
      clientData: [],
      tableData: [],
      clientSearch_name: "",
      clientList: [],
      currenttableData: [],
      currentPage: 1,
      pagesize: 10,
      total: 0,
      criteria: "",
      record_data: []
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
    this.clientView();
    this.clientLogView();
    store.saveIndex("1");
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
    clientView() {
      let global = this;
      apiRequest
        .sendRequest("post", "/cryptotool/user/clients/owner/view")
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.clientData = response.data.clientList;
              global.tableData = global.clientData;

              global.total = global.tableData.length;
              global.currentPage = 1;
              global.loadData(
                global.criteria,
                global.currentPage,
                global.pagesize
              );
              for (var i = 0; i < global.tableData.length; i++) {
                global.clientList.push({
                  value: global.clientData[i].clientName
                });
              }
            } else {
              global.$message.warning(response.msg);
            }
          }
        });
    },
    client_create() {
      this.$router.push({ name: "createclient" });
    },
    querySearch(queryString, cb) {
      var clientList = this.clientList;
      var results = queryString
        ? clientList.filter(this.createFilter(queryString))
        : clientList;
      cb(results);
    },
    createFilter(queryString) {
      return clientList => {
        return clientList.value.indexOf(queryString) >= 0;
      };
    },
    client_edit(index, row) {
      this.$router.push({
        name: "editclient",
        params: { clientName: row.clientName }
      });
    },
    searchClient() {
      if (this.clientSearch_name === "") {
        this.tableData = this.clientData;
        this.total = this.tableData.length;
        this.currentPage = 1;
        this.loadData(this.criteria, this.currentPage, this.pagesize);
        return;
      }

        var newArr=[];
        //this.clientSearch_name=this.clientSearch_name.replace(/[\\]/g, "\\");
       for(var i=0;i<this.clientData.length;i++){

         if(this.clientData[i].clientName.indexOf(this.clientSearch_name) >=0){
           newArr.push(this.clientData[i]);
         }
        }
      this.tableData = newArr;
      this.total = this.tableData.length;
      this.currentPage = 1;
      this.loadData(this.criteria, this.currentPage, this.pagesize);
    },

    //页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.loadData(this.criteria, this.currentPage, this.pagesize);
    },
    loadData(criteria, currentPage, pagesize) {
      var start = (currentPage - 1) * this.pagesize;
      this.currenttableData = this.tableData.slice(start, start + pagesize);
    },
    clientLogView() {
      let global = this;
      apiRequest
        .sendRequest("get", "/cryptotool/log/client/view")
        .then(function(response) {
          if (response) {
            if (response.code === "0") {
              global.record_data = response.data.loglist;
              
            } else {
              global.$message.warning(response.msg);
            }
          }
        });
    }
  }
};
</script>

<style>
.clientlist_content {
  width: 80%;
  min-width: 800px;
  margin: auto;
  font-family: georgia, serif !important;
}
.clientlist_content .el-button--warning {
  color: rgb(254, 250, 245);
}
.table_sort {
  width: 100%;
}
.top_button {
  margin-top: 20px;
}
.list_content {
  margin: auto;
  padding-bottom: 10px;
}
.create_client_content {
  text-align: right;
}
.search_client_content {
  float: left;
}
.search_client_content.el-input {
  font-family: georgia, serif;
}
.el-dialog__title {
  font-size: 20px;
  color: rgb(64, 64, 65);
}
.el-dialog__header {
  border-bottom: solid 1px #a32020;
}
.page_content {
  padding: 10px;
  text-align: right;
}
.client_log_content {
  text-align: center;
  margin-bottom: 30px;
}

.client_log_content td {
  border: 0;
  padding: 4px 0;
  font-size: 12px;
}

.event_header{
  padding: 10px;
}
.client_log_content .el-table__header-wrapper{
  display: none;
}
</style>