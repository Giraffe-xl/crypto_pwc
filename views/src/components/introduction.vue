<template>

	 <div id="introduction_content">
      <h2>Instructions</h2>
      <p>PwC Crypto Audit Tool provides services for verifying <b>wallet addresses</b> of cryptocurrencies. </p>
      <div><b>1. Register the client on <u @click='goto_clientManagement'>Client Management</u>.</b></div>    
      <div class="introduce_list">
        <span>1.1 Click &quot;Create Client&quot; at the top right of the list, input all required information in the popup page and click &quot;Create&quot; at the end.</span>
      </div>
      <div class="introduce_list">
        <span>1.2 If the client is registered successfully, it will be listed on the page.</span>
      </div>
      <div class="introduce_list">
        <span>1.3 The information of every successfully registered client can be updated later by clicking the rightmost button on the row.</span>
      </div>
      <div><b>2. Add wallet addresses for the registered client on <u @click='goto_addressManagement'>Address Management</u>.</b></div>    
      <div class="introduce_list">
        <span>2.1 Select the client by its name in &quot;Client Name&quot; above the list.</span>
      </div>
      <div class="introduce_list">
        <span>2.2 Either, click &quot;Add Address&quot; at the bottom left of the list, input all required information of the wallet address and click &quot;Add&quot; at the end. Repeat this step to add multiple addresses.</span>
      </div>
      <div class="introduce_list">
        <span>2.3 Or, click &quot;Import Address&quot; at the bottom of the list to upload a file containing one or more wallet addresses. A template file can be downloaded via &quot;Download the Excel template&quot; next to &quot;Import Address&quot;.</span>
      </div>
      <div class="introduce_list">
        <span>2.4 All successfully added wallet addresses will be listed on the page.</span>
      </div>

    <div>
      <b>
        3. Verify addresses for registered clients on
        <u
          @click="goto_addressValidation"
        >Address Validation</u>.
      </b>
    </div>
    <div class="introduce_list">
      <span>3.1 Select client by name in the box of &quot;Client Name&quot; above the list. All of the addresses for the client are then listed.</span>
    </div>
    <div class="introduce_list">
      <span>3.2 Generate unsigned messages for addresses.</span>
    </div>
    <div class="introduce_bg">
      <span>3.2.1 Select addresses without messages.</span>
    </div>
    <div class="introduce_bg">
      <span>3.2.2 Click &quot;Generate Messages&quot;.</span>
    </div>
    <div class="introduce_list">
      <span>3.3 Sign messages.</span>
    </div>
    <div class="introduce_bg">
      <span>3.3.1 Select addresses with unsigned messages.</span>
    </div>
    <div class="introduce_bg">
      <span>3.3.2 Click &quot;Export Messages&quot; to download a file (MS Excel) including generated messages of selected addresses.</span>
    </div>
    <div class="introduce_bg">
      <span>3.3.3 Ask the client to fill out the Excel file with signatures on messages.</span>
    </div>
    <div class="introduce_bg">
      <span>3.3.4 Import the Excel file with signatures by clicking &quot;Import Signatures&quot;.</span>
    </div>

    <div class="introduce_list">
      <span>3.4 Validate addresses.</span>
    </div>
    <div class="introduce_bg">
      <span>3.4.1 Select all non-validated addresses with signatures.</span>
    </div>
    <div class="introduce_bg">
      <span>3.4.2 Click &quot;Verify Signatures&quot; to verify all signatures. The validation result of each wallet will be listed in the &quot;Status&quot; column of the list.</span>
    </div>

    <div class="introduce_list">
      <span>3.5 Get the report.</span>
    </div>
    <div class="introduce_bg">
      <span>3.5.1 Select addresses for the validation report .</span>
    </div>
    <div class="introduce_bg">
      <span>3.5.2 Click &quot;Export Report&quot; to download the report.</span>
    </div>
    <br>
    <br>
    <div>In the above step 3.3.3, auditors can direct clients to sign messages by the following instructions.</div>
    <div class="introduce_list">
      <span>1. Ask the client to sign messages in a wallet application supporting digital signatures on customized messages.</span>
    </div>
    <div class="introduce_bg">
      <span>1.1 If the wallet application used by the client does not support customized-message signatures, 
      the client must first import his/her private key to a supporting application and sign messages.</span>
    </div>
    <div class="introduce_bg">
      <span>1.2 Some popular wallet applications supporting  customized-message signatures are listed below:</span>
    </div>
    <div style="width: inherit; margin:0 auto">
      <br/>
      <el-table
      :data="tableData"
      stripe
      style="width: 100%;color: rgb(64, 64, 65);">
      <el-table-column
        prop="Currency"
        label="Currency">
      </el-table-column>
      <el-table-column
        prop="Wallet"
        label="Wallet Applications">
      </el-table-column>
    </el-table>
    <br/>
    </div>
    <div class="introduce_list">
      <span>2. Ask the client to fill signatures in the &quot;Signature&quot; column of the Excel file, and return the updated file to the auditor.</span>
    </div>
  </div>
</template>
<script>
import apiRequest from '../request/request'
import store from '../store'
export default {
  name: "introduction",
  data(){
    return{
       tableData: [
         {
          Currency:'BTC',
          Wallet:"Bitcoin-cli, Bitpie, Bither, Coinomi, Electrum"
          },
         {
          Currency:'LTC',
          Wallet:"Bitpie, Electrum-LTC"
         },
         {
          Currency:'BCH',
          Wallet:"Bitpie, Electron Cash"
         },
         {
          Currency:'ETH',
          Wallet:"Bitpie, Coinomi"
         }

       ]
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
    store.saveIndex("0")
  },

  methods: {

    getUserName(){
      let global = this;
      apiRequest.sendRequest("get","/cryptotool/user/current/get").then(response=> {
         if(response){
            if (response.code === "0") {
              store.saveUserName(response.data.userName);
            }
         }
      });
    },

    goto_clientManagement() {
      this.$router.push({ name: "clientlist" });
    },
    goto_addressManagement() {
      this.$router.push({ name: "manageaddress" });
    },
    goto_addressValidation() {
      this.$router.push({ name: "validateaddress" });
    }
  }
};
</script>

<style>
#introduction_content {
  width: 80%;
  min-width: 600px;
  margin: auto;
  padding: 10px 5% 50px;
  margin-top: 50px;
  color: rgb(64, 64, 65);
  font-family: georgia, serif;
  /* background-color: #f2f2f2; */
}
#introduction_content h2 {
  width: 100%;
  text-align: center;
  height: 80px;
  line-height: 80px;
}

#introduction_content u {
  color: #a32020;
  cursor: pointer;
}
#introduction_content div,
#introduction_content p {
  line-height: 250%;
}

.introduce_list i {
  clear: both;
  float: left;
  font-size: 24px;
  margin-right: 20px;
  margin-top: 2px;
  /* font-weight: 700px; */
}
.introduce_bg {
  padding-left: 50px;
}
</style>