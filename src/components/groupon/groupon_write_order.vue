<template>
    <div class="grouponwriteorder-page">
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
                <yd-cell-item type="a" href="javascript:;">
                    <span slot="left">商品合计</span>
                    <span slot="right">¥{{ goodsData.total.toFixed(2) }}</span>
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
        </div>
        <footer>
            <div>
                应付：¥{{ (goodsData.total).toFixed(2) }}
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
            freight: this.$store.state.shopingCart.total >= 88 ? 0 : 10,
        }
    },
    mounted() {
        console.log(this.goodsData)
        //判断是否有下单数据 没有了就返回
        if(!this.goodsData.goodslist) {
            this.$router.go(-1)
        }
    },
    methods: {
        payment() {
            if(this.$route.query.type == "join") {
                this.$store.commit("openWait");
                this.$http.post(this.apiUrl,{
                    code: "gotoFightprice",
                    addressid: this.goodsData.address.id,
                    specificationsid: this.$route.query.sfid,
                    ordersn: this.$route.query.ordersn,
                    groupoid: this.$route.query.goid
                }).then((data) => {
                    if(data.ztm == 1) {
                        this.$router.push('payment?istg=1&back=1&oid=' + data.ordersn);
                    }else {
                        this.$dialog.toast({
                            mes: data.msg,
                            icon: "error"
                        })
                    }
                })
            }else {
                this.$store.commit("openWait");
                this.$http.post(this.apiUrl,{
                    code: "joinFightGroup",
                    addressid: this.goodsData.address.id,
                    specificationsid: this.$route.query.sfid,
                    id: this.$route.query.id
                }).then((data) => {
                    console.log(data)
                    if(data.ztm == 1) {
                        this.$router.push('payment?istg=1&back=1&oid=' + data.ordersn);
                    }else {
                        this.$dialog.toast({
                            mes: data.msg,
                            icon: "error"
                        })
                    }
                })
            }
        }
    }
}
</script>

<style lang="less">
.grouponwriteorder-page {
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
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
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
