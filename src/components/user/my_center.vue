<template>
    <div class="mycenter-page">
        <ComHeaderbar text="个人中心"></ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item arrow type="a" href="#/myinfo">
                    <span slot="left">个人信息</span>
                    <ImgTag class="userlogo" :url="appImgUrl + userAvatar" slot="right" />
                </yd-cell-item>
                <yd-cell-item arrow type="a" href="#/accountsecurity">
                    <span slot="left">账号安全</span>
                    <span slot="right"></span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('vipclub')">
                    <span slot="left">会员俱乐部</span>
                    <!-- <span slot="right">V1会员</span> -->
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('integral')">
                    <span slot="left">积分中心</span>
                    <span slot="right"></span>
                </yd-cell-item>
                <!-- <yd-cell-item arrow @click.native="$router.push('undergraduate')">
                    <span slot="left">在校大学生认证</span>
                    <span slot="right">未认证</span>
                </yd-cell-item> -->
            </yd-cell-group>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userAvatar: localStorage.getItem('userAvatar') || ""
        }
    }
}
</script>

<style lang="less">
.mycenter-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .yd-cell-box {
            margin-top: .2rem;
            .userlogo {
                width: .6rem;
                height: .6rem;
                border-radius: 50%;
            }
        }
    }
}
</style>

