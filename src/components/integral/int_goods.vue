<template>
    <div class="intgoods-page">
        <ComHeaderbar text="积分兑好礼">
            <router-link class="other" to="intrecord"><span>兑换记录</span></router-link>
        </ComHeaderbar>
        <div class="main" v-if="pageData">
            <div class="ctn-top">
                <div>
                    <h4>可用积分</h4>
                    <h3>{{pageData.userintegral}}</h3>
                    <p>小积分 换好礼 会员专享 每月更新</p>
                </div>
            </div>
            <div class="nav">
                <ul>
                    <li :class="{'active': activeNum == 1}" @click="filter(1)">全部</li>
                    <li :class="{'active': activeNum == 2}" @click="filter(2,0,999)">0-999</li>
                    <li :class="{'active': activeNum == 3}" @click="filter(3,1000,2999)">1000-2999</li>
                    <li :class="{'active': activeNum == 4}" @click="filter(4,3000,5999)">3000-5999</li>
                    <li :class="{'active': activeNum == 5}" @click="filter(5,6000,9999)">6000-9999</li>
                    <li :class="{'active': activeNum == 6}" @click="filter(6,10000)">10000以上</li>
                </ul>
            </div>
            <ul class="goods-list">
                <li v-for="item in goodslist" @click="$router.push('intgoodsdetails?id=' + item.id)">
                    <div class="img-wrap">
                        <ImgTag :url="imgUrl + item.pic" />
                    </div>
                    <div class="goods-info">
                        <h3>{{item.title}}</h3>
                        <div><span>{{item.integralbuy}}积分</span><s>￥{{item.price}}</s></div>
                        <a href="javascript:;">立即兑换</a>
                    </div>
                </li>
                <div class="empty" v-show="goodslist.length == 0">
                    <img src="../../assets/images/icon/goodsempty_icon.png" />
                    <span>暂无相关商品</span>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageData: null,
            goodslist: [],
            activeNum: 1
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "integralBuyList"
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data;
                    this.goodslist = data.goods;
                }
            }) 
        },
        filter(activeNum,num1,num2) {
            this.activeNum = activeNum;
            var arr = [];
            if(activeNum == 1) {
                this.goodslist = this.pageData.goods;
                return;
            }
            if(activeNum == 6) {
                for(var i in this.pageData.goods) {
                    if(this.pageData.goods[i].integralbuy >= 10000) {
                        arr.push(this.pageData.goods[i]);
                    }
                }
                this.goodslist = arr;
                return;
            }
            for(var i in this.pageData.goods) {
                if(this.pageData.goods[i].integralbuy >= num1 && this.pageData.goods[i].integralbuy <= num2) {
                    arr.push(this.pageData.goods[i]);
                }
            }
            this.goodslist = arr;
        }
    }
}
</script>

<style lang="less">
.intgoods-page {
    display: flex;
    flex-direction: column;
    .com-headerbar {
        .other {
            span {
                float: right;
                white-space: nowrap;
                padding-right: .1rem;
            }
            
        }
    }
    .main {
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .ctn-top {
            background-color: #a1a1a1;
            padding: .5rem 1.3rem;
            margin-bottom: .2rem;
            div {
                text-align: center;
                background-color: #fff;
                border: 1px solid #a1a1a1;
                outline: 4px solid #fff;
                h4 {
                    line-height: .66rem;
                    font-weight: normal;
                    font-size: .25rem;
                }
                h3 {
                    font-size: .4rem;
                    color: #ba9f7a;
                }
                p {
                    padding: .2rem;
                    color: #9b9b9b;
                    font-size: .24rem;
                }
            }
        }
        .nav {
            background-color: #fff;
            -webkit-overflow-scrolling: touch;
            overflow-x: scroll;
            position: sticky;
            top: 0;
            left: 0;
            border-bottom: 1px solid #d5d5d5;
            ul {
                white-space: nowrap;
                li {
                    display: inline-block;
                    line-height: .74rem;
                    font-size: .28rem;
                    font-weight: 700;
                    margin: 0 .44rem;
                    border-bottom: 2px solid transparent;
                    &.active {
                        color: #c33;
                        border-color: #c33;
                    }
                }
            }
        }
        .goods-list {
            li {
                display: flex;
                background-color: #fff;
                padding: .25rem .4rem;
                border-bottom: 1px solid #d5d5d5;
                .img-wrap {
                    img {
                        width: 3.2rem;
                        height: 3rem;
                    }
                }
                .goods-info {
                    flex: 1;
                    padding-left: .2rem;
                    align-self: center;
                    h3 {
                        font-size: .3rem;
                    }
                    div {
                        padding: .26rem 0;
                        span {
                            font-size: .35rem;
                            color: #aa9a79;
                            font-weight: bold;
                        }
                        s {
                            font-size: .25rem;
                        }
                    }
                    a {
                        display: inline-block;
                        border: 1px solid #aa9a79;
                        padding: .16rem .3rem; 
                        color: #aa9a79;
                        font-size: .28rem;
                        border-radius: .1rem;
                    }
                }
                
            }
            .empty {
                text-align: center;
                img {
                    height: 2.5rem;
                    display: block;
                    margin: 1rem auto .2rem;
                }
                span {
                    color: #999;
                    font-size: .3rem;
                }
            }
        }
    }
}
</style>

