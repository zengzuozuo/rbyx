<template>
    <div class="activitylist-page">
        <ComHeaderbar text="热门活动" />
        <div class="main">
            <ul>
                <li v-for="item in pageData">
                    <span>{{item.createtime}}</span>
                    <div class="content" @click="$store.commit('openUrl', item.url)">
                        <h3>{{item.title}}</h3>
                        <div>
                            <ImgTag :url="imgUrl + item.pic" />
                            <p>{{item.desc}}</p>
                            <i class="over" v-if="item.sign == 1">活动结束</i>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="empty" v-if="pageData.length == 0">
                <img src="../../assets/images/icon/empty_dindan.png" alt="">
                <span>暂无消息</span>
            </div>
        </div>
    </div>
</template>

<script>
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
            this.$http.post(this.shareApiUrl, {
                code: "myNewsActivityList"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }else {
                    this.pageData = [];
                }
            })
        }
    }
}
</script>

<style lang="less">
.activitylist-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        ul {
            li {
                padding: 0 .3rem;
                text-align: center;
                span {
                    display: inline-block;
                    background-color: #cccccc;
                    margin: .3rem 0;
                    color: #fff;
                    padding: .1rem .2rem;
                    border-radius: .05rem;
                }
                .content {
                    background-color: #fff;
                    padding: 0 .3rem;
                    text-align: left;
                    h3 {
                        line-height: .76rem;
                        border-bottom: 1px solid #666;
                        font-size: .3rem;
                    }
                    
                    div {
                        position: relative;
                        p {
                            flex: 1;
                            font-size: .3rem;
                            line-height: .46rem;
                            color: #989898;
                            padding: .2rem 0;
                        }
                        img {
                            width: 100%;
                            height: 2.5rem;
                            margin-top: .2rem;
                        }
                        .over {
                            position: absolute;
                            width: 100%;
                            height: 2.5rem;
                            top: .2rem;
                            left: 0;
                            background-color: rgba(0, 0, 0, .4);
                            text-align: center;
                            line-height: 2.5rem;
                            color: #fff;
                            font-size: .3rem;
                        }
                    }

                }
            }
        }
        .empty {
            text-align: center;
            margin-top: 2rem;
            img {
                display: block;
                width: 3rem;
                margin: 0 auto;
            }
            span {
                font-size: .3rem;
                color: #666;
            }
        }
    }
}
</style>
