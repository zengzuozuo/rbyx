<template>
  <div class="message-center-page">
        <ComHeaderbar text="消息中心"></ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item arrow @click.native="tel">
                    <img slot="icon" src="../../assets/images/icon/service_icon.png">
                    <span slot="left">联系客服</span>
                    <span slot="right"></span>
                </yd-cell-item>

                <yd-cell-item arrow @click.native="$router.push('myproperty')">
                    <img slot="icon" src="../../assets/images/icon/sh_icon.png">
                    <span slot="left">我的资产</span>
                    <span slot="right"></span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('activitylist')">
                    <img slot="icon" src="../../assets/images/icon/star_icon_black.png">
                    <span slot="left">热门活动</span>
                    <span slot="right"></span>
                </yd-cell-item>

                <yd-cell-item arrow>
                    <img slot="icon" src="../../assets/images/icon/yfh_icon.png">
                    <span slot="left">物流助手</span>
                    <span slot="right"></span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('systeminfo')">
                    <img slot="icon" src="../../assets/images/icon/message_icon.png">
                    <span slot="left">通知消息</span>
                    <span slot="right"></span>
                </yd-cell-item>
            </yd-cell-group>
        </div>
  </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        tel() {
            location.href = "tel:" + localStorage.getItem("tel");
        }
    }
}
</script>

<style lang="less">
.message-center-page {
    display: flex;
    flex-direction: column;

    .main {
        flex: 1;
        .yd-cell-box {

            margin-top: .2rem;
        }
    }
}
</style>

