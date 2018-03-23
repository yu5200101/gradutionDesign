var common = require('../template/getCode.js')
Page({
	data:{
		account:"ruyuan",
		password:"YRY22087793",

	},
	sendAccount:function(e){
		var account = e.detail.value.account;
		var password = e.detail.value.password;
		if(account == this.data.account && password == this.data.password){
			wx.navigateTo({
               url:'../addGoods/addGoods'
          })
		}
		else{
			common.dataLoading("输入的账号或密码错误","loading");
		}
	}
})