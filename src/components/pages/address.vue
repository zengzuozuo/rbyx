<template>
    <div class="address-page">
        <ComHeaderbar text="地址管理"></ComHeaderbar>
        <div class="main">
            <ul>
                <li v-for="item in pageData" @click="selectAddress(item)">
                    <div class="ctn-left">
                        <span>{{ item.realname }}</span>
                        <a href="javascript:;" v-if="item.sign == 1">默认</a>
                    </div>
                    <div class="ctn-center">
                        <p class="phone">{{ item.mobile }}</p>
                        <p class="useraddress">{{ item.region }}{{ item.address }}</p>
                    </div>
                    <div class="ctn-right" @click="compile(item)">
                        <img src="../../assets/images/icon/compile_icon.png" />
                    </div>
                </li>
            </ul>
        </div>
        <footer>
            <a href="#/newaddress">+新建地址</a>
        </footer>
    </div>
</template>

<script>
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
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getUserAddressList"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }
            })
        },
        selectAddress(data) {
            if(this.$route.query.back) {
                this.$store.commit("setShopingCart",{data: "",address: data});
                this.$router.goBack(-1);
            }
            if(this.$route.query.invoice) {
                sessionStorage.setItem("invoiceAddress", JSON.stringify(data));
                this.$router.goBack(-1);
            }
            
        },
        compile(item) {
            event.cancelBubble = true;
            this.$router.push({path: 'newaddress',query: {data: JSON.stringify(item)}})
        }
    }
}
</script>

<style lang="less">
.address-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: auto;
        ul {    
            background: url("../../assets/images/icon/address_strip_icon.png") repeat-x left top;
            background-size: auto .1rem;
            padding-top: .1rem;
            li {
                display: flex;
                align-items: center;
                background-color: #fff;
                padding: .2rem;
                font-size: .3rem;
                border-bottom: 1px solid #d5d5d5;
                .ctn-left {
                    width: 1.8rem;
                    padding-right: .2rem;
                    span {
                        display: block;
                    }
                    a {
                        display: inline-block;
                        border: 1px solid #c33;
                        padding: .02rem .1rem;
                        border-radius: .05rem;
                        color: #c33;
                        font-size: .2rem;
                    }

                }
                .ctn-center {
                    flex: 1;
                    padding-right: .2rem;
                    .useraddress {
                        font-size: .28rem;
                        color: #999;
                    }
                }
                .ctn-right {
                    img {
                        width: .45rem;
                        height: .45rem;
                    }
                }
            }
        }
    }
    footer {
        padding: .2rem;
        a {
            display: block;
            border: 1px solid #c33;
            text-align: center;
            padding: .2rem 0;
            color: #c33;
        }
    }
}
</style>