<template>
    <div class="writeorder-page">
        <ComHeaderbar text="填写订单"></ComHeaderbar>
        <div class="main">
            <div class="address" @click="$router.push('address?back=1')">
                <div class="ctn-left">
                    <span>{{goodsData.address.realname}}</span>
                    <a href="javascript:;" v-if="goodsData.address.sign == 1">默认</a>
                </div>
                <div class="ctn-center">
                    <p class="phone">{{goodsData.address.mobile}}</p>
                    <p class="useraddress">{{goodsData.address.region}}{{goodsData.address.address}}</p>
                </div>
                <div class="ctn-right">
                    <img src="../../assets/images/icon/arrow_go_black.png" />
                </div>
            </div>
            <yd-cell-group>
                <yd-cell-item arrow @click.native="$store.state.popupIsShow = true" v-if="goodsData.userCoupontitle">
                    <span slot="left">优惠券： {{goodsData.userCoupontitle}}</span>
                    <span slot="right">{{goodsData.userCoupon.length}}张</span>
                </yd-cell-item>
            </yd-cell-group>
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left">商品合计</span>
                    <span slot="right">¥{{ goodsData.istotal }}</span>
                </yd-cell-item>
                <yd-cell-item v-if="goodsData.discount != 0">
                    <span slot="left">活动优惠</span>
                    <span slot="right">-¥{{goodsData.discount}}</span>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left">优惠券</span>
                    <span slot="right">-¥{{goodsData.coupon}}</span>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left">运费</span>
                    <span slot="right">¥{{goodsData.freight}}</span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('invoice?money=' + goodsData.istotal)">
                    <span slot="left" class="radio-icon" v-if="goodsData.invoice" :class="{'on': goodsData.invoice.status == 1}" @click="needInvoice"></span>
                    <span slot="left" @click="needInvoice">我要开发票</span>
                    <span slot="right"></span>
                </yd-cell-item>
            </yd-cell-group>
            <ul class="goods-list">
                <li class="goods-item" v-for="item in goodsData.goodslist">
                    <ImgTag :url="imgUrl + item.pic" />
                    <div class="goods-info">
                        <h4 class="goodsname">{{ item.title }}</h4>
                        <p>{{ item.specifications }}</p>
                        <div class="price">
                            <span>¥{{ item.price }}</span>
                        </div>
                    </div>
                    <div class="amount">
                        × {{ item.number }}
                    </div>
                </li>
            </ul>
            <yd-popup v-model="$store.state.popupIsShow" position="bottom" height="auto">
                <h2>可用优惠券</h2>
                <ul class="coupon-list" v-if="goodsData.userCoupon">
                    <li v-for="item in goodsData.userCoupon">
                        <div class="ctn-top" @click="using(item.id)">
                            <div class="facevalue"><span>{{item.welfare}}</span>元</div>
                            <div class="info">
                                <div class="name">{{item.title}}</div>
                                <p>{{item.starttime}} - {{item.endtime}}</p>
                            </div>
                        </div>
                        <div class="ctn-btm">
                            <div class="text" :class="{'fold' : foldId != item.id}">12月好物榜12月好物12月好物榜榜12月12月好物榜好物榜12月好物榜12月好物榜12月好物榜12月好物榜12月好物榜12月好物榜</div>
                            <div class="btn" :class="{'fold' : foldId != item.id}"><i @click="foldBtn(item.id)"></i></div>
                        </div>
                    </li>
                </ul>
            </yd-popup>
        </div>
        <footer>
            <div>
                应付：¥{{ goodsData.total.toFixed(2) }}
            </div>
            <a href="javascript:;" @click="payment">去付款</a>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            goodsData: this.$store.state.shopingCart,
            freight: 0,
            foldId: 0
        }
    },
    mounted() {
        
        //判断是否有下单数据 没有了就返回
        if(!this.goodsData.goodslist) {
            this.$router.go(-1)
        }else {
            this.confirmOrder();
        }
    },
    methods: {
        payment() {
            //orderfrom   APP 1   H5 2  小程序 3
            var t = "1";
            if(this.$route.query.gd) {
                t = "0";
            }
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "addOrder",
                type: t,
                data: JSON.stringify(this.goodsData),
                orderfrom: 1
            }).then((data) => {
                if(data.ztm == 1) {
                    this.$router.replace('payment?oid=' + data.ordersn);
                }
            })
        },
        confirmOrder() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "confirmOrder",
                goodslist: JSON.stringify(this.goodsData.goodslist),
                usecouponid: this.goodsData.couponid || ""
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.$store.commit("setShopingCart",{data:{
                        goodslist: this.goodsData.goodslist,
                        total: data.payment,
                        address: this.goodsData.address,
                        invoice: this.goodsData.invoice || {status: 0},
                        coupon: data.coupon,
                        couponid: data.couponid,
                        istotal: data.istotal,
                        discount: data.discount,
                        userCoupon: data.userCoupon,
                        userCoupontitle: data.userCoupontitle,
                        freight: data.freight
                    }})
                    this.goodsData = this.$store.state.shopingCart;
                }else {
                    this.$dialog.toast({
                        mes: data.msg
                    })
                }
            })
        },
        foldBtn(id) {
            this.foldId = this.foldId == id ? 0 : id;
        },
        using(id) {  //选择优惠券   
            this.$store.commit("setShopingCart",{couponid: id});
            this.confirmOrder();
            this.$store.state.popupIsShow = false;
        },
        needInvoice() {
            event.cancelBubble = true;
            if(this.goodsData.invoice.status == 1) {
                this.goodsData.invoice.status = 0;
            }else {
                this.goodsData.invoice.status = 1;
            }
            
        }
    }
}
</script>

