<template>
    <div class="like-component">
        <h2>猜你喜欢</h2>
        <GoodsList :goodslist="pageData"></GoodsList>
    </div>
</template>

<script>
import GoodsList from "./goodslist_component.vue"
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
            this.$http.post(this.apiUrl,{
                code: "getGuessYouLike"
            }).then((data) => {
                if(data.ztm == 1) {
                    this.pageData = data.data;
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
.like-component {
    background-color: #fff;
    margin-top: .2rem;
    overflow: hidden;
    h2 {
        font-size: .3rem;
        color: #000;
        padding: .38rem 0;
        text-align: center;
    }
}
</style>