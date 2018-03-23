var app = getApp()
var Bmob=require("../../utils/bmob.js");
var common = require('../template/getCode.js')
var that;
Page({
	data:{
    typeIndex:0,
    type:['　　　　　','功能异常','其他问题'],
    content:"您使用此款微信小程序时遇到的问题和意见",
    index:"0"
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
    var myInterval=setInterval(getReturn,500);
    function getReturn(){
      wx.getStorage({
        key: 'user_openid',
        success: function(ress) {
          if(ress.data){
            clearInterval(myInterval)
              that.setData({
                loading:true
            })
          }
        } 
      })
    }
  },
  typePickerBindchange:function(e){
    this.setData({
     typeIndex:e.detail.value
    })
  },
   uploadPic:function(){//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc:true,
          src:tempFilePaths
        })
      }
    })
  },
  clearPic:function(){//删除图片
    that.setData({
      isSrc:false,
      src:""
    })
  },
  formSubmit: function(e) {
    var content=e.detail.value.content;
    console.log(content);
    var typeIndex=e.detail.value.typeIndex;
    if (typeIndex == 0) {
      common.showTip("请选择区域", "loading");
      return false;
    }else if (!content) {
      common.showTip("内容不能为空", "loading");
      return false;
    }
    else{
        that.setData({
          isLoading:true,
          isdisabled:true
        }) 
        wx.getStorage({
          key: 'user_id',
          success: function(ress) {
              var Suggback = Bmob.Object.extend("Suggback");
              var sug = new Suggback();
              var me = new Bmob.User();
              me.id=ress.data;
              sug.set("typeIndex",typeIndex);
              sug.set("content",content);
              sug.set("suggster", me);
              console.log("111");
              if(that.data.isSrc==true){
                  var name=that.data.src;//上传的图片的别名
                  var file=new Bmob.File(name,that.data.src);
                  file.save();
                  sug.set("pic",file);
              }
              sug.save(null, {
                success: function(result) {
                  that.setData({
                    isLoading:false,
                    isdisabled:false
                  }) 
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  common.dataLoading("反馈信息成功","success",function(){
                      wx.navigateBack({
                          delta: 1
                      })
                  });
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
        })
        
      
    }
    
  }
})