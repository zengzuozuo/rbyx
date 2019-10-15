<template>
    <div class="zcorderdetails-page">
        <ComHeaderbar text="订单详情">
            <a href="javascript:;" class="other" @click="$router.push('home')"><img src="../../assets/images/icon/home_icon.png"></a>
        </ComHeaderbar>
        <div class="main">
            <div class="address" v-if="pageData">
                <div class="ctn-left">
                    <span>{{pageData.address.realname}}</span>
                </div>
                <div class="ctn-center">
                    <p class="phone">{{pageData.address.mobile}}</p>
                    <p class="useraddress">{{pageData.address.region}}{{pageData.address.address}}</p>
                </div>
            </div>
            <div class="parcel" v-if="pageData">
                <div class="ctn-top clearfix">
                    <span class="time">包裹1</span>
                    <span class="status">{{pageData.data[0].zt}}</span>
                </div>
                <ul class="goods-list">
                    <li class="goods-item" v-for="item in pageData.data">
                        <ImgTag :url="imgUrl + item.pic" />
                        <div class="goods-info">
                            <h4 class="goodsname">{{item.title}}</h4>
                            <p>{{item.specifications}}</p>
                            <div class="price">
                                <span>¥{{item.price}}</span>
                            </div>
                        </div>
                        <div class="amount">
                            × 1
                        </div>
                    </li>
                </ul>
                <div class="btn-wrap clearfix" v-if="pageData">

                </div>
            </div>
            <div class="order-info mt20" v-if="pageData">
                <ul>
                    <li>
                        <label>订单编号：</label>
                        <span>2349873421</span>
                    </li>
                    <li>
                        <label>下单时间：</label>
                        <span>{{pageData.data[0].createtime}}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <label>支付方式：</label>
                        <span v-show="pageData.data[0].paytype == 2">支付宝</span>
                        <span v-show="pageData.data[0].paytype == 1">微信</span>
                    </li>
                    <li>
                        <label>商品合计：</label>
                        <span>¥{{pageData.data[0].total}}</span>
                    </li>
                    <li>
                        <label>运费：</label>
                        <span>¥{{pageData.data[0].freight}}</span>
                    </li>
                </ul>
                <div v-if="pageData.data[0].status != 0">
                    <label>实付：</label>
                    <span>¥{{pageData.data[0].payment}}</span>
                </div>
                <div v-if="pageData.data[0].status == 0">
                    <label>应付：</label>
                    <span>¥{{pageData.data[0].payment}}</span>
                </div>
            </div>
        </div>
        <footer v-if="pageData">
            <a href="javascript:;" @click="$router.push('payment?back=1&oid=' + $route.query.oid)" v-if="pageData.data[0].status == 0">在线支付</a>
            <a :href="'tel:' + tel">电话客服</a>
        </footer>
    </div>
</template>

<script>
import Like from "../common/like_component.vue";
export default {
    data() {
        return {
            pageData: null,
            total : 0,
            tel: localStorage.getItem("tel")
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "CrowdFundingOrderDetail",
                ordersn: this.$route.query.oid
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;
                }
            })
        }
    },
    components: {
        Like
    }
}
</script>

<style lang="less">
.zcorderdetails-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .mt20 {
            margin-top: .2rem;
        }
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
        .parcel {
            background-color: #fff;
            padding-left: .3rem;
            .ctn-top {
                line-height: .9rem;
                padding: 0 .3rem 0 0;
                font-size: .26rem;
                .status {
                    float: right;
                    color: #c33;
                }
            }
            .goods-list {
                .goods-item {
                    display: flex;
                    padding: .2rem .3rem .2rem 0;
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
                        padding-top: .1rem;
                        padding-left: .1rem;
                        font-size: .3rem;
                    }
                }
            }
            .btn-wrap {
                padding: .2rem;
                border-top: 1px solid #d5d5d5;
                a {
                    float: right;    
                    padding: .1rem .2rem;
                    border: 1px solid #999;
                    margin: 0 .1rem;
                    border-radius: .05rem;
                }
            }
        }   
        .order-info {
            padding-left: .3rem;
            background-color: #fff;
            ul {
                padding: .08rem .08rem .08rem 0;
                border-bottom: 1px solid #d5d5d5;
                li {
                    padding: .08rem .3rem .08rem 0;
                    font-size: .28rem;
                    label {
                        display: inline-block;
                        color: #999;
                        width: 1.6rem;
                    }
                }
            }
            div {
                padding: .4rem 0;
                color: #c33;
                font-size: .28rem;
                label {
                    display: inline-block;
                    width: 1.6rem;
                }
            }
        }
        h2 {
            padding: .4rem .3rem;
            font-weight: normal;
            background-color: #fff;
            font-size: .28rem;
            span {
                color: #c33;
            }
        }
    }
    footer {
        display: flex;
        justify-content: space-around;
        padding: .1rem;
        a {
            flex: 1;
            line-height: .8rem;
            background-color: #999;
            color: #fff;
            font-size: .3rem;
            text-align: center;
            border-radius: .1rem;
            margin: 0 .1rem;
        }
    }
}
</style>
