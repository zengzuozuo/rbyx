<template>
    <div class="manufacturer-page">
        <ComHeaderbar text="品牌制造商">
            <a href="javascript:;" class="other" @click="$router.push('findmanufacturer')">查找</a>
        </ComHeaderbar>
        <div class="main" ref="main">
            <ul>
                <li v-for="item in pageData" @click="$router.push('mftdetails?id=' + item.id)">
                    <ImgTag class="banner" :url="imgUrl + item.banner" />  
                    <div class="content-wrap">
                        <div class="ctn-top">
                            <h3>{{item.brand}}</h3>
                            <label>上新</label>
                            <span>{{item.desc}}</span>
                        </div>
                        <p>{{item.content}}</p>
                        <div class="imgbox">
                            <ImgTag v-for="subItem in item.goods" key="item" :url="imgUrl + subItem.pic" />
                        </div>
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
            pageData: []
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "brandList",
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }else {
                    this.$dialog.toast({mes: data.msg})
                }
            })
        }
    },
    activated() {
        const frompath = sessionStorage.getItem('frompath');
        if(frompath == "/mftdetails") {
            this.$refs.main.scrollTo(0,sessionStorage.getItem('scrollTop'))
        }
    },
    deactivated() {
        sessionStorage.setItem('scrollTop', this.$refs.main.scrollTop);
    }
}
</script>

<style lang="less">
.manufacturer-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: auto;
        ul {
            li {
                margin-bottom: .2rem;
                .banner {
                    display: block;
                    height: 3.3rem;
                    width: 100%;
                }
                .content-wrap {
                    position: relative;
                    padding: .3rem;
                    background-color: #fff;
                    &:after {
                        content: "";
                        position: absolute;
                        z-index: 99;
                        top: -0.3rem;
                        left: .66rem;
                        border: .15rem solid transparent;
                        border-bottom-color: #fff;
                    }
                    .ctn-top {
                        display: flex;
                        h3 {
                            flex: 1;
                        }
                        label {
                            color: #af996e;
                            border: 1px solid #af996e;
                            padding: .05rem .1rem;
                            margin-right: .1rem;
                            vertical-align: middle;
                            border-radius: .05rem;
                        }
                        span {
                            color: #c33;
                            font-weight: bold;
                            vertical-align: middle;
                        }
                    }
                    p {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        line-height: .5rem;
                    }
                    .imgbox {
                        display: flex;
                        justify-content: space-between;
                        padding-top: .3rem;
                        img {
                            width: 30%;
                            height: 2.7rem;
                        }
                    }
                }
            }
        }
    }
}
</style>

