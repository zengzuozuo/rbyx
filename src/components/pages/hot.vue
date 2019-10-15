<template>
    <div class="hot-page">
        <ComHeaderbar text="人气推荐"></ComHeaderbar>
        <div class="main" v-if="pageData">
            <ImgTag class="top-banner" :url="imgUrl + pageData.data.img" />
            <div class="nav">
                <a href="javascript:;" :class="{'active' : active == 1}" @click="getData(1)">编辑推荐</a>
                <a href="javascript:;" :class="{'active' : active == 2}" @click="getData(2)">24小时热销</a>
                <a href="javascript:;" :class="{'active' : active == 3}" @click="getData(3)">人气周榜</a>
                <a href="javascript:;" :class="{'active' : active == 4}" @click="getData(4)">热销总榜</a>
            </div>
            <GoodsList :goodslist="pageData.goods" />
        </div>
    </div>
</template>

<script>
import GoodsList from "../common/goodslist_component";
export default {
    data() {
        return {
            pageData: null,
            active: 1
        }
    },
    mounted() {
        this.getData(this.active);
    },
    methods: {
        getData(res) {
            this.active = res;
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "Popularity",
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.pageData = data;
                }else {
                    this.$dialog.toast({mes: data.msg})
                }
            })
        },
    },
    components: {
        GoodsList
    }
}
</script>

<style lang="less">
.hot-page {
    display: flex;
    flex-direction: column;
    .main {
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        background-color: #fff;
        .top-banner {
            display: block;
            width: 100%;
        }
        .nav {
            position: sticky;
            top: 0;
            left: 0;
            display: flex;
            background-color: #fff;
            border-bottom: 2px solid #f5f5f5;
            margin-bottom: .2rem;
            a {
                flex: 1;
                text-align: center;
                line-height: .8rem;
                font-size: .28rem;
                color: 000;
                &.active {
                    color: #c33;
                }
            }
        }
    }
}
</style>
