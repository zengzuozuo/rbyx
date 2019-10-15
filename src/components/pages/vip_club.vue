<template>
    <div class="vipclub-page">
        <ComHeaderbar text="会员俱乐部"></ComHeaderbar>
        <div class="main" v-if="pageData">
            <div class="ctn-top">
                <div class="user">
                    <div class="user-info">
                        <ImgTag class="userlogo" :url="appImgUrl + pageData.userdata.avatar" />
                        <div>
                            <p>{{pageData.userdata.username}}</p>
                            <!-- <img src="../../assets/images/icon/vip1_icon.png"> -->
                            <span>{{pageData.levelname}}</span>
                        </div>
                    </div>
                    <div class="grow-up">
                        <div class="text-wrap">
                            <span>成长值</span>
                            <span>{{pageData.usergrowthvalue}}/{{pageData.toplimit}}</span>
                        </div>
                        <yd-progressbar type="line" :progress="pageData.usergrowthvalue / pageData.toplimit" trail-width="4" trail-color="#fff"></yd-progressbar>
                    </div>
                </div>
                <div class="hyzx">
                    <div class="column-title">
                        <h3>会员专享</h3>
                        <p>查看不同级别会员服务详情</p>
                    </div>
                    <ul>
                        <li :class="{'not-get' : item.sign != 1}" v-for="item,index in pageData.vipservice" @click="$router.push('vipclubdetails?i=' + index)">
                            <span>{{item.title}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- <div class="hyr">
                <div class="column-title">
                    <h3>会员日</h3>
                    <p>每月12日，会员专享超值福利</p>
                </div>
                <div class="advance">
                    <div>
                        <h3>下期预告：年货随心搭</h3>
                        <p>2月12日 敬请期待</p>
                    </div>
                    <a href="javascript:;">短信订阅</a>
                </div>
                <ul>
                    <li v-for="item in 8">
                        <ImgTag />
                        <h4>零食免费试吃</h4>
                        <p>-12月12日-</p>
                    </li>
                </ul>
            </div> -->
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
            this.$http.post(this.shareApiUrl,{
                code: "userGrowth"
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data;
                }
            })
        }
    }
}
</script>

<style lang="less">
.vipclub-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        background-color: #fff;
        .ctn-top {
            background-color: #fff;
            padding: .3rem;
            .user {
                background: #b5a179; /* Old browsers */
                background: -moz-linear-gradient(-45deg, #b5a179 0%, #ebe0cb 100%); /* FF3.6-15 */
                background: -webkit-linear-gradient(-45deg, #b5a179 0%,#ebe0cb 100%); /* Chrome10-25,Safari5.1-6 */
                background: linear-gradient(135deg, #b5a179 0%,#ebe0cb 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b5a179', endColorstr='#ebe0cb',GradientType=1 );
                padding: .4rem .5rem;
                color: #fff;
                border-radius: .1rem;
                .user-info {
                    display: flex;
                    .userlogo {
                        width: 1.34rem;
                        height: 1.34rem;
                        border-radius: 50%;
                        border: 1px solid #fff;
                    }
                    div {
                        flex: 1;
                        margin-left: .28rem;
                        font-size: .35rem;
                        align-self: center;
                        img {
                            width: .4rem;
                            height: .4rem;
                            background-color: #999;
                        }
                    }
                }
                .grow-up {
                    margin-top: .8rem;
                    .text-wrap {
                        overflow: hidden;
                        span {
                            &:nth-child(1) {
                                float: left;
                            }
                            &:nth-child(2) {
                                float: right;
                            }
                        }
                    }
                    .yd-progressbar {
                        svg {
                            height: .1rem;
                        }
                    }
                }
            }
            .hyzx {
                ul {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    li {
                        width: 48%;
                        height: 1.6rem;
                        background-color: #f6edde;
                        margin-bottom: .3rem;
                        border-radius: .08rem;
                        span {
                            display: inline-block;
                            font-size: .28rem;
                            color: #a68a53;
                            margin: .56rem 0 0 .3rem;
                            padding-bottom: .15rem;
                            border-bottom: 1px solid #a68a53;
                        }
                        &.not-get {
                            background-color: #f7f7f7;
                        }
                    }
                }
            }
        }
        .column-title {
            text-align: center;
            line-height: .55rem;
            padding: .2rem 0;
            h3 {
                font-size: .3rem;
            }
            p {
                font-size: .24rem;
                color: #666;
            }
        }
        .hyr {
            margin-top: .2rem;
            background-color: #fff;
            .advance {
                display: flex;
                background-color: #eceae3;
                padding: .4rem .38rem;
                div {
                    flex: 1;
                    color: #b8a072;
                    h3 {
                        font-size: .3rem;
                    }
                    p {
                        font-size: .24rem;
                        margin-top: .2rem;
                    }
                }
                a {
                    align-self: center;
                    background-color: #b8a072;
                    padding: .15rem .48rem;
                    color: #fff;
                    border-radius: .08rem;
                }
            }
            ul {
                white-space: nowrap;
                padding: .28rem;
                overflow-x: scroll;
                li {
                    display: inline-block;
                    padding: .2rem;
                    text-align: center;
                    background-color: #fbf8f3;
                    margin-left: .28rem;
                    &:first-child {
                        margin-left: 0;
                    }
                    img {
                        display: block;
                        width: 2.2rem;
                        height: 2.2rem;
                    }
                    h4 {
                        line-height: .7rem;
                        font-size: .26rem;
                        font-weight: normal;
                        color: #000;
                    }
                    p {
                        font-size: .24rem;
                        color: #999;
                    }
                }
            }
        }
    }
}
</style>

