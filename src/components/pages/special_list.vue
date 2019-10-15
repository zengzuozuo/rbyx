<template>
    <div class="speciallist-page">
        <ComHeaderbar :text="$route.query.title"></ComHeaderbar>
        <div class="main">
            <ul>
                <li v-for="item in pageData" @click="$store.commit('openUrl',item.url + '?ztid=' + item.id + '&bm=' + token)">
                    <div class="userinfo">
                        <ImgTag />
                        <span>曾左左</span>
                    </div>
                    <div class="ad">
                        <ImgTag :url="imgUrl + item.pic" />
                    </div>
                    <div class="content">
                        <div>
                            <p>{{item.title}}</p>
                            <span>{{item.price}}元起</span>
                        </div>
                        <p class="subtitle">{{item.desc}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageData: [],
            token: localStorage.getItem('zzz') || ""
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$http.post(this.apiUrl,{
                code: "getSpecialList",
                id: this.$route.query.id
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }else {
                    this.$dialog.toast({mes: data.msg})
                }
            })
        }
    }
}
</script>

<style lang="less">
.speciallist-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        ul {
            li {
                background-color: #fff;
                margin-bottom: .2rem;
                .userinfo {
                    padding: .2rem .3rem;
                    img {
                        width: .6rem;
                        height: .6rem;
                        border-radius: 50%;
                        vertical-align: middle;
                    }
                    span {
                        vertical-align: middle;
                        display: inline-block;
                        margin-left: .2rem;
                        font-size: .26rem;
                    }
                }
                .ad {
                    img {
                        width: 100%;
                    }
                }
                .content {
                    padding: .2rem .3rem;
                    div {
                        display: flex;
                        font-size: .3rem;
                        overflow: hidden;
                        width: 100%;
                        p {
                            flex: 1;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        span {
                            color: #c33;
                            font-weight: bold;
                        }
                    }
                    .subtitle {
                        font-size: .26rem;
                        color: #777;
                        padding: .1rem 0;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
    }
}
</style>