<style lang="less">
.writeorder-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: auto;
        .address {
            display: flex;
            align-items: center;
            background:#fffcec url("../../assets/images/icon/address_strip_icon.png") repeat-x left top;
            background-size: auto .1rem;
            padding-top: .1rem;
            padding: .2rem;
            font-size: .3rem;
            border-bottom: 1px solid #d5d5d5;
            .ctn-left {
                width: 1.8rem;
                padding-right: .2rem;
                span {
                    display: block;
                }
                a {
                    display: inline-block;
                    border: 1px solid #c33;
                    padding: .02rem .1rem;
                    border-radius: .05rem;
                    color: #c33;
                    font-size: .2rem;
                }

            }
            .ctn-center {
                flex: 1;
                padding-right: .2rem;
                .useraddress {
                    font-size: .28rem;
                    color: #999;
                }
            }
            .ctn-right {
                img {
                    width: .3rem;
                    height: .3rem;
                }
            }
        }
        .yd-cell-box {
            margin-top: .2rem;
            .radio-icon {
                width: .5rem;
                height: 100%;
                background: url("../../assets/images/icon/radio_off_icon.png") no-repeat center;
                background-size: 100%;
                &.on {
                    background-image: url("../../assets/images/icon/radio_on_icon.png");
                }
            }
        }
        .goods-list {
            .goods-item {
                display: flex;
                padding: .2rem .3rem;
                background-color: #fff;
                border-top: 1px solid #d5d5d5;
                img {
                    width: 1.64rem;
                    height: 1.64rem;
                }
                .goods-info {
                    flex: 1;
                    padding-left: .2rem;
                    overflow: hidden;
                    h4 {
                        padding-top: .1rem;
                        font-size: .3rem;
                    }
                    p {
                        line-height: .56rem;
                        color: #5d5d5d;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .price {
                        overflow: hidden;
                        span {
                            font-size: .3rem;
                            font-weight: bold;
                        }
                        button {
                            float: right;
                            padding: .1rem .2rem;
                            border: 1px solid #999;
                            border-radius: 0.05rem;
                        }
                    }
                }
                .amount {
                    padding-left: .1rem;
                    padding-top: .1rem;
                    font-size: .3rem;
                }
            }
        }
        .yd-popup-content {
            h2 {
                line-height: .8rem;
                text-align: center;
                background-color: #fafafa;
                font-size: .3rem;
            }
        }
        .coupon-list {
            padding: .3rem .3rem 0;
            max-height: 7rem;
            -webkit-overflow-scrolling: touch;
            overflow-y: scroll;
            li {
                &.bad {
                    .ctn-top {
                        background-color: #b6bac3;
                    }
                    .ctn-btm {
                        background: #a9acb5 url('../../assets/images/icon/border_bg2.png') repeat-x left top;
                    }
                }
                border-radius: .1rem;
                overflow: hidden;
                margin-bottom: .3rem;
                color: #fff;
                font-size: .28rem;
                .ctn-top {
                    display: flex;
                    padding: .4rem 0;
                    background-color: #ec7476;
                    .facevalue {
                        padding: 0 .6rem;
                        align-self: center;
                        span {
                            font-size: .46rem;
                        }
                    }
                    .info {
                        flex: 1;
                        text-align: left;
                        overflow: hidden;
                        p {
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            font-size: .24rem;
                        }
                    }
                    a {
                        align-self: center;
                        background-color: #fff;
                        color: #f07c7d;
                        padding: .1rem .35rem;
                        border-radius: 0.1rem;
                        margin: 0 .3rem;
                    }
                }
                .ctn-btm {
                    display: flex;
                    background: #da696d url('../../assets/images/icon/border_bg1.png') repeat-x left top;
                    padding: .3rem 0;
                    overflow: hidden;
                    .text {
                        flex: 1;
                        text-align: left;
                        padding-left: .4rem;
                        font-size: .26rem;
                        &.fold {
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }
                    .btn {
                        padding: 0 .4rem;
                        &.fold {
                            i {
                                background-image: url('../../assets/images/icon/arrow_down_white.png');
                            }
                        }
                        i {
                            display: inline-block;
                            width: .3rem;
                            height: .3rem;
                            background: url('../../assets/images/icon/arrow_up_white.png') no-repeat center;
                            background-size: cover;
                        }
                    }
                }
            }
        }
    }
    footer {
        display: flex;
        line-height: 1rem;
        border-top: 1px solid #d5d5d5;
        div {
            flex: 1;
            padding: 0 .3rem;
            color: #c33;
            font-size: .28rem;
            font-weight: bold;
        }
        a {
            width: 2.3rem;
            text-align: center;
            color: #fff;
            background-color: #c33;
            font-size: .3rem;
        }
    }
}
</style>
