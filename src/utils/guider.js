import router from '../router'


function parseQueryString(url) {  //取参
    var json = {};
    var arr = url.substr(url.indexOf('?') + 1).split('&');
    arr.forEach(function(item) {
        var tmp = item.split('=');
        json[tmp[0]] = tmp[1];
    })
    return json;
}
function share(type,shareSendObj) {
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

export default function(webview,url) {
    var reg1 = /goodsdetails/,
        reg2 = /login/,
        reg3 = /pmtgoodslist/,
        reg4 = /sharebtn/,
        reg5 = /home/,
        reg6 = /imgshare/,   //晒收入图片分享
        reg7 = /regression/;   //回归分享
    if(reg1.test(url)) {
        var id = "";
        try{
            var parameter = url.split("?");
            parameter = parameter[1].split("&");
            parameter = parameter[0].split("=");
            if(parameter[0] == "id") {
                id = parameter[1];
            }
        }catch(err) {
            plus.nativeUI.toast("地址有误" + url);
        }
        if(id && id.trim() != "") {
            webview.hide();
            router.push({path: 'goodsdetails',query: {
                id: id
            }})
        }
        return;
    }
    if(reg2.test(url)) {
        webview.hide();
        router.push({path: 'login',query: {
            back: 1
        }})
        return;
    }
    if(reg3.test(url)) {
        var data = parseQueryString(url);
        if(id && id.trim() != "") {
            webview.hide();
            router.push({path: 'pmtgoodslist',query: {
                id: data.id,
                title: data.title
            }})
        }
        return;
    }
    if(reg4.test(url)) {
        var data = parseQueryString(url);
        var uid = localStorage.getItem("uid");
        var shareSendObj = {
            title : "融博优选",
            content : "注册领红包",
            href : "https://scapp.szrbht.com/storeother/share/re_download.html?uid=" + uid,
            pictures : "",
        };
        switch(data.sharebtn) {
            case "weixin":
                share("weixin",shareSendObj);
                break;
            case "pengyouquan":
                share("pengyouquan",shareSendObj);
                break;
            case "qq":
                share("qq",shareSendObj);
                break;
            case "sinaweibo":
                share("sinaweibo",shareSendObj);
                break;
            default:
        }
        return;
    }
    if(reg5.test(url)) {
        webview.close("slide-out-right","200");
        router.push('home');
        return;
    }
    if(reg6.test(url)) {
        var data = parseQueryString(url);
        var shareSendObj = {
            title : "融博优选",
            content : "我的收入",
            href : "https://scapp.szrbht.com/storeother/share/imgpage.html?id=" + data.id,
            pictures : "",
        };
        share(data.imgshare,shareSendObj);
        return;
    }
    if(reg7.test(url)) {
        var data = parseQueryString(url);
        var shareSendObj = {
            title : "融博优选",
            content : data.text,
            href : "https://scapp.szrbht.com/storeother/share/regression.html?mid=" + data.mid + "&pid=" + data.pid,
            pictures : "",
        };
        share(data.type,shareSendObj);
        return;
    }
    webview.loadURL(url);
}