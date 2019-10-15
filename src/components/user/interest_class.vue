<template>
    <div class="interestclass-page">
        <ComHeaderbar text="选择感兴趣的分类"></ComHeaderbar>
        <div class="main">
            <p class="tip">多选几个，我们会推荐得更准确哦！</p>
            <ul>
                <li v-for="item in pageData" @click="item.sign = !item.sign">
                    <div class="active" v-show="item.sign"></div>
                    <ImgTag :url="imgUrl + item.pic" />
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <footer>
            <a href="javascript:;" @click="subMit">提交</a>
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
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "interestedType"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }
            })
        },
        subMit() {  //提交
            this.$store.commit('openWait');
            var arr = [];
            this.pageData.forEach((value,index) => {
                if(value.sign) {
                    arr.push(value.id);
                }
            })
            this.$http.post(this.apiUrl,{
                code: "userInterested",
                sid: arr.join(",")
            }).then((data) => {
                console.log(data);
                this.$dialog.toast({mes: data.msg});
            })
        }
    }
}
</script>

<style lang="less">
.interestclass-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        background-color: #fff;
        .tip {
            line-height: 1rem;
            text-align: center;
            font-size: .3rem;
        }
        ul {
            overflow: hidden;
            li {
                position: relative;
                float: left;
                width: 30%;
                margin-left: 2.5%;
                margin-bottom: .2rem;
                img {
                    display: block;
                    width: 100%;
                    height: 2rem;
                }
                span {
                    display: block;
                    text-align: center;
                    font-size: .28rem;
                    line-height: .5rem;
                }
                .active {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2rem;
                    background: rgba(000, 000, 000, .3) url("../../assets/images/icon/selected_icon.png") no-repeat center;
                    background-size: 30%;
                }
            }
        }
    }
    footer {
        a {
            display: block;
            line-height: .9rem;
            background-color: #c33;
            color: #fff;
            font-size: .3rem;
            text-align: center;
        }
    }
}
</style>
