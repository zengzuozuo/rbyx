<template>
    <div class="goodsclass-component">
        <div class="search-wrap">
            <router-link tag="div" to="search">
                <img src="../../../assets/images/icon/search_icon.png" />
                <span>搜索商品，这里有你想要的</span>
            </router-link>
        </div>
        <div class="class-box-wrap">  
            <yd-scrolltab class="class-box" id="class-box" ref="ggg">
                <yd-scrolltab-panel :label="item.name" v-for="item,index in pageData" :key="index">
                    <ImgTag class="top-banner" :url="imgUrl + item.ad.pic" @click.native="$router.push('detailsclassgoods?id=' + item.id)" />
                    <h3>-- {{item.name}}分类 --</h3>
                    <ul class="sub-class">
                        <li v-for="subitem,index in item.typedata" @click="$router.push('/detailsclassgoods?id=' + item.id + '&i=' + index)">
                            <ImgTag :url="imgUrl + subitem.icon" />
                            <span>{{subitem.name}}</span>
                        </li>
                    </ul>
                </yd-scrolltab-panel>
            </yd-scrolltab>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageData: [],
            dom: null
        }
    },
    mounted() {
        this.setHeight("class-box");
        this.getData();
        this.dom = document.getElementsByClassName("yd-scrolltab-content")[0];
        
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getclassifyCategory"
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }
            })
        },
        fn() {
            sessionStorage.setItem('gcScrollTop', this.dom.scrollTop);
        }
    },
    activated() {
        this.dom.scrollTop = sessionStorage.getItem('gcScrollTop');
        this.dom.removeEventListener("scroll",this.fn,false);
        this.dom.addEventListener("scroll",this.fn,false)
    }
}
</script>

<style lang="less">
.goodsclass-component {
    display: flex;
    flex-direction: column;
    .search-wrap {
        padding: .12rem .32rem;
        background-color: #fafafa;
        div {
            background-color: #ededed;
            border-radius: .1rem;
            height: .7rem;
            line-height: .7rem;
            text-align: center;
            img {
                width: .4rem;
                vertical-align: middle;
            }
        }
    }
    .class-box-wrap {
        flex: 1;
        overflow: hidden;
    }
    .class-box {
        &.yd-scrolltab {
            position: relative;
            .yd-scrolltab-nav {
                width: 1.5rem;
                background-color: #fff;
                .yd-scrolltab-item {
                    padding: 0;
                    height: .8rem;
                    &.yd-scrolltab-active {
                        border-left: .04rem solid #c33;
                        font-weight: bold;
                        .yd-scrolltab-title {
                            color: #c33;
                        }
                    }
                }
            }
            .yd-scrolltab-content {
                -webkit-overflow-scrolling: touch;
                overflow-y: scroll;
                .yd-scrolltab-content-item {
                    margin-bottom: 1rem;
                    .yd-scrolltab-content-title {
                        display: none;
                    }
                    .top-banner {
                        width: 100%;
                        margin: .3rem auto .1rem;
                    }
                    h3 {
                        text-align: center;
                        background-color: #fff;
                        position: -webkit-sticky;
                        position: sticky;
                        top: 0;
                        left: 0;
                        padding: .2rem 0;
                    }
                    .sub-class {
                        min-height: 7rem;
                        overflow: hidden;
                        li {
                            float: left;
                            width: 33%;
                            text-align: center;
                            margin-top: .6rem;
                            img {
                                display: block;
                                margin: 0 auto .28rem;
                                width: 1.05rem;
                                height: 1.05rem;
                            }
                            
                        }
                    }
                }
            }
        }
    }
}
</style>