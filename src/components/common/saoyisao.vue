<template>
	<div class="saoyisao-page">
		<div class="main-headerbar">
			<h2>扫一扫</h2>
			<a class="back-arrows" href="javascript:;" @click="backPage">
				<img src="../../assets/images/icon/arrow_back_black.png">
			</a>
		</div>
		<div class="main">
			<div class="saoyisao-bcid" id="saoyisao-bcid">
				<!-- <p class="tiptext">扫描店铺或线下订单二维码</p> -->
			</div>
			<span class="flashlight" :class="{'open' : isOpen}" @click="flashlight"></span>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			scan : null,
			isOpen : false, //开关手电
			reg: /goodsdetails\?spbh=/,
		}
	},
	mounted() {
		var that = this;
		try{
			that.scan = new plus.barcode.Barcode('saoyisao-bcid');
			that.scan.onmarked = function( type, result ) {
				if(that.reg.test(result)) {
					var data = that.parseQueryString(result);
					that.findGoodsNumber(data.spbh);
				}else {
					that.findGoodsNumber(result);
				}
				that.scan.cancel(); //清除扫描
				that.scan.close();  //关闭扫描框
			};
			that.scan.start();
		}catch(err) {
			that.$dialog.alert({
				mes: "此环境不支持",
				callback: () => {
					this.backPage();
				}
			})
		}
		
	},
	methods : {
		flashlight() {  //照明
			this.isOpen = !this.isOpen;
			this.scan.setFlash(this.isOpen);
		},
		backPage() {
			this.$router.goBack(-1);
			try {
				this.scan.cancel(); //清除扫描
				this.scan.close();  //关闭扫描框
			} catch (error) {}
		},
		parseQueryString(url) {  //取参
			var json = {};
			var arr = url.substr(url.indexOf('?') + 1).split('&');
			arr.forEach(function(item) {
				var tmp = item.split('=');
				json[tmp[0]] = tmp[1];
			})
			return json;
		},
		findGoodsNumber(spbh) {
			this.$store.commit('openWait');
			this.$http.post(this.apiUrl,{
				code: "findGoodsNumber",
				spbh: spbh
			}).then((data) => {
				console.log(data);
				if(data.ztm == 1) {
					this.$router.replace("goodsdetails?spbh=" + spbh);
				}else {
					this.$dialog.toast({mes: data.msg});
					this.backPage();
				}
			})
		}
	},
	beforeDestroy() {
		try {
			this.scan.cancel(); //清除扫描
			this.scan.close();  //关闭扫描框
		} catch (error) {}
	},
	
}
</script>

<style lang="less">
.saoyisao-page {
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #afafaf;
	.main-headerbar {
		position: relative;
		z-index: 121214;
		width: 100%;
		height: 0.9rem;
		background-color: #fafafa;
		h2 {
			line-height: 0.88rem;
			text-align: center;
			font-size: 0.3rem;
			color: #000;
			border-bottom: 1px solid #d5d5d5;
		}
		a {
			position: absolute;
			top: 0;
			color: #000;
			font-weight: bold;
		}
		.back-arrows {
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			width: 1rem;
			img {
				display: block;
				margin: 0.25rem 0.3rem;
				width: 0.4rem;
				height: 0.4rem;
			}
		}
	}
	.main {
		flex: 1;
		.saoyisao-bcid {
			position: relative;
			margin-top: 2rem;
			height: 6.4rem;
			background-color: #666;
			.tiptext {
				position: absolute;
				z-index: 99;
				bottom: -0.3rem;
				left: 0;
				width: 100%;
				color: #fff;
				font-size: 0.22rem;
				text-align: center;
				
			}
		}
		.flashlight {
			position: absolute;
			display: block;
			width: 1.3rem;
			height: 0.6rem;
			background:rgba(255,255,255,.5) url(../../assets/images/icon/sdt_icon.png) no-repeat center;
			background-size: auto 80%;
			border-radius: 0.1rem;
			bottom: 1rem;
			left: 50%;
			margin-left: -0.65rem;
			&.open {
				background:rgba(250,250,155,.9) url(../../assets/images/icon/sdt_open_icon.png) no-repeat center;
				background-size: auto 80%;
			}
		}
	}
	
}
</style>