<template>
    <div class="zc-homelist-component" ref="zchomelistcomponent">
        <div class="cpt-main" ref="main">
            <PullDown ref="pulldown"/>
            <div class="top-banner" v-if="pageData">
                <ImgTag :url="imgUrl + pageData.banner.pic" />
            </div>
            <h2 class="middle-title"><span><img src="../../assets/images/icon/zhongchou_icon.png" />正在众筹</span></h2>
            <ul v-if="pageData">
                <li v-for="item in pageData.data" @click="$router.push('zcdetails?id=' + item.id)">
                    <div class="ctn-l">
                        <ImgTag :url="imgUrl + item.pic" />
                    </div>
                    <div class="ctn-r">
                        <h3>{{item.title}}</h3>
                        <h4>¥<span>{{item.price}}</span>起</h4>
                        <div class="progressbar">
                            <yd-progressbar type="line" :progress="item.schedule" trail-width="4" trail-color="#c33"></yd-progressbar>
                            <span class="value">{{item.schedule * 100}}%</span>
                        </div>
                        <div class="participation">
                            <span><i></i>{{item.people}}人已支持</span>
                            <a href="javascript:;">支持项目</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ["tipid",'selfindex','activeindex'],
    data() {
        return {
            myScroll: null,
            pageData: null
        }
    },
    watch: {
        activeindex(val,oldval) {
            if(this.selfindex == val && !this.pageData) {
                this.getData();
            }
        }
    },
    mounted() {
        var that = this;
        this.myScroll = new iScroll(this.$refs.zchomelistcomponent,{
            preventDefault: false,
			probeType: 3,
        });
        var size = 0;
        this.myScroll.on("scroll",function() {
            size =  this.y >= 100 ? 100 : this.y;
            that.$refs.pulldown.$el.style.transform = "scale("+ size/100 +")";
        })
        this.$refs.main.addEventListener("touchend",function(e){
            if(that.myScroll.y >= 100){
                that.getData();
            }
        })
        
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "CrowdFunding"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;
                    setTimeout(() => {
                        this.myScroll.refresh();
                    },300)
                }
            })
        }
    },
    components: {

    }
}
</script>

<style lang="less">
.zc-homelist-component {
    height: 100%;
    .cpt-main {
        min-height: 100.1%;
        .top-banner {
            img {
                width: 100%;
            }
        }
        .middle-title {
            position: relative;
            line-height: 1rem;
            text-align: center;
            font-size: .3rem;
            padding: 0 .28rem;
            span {
                display: inline-block;
                position: relative;
                background-color: #f3f3f3;
                z-index: 2;
                padding: 0 .3rem;
                img {
                    width: .4rem;
                    height: .4rem;
                    vertical-align: middle;
                    display: inline-block;
                    margin-right: .1rem;
                }
            }
            &:after {
                content: "";
                position: absolute;
                top: .49rem;
                left: 5%;
                width: 90%;
                display: block;
                border-bottom: 2px solid #d4d4d4;
            }
        }
        ul {
            background-color: #fff;
            li {
                display: flex;
                padding: .3rem;
                text-align: left;
                .ctn-l {
                    width: 2.1rem;
                    height: 2.1rem;
                    border-radius: .1rem;
                    overflow: hidden;
                    background-color: #f9f9f9;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .ctn-r {
                    flex: 1;
                    padding-left: .3rem;
                    overflow: hidden;
                    h3 {
                        font-size: .28rem;
                        line-height: .6rem;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    h4 {
                        font-size: .26rem;
                        color: #c33;
                        span {
                            font-size: .34rem;
                        }
                    }
                    .progressbar {
                        .yd-progressbar {
                            display: inline-block;
                            width: 80%;
                        }
                        .value {
                            display: inline-block;
                            font-size: .28rem;
                            padding-left: .1rem;
                            color: #c33;
                        }
                    }
                    .participation {
                        display: flex;
                        margin-top: .1rem;
                        span {
                            flex: 1;
                            align-self: center;
                            font-size: .28rem;
                            i {
                                display: inline-block;
                                width: .4rem;
                                height: .4rem;
                                background: url("../../assets/images/icon/crowd_icon.png") no-repeat center;
                                background-size: cover;
                                vertical-align: bottom;
                            }
                        }
                        a {
                            color: #c33;
                            display: inline-block;
                            border: 1px solid #c33;
                            padding: .1rem .2rem;
                            font-size: .28rem;
                        }
                    }
                }
            }
        }
    }
}
</style>
