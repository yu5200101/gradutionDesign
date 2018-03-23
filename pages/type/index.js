var that;
var Bmob=require("../../utils/bmob.js");
var optionId;
Page( {
    data:{
        currentTab: 0,
        currentType:"1",
        showCart:false,
    },
    onShareAppMessage: function () {
    var title = "分类";
    var path = "pages/type/index";
    return {
      title: title,
      path: path
    }
  },
    onLoad: function(options) {
        optionId=options.currentTab;
        that = this;
        that.setData({
           currentTab:optionId
        })
        wx.getSystemInfo( {
            success: function( res ) {
                that.setData( {
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }

        });

        var Good_type = Bmob.Object.extend("good_type");
        var query = new Bmob.Query(Good_type);
        query.find({
            success: function(result) {
                var typeArray=new Array();
                for (var i = 0; i < result.length; i++) {
                    var object = result[i];
                    var t = {id:object.get('type_id'),type_name:object.get('type_name')}
                    typeArray.push(t);
                }
                that.setData({
                    menu:typeArray
                })
            },
            error: function(error) {
                
            }
        })


        var Menu = Bmob.Object.extend("good");
        var query = new Bmob.Query(Menu);
        query.include("relation");
        query.find({
                    success: function(result) {
                        var menuType = that.data.menu;
                        var menuArray=new Array();
                        var Data = new Array();
                        
                        for(var i=0;i<result.length;i++){
                            var a={id:result[i].id,type_name:result[i].get("relation").get("type_name"),
                            menu_type:result[i].get("menu_type"),price:result[i].get("price"),
                            sale:result[i].get("seller_number"),menu_name:result[i].get("menu_name"),
                            createdAt:result[i].createdAt,menu_logo:result[i].get("menu_logo"),
                            sale_number:result[i].get("seller_number"),num:0}
                            menuArray.push(a);
                        } 
                        var len = menuArray.length;
                        for(var l in menuType){
                            var data = new Array();
                            var menuData = {foodType:menuType[l].type_name,id:menuType[l].id,data:data};
                            for(var k in menuArray){
                                if(menuType[l].id == menuArray[k].menu_type){
                                    data.push(menuArray[k]);
                                }
                            }
                            Data.push(menuData);
                        }
                        that.setData({
                            menu:Data
                        })
                    },
                    error: function(error) {
                    }
                })



        wx.getStorage({
            key: 'user_id',
            success: function(ress) {
                var me = new Bmob.User();
                me.id=ress.data;
                var Order = Bmob.Object.extend("Order");
                var queryOrder = new Bmob.Query(Order); 
                queryOrder.equalTo("orderUser",me);   
                queryOrder.find({
                    success: function(result) {
                        var orderArray=new Array();
                        for(var i=0;i<result.length;i++){
                            var a={orderId:result[i].get("orderId"),orderDetail:result[i].get("orderDetail"),
                            amount:result[i].get("amount"),createdAt:result[i].createdAt}
                            orderArray.push(a);
                        }
                        
                        that.setData({
                            orderArray:orderArray
                        })
                    },
                    error: function(error) {
                        
                    }
                })
            }
        })
    },

    chooseType:function(event){
        var foodType=event.target.dataset.foodtype;
        that.setData({
            currentType:foodType
        })
    },

})