<template>
    <div class="integral-page">
        <ComHeaderbar text="积分中心"></ComHeaderbar>
        <div class="main" v-if="pageData">
            <div class="usable">
                <h3>你的可用积分</h3>
                <span class="number">{{pageData.userintegral}}</span>
                <a href="javascript:;"><img src="../../assets/images/icon/vip1_icon.png">会员</a>
            </div>
            <div class="sign-in">
                <yd-step :current="pageData.number">
                    <yd-step-item v-for="item,index in pageData.data" :key="index">
                        <span slot="top">+{{item.integral}}</span>
                        <span slot="bottom">{{item.number}}天</span>
                    </yd-step-item>
                </yd-step>
                <a href="javascript:;" v-if="pageData.ztm == 1" class="" @click="signIn">签到</a>
                <a href="javascript:;" v-if="pageData.ztm == 2" class="disabled">已签到</a>
            </div>
            <div class="exchange">
                <div class="title">
                    <h2>积分 <span>兑好礼</span></h2>
                    <p>小积分 换好礼 会员专享，每月更新</p>
                </div>
                <ul>
                    <li v-for="item,index in pageData.goods" @click="$router.push('intgoodsdetails?id=' + item.id)">
                        <ImgTag :url="imgUrl + item.pic" />
                        <p>{{item.title}}</p>
                        <div class="price"><span>{{item.integralbuy}}积分</span><s>¥{{item.price}}</s></div>
                    </li>
                </ul>
                <router-link to="intgoods" class="see-more">查看全部</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageData: null
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "signHome"
            }).then((data) => {
                console.log(data)
                if(data.ztm != 0) {
                    this.pageData = data;
                }
            })
        },
        signIn() {
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "userSign"
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "success"
                    })
                    this.getData();
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
</script>

<style lang="less">
.integral-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .usable {
            background-color: #f2ead8;
            text-align: center;
            padding: .56rem 0;
            h3 {
                color: #000;
                font-size: .35rem;
            }
            .number {
                display: block;
                font-size: .68rem;
                font-weight: bold;
                color: #b4a078;
                padding: .3rem 0;
            }
            a {
                background-color: #c33;
                color: #fff; 
                border-radius: .1rem;
                padding: .05rem .1rem;
                img {
                    width: .25rem;
                }
            }
        }
        .sign-in {
            background-color: #fff;
            overflow: hidden;
            .yd-step {
                padding: .4rem 0;
            }
            a {
                display: block;
                width: 60%;
                margin: 0 auto .5rem;
                text-align: center;
                background-color: #b4a078;
                color: #fff;
                line-height: .84rem;
                border-radius: .42rem;
                font-size: .3rem;
                &.disabled {
                    background-color: #e0dfdd;
                }
            }
        }
        .exchange {
            background-color: #fff;
            text-align: center;
            padding-bottom: .4rem;
            .title {
                padding: .4rem 0;
                h2 {
                    text-align: center;
                    font-size: .3rem;
                    span {
                        font-size: .35rem;
                    }
                }
                p {
                    text-align: center;
                    font-size: .25rem;
                    line-height: .5rem;
                    color: #999;
                }
            }
            ul {
                display: flex;
                flex-wrap: wrap;
                text-align: left;
                li {
                    width: 45%;
                    margin-left: 3%;
                    margin-bottom: .2rem;
                    border: 1px solid #999;
                    img {
                        width: 100%;
                        height: 3.4rem;
                    }
                    p {
                        padding: .16rem .2rem;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .price {
                        padding: 0 .2rem .4rem;
                        span {
                            color: #c33;
                            font-size: .3rem;
                            font-weight: bold;
                        }
                        s {
                            display: inline-block;
                            font-size: .25rem;
                            padding-left: .1rem;
                            color: #999;
                        }
                    }
                }
            }
            .see-more {
                display: inline-block;
                line-height: .9rem;
                border: 1px solid #999;
                padding: 0 1rem;
                border-radius: .45rem;
            }
        }
    }
}
</style>
