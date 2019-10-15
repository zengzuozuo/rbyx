<template>
    <div class="similar-page">
        <ComHeaderbar text="找相似"></ComHeaderbar>
        <div class="main">
            <div class="select-goods" v-if="pageData">
                <ImgTag :url="imgUrl + pageData.data.pic"/>
                <div class="goods-info">
                    <h4 class="goodsname">{{pageData.data.title}}</h4>
                    <p>{{pageData.data.desc}}</p>
                    <div class="price">
                        <span>¥{{pageData.data.price}}</span>
                    </div>
                </div>
            </div>
            <div class="mimilar-goods" v-if="pageData">
                <h2>相似商品</h2>
                <GoodsList :goodslist="pageData.goods"></GoodsList>
            </div>
        </div>
    </div>
</template>

<script>
import GoodsList from "../common/goodslist_component";
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
            this.$http.post(this.apiUrl,{
                code: "findSimilar",
                goodsid: this.$route.query.id,
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data;
                }
            })
        }
    },
    components: {
        GoodsList
    }
}
</script>

<style lang="less">
.similar-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: auto;
        .select-goods {
            display: flex;
            padding: .2rem .3rem;
            background-color: #fff;
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
        .mimilar-goods {
            background-color: #fff;
            margin-top: .2rem;
            h2 {
                text-align: center;
                line-height: 1rem;
                font-size: .3rem;
            }
        }
    }
}
</style>
