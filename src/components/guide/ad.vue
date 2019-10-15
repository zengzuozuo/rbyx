<template>
    <div class="ad-page">
        <div class="img-wrap">
            <div class="img-flex">
                <div v-if="pageData">
                    <img class="ad-img" :src="imgUrl + pageData.pic" @click="$store.commit('openUrl',pageData.url)">                
                </div>
            </div>
            <img class="ad-btm" src="static/images/ad_btm.png" alt="">
        </div>
        <a class="skip" href="javascript:;" @click="skip">跳过</a>
    </div>
</template>

<script>
export default {
    data() {
        return {
          timer: null,
          pageData: null  
        }
    },
    mounted() {
        this.timer = setTimeout(() => {
            this.$router.replace('home');

        },5000)
        this.getData();

        sessionStorage.setItem("MYAD", "true");
    },
    methods: {
        skip() {
            clearTimeout(this.timer);
            this.$router.replace('home');
        },
        getData() {
            this.$http.post(this.shareApiUrl,{
                code: "openAppImg"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                    localStorage.setItem("tel",data.tel);
                }
            })
        }
    }
}
</script>

<style lang="less">
.ad-page {
    position: relative;
    overflow: hidden;
    height: 100%;
    .img-wrap {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .img-flex {
            flex: 1;
            overflow: hidden;
            div {
                height: 100%;
                overflow: hidden;
            }
            .ad-img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        
        .ad-btm {
            width: 100%;
        }
    }
    .skip {
        position: absolute;
        top: .3rem;
        right: .3rem;
        border: 1px solid #fff;
        width: .8rem;
        height: .8rem;
        text-align: center;
        line-height: .8rem;
        border-radius: 50%;
        color: #000;
        font-size: .28rem;
        background-color: rgba(255,255,255,.8);
        font-weight: bold;
    }
}
</style>