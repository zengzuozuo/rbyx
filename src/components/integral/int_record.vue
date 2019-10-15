<template>
    <div class="record-page">
        <ComHeaderbar text="兑换记录"></ComHeaderbar>
        <div class="main">
            <ul class="dindan-list">
                <li v-for="(item,index) in orderList">
                    <div class="ct-top">
                        <p>订单编号：{{index}}</p>
                        <!-- <i class="icon" @click="$store.commit('undone')"></i> -->
                    </div>
                    <div class="content" @click="$router.push('intgoodsdetails?id=' + item[0].goodsid)">
                        <div class="img-wrap">
                            <ImgTag :url="imgUrl + item[0].pic" :key="index" />
                            <div>
                                <h3>{{item[0].title}}</h3>
                                <h4>{{item[0].specifications}}</h4>
                                <h3 style="color: #b2a47e;">{{item[0].payintegral}}积分<s>¥{{item[0].price}}</s></h3>
                            </div>
                        </div>
                        <span>{{item[0].zt}}</span>
                    </div>
                    <div class="btn-wrap clearfix">
                        <a href="javascript:;" style="color: #c33;border-color: #c33" v-if="item[0].status == 2" @click="ConfirmationCollect(item[0].ordersn)">确认收货</a>
                        <a href="javascript:;" v-if="item[0].status == 2" @click="$router.push('logistics?oid=' + item[0].ordersn)">追踪物流</a>
                        <a href="javascript:;" @click="$router.push('orderdetails?oid=' + item[0].ordersn)">订单详情</a>
                    </div>
                </li>
                <div class="empty" v-if="orderList.length == 0">
                    <img src="../../assets/images/icon/empty_dindan.png" alt="">
                    <span>暂无记录</span>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orderList: []
        }
    },
    mounted() {
        this.getOrderList();
    },
    methods: {
        getOrderList() {
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "IntegralOrderList"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.orderList = data.data;
                }else {
                    this.orderList = [];
                }
            })
        },
        /**
         * 订单确认收货
         * 
         * @param    oid    订单号
         */
        ConfirmationCollect(oid) {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定货品已收到？',
                opts: () => {
                    this.$store.commit("openWait");
                    this.$http.post(this.apiUrl,{
                        code: "ConfirmationCollect",
                        ordersn: oid
                    }).then((data) => {
                        console.log(data);
                        if(data.ztm == 1) {
                            this.getOrderList();
                        }
                        this.$dialog.toast({
                            mes: data.msg
                        })
                    })
                }
            })
        },
    }
}
</script>

<style lang="less">
.record-page {
    display: flex;
    flex-direction: column;
    .main {
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .dindan-list {
            li {
                border-left: .2rem solid #fff;
                background-color: #fff;
                margin-top: .2rem;
                .ct-top {
                    display: flex;
                    border-bottom: 1px solid #d5d5d5;
                    p {
                        flex: 1;
                        font-size: .28rem;
                        line-height: .88rem;
                        text-align: left;
                        padding-right: .2rem;
                    }
                    .icon {
                        width: .88rem;
                        height: .88rem;
                        background: url("../../assets/images/icon/delete_icon.png") no-repeat center;
                        background-size: 40%;
                    }
                }
                .content {
                    display: flex;
                    align-items: center;
                    padding-right: .2rem;
                    border-bottom: 1px solid #d5d5d5;
                    .img-wrap {
                        flex: 1;
                        img {
                            float: left;
                            width: 1.5rem;
                            height: 1.5rem;
                            margin: .2rem .2rem .2rem 0;
                        }
                        div {
                            float: left;
                            max-width: 3.5rem;
                            padding-top: .6rem;
                            font-size: .25rem;
                            overflow: hidden; 
                            text-align: left;
                            h3 {
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden; 
                                s {
                                    display: inline-block;
                                    padding-left: .2rem;
                                    color: #999;
                                }
                            }
                            h4 {
                                font-weight: normal;
                                padding-top: .1rem;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }
                        }
                    }
                    span {
                        color: #c33;
                    }
                }
                .btn-wrap {
                    padding: .2rem;
                    a {
                        float: right;    
                        padding: .1rem .2rem;
                        border: 1px solid #999;
                        margin: 0 .1rem;
                        border-radius: .05rem;
                    }
                }
            }
            .empty {
                text-align: center;
                img {
                    display: block;
                    width: 2.8rem;
                    margin: 2rem auto .3rem;
                }
                span {
                    color: #a9a9a9;
                    font-size: .3rem;
                }
            }
        }
    }
}
</style>

