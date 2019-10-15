<template>
    <div class="payment-page">
        <ComHeaderbar text="选择支付方式"></ComHeaderbar>
        <div class="main">
             <yd-radio-group class="paymethod" v-model="payType" color="#c33">
                <div class="alipay">
                    <yd-radio val="alipay"></yd-radio>
                    <div class="content" @click="getChannels('alipay')">
                        <img src="../../assets/images/icon/zfb_logo.png" alt="">
                        <div>
                            <h3>支付宝支付</h3>
                            <p>抽奖赢礼券，最高188元</p>
                        </div>
                    </div>
                </div>
                <div class="wxpay">
                    <yd-radio val="wxpay"> </yd-radio>
                    <div class="content" @click="getChannels('wxpay')">
                        <img src="../../assets/images/icon/wxzf.png" alt="">
                        <div>
                            <h3>微信支付</h3>
                            <p></p>
                        </div>
                    </div>
                </div>
            </yd-radio-group>
            <yd-popup v-model="tipIsShow" position="center" width="auto">
                <div class="tipbox">
                    <h3>确认离开并放弃支付？<br />订单会保留一段时间请尽快支付</h3>
                    <div class="btn-wrap">
                        <a href="javascript:;" @click="leave">确认离开</a>
                        <a href="javascript:;" @click="tipIsShow = false">继续支付</a>
                    </div>
                </div>
            </yd-popup>
        </div>
        <footer>
            <a href="javascript:;" @click="onlinePay">确定</a>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            payType: "",
            iap: null,  //支付通道
            tipIsShow: false,
            isLeave: false
        }
    },
    mounted() {
        var that = this;

        const frompath = sessionStorage.getItem("frompath")
        this.$store.commit("openWait");
        this.$http.post(this.apiUrl, {
            code: "orderStatus",
            ordersn: this.$route.query.oid
        }).then((res) => {
            console.log(res);
            if(res.ztm == 1) {
                if(res.status == 0) {
                    // 为支付订单 可正常支付
                    this.getChannels("alipay");
                }else {
                    this.isLeave = true;
                    if(frompath == "/orderdetails") {
                        this.$router.go(-1)
                    }else {
                        // 判断订单来源 跳转对应详情页
                        if(that.$route.query.iszc) {
                            that.$router.replace("zcorderdetails?oid=" + that.$route.query.oid);
                        }else if(that.$route.query.istg){
                            that.$router.replace("grouponorderdetails?oid=" + that.$route.query.oid);
                        }else {
                            that.$router.replace("orderdetails?oid=" + that.$route.query.oid);
                        }
                    }
                    
                }
            }else {
                
            }
        })
    },
    methods: {
        getChannels(type) {
			var that = this;
            this.payType = type;
            this.iap = null;
			if(type == "alipay" || type == "wxpay") {
                try {
                    plus.payment.getChannels(function(channels){
                        for(var i in channels){
                            var channel=channels[i];
                            if(channel.id === type){
                                that.iap = channel;
                            }
                        }
                    },function(e){
                        that.$dialog.alert({mes: "获取支付通道失败"})
                    });
                } catch (error) {}
				
			}
			
		},
		onlinePay() {
            //APP 1   H5 2  小程序 3
            var that = this;
			var reg = /^[0-9]*[1-9][0-9]*$/;
			var payUrl = "";
			if(this.payType == "alipay"){
                payUrl = this.serversUrl + "/public/index.php/home/Alipay/pay?orderfrom=1&ordersn=";
			}else {
                payUrl = this.serversUrl + '/public/index.php/home/Wechat/index?orderfrom=1&ordersn=';
            }
            this.$store.commit("openWait");
			var xhr=new XMLHttpRequest();
		    xhr.onreadystatechange=function(){
		        switch(xhr.readyState){
                    case 4:
                    that.$store.commit("closeWait");
		            if(xhr.status==200){
		                plus.payment.request(that.iap,xhr.responseText,function(result){
                            that.$dialog.alert({
                                mes: "支付完成",
                                icon: "success",
                                callback: () => {
                                    that.isLeave = true;
                                    // 判断订单来源 跳转对应详情页
                                    if(that.$route.query.iszc) {
                                        that.$router.replace("zcorderdetails?oid=" + that.$route.query.oid);
                                    }else if(that.$route.query.istg){
                                        that.$router.replace("grouponorderdetails?oid=" + that.$route.query.oid);
                                    }else {
                                        that.$router.replace("orderdetails?oid=" + that.$route.query.oid);
                                    }
                                    
                                }
                            })
                            that.$store.commit("setShopingCart",{data:{}})
		                },function(error){
                            that.$dialog.alert({mes: "支付失败" + error})
		                    that.$dialog.alert({mes: "支付失败"})
		                });
		            }else{
		                that.$dialog.alert({mes: "获取订单信息失败"})
		            }
		            break;
		            default:
		            break;
		        }
		    }
			xhr.open('GET',payUrl + that.$route.query.oid);
		    xhr.send();
        },
        leave() {
            this.tipIsShow = false;
            this.isLeave = true;
            this.$router.replace("dindan");
        }
    },
    beforeRouteLeave (to, from, next) {
        if(this.$route.query.back) {
            next(true);
        }else {
            if(!this.isLeave) {
                this.tipIsShow = true;
                next(false)
            }else {
                next(true)
            }
        }
        
    }
}
</script>

<style lang="less">
.payment-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        .paymethod {
            margin-top: .2rem;
            padding-left: .3rem;
            background-color: #fff;
            &>div {
                display: flex;
                border-bottom: 1px solid #dbdbdb;
                padding: .1rem 0;

                .yd-radio {
                    align-self: center;
                    .yd-radio-text {
                        display: none;
                    }
                }
                .content {
                    flex: 1;
                    display: flex;
                    img {
                        width: .9rem;
                        height: .9rem;
                    }
                    div {
                        flex: 1;
                        padding: 0 .2rem;
                        align-self: center;
                        h3 {
                            font-size: .28rem;
                            margin-bottom: .1rem;
                        }

                        p {
                            color: #8a8a8a;
                            font-size: .26rem;
                        }
                    }
                }
            }
        }
        .tipbox {
            h3 {
                line-height: .6rem;
                padding: .4rem .8rem;
                font-size: .3rem;
                font-weight: normal;
                text-align: center;
                white-space: nowrap;
            }
            .btn-wrap {
                display: flex;
                border-top: 1px solid #d9d9d9;
                a {
                    flex: 1;
                    text-align: center;
                    padding: .3rem 0;
                    font-size: .3rem;
                    &:nth-child(2) {
                        color: #c33;
                        border-left: 1px solid #d9d9d9;
                    }
                }
            }
        }
    }
    footer {
        padding: .3rem;
        a {
            display: block;
            line-height: .98rem;
            text-align: center;
            background-color: #c33;
            color: #fff;
            font-size: .3rem;
            border-radius: .1rem;
        }
    }
}
</style>

