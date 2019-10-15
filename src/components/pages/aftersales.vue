<template>
    <div class="aftersales-page">
        <ComHeaderbar text="售后服务"></ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item arrow @click.native="$router.push('tuihuo')">
                    <img slot="icon" style="vertical-align: middle" src="../../assets/images/icon/tui_icon.png" />
                    <span slot="left">申请退货/退款</span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('huanhuo')">
                    <img slot="icon" style="vertical-align: middle" src="../../assets/images/icon/huan_icon.png" />
                    <span slot="left">申请换货</span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('invoiceservice')">
                    <img slot="icon" style="vertical-align: middle" src="../../assets/images/icon/invoice_icon.png" />
                    <span slot="left">发票服务</span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="$router.push('shouhoujilu')">
                    <img slot="icon" style="vertical-align: middle" src="../../assets/images/icon/record_icon.png" />
                    <span slot="left">售后记录</span>
                </yd-cell-item>
                <yd-cell-item arrow @click.native="tel">
                    <img slot="icon" style="vertical-align: middle" src="../../assets/images/icon/service_icon.png" />
                    <span slot="right">{{telNumber}}</span>
                    <span slot="left">联系客服</span>
                </yd-cell-item>
            </yd-cell-group>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            telNumber: localStorage.getItem("tel")
        }
    },
    methods: {
        tel() {
            location.href = "tel:" + localStorage.getItem("tel");
        }
    }
} 
</script>


<style lang="less">
.aftersales-page {
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