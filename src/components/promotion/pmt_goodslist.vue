<template>
    <div class="pmtgoodslist-page">
        <ComHeaderbar text="促销"></ComHeaderbar>
        <div class="main">
            <h2>{{$route.query.title}}</h2>
            <GoodsList :goodslist="pageData" :pushcart="true"></GoodsList>
        </div>
    </div>
</template>

<script>
import GoodsList from "../common/goodslist_component.vue"
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
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "activityDetail",
                id: this.$route.query.id
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
    components: {
        GoodsList
    }
}
</script>

<style lang="less">
.pmtgoodslist-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        h2 {
            background-color: #fff;
            text-align: center;
            padding: .4rem .2rem;
            font-size: .28rem;
            font-weight: normal;
        }
    }
}
</style>
