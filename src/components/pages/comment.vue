<template>
    <div class="comment-page">
        <ComHeaderbar text="评论"></ComHeaderbar>
        <div class="main">
            <yd-pullrefresh :callback="getData" ref="pullrefreshDemo">
            <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
                <!-- <div class="top-box" slot="list">
                    <div>
                        <span>评分</span>
                        <yd-rate slot="left" v-model="star" active-color="#fcb54a" :readonly="true" size="18px"></yd-rate>
                        <span>98%好评</span>
                    </div>
                    <ul class="label-wrap">
                        <li>全部（999+）</li>
                        <li>有图（999+）</li>
                        <li>好评（999+）</li>
                        <li>差评（999+）</li>
                    </ul>
                </div> -->
                <ul class="comment-list" slot="list">
                    <li v-for="item in pageData">
                        <div class="userinfo">
                            <ImgTag :url="appImgUrl + item.avatar" />
                            <span>{{item.username}}</span>
                            <i></i>
                            <yd-rate slot="left" v-model="item.score" :readonly="true" active-color="#fcb54a" size="15px"></yd-rate>
                        </div>
                        <p class="orderinfo">
                            <span>{{item.createtime}}</span>
                            <span>{{item.vs}}</span>
                        </p>
                        <p class="remark">{{item.content}}</p>
                        <div class="img-box">
                            <!-- <img v-for="item in 3" src="../../assets/images/test_goods.png" /> -->
                            <yd-lightbox>
                                <yd-lightbox-img v-for="subItem,key in item.img" :key="key" :src="appImgUrl + subItem"></yd-lightbox-img>
                            </yd-lightbox>
                        </div>
                    </li>
                    <div class="empty" v-if="pageData.length == 0">
                        <img src="../../assets/images/icon/goodsempty_icon.png" />
                        <span>暂无相关评论</span>
                    </div>
                </ul>
            </yd-infinitescroll>
            </yd-pullrefresh>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            star: 5,
            pageData: []
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$http.post(this.apiUrl,{
                code: "evaluateList",
                id: this.$route.query.id || ""
            }).then((data) => {
                console.log(data);
                this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }else {
                    this.pageData = [];
                }
            })
        },
        loadList() {
            setTimeout(() => {
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');

                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
            },3000)
        },
    },
    beforeRouteLeave(to, from, next) {
        var dom = document.getElementsByClassName("yd-lightbox")[0];
        if(dom) {
            dom.parentNode.remove();
            next(false);
        }else {
            next();
        }
    }
}
</script>

<style lang="less">
.comment-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
        position: relative;
        background-color: #fff;
        .top-box {
            background-color: #fff;
            padding: .4rem .3rem;
            div {
                span {
                    color: #000;
                    font-size: .3rem;
                }
                .yd-rate {
                    display: inline-block !important;
                    margin: 0 .2rem;
                }
            }
            .label-wrap {
                overflow: hidden;
                li {
                    float: left;
                    margin: .33rem .3rem 0 0;
                    padding: .1rem .16rem;
                    border: 1px solid #999;
                    border-radius: .1rem;
                }
            }
        }
        .comment-list {
            padding: 0 .3rem;
            border-top: 1px solid #d8d8d8;
            min-height: 100%;
            li {
                border-bottom: 1px solid #d8d8d8;
                margin-top: .3rem;
            }
            .userinfo {
                img {
                    width: .68rem;
                    height: .68rem;
                    vertical-align: middle;
                    border-radius: 50%;
                }
                span {
                    display: inline-block;
                    padding: 0 .1rem;
                    font-size: .3rem;
                    color: #000;
                    vertical-align: middle;
                }
                i {
                    display: inline-block;
                    border-radius: .03rem;
                    width: .3rem;
                    height: .3rem;
                    background: #b4a078 url("../../assets/images/icon/vip1_icon.png") no-repeat center;
                    background-size: 100%;
                    vertical-align: middle;
                }
            }
            .orderinfo {
                line-height: .7rem;
                color: #727272;
                font-size: .28rem;
            }
            .remark {
                line-height: .44rem;
                color: #000;
                font-size: .28rem;
            }
            .img-box {
                img {
                    width: 23%;
                    height: 1.56rem;
                    margin: .2rem 2% 0 0;
                }
            }
            .empty {
                padding: 1rem 0;
                text-align: center;
                img {
                    display: block;
                    width: 2.8rem;
                    margin: .3rem auto;
                }
                span {
                    color: #a9a9a9;
                    font-size: .28rem;
                }
            }
        }
    }
}
</style>