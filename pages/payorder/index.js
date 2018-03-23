var common = require('../../utils/common.js');
var Bmob=require("../../utils/bmob.js");
var that;
Page({
  data: {
    area: ['省份', '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', 
    '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', 
    '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', 
    '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', 
    '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
     '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'],
    showAddAddr : true,
    totalMoney : 0,
  },
  onShow() {
    wx.getStorage({
            key: 'orderResult',
            success: function(res) {
              console.log(res.data);
              var len = res.data.length;
              var total = 0;
              for(var i =0 ;i < len;i++){
                console.log(res.data[i].number);
                console.log(res.data[i].price);
                console.log(res.data[i].name);
                console.log(res.data[i].pic);
                console.log(res.data[i].good_id);
                total += res.data[i].number * res.data[i].price;

              }
                that.setData({
                    totalMoney:total,
                    detail:res.data
                    
                })
            } 
        })
  },
  onLoad() {
    that = this;
    //获取用户的信息
    var User = Bmob.Object.extend("_User");
    var currentUser = Bmob.User.current();
    var objectid = currentUser.id;
    var query = new Bmob.Query(User);
    query.get(objectid, {
    success: function(result) {
      // 查询成功，调用get方法获取对应属性的值
      var name = result.get("name");
      if(name){
          that.setData({    
            showAddr : true,
            showAddAddr : false
          })  
      }
      var tel = result.get("tel");
      var areaIndex = result.get("areaIndex");
      var addrdetail = result.get("addrdetail");
      that.setData({    
        name: name,
        tel: tel,
        addrdetail: addrdetail,
        areaIndex:areaIndex
      })  
    },
    error: function(object, error) {
      // 查询失败
    }
    });
  },
  placeOrder : function(event){
    if(this.data.showAddAddr){
        common.showTip("请填写收货地址", "loading");
        return false;
    }
    // 发起支付
    var orderDetail = this.data.detail;
    console.log(orderDetail);
    var userInfo = {name:this.data.name,tel:this.data.tel,addrdetail:this.data.addrdetail,areaIndex:this.data.areaIndex};
    var totalPrice = this.data.totalMoney + 10;
    var remarks = event.detail.value.remark;
    wx.showModal({
        title: '提示',
        content: '是否确认付款',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //付款成功,这里可以写你的业务代码
                            var User = Bmob.Object.extend("_User");
                            var currentUser = Bmob.User.current();
                            var objectid = currentUser.id;
                            var Order = Bmob.Object.extend("Order");
                            var Order = new Order();
                            var orderId = Math.round(9999*Math.random());
                            var me = new Bmob.User();
                            me.id=objectid;
                            Order.set("remarks",remarks);
                            Order.set("orderUser",me);
                            Order.set("totalprice", parseFloat(totalPrice));
                            Order.set("isPay",true);
                            Order.set("isComment",false);
                            Order.set("orderDetail",orderDetail);
                            Order.set("orderId",orderId);
                            Order.set("userInfo",userInfo);
                            Order.save(null, {
                                success: function(result) {
                                    wx.redirectTo({
                                        url: '../order/index'
                                    })
                                },
                                error: function(result, error) {

                                }
                            });

          } else if (res.cancel) {
            console.log('用户点击取消')
                            var User = Bmob.Object.extend("_User");
                            var currentUser = Bmob.User.current();
                            var objectid = currentUser.id;
                            var Order = Bmob.Object.extend("Order");
                            var Order = new Order();
                            var orderId = Math.round(9999*Math.random());
                            var me = new Bmob.User();
                            me.id=objectid;
                            Order.set("remarks",remarks);
                            Order.set("orderUser",me);
                            Order.set("totalprice",parseInt(totalPrice));
                            Order.set("isPay",false);
                            Order.set("failReson",false);
                            Order.set("isComment",false);
                            Order.set("orderDetail",orderDetail);
                            Order.set("userInfo",userInfo);
                            Order.set("orderId",orderId);
                            Order.save(null, {
                                success: function(result) {
                                    console.log(result.id)
                                },
                                error: function(result, error) {

                                }
                            });
                            wx.redirectTo({
                                        url: '../order/index'
                                    })
          }
        }
      })          
}  
});
