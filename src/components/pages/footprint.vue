<template>
    <div class="footprint-page">
        <ComHeaderbar text="我的足迹"></ComHeaderbar>
        <div class="main" ref="main">
            <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
                <div slot="list" v-if="pageData">
                    <ul class="time-list">
                        <li class="time-item" v-for="(item,index) in pageData">
                            <h3 ref="timetitle">{{index}}</h3>
                            <ul class="goods-list">
                                <router-link tag="li" :to="'goodsdetails?id=' + subItem.id" class="goods-item" v-for="subItem,subIndex in item" :key="subIndex">
                                    <ImgTag :url="imgUrl + subItem.pic" />
                                    <div class="goods-info">
                                        <h4 class="goodsname">{{subItem.title}}</h4>
                                        <p>{{subItem.desc}}</p>
                                        <div class="price">
                                            <span>¥{{subItem.price.toFixed(2)}}</span>
                                            <button @click="goSimilar(subItem.id)">找相似</button>
                                        </div>
                                    </div>
                                </router-link>
                            </ul>
                        </li>
                    </ul>
                </div>
            </yd-infinitescroll>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            page: 1,
            pageSize: 10,
            pageData: []
        }
    },
    mounted() {
        
    },
    methods: {
        goSimilar(id) {  //去找相似
            event.cancelBubble = true;
            this.$router.push('similar?id=' + id);
        },
        loadList() {
            setTimeout(() => {
                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                this.page++;
            },2000)
        },
        getData() {
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "myfootprint"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }else {
                    this.pageData = [];
                }
            })
        }
    },
    activated() {
        if(sessionStorage.getItem('frompath') == "/similar" || sessionStorage.getItem('frompath') == "/goodsdetails") {
            this.$refs.main.scrollTop = sessionStorage.getItem('scrollTop');
        }else {
            this.getData();
        }
    },
    deactivated() {
        sessionStorage.setItem('scrollTop', this.$refs.main.scrollTop);
    }
}
</script>

<style scoped lang="less">
.footprint-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .time-list {
            .time-item {
                margin-bottom: .2rem;
                background-color: #fff;
                h3 {
                    position: -webkit-sticky;
                    position: sticky;
                    top: 0;
                    left: 0;
                    width: 100%;
                    line-height: .94rem;
                    padding: 0 .3rem;
                    font-size: .3rem;
                    border-bottom: 1px solid #d5d5d5;
                    background-color: #fff;
                }
                ul {
                    
                    li {
                        display: flex;
                        padding: .2rem .3rem;
                        border-bottom: .1rem solid #f5f5f5;
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
                    }
                }
            }
        }
    }
}
</style>

