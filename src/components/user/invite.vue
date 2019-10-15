<template>
    <div class="invite-page">
        <ComHeaderbar text="我的邀请码"></ComHeaderbar>
        <div class="main">
            <h2>邀请好友得分红奖励，多邀多得！</h2>
            <div class="activity-rules">
                <a href="javascript:;">活动规则></a>
            </div>
            <div class="qrcode">
                <!-- <ImgTag url="static/images/qrcode.png" /> -->
                <div ref="qrcode"></div>
                <p>邀请好友扫描二维码，TA可获首单专属优惠 您可获订单实付金额的5%作为分红奖励</p>
            </div>
            <transition-group name="bounce">
                <ShareBox v-show="$store.state.shareIsShow" v-bind:key="1"></ShareBox>
            </transition-group>
        </div>
        <footer>
            <a href="javascript:;" @click="$store.state.shareIsShow = true">使用其他邀请方式></a>
        </footer>
    </div>
</template>

<script>
import ShareBox from "../common/share_component";
export default {
    data() {
        return {
            content: this.webh5 + "/share/re_download.html?uid=" + localStorage.getItem("uid"),
        }
    },
    mounted() {
        this.makeCode(this.content)
    },
    methods: {
        makeCode(content) {
            var qrcode = new QRCode(this.$refs.qrcode, {
                width : 200,//设置宽高
                height : 200
            });
            qrcode.makeCode(content);
        }
    }
}
</script>

<style lang="less">
.invite-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        h2 {
            text-align: center;
            margin-top: .5rem;
            font-size: .36rem;
        }
        .activity-rules {
            font-size: .28rem;
            text-align: center;
            padding: .26rem 0;
        }
        .qrcode {
            width: 80%;
            margin: .1rem auto;
            background-color: #fff;
            padding: .6rem;
            img {
                width: 100%;
            }
            p {
                margin-top: .2rem;
                font-size: .25rem;
                text-align: center;
                line-height: .33rem;
            }
        }
    }
    footer {
        text-align: center;
        a {
            display: block;
            padding: .5rem 0;
            font-size: .28rem;
        }
    }
}
</style>
