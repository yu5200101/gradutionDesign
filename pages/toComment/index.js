var app = getApp()
var Bmob=require("../../utils/bmob.js");
var common = require('../template/getCode.js')
var that;
Page({
	data:{
    contents:"快书建议您多说说使用后的效果感受",
    index:"0",
    detailResult:[]
  },
  onLoad: function(options) {
      that=this;
      that.setData({//初始化数据
        src:"",
        isSrc:false,
        loading:true,
        autoFocus:true,
        isLoading:false,
        isdisabled:false
      })
  },
  onReady:function(){
     wx.hideToast() 
  },
  onShow:function(){
    wx.getStorage({
        key: 'commentResult',
        success: function(res) {
          var detailList = new Array();    
          var orderId = res.data[0].orderId;
          console.log(orderId);
          detailList = res.data[0].orderDetail;
            that.setData({
                orderId:orderId,
                detailResult:detailList,
                loading:true
                
            })
        } 
    })
  },
   uploadPic:function(e){//选择图标
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var detailResult = that.data.detailResult;
    if(index!=="" && index != null){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        detailResult[parseInt(index)].src=tempFilePaths;
        detailResult[parseInt(index)].isSrc = true;
        that.setData({
          detailResult: detailResult    
        })
      }
    })
   }
  },
  clearPic:function(e){//删除图片
    var index = e.currentTarget.dataset.index;
    var detailResult = that.data.detailResult;
    detailResult[parseInt(index)].src=""; 
    detailResult[parseInt(index)].isSrc = false; 
    that.setData({
      detailResult:detailResult
    })
  },
  setContent:function(e){
    var index = e.currentTarget.dataset.index;
    var detailResult = that.data.detailResult;
    detailResult[parseInt(index)].content = e.detail.value;
    that.setData({
      detailResult:detailResult
    })
  },
    formSubmit: function(e) {
    var orderId = that.data.orderId;
    var orderid = parseInt(orderId);
    console.log(orderid);
    var detailResult = that.data.detailResult;
    console.log(detailResult); 
    for(var i = 0; i < detailResult.length; i++){
      console.log(detailResult[parseInt(i)].src);         
      console.log(detailResult[parseInt(i)].content);      
      var src = detailResult[parseInt(i)].src;
      var content = detailResult[parseInt(i)].content;
      var good_id = detailResult[parseInt(i)].good_id;
      var isSrc = detailResult[parseInt(i)].isSrc;
    if (!content) {
        common.dataLoading("内容不能为空","loading");
        return false;
      }
    else{
        that.setData({
          isLoading:true,
          isdisabled:true
        }) 
      var User = Bmob.Object.extend("_User");
      var currentUser = Bmob.User.current();
      var objectid = currentUser.id;
      var good_comment = Bmob.Object.extend("good_comment");
      var god_com = new good_comment();
      var me = new Bmob.User();
      me.id=objectid;
      var good = Bmob.Object.extend("good");
      var goodQuery = new good();
      goodQuery.id = good_id;
      god_com.set("content",content);
      god_com.set("publisher", me);
      god_com.set("good_id",goodQuery);
      if(isSrc==true){
          var name= src;//上传的图片的别名
          var file=new Bmob.File(name,src);
          file.save();
          god_com.set("goodPic",file);
      }
      god_com.save(null, {
        success: function(result) {
          that.setData({
            isLoading:false,
            isdisabled:false
          }) 
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        },
        error: function(result, error) {
          // 添加失败
          console.log(error)
          common.dataLoading("反馈信息失败","loading");
          that.setData({
            isLoading:false,
            isdisabled:false
          }) 
        }
      });
    }
  }    
    var Order = Bmob.Object.extend("Order");
    var order = new Bmob.Query(Order);
    order.equalTo("orderId",orderid);
    order.find({
      success:function(result){
        var result = result[0];
        result.set("isComment",true);
        result.save();
        common.dataLoading("评价成功","loading");
          
      },
      error: function (error) {

        }
    })
    common.dataLoading("反馈信息成功","success",function(){
      wx.redirectTo({
          url:"../order/index"
      })
      });
       setTimeout(function () {
          that.onShow()
        }, 3000);
  }
})