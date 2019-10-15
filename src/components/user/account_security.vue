<template>
    <div class="accountsecurity-page">
        <ComHeaderbar text="账号安全"></ComHeaderbar>
        <div class="main">
            <yd-cell-group>
                <yd-cell-item arrow type="a" href="#/setphone">
                    <span slot="left">修改手机号码</span>
                    <span slot="right">{{mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
                </yd-cell-item>
            </yd-cell-group>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mobile: ""
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            this.$http.post(this.apiUrl,{
                code: "getUserinfo"
            }).then((data) => {
                if(data.ztm == 1) {
                    this.mobile = data.data.mobile;   
                }
            })
        },
    }
}
</script>

<style lang="less">
.accountsecurity-page {
    display: flex;
    flex-direction: column;

    .main {
        flex: 1;
    }
}
</style>
