import Vue from 'vue';
import Vuex from "vuex";
import router from "../router"
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
import guider from "../utils/guider.js"



Vue.use(Vuex);

import mTip from './modules/tip';

export default new Vuex.Store({
    state: {
        transitionName: 'slide-left',
        isBack: false,
        popupIsShow: false,
        shareIsShow: false,
        webview: null,
        shopingCart: {},
        shopCartNum: 0
    },
    modules: {
        mTip
    },
    mutations: {
        setHeight(state,elemId) {
            var elem = document.getElementById(elemId);
            var fh = elem.parentNode;
            elem.style.height = fh.clientHeight + "px";
        },
        openUrl(state,url,pageType) {
            var that = this;
            try{
                // 分享
                var share = function(type,shareSendObj) {
                    var shares = {};
                    plus.share.getServices( function(s){
                        s.forEach(function(value, index){
                            shares[value.id] = value;
                        })
                        var targetShare = null;
                        switch(type){
                            case "weixin":    //分享到微信
                                shareSendObj.extra = {};
                                shareSendObj.extra.scene = "WXSceneSession";
                                targetShare= shares.weixin;
                            break;        
                            case "pengyouquan":    //分享到朋友圈
                                shareSendObj.extra = {};
                                shareSendObj.extra.scene = "WXSceneTimeline";
                                targetShare= shares.weixin;
                            break;
                            case "sinaweibo":    //分享到新浪微博
                                delete shareSendObj.extra;
                                targetShare= shares.sinaweibo;
                            break;
                            case "qq":    //分享到QQ
                                delete shareSendObj.extra;
                                targetShare= shares.qq;
                            break;
                            default :
                                targetShare= shares.weixin;
                        }
                        
                        if ( !targetShare) {
                            plus.nativeUI.alert( "未安装相应软件", function(){
                            }, "提示", "关闭" );
                            return;
                        }
                        if ( targetShare.authenticated ) {
                            targetShare.send( shareSendObj, function(){
                                plus.nativeUI.alert( "分享成功！", function(){
                                }, "提示", "关闭" );
                            }, function(e){
                                plus.nativeUI.alert( "分享失败！", function(){
                                }, "提示", "关闭" );
                            } );
                        } else {
                            targetShare.authorize( function(){
                                targetShare.send( shareSendObj, function(){
                                    plus.nativeUI.alert( "分享成功！", function(){
                                    }, "提示", "关闭" );
                                }, function(e){
                                    plus.nativeUI.alert( "分享失败！", function(){
                                    }, "提示", "关闭" );
                                } );
                            }, function(e){
                                plus.nativeUI.alert( "未进行认证", function(){
                                }, "提示", "关闭" );
                            });
                        }
                    }, function(e){
                        plus.nativeUI.alert( "获取分享服务列表失败", function(){
                        }, "提示", "关闭" );
                    } );
                }
                var buttonFn = function() {
                    // 弹出系统选择按钮框
                    plus.nativeUI.actionSheet( {title:"分享",cancel:"取消",buttons:[{title:"微信"},{title:"朋友圈"},{title:"QQ好友"},{title:"微博"}]}, function(e){
                        console.log( "User pressed: "+e.index );
                        var shareSendObj = {
                            title : "融博优选",
                            content : state.webview.getTitle(),
                            href : state.webview.getURL(),
                            pictures : "",
                        };
                        switch(e.index) {
                            case 1:
                                share("weixin",shareSendObj);
                                break;
                            case 2:
                                share("pengyouquan",shareSendObj);
                                break;
                            case 3:
                                share("qq",shareSendObj);
                                break;
                            case 4:
                                share("sinaweibo",shareSendObj);
                                break;
                            default:
                        }
                    } );
                }
                var collection = function() {
                    var json = {};
                    var arr = url.substr(url.indexOf('?') + 1).split('&');
                    arr.forEach(function(item) {
                        var tmp = item.split('=');
                        json[tmp[0]] = tmp[1];
                    })
                    this.$http.post(this.apiUrl,{
                        code: "collection",
                        type: 0,
                        id: json.ztid
                    }).then((data) => {
                        if(data.ztm == 1) {
                            
                        }else {
                            
                        }
                        
                    })
                }
                var configuration = null;  //配置信息
                var obj1 = {    //专题（可分享，可转发）
                    'titleNView':{
                        'backgroundColor':'#fafafa',
                        'titleColor':'#000',
                        autoBackButton:true,
                        buttons:[
                            {
                                text: '\ue60d',
                                fontSrc: '_www/font/myiconfont.ttf',
                                float:'right',
                                onclick:buttonFn
                            }
                            // ,
                            // {
                            //     text:'\ue6dc',
                            //     fontSrc: '_www/font/myiconfont.ttf',
                            //     float:'right',
                            //     onclick:collection
                            // }
                        ],
                        progress:{color:'#00ff2a'}
                    }
                };
                var obj2 = {    //其他
                    'titleNView':{
                        'backgroundColor':'#fafafa',
                        'titleColor':'#000',
                        autoBackButton:true,
                        progress:{color:'#00ff2a'}
                    }
                };
                if(/special/.test(url)) {   //专题和活动页可以被分享
                    configuration = obj1;
                }else {
                    configuration = obj2;
                }
                state.webview = plus.webview.create(url, 'mainwebview', configuration);
                state.webview.addEventListener('titleUpdate', function(){
                    state.webview.show("slide-out-left","200");
                });
                state.webview.addEventListener('close', function(){
                    state.webview=null;
                }, false);
                state.webview.overrideUrlLoading({
                    mode: "reject",
                    effect: "touchstart",
                }, function(event){
                    var url = event.url;
                    guider(state.webview,url);
                });
            }catch(e) {
                window.location.href = url;
            }
        },
        showUrl(state,rul) {  //返回时显示未关闭的webview
            if(state.webview) {
                if(!state.webview.isVisible()) {
                    state.webview.show("slide-out-right","200");
                }
            }
        },
        undone() {
            Toast({mes: "拼命开发中..."})
        },
        setShopingCart(state,obj) {
            if(obj.address) {
                state.shopingCart.address = obj.address;
            }else if(obj.couponid){
                state.shopingCart.couponid = obj.couponid;
            }else if(obj.invoice) {
                state.shopingCart.invoice = obj.invoice;
            }else{
                state.shopingCart = obj.data;
            }
        },
    }

})
