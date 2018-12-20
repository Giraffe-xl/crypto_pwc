<template>
    <div class="address_error_content">

				<el-button type="text" class="error_back" @click="error_back"><i class="el-icon-arrow-left"></i> Back to previous page</el-button>
         <div class="address_error_header">
					 
					 <span>{{operation}} Error</span>
           
        </div>
        <div class="address_error_info">
            <span>Client Name:</span>
            <i>{{clientName}}</i>
            <span >Project:</span>
            <i>{{projectTitle}}</i>
						<span >Operator:</span>
            <span>{{operator}}</span>
          </div>
     <el-table
		 			class="error_font"
			    :data="tableData"
					style="color:rgb(64, 64, 65);"
			    stripe
			     >
			   
			    <el-table-column
			      type="index"
			      label="No."
                  align="center"
			      >
			    </el-table-column>

						<el-table-column
			      prop="error_detail"
			      label="Error Info"
                  align="center"
			      >
			    </el-table-column>

					 <el-table-column
			      prop="currency"
			      label="Currency"
                  align="center">
			    </el-table-column>

					<el-table-column
			      prop="address"
			      label="Public Address"
                  align="center"
			      >
			    </el-table-column>
			    <el-table-column
			      label="Multisig(N/M)"
            align="center"
			      >
			      	<template slot-scope="scope">			      		
						  <span v-if="tableData[scope.$index].n>0">
				      		<span>{{tableData[scope.$index].m}}</span>
				      		<span>/</span>
				      		<span>{{tableData[scope.$index].n}}</span>
						  </span>

						  <span v-else>
              <i style="display:block;margin:auto; width:20px;height:1px;background-color:rgb(64, 64, 65)"></i>
            </span>

			      	</template>

			    </el-table-column>

				<el-table-column
			      prop="message"
			      label="Message"
                  align="center"
			      >
			    </el-table-column>

			    <el-table-column
			      prop="signed_message"
			      label="Signed-Message"
                  align="center"
			      >
			    </el-table-column>

			    <el-table-column
			      prop="status"
			      label="Address Status"
                  align="center"
			      >
			    </el-table-column>
  		</el-table>
    </div>   
</template>

<script>
import apiRequest from '../request/request'
import store from '../store'

export default {
  data() {
        return {
            clientName: this.$route.params.name,
						projectTitle: this.$route.params.project,
						logId:this.$route.params.id,
						operation:this.$route.params.operation,
						operator:this.$route.params.operator,
            tableData: [],

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
		store.saveIndex("3")

		this.viewLogDetail()	
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
		error_back(){
			//window.history.go(-1);
			this.$router.go(-1);
		},
		viewLogDetail(){
			let global = this;
			apiRequest.sendRequest("post","/cryptotool/log/verify/detail/view", 
				JSON.stringify({
						clientName: global.clientName,
						projectTitle: global.projectTitle,
						logId:global.logId
				})
			).then(function(response){
				if(response){
					if(response.code==='0'){
						global.tableData=response.data.messageOperateAddress;
					}
				}
			});
		}

  }
}
</script>

<style>
.address_error_content{
	width: 80%;
  min-width: 800px;
  margin: auto;
  padding: 10px 20px 20px;
	color:rgb(64, 64, 65);
  font-family: georgia,serif !important;
}
.error_font{
	font-size: 13px;
}
.address_error_header{
		margin-bottom:20px;
    text-align: center;
    font-size: 22px;
}
.address_error_header .el-button{
	clear: both;

}
.address_error_info{
    padding: 10px;
		font-size: 16px;
}
.address_error_info i{
	margin-right: 20px;
}
.error_back{
	font-size: 18px;
	margin-top:10px;
	color: #909399;
	text-decoration: underline;
}
.error_back:hover{
	color: #909399;
}
</style>