<template>
    <div class="huanhuo-page">
        <ComHeaderbar text="申请换货" />
        <div class="main">
            <ul>
                <li v-for="(item,index) in pageData">
                    <div class="ct-top">
                        <p>订单编号：{{index}}</p>
                    </div>
                    <div class="content"  @click="$router.push('orderdetails?oid=' + index)">
                        <div class="img-wrap">
                            <ImgTag v-for="subitem,index in item" :url="imgUrl + subitem.pic" :key="index" />
                            <div v-if="item.length == 1">
                                <h3>{{item[0].title}}</h3>
                                <h4>{{item[0].specifications}}</h4>
                            </div>
                        </div>
                        <span>{{item[0].zt}}</span>
                    </div>
                    <div class="btn-wrap clearfix">
                        <!-- 待评价的可以换货 -->
                        <a href="javascript:;" v-if="item[0].status == 3" @click="$router.push('shenqinghuanhuo?t=1&oid=' + item[0].ordersn)">换货</a>
                        <a href="javascript:;" v-if="item[0].status == 7 || item[0].status == 71 || item[0].status == 90 || item[0].status == 75 || item[0].status == 73" @click="$router.push('aftersalesstatus?oid=' + item[0].ordersn)">查看状态</a>
                    </div>
                </li>
                <div class="empty" v-show="pageData.length == 0">
                    <img src="../../assets/images/icon/empty_dindan.png" />
                    <span>没有可操作订单</span>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
/**
 *  0 = 未付款
    1 = 待发货
    2 = 已发货
    3 = 待评价
    4 = 交易成功
    5 = 申请退款
    7 = 申请换货
    8 = 退款成功
    9 = 申请退货
    10=同意退货
    90 = 同意退货换货
 */
export default {
    data() {
        return {
            pageData: []
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "CanReplaceList"
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }else {
                    
                }
            })
        },
        tuikuan() {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定需要取消订单并退款吗？',
                opts: () => {
                    this.$dialog.toast({mes: '你点了确定', timeout: 1000});
                }
            });
        }
    }
}
</script>


<style lang="less">
.huanhuo-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        ul {
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
                            h3 {
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden; 
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
                overflow: hidden;
                img {
                    display: block;
                    width: 2.8rem;
                    margin: 2rem auto .3rem;
                }
                span {
                    display: block;
                    color: #a9a9a9;
                    text-align: center;
                }
            }
        }
    }
}
</style>

