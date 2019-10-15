// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store.js'
import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.rem.css'
import axios from './api/index.js'
import qs from 'qs'
import FastClick from 'fastclick' 
import Swiper from "swiper"

require("swiper/dist/css/swiper.min.css");
// require("swiper/dist/js/swiper.min.js");
require('vue2-animate/dist/vue2-animate.min.css');

if ('addEventListener' in document) {  // 解决移动端300毫秒延迟
	document.addEventListener('DOMContentLoaded', function () {
		FastClick.attach(document.body)
	}, false)
}


// puls
function plusReady() {
	plus.navigator.setStatusBarBackground('#fafafa');
	plus.navigator.setStatusBarStyle('dark');
  
	// 隐藏滚动条
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
	  // Android处理返回键
	  plus.key.addEventListener('backbutton', function() {
		  var ws=plus.webview.getWebviewById( "mainwebview" );
		  if(ws && ws.isVisible()) {
			  ws.canBack( function(e){
				  if(e.canBack) {
					  ws.back();
				  }else {
					  ws.close("slide-out-right","200");
				  }
			  });
			  return;
		  }
		  var h = location.hash;
		  var s = true; //标识
		  var arr = ["#/home","#/special","#/class","#/shopingcart","#/my","#/ad"];
		  arr.forEach(function(value, index) {
			  if(h == value) {
				  ('iOS' == plus.os.name) ? plus.nativeUI.confirm('确认退出？', function(e) {
					  if(e.index > 0) {
						  plus.runtime.quit();
					  }
				  }, '提示', ['取消', '确定']): (confirm('确认退出？') && plus.runtime.quit());
				  s = false;
			  }
		  })
		  if(s) {
			  if(store.state.popupIsShow) {
				  store.state.popupIsShow = false;  //返回键先关闭页面弹出框
			  }else {
				  store.state.isBack = true;
				  store.commit('closeWait');  //返回的同时关闭loading
				  router.goBack(-1);
			  }
			  
		  }
	  }, false);

	//判断版本并更新
	var w1 = plus.nativeUI.showWaiting("版本检测中...", {
		back: "transmit"
	});
	Vue.prototype.$http.post("https://scapp.szrbht.com/public/index.php/home/index/index",{
		code: "getconfigure"
	}).then((data) => {
		w1.close();
		var v = plus.runtime.version;
		var dqbb = v.replace(/\./g, "") * 1,
			hqbbAndroid = data.data.android_version_number.replace(/\./g, "") * 1,
			hqbbIos = data.data.ios_version_number.replace(/\./g, "") * 1;
			
		if(plus.os.name == 'iOS' && dqbb < hqbbIos){
			plus.nativeUI.confirm("检测到新版本,是否马上更新?", function(e) {
				if(e.index == 0) {
					plus.runtime.openURL(data.data.ios_download_address);
					plus.runtime.quit();
					plus.nativeUI.showWaiting("请更新版本", {
						modal: true
					})
				} else {
					plus.runtime.quit();
					plus.nativeUI.showWaiting("请更新版本", {
						modal: true
					})
				}
			}, "提示", ["马上更新", "退出程序"]);
		}
		
		//不是ios客户端且不是最新版本
		if(plus.os.name != 'iOS' && dqbb < hqbbAndroid) {
			plus.nativeUI.confirm("检测到新版本,是否马上更新?", function(e) {
				if(e.index == 0) {
					//安卓系统直接下载更新
					var w = plus.nativeUI.showWaiting("正在下载...", {
						back: "transmit"
					});
					var dtask = plus.downloader.createDownload(data.data.android_download_address);
					var timer = null,
						n = 0,
						s = 0;
					// 监听下载任务状态 
					dtask.addEventListener("statechanged", function onStateChanged(download, status) {
						n = parseInt(download.downloadedSize / 1024) + "k/";
						if(s == 0) {								
							s = parseInt(download.totalSize / 1024);
						}
						if(download.state == 4 && status == 200) {
							// 下载完成 
							w.close();
							clearInterval(timer);
							// 安装应用
							plus.runtime.install(download.filename);
							plus.runtime.quit();
						}
					}, false);
					dtask.start();
					timer = setInterval(function(){	
						var str = n + s + "k";
						w.setTitle(str);
					},500)
				} else {
					plus.runtime.quit();
					plus.nativeUI.showWaiting("请更新版本", {
						modal: true
					})
				}
			}, "提示", ["马上更新", "退出程序"]);
			
		}
	})
  }
  if(window.plus) {
	  plusReady();
  } else {
	  document.addEventListener('plusready', plusReady, false);
  }


var original = document.documentElement.clientHeight;
window.addEventListener("resize", function() {
	var resizeHeight = document.documentElement.clientHeight;
	var dom = document.getElementsByTagName("footer")[0];
	if(dom) {
		if(resizeHeight != original) {
			dom.style.visibility = "hidden";
			dom.style.height = "0px";
		} else {
			dom.style.visibility = "inherit";
			dom.style.height = "auto";
		}
	}
});

// 公共组件
import ComHeaderbar from './components/common/comheaderbar.vue';   //topbar
import ShareBox from './components/common/share_component.vue';  //分享组件
import ImgTag from './components/common/imgtag.vue';  //img标签
import PullDown from './components/common/pull_down';  //下拉刷新

Vue.component("ComHeaderbar",ComHeaderbar);
Vue.component("ShareBox",ShareBox);
Vue.component("ImgTag",ImgTag);
Vue.component("PullDown",PullDown);

Vue.use(YDUI);
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.prototype.setHeight = function(elemId) {
	var elem = document.getElementById(elemId);
	var fh = elem.parentNode;
	elem.style.height = fh.clientHeight + "px";
}

// Vue.prototype.apiUrl = "http://192.168.1.159/yshopapp/public/index.php/home/index/index";   //接口地址
// Vue.prototype.imgUrl = "http://192.168.1.159/yshop/public";  //图片地址
// Vue.prototype.appImgUrl = "http://192.168.1.159/yshopapp/public";  //图片地址
// Vue.prototype.helpUrl = "http://192.168.1.159/yshop/public/storeother/help.html?id="
// Vue.prototype.uploadUrl = "http://192.168.1.159/yshopapp/public/index.php/home/index/uploadoneimage"
// Vue.prototype.shareApiUrl = "http://192.168.1.159/yshopapp/public/index.php/home/share/index"
// Vue.prototype.webh5 = "http://sc.szrbht.com/public/storeother"    //h5页面服务器地址

Vue.prototype.apiUrl = "https://scapp.szrbht.com/public/index.php/home/index/index";   //接口地址
Vue.prototype.imgUrl = "http://sc.szrbht.com/public";  //图片地址
Vue.prototype.appImgUrl = "https://scapp.szrbht.com/public";  //图片地址
Vue.prototype.helpUrl = "http://sc.szrbht.com/public/storeother/help.html?id="
Vue.prototype.webh5 = "https://scapp.szrbht.com/storeother"    //h5页面服务器地址
Vue.prototype.uploadUrl = "https://scapp.szrbht.com/public/index.php/home/index/uploadoneimage"  //图片上传地址
Vue.prototype.shareApiUrl = "https://scapp.szrbht.com/public/index.php/home/share/index"  //活动分享地址
Vue.prototype.serversUrl = "https://scapp.szrbht.com"   //服务器地址



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
