<template>
    <div class="com-headerbar">
        <h2>{{ text }}</h2>
        <a class="back" href="javascript:;" v-show="backarrow" @click="goBack">
            <img src="../../assets/images/icon/arrow_back_black.png">
        </a>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        text: {  // 必须提供字段
            default: "详情"
        },
        backarrow: {   // 可选字段，有默认值
            default: true
        }
    },
    methods: {
        goBack() {
            this.$router.goBack(-1);
        }
    },
    
}
</script>

<style lang="less">
.com-headerbar {
    position: relative;
    z-index: 121214;
    width: 100%;
    height: 0.9rem;
    background-color: #fafafa;
    h2 {
        line-height: 0.88rem;
        text-align: center;
        font-size: 0.3rem;
        color: #000;
        border-bottom: 1px solid #d5d5d5;
    }
    .back {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 1rem;
        img {
            display: block;
            margin: 0.25rem 0.3rem;
            width: 0.4rem;
            height: 0.4rem;
        }
    }
    .other {
        position: absolute;
        right: 0;
        top: 0;
        height: .9rem;
        line-height: .9rem;
        width: 1rem;
        font-size: 0.3rem;
        color: #000;
        font-weight: bold;
        img {
            width: .4rem;
            height: .4rem;
            margin: .25rem;
        }
    }
}
</style>