<template>
    <div class="income-page">
        <ComHeaderbar text="我的收入"></ComHeaderbar>
        <div class="main" v-if="pageData">
            <img class="banner" :src="imgUrl + pageData.banner.pic" @click="$store.commit('openUrl', pageData.banner.url)" />
            <div class="ctn-info">
                <div class="balance">
                    <a href="javascript:;">
                        <i>我的积分</i>
                        <span>{{pageData.allIntegral}}</span>
                    </a>
                    <!-- <a href="javascript:;">
                        <i>我的零钱</i>
                        <span>5.36</span>
                    </a> -->
                </div>
                <!-- <p class="p1">昨日最后金币（转）零钱清算：2740金币 = 1.7元</p>
                <p class="p2">※金币转换汇率受每日收益影响（上下会有浮动）</p> -->
            </div>
            <yd-tab>
                <yd-tab-panel label="积分记录">
                    <ul>
                        <li v-for="item in pageData.data">
                            <div>
                                <span>{{item.desc}}</span>
                                <span style="color: #0fba0a" v-if="item.sign != 1">+{{item.integral}}积分</span>
                                <span style="color: #c33" v-if="item.sign == 1">-{{item.integral}}积分</span>
                            </div>
                            <div>
                                <span></span>
                                <span>{{item.createtime}}</span>
                            </div>
                        </li>
                    </ul>
                </yd-tab-panel>
                <!-- <yd-tab-panel label="零钱">
                    <ul>
                        <li v-for="item in 20">
                            <div>
                                <span>新年小目标活动</span>
                                <span style="color: #0fba0a">+0.05元</span>
                            </div>
                            <div>
                                <span>有效徒弟红包奖励</span>
                                <span>2018-01-10 12:12:12</span>
                            </div>
                        </li>
                    </ul>
                </yd-tab-panel> -->
            </yd-tab>
        </div>
        <footer v-if="pageData">
            <a href="javascript:;" @click="$store.commit('openUrl',webh5 + '/share/share_img.html')">累计收入{{pageData.allIntegral}}积分　炫耀一下</a>
        </footer>
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
            this.$http.post(this.shareApiUrl,{
                code: "bagRecord"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;
                }
            })
        }
    }
}
</script>

<style lang="less">
.income-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .banner {
            display: block;
            width: 100%;
        }
        .ctn-info {
            background-color: #fff;
            padding: .28rem .4rem;
            .balance {
                display: flex;
                border-bottom: 1px solid #999;
                padding: 0 0 .2rem;
                a {
                    flex: 1;
                    text-align: center;
                    i {
                        font-size: .28rem;
                        color: #999;
                    }
                    span {
                        display: block;
                        font-weight: bold;
                        font-size: .5rem;
                        color: #f9a329;
                    }
                }
            }
            .p1 {
                font-size: .28rem;
                padding: .2rem 0;
                color: #000;
                font-weight: bold;
            }
            .p2 {
                color: #f9a329;
                font-size: .25rem;
            }
        }
        .yd-tab {
            margin-top: .26rem;
            .yd-tab-nav {
                font-weight: bold;
                &:after {
                    border-color: #0fba0a;
                }
                .yd-tab-active {
                    color: #0fba0a;
                    &:before {
                        left: 0;
                        margin-left: 0;
                        width: 100%;
                    }
                }
            }
            .yd-tab-panel-item {
                ul {
                    li {
                        padding: .1rem .2rem;
                        border-bottom: 1px solid #ccc;
                        div {
                            overflow: hidden;
                            line-height: .5rem;
                            color: #919191;
                            span {
                                &:nth-child(1) {
                                    float: left;
                                }
                                &:nth-child(2) {
                                    float: right;
                                }
                            }
                            &:nth-child(1) {
                                font-size: .3rem;
                                font-weight: bold;
                                color: #000;
                            }
                        }
                    }
                }
            }
        }
    }
    footer {
        position: relative;
        padding: .34rem .3rem;
        background-color: #fff;
        box-shadow: 0px 0px 20px #888888;
        a {
            display: block;
            text-align: center;
            color: #fff;
            background-color: #f7a623;
            font-size: .32rem;
            line-height: .9rem;
            border-radius: .45rem;
        }
    }
}
</style>
