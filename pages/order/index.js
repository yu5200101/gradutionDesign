var that;
var Bmob=require("../../utils/bmob.js");
var common = require("../../utils/common.js");
Page({
  data: {
    area: ['省份', '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', 
    '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', 
    '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', 
    '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', 
    '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
     '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'],
    currentTab : 0,
  },
  onLoad:function(options){
    that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.getSystemInfo( {
            success: function( res ) {
                that.setData( {
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    //获取全部订单信息
    var currentUser = Bmob.User.current();
    var Order = Bmob.Object.extend("Order");
    var query = new Bmob.Query(Order);
    query.equalTo("orderUser",currentUser.id);
    query.descending("createdAt"); 
    query.find({
        success: function(result) {
          console.log(result);
            var orderArray = new Array();
            var isPayArray = new Array();
            var noPayArray = new Array();
            var isFinished = new Array();
            for (var i = 0; i < result.length; i++) {
                var object = result[i];
                var status = '';
                if(object.get('isPay') && object.get('isComment')){
                    status = '已完成';
                    var p = {totalprice:object.get('totalprice'),
                    remarks:object.get('remarks'),
                    orderId:object.get('orderId'),
                    status:status,
                    orderDetail:object.get('orderDetail'),
                    userInfo:object.get('userInfo'),
                    createdAt:object.createdAt};
                    isFinished.push(p);
                }else if(object.get('isPay') && !(object.get('isComment'))){
                    status = '待评价';
                    var c = {totalprice:object.get('totalprice'),
                    remarks:object.get('remarks'),
                    orderId:object.get('orderId'),
                    status:status,
                    orderDetail:object.get('orderDetail'),
                    userInfo:object.get('userInfo'),
                    createdAt:object.createdAt};
                    isPayArray.push(c);
                }
                else if( !(object.get('isPay')) && !(object.get('isComment'))){
                    status = '待付款';
                    var n = {totalprice:object.get('totalprice'),
                    remarks:object.get('remarks'),
                    orderId:object.get('orderId'),
                    status:status,
                    orderDetail:object.get('orderDetail'),
                    userInfo:object.get('userInfo'),
                    createdAt:object.createdAt};
                    noPayArray.push(n);
                }
                var t = {totalprice:object.get('totalprice'),
                remarks:object.get('remarks'),
                orderId:object.get('orderId'),
                status:status,
                orderDetail:object.get('orderDetail'),
                userInfo:object.get('userInfo'),
                createdAt:object.createdAt}
                orderArray.push(t);
            }
            console.log(orderArray);
            console.log(orderArray.length);
            if(orderArray.length >= 2){
                //高度取变量值
                that.setData({
                  winHeight: 100+(389*orderArray.length),

                });
            }
            that.setData({
                allOrder:orderArray,
                isPayOrder:isPayArray,
                noPayOrder:noPayArray,
                isFinished :isFinished 
            })
        },
        error: function(error) {
            
        }
    })
    
  },
  swichNav: function( e ) {

        var that = this;

        if( this.data.currentTab === e.target.dataset.current ) {
            return false;
        } else {
            that.setData( {
                currentTab: e.target.dataset.current
            })
        }


    },

    bindChange: function( e ) {

        that = this;
        that.setData( { currentTab: e.detail.current });

    },

    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      that.onShow()
    },
//取消订单
    cancelOrder : function( e ){
       var that = this;
       var orderid = e.target.dataset.id;

       wx.showModal({
            title: '提示',
            content: '你确定取消订单吗？',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                var Order = Bmob.Object.extend("Order");
                var query = new Bmob.Query(Order);
                query.equalTo("orderId", orderid);
                query.find().then(function (result) {
                  return Bmob.Object.destroyAll(result);
                }).then(function (result) {
                  common.showTip('取消订单成功');
                  setTimeout(function () {
                    that.onShow()
                  }, 3000);
                  // 删除成功
                }, function (error) {
                  // 异常处理
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })          
    },
//删除订单
   deleteOrder: function (e) {
      var that = this;
      var orderid = e.target.dataset.id;

      wx.showModal({
          title: '提示',
          content: '你确定删除订单吗？',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              //取消订单
              var Order = Bmob.Object.extend("Order");
              var query = new Bmob.Query(Order);
              orderid = parseInt(orderid);
              query.equalTo("orderId", orderid);
              query.find().then(function (result) {
                return Bmob.Object.destroyAll(result);
              }).then(function (result) {
                common.showTip('删除订单成功');
                setTimeout(function () {
                  that.onShow()
                }, 3000);
                // 删除成功
              }, function (error) {
                // 异常处理
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

        
   
    },
    toComment:function(e){
      var that = this;
      var orderid = e.target.dataset.id;
      var Order = Bmob.Object.extend("Order");
      var query = new Bmob.Query(Order);
      query.equalTo("orderId",orderid);
      query.find({
        success:function(result){
            console.log(result);
            var object = result[0]; 
            var commentList = new Array();
            var n = {
                    orderId:object.get('orderId'),
                    orderDetail:object.get('orderDetail')};
                    commentList.push(n);         
            console.log(commentList);
              that.setData({
              commentList:commentList
              })
              var commentResult = that.data.commentList;
              console.log(commentResult);
              wx.setStorage({
              key: "commentResult",
              data: commentResult
                })
              wx.navigateTo({
                url:"../toComment/index"
              })
        },
        error:function(error){
          console.log("查询失败: " + error.code + " " + error.message);
        }
      })       
      
    },
    payOrder : function( e ){
      var orderid = e.target.dataset.id;
      var that = this;

      wx.showModal({
          title: '提示',
          content: '是否确认付款',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              //付款成功,修改订单的状态
                var Order = Bmob.Object.extend("Order");
                var query = new Bmob.Query(Order);
                orderid = parseInt(orderid);
                query.equalTo("orderId", orderid);
                console.log(orderid);
                query.find({
                  success: function (result) {
                    result = result[0];
                    result.set('isPay', true);
                    result.save();
                    common.showTip('支付成功');
                    setTimeout(function () {
                      that.onShow()
                    }, 3000);
                  },
                  error: function (error) {

                  }
                });
            } else if (res.cancel) {
              console.log('用户点击取消')
              common.showTip('支付失败');
            }
          }
        })
    }

});
