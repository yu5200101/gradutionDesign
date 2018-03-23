
//获取应用实例
var app = getApp()
var Bmob=require("../../utils/bmob.js");
var common = require('../template/getCode.js')
var that;
Page({
  onLoad: function(options) {
      that=this;
      that.setData({//初始化数据
        src:"",
        isSrc:false,
        loading:true,
        autoFocus:true,
        isLoading:false,
        isdisabled:false,
        typetra:['交易类型','想买','想卖'],
        typetraIndex:0
      })
  },
  onReady:function(){
     wx.hideToast() 
  },
  onShow:function(){
    wx.getStorage({
      key: 'position',
        success: function(res) {
          console.log(res.data);
          that.setData({
            college:res.data
          })
        }
    })
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
  
  onTypetraChange: function (e) {
    this.setData({
      typetraIndex: e.detail.value
    });
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
  sendNewBook: function(e) {//保存书籍
    //判断书籍是否为空
    var college = that.data.college;
    console.log(college);
    var content=e.detail.value.content;
    console.log(content);
    var title=e.detail.value.title;
    var dorm = e.detail.value.dorm;
    var price = e.detail.value.price;
    var typetraIndex = e.detail.value.typetraIndex;
    console.log(typetraIndex);
    if(content==""){
      common.dataLoading("书籍内容不能为空","loading");
    }
    else{
        that.setData({
          isLoading:true,
          isdisabled:true
        }) 
        wx.getStorage({
          key: 'user_id',
          success: function(ress) {
              var Public = Bmob.Object.extend("Public");
              var pub = new Public();
              var me = new Bmob.User();
              me.id=ress.data;
              pub.set("title",title);
              pub.set("content",content);
              pub.set("dorm",dorm);
              pub.set("price",price);
              pub.set("typetraIndex",typetraIndex);
              pub.set("publisher", me);
              pub.set("likeNum",0);
              pub.set("college",college);
              pub.set("isDonate",false);
              pub.set("isdonCon","未交易");
              pub.set("commentNum",0);
              pub.set("liker",[]);
              console.log("111");
              if(that.data.isSrc==true){
                  var name=that.data.src;//上传的图片的别名
                  var file=new Bmob.File(name,that.data.src);
                  file.save();
                  pub.set("pic",file);
              }
              pub.save(null, {
                success: function(result) {
                  that.setData({
                    isLoading:false,
                    isdisabled:false
                  }) 
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  common.dataLoading("发布书籍成功","success",function(){
                      wx.navigateBack({
                          delta: 1
                      })
                  });
                },
                error: function(result, error) {
                  // 添加失败
                  console.log(error)
                  common.dataLoading("发布书籍失败","loading");
                  that.setData({
                    isLoading:false,
                    isdisabled:false
                  }) 

                }
            });


          }
        })
        
      
    }
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  }
})
