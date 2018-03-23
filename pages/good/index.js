var Zan = require('../../dist/index');
var common = require('../../utils/common.js');
var app = getApp()
var that;
var Bmob=require("../../utils/bmob.js");
Page(Object.assign({}, Zan.Quantity, {
  data: {
    indicatorDots: true,//是否出现焦点  
    autoplay: true,//是否自动播放轮播图  
    interval: 4000,//时间间隔
    duration: 1000,//延时时间
    hiddenModal: true,
    iscollect: 0,
    coltxt: "收藏",
    quantity1: {
      quantity: 1,
      min: 1,
      max: 20
    },
    actionType : 'payOrder',
  },
  onLoad: function (options) {
    that = this;
    that.setData({    
      good_id: options.id    
    })   

    //查询商品详情
    var good_id = this.data.good_id;
    var Good = Bmob.Object.extend("good");
    var query = new Bmob.Query(Good);
    query.equalTo("is_delete", 0);
    query.get(good_id, {
      success: function(result) {
        // 查询成功，调用get方法获取对应属性的值
        var id = good_id;
        var price = result.get("price");
        var menu_name = result.get("menu_name");
        var parameter = result.get("parameter");  
        var sale_number = result.get("sale_number"); 
        var menu_logo = result.get("menu_logo");
        var pic1= result.get("pic1");
        var pic2 = result.get("pic2");
        var num = 0;
        var good_number = result.get("good_number");
        that.setData({    
                id: id,
                price: price,
                menu_name: menu_name,
                parameter:parameter,
                sale_number: sale_number,
                menu_logo: menu_logo,
                pic1:pic1,
                pic2:pic2,
                good_number: good_number
        })
        var pic_attr = new Array();
        pic_attr.push(that.data.pic1);
        pic_attr.push(that.data.pic2);
        that.setData({
              imgUrls:pic_attr
        })
      },     
      error: function(object, error) {
        console.log(error);
        // 查询失败
      }
    });
    //查询商品是否被当前用户收藏
    wx.getStorage({
          key: 'user_id',
          success: function(ress) {
              var Collect = Bmob.Object.extend("Collect");
              var collect = new Bmob.Query(Collect);
              var me = new Bmob.User();
              me.id=ress.data;
              collect.equalTo("uid", me.id);
              collect.equalTo("good_id",good_id); 
              console.log(me.id);       
              console.log(good_id);
              collect.find({
                success:function(result){
                  console.log(result);
                  if(result != "" && result != null){
                    console.log(1);
                  var result = result[0];
                  var is_col = result.get('is_col');
                  var coltxt = result.get('coltxt');
                     that.setData({    
                          iscollect: is_col,
                          coltxt:coltxt
                      })
                   }
                   else{
                    console.log(0);
                     that.setData({    
                          iscollect: 0,
                          coltxt: "收藏"
                      })
                   }
                },
                error:function(error){
                  console.log(error);
                       // 查询失败
                }
              })
          }
      });  

    //查询评价详情
    var good_comment = Bmob.Object.extend("good_comment");
    var query = new Bmob.Query(good_comment);
    query.equalTo("good_id",good_id);
    query.include("publisher");
    query.find({
      success:function(result){
        var commentDetail = new Array();
        for(var i = 0; i<result.length;i++){
          var object = result[i];
          var t = {
            goodPic:object.get('goodPic')._url,
            content:object.get('content'),
            createdAt:object.createdAt,
            userNick:object.get('publisher').get('nickName'),
            userPic: object.get('publisher').get('userPic')
          }
          commentDetail.push(t);
        }
        that.setData({
            commentDetail:commentDetail
          })
      },
      error:function(error){
        console.log(error);
      }
    })
    
  },
  collect: function (event) {//收藏商品
    var good_id = this.data.good_id;
    var iscollect = that.data.iscollect;
    var coltxt = that.data.coltxt;
    if (iscollect == 0) {
      that.setData({
        iscollect: 1,
        coltxt:"已收藏"
      })
    }
    else if (iscollect == 1) {
      that.setData({
        iscollect: 0,
        coltxt: "收藏"
      })
    }
    wx.getStorage({
          key: 'user_id',
          success: function(ress) {
              var Collect = Bmob.Object.extend("Collect");
              var query = new Bmob.Query(Collect);
              var good = Bmob.Object.extend("good");
              var goodQuery = new good();
              goodQuery.id = good_id;
              var me = new Bmob.User();
              me.id=ress.data;        
              console.log(good_id);
            // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
              // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
              query.equalTo("uid", me.id);
              query.equalTo("good_id",good_id); 
              query.find({
                success:function(result){
                    if(result != "" && result != null){
                      var result = result[0];
                      console.log(1);
                      result.set('is_col', that.data.iscollect);
                      result.set('coltxt', that.data.coltxt);
                      result.save();
                    }
                    else{
                      var collect = new Collect();
                      console.log(0);
                      console.log(good_id);
                       collect.set('is_col',that.data.iscollect);
                       collect.set('coltxt', that.data.coltxt);
                       collect.set('uid',me);
                       collect.set('good_id',goodQuery);
                       collect.save();
                    }
                },
                error:function(error){
                       // 查询失败
                       
                }
              })
             
          }
          });     
},
  onShow: function() {
  },

  placeOrder:function(event){
        var name = event.target.dataset.name;
        if(name=="order"){
            this.setData({
                    actionType : 'payOrder'
                })
        }else if(name=="cart"){
            this.setData({
                    actionType : 'addCart'
                })
        }
        if(this.data.showModalStatus){  
          this.hideModal();  
        }else{  
          this.showModal();  
        }  
    },

  showModal: function () {  
    // 显示遮罩层  
    var animation = wx.createAnimation({  
      duration: 200,  
      timingFunction: "linear",  
      delay: 0  
    })  
    this.animation = animation  
    animation.translateY(300).step()  
    this.setData({  
      animationData: animation.export(),  
      showModalStatus: true  
    })  
    setTimeout(function () {  
      animation.translateY(0).step()  
      this.setData({  
        animationData: animation.export()  
      })  
    }.bind(this), 200)  
  },  

  hideModal: function () {  
    // 隐藏遮罩层  
    var animation = wx.createAnimation({  
      duration: 200,  
      timingFunction: "linear",  
      delay: 0  
    })  
    this.animation = animation  
    animation.translateY(300).step()  
    this.setData({  
      animationData: animation.export(),  
    })  
    setTimeout(function () {  
      animation.translateY(0).step()  
      this.setData({  
        animationData: animation.export(),  
        showModalStatus: false  
      })  
    }.bind(this), 200)  
  },  

  onReachBottom: function () {
    // Do something when page reach bottom.
    console.log('circle 下一页');
  },

  handleZanQuantityChange(e) {
    var componentId = e.componentId;//唯一的componentId
    var quantity = e.quantity;
    //把共同的方法抽象出来放在一个JS里面
    this.setData({
      [`${componentId}.quantity`]: quantity
    });
  },

  click_cancel:function(){  
     this.hideModal();  
  },  

   payOrder:function(){
     //获取传递过来的id,数量，商品名称，价格
     var good_id = that.data.good_id;
     console.log(good_id);
     var number = this.data.quantity1.quantity;
     var price = this.data.price;
     var name = this.data.menu_name;
     var pic = this.data.menu_logo._url;
     var good_number = this.data.good_number;
      if(parseInt(number) > parseInt(good_number)){
          common.showModal("货存不足！");
          return false;
      }
     var detailArray = new Array();
     detailArray = {number:number,price:price,name:name,pic:pic,good_id:good_id};
     var orderResult = new Array();
     orderResult.push(detailArray);
     console.log(orderResult);
      wx.setStorage({
          key:"orderResult",
          data: orderResult
      })
     wx.redirectTo({
            url: '../payorder/index'
        })
  },  

  addCart : function(){
      //购物车数据放进本地缓存
      var good_id = that.data.good_id;
      console.log(good_id);
      var number = this.data.quantity1.quantity;
      var price = this.data.price;
      var name = this.data.menu_name;
      var pic = this.data.menu_logo._url;
      var good_number = this.data.good_number;
      var cartResult = new Array();
      if(parseInt(number) > parseInt(good_number)){
          common.showModal("货存不足！");
          return false;
      }
      var detailArray = { number: number, price: price, name: name, pic: pic,
       good_number: good_number,good_id:good_id,active: true };
      var oldcartResult = new Array;
      oldcartResult = wx.getStorageSync('cartResult');
      if(!oldcartResult){
        cartResult.push(detailArray);
        wx.setStorage({
          key: "cartResult",
          data: cartResult
        })
      }else{
        oldcartResult.push(detailArray);
        wx.setStorage({
          key: "cartResult",
          data: oldcartResult
        })
      }
     
      wx.reLaunch({
            url: '../cart/index'
        })
  },

  index : function(){
    wx.switchTab({
            url: '../dashboard/index'
        })
  },

  cart : function(){
    wx.switchTab({
            url: '../cart/index'
        })
  },
  
  selectAttributes : function(){
    if(this.data.showModal){  
          this.hideModal_other();  
        }else{  
          this.showModal_other();  
        }  
  },
    showModal_other: function () {  
    // 显示遮罩层  
    var animation = wx.createAnimation({  
      duration: 200,  
      timingFunction: "linear",  
      delay: 0  
    })  
    this.animation = animation  
    animation.translateY(300).step()  
    this.setData({  
      animationData: animation.export(),  
      showModal: true  
    })  
    setTimeout(function () {  
      animation.translateY(0).step()  
      this.setData({  
        animationData: animation.export()  
      })  
    }.bind(this), 200)  
  },  

  hideModal_other: function () {  
    // 隐藏遮罩层  
    var animation = wx.createAnimation({  
      duration: 200,  
      timingFunction: "linear",  
      delay: 0  
    })  
    this.animation = animation  
    animation.translateY(300).step()  
    this.setData({  
      animationData: animation.export(),  
    })  
    setTimeout(function () {  
      animation.translateY(0).step()  
      this.setData({  
        animationData: animation.export(),  
        showModal: false  
      })  
    }.bind(this), 200)  
  }, 
  click_cancel_other:function(){  
     this.hideModal_other();  
  }, 
}))
