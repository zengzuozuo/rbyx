<template>
    <div class="gd-component">
        <!-- <h2>商品参数</h2>
        <ul class="parameters">
            <li v-for="item in 5">
                <label>适用环境</label>
                <p>家用</p>
            </li>
        </ul> -->
        <div>
            <div v-html="detailshtml"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["detailshtml"],
    mounted() {
        console.log(this.detailshtml)
    }
}
</script>

<style lang="less">
.gd-component {
    h2 {
        background-color: #fff;
        padding: .28rem .28rem 0;
        font-size: .3rem;
    }
    .parameters {
        background-color: #fff;
        padding: .28rem;
        li {
            display: flex;
            border-top: 1px dashed #8c8a89;
            line-height: .6rem;
            label {
                width: 1.68rem;
            }
            p {
                flex: 1;
            }
            &:last-child {
                border-bottom: 1px dashed #8c8a89;
            }
        }
    }
    img {
        width: 100%;
    }
}
</style>
