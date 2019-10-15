<template>
    <div class="about-page">
        <ComHeaderbar text="关于我们"></ComHeaderbar>
        <div class="main">
            <ImgTag class="applogo" url="static/images/store_logo.png" />
            <p v-show="version" class="version-number">版本号：{{version}}</p>
        </div>
        <footer>
            <a href="javascript:;">隐私声明</a>
            <p>融博汇通版权所有©</p>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            version: ""
        }
    },
    mounted() {
        try {
            this.version = plus.runtime.version;
        } catch (error) {
            this.version = "";
        }
        
    }
}
</script>

<style lang="less">
.about-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow: hidden;
        .applogo {
            display: block;
            margin: 2rem auto 0;
            width: 2.2rem;
            height: 2.2rem;
        }
        .version-number {
            font-size: .28rem;
            color: #777;
            text-align: center;
            line-height: .6rem;
        }
    }
    footer {
        text-align: center;
        color: #999;
        a {
            display: inline-block;
            padding: .1rem .4rem;
            border: 1px solid #999;
            margin-bottom: .4rem;
        }
        p {
            line-height: .6rem;
            font-size: .28rem;
        }
    }
}
</style>
