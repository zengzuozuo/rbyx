<template>
    <div class="logistics-page">
        <ComHeaderbar text="物流信息" />
        <div class="main">
            <ul v-if="pageData">
                <li>
                    <div class="content">
                        <div class="img-wrap">
                            <img src="../../assets/images/icon/wlcart.png" alt="">
                            <div>
                                <h3>物流公司：{{pageData.kdname}}</h3>
                                <h4>物流单号：{{pageData.number}}</h4>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <yd-timeline v-if="pageData">
                <yd-timeline-item v-for="item,index in pageData.data" :key="index">
                    <p>{{item.AcceptStation}}</p>
                    <p style="margin-top: 10px;">{{item.AcceptTime}}</p>
                </yd-timeline-item>
            </yd-timeline>
            <div class="empty" v-if="pageData">
                <div v-show="pageData.data == 0">
                    <img src="../../assets/images/icon/empty_dindan.png" />
                    <span>暂无物流信息</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
.logistics-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: scroll;
        ul {
            li {
                border-left: .2rem solid #fff;
                background-color: #fff;
                .ct-top {
                    display: flex;
                    border-bottom: 1px solid #d5d5d5;
                    p {
                        flex: 1;
                        
                        font-size: .28rem;
                        line-height: .88rem;
                        text-align: left;
                        padding-right: .2rem;
                    }
                    .icon {
                        width: .88rem;
                        height: .88rem;
                        background: url("../../assets/images/icon/delete_icon.png") no-repeat center;
                        background-size: 40%;
                    }
                }
                .content {
                    padding-right: .2rem;
                    border-bottom: 1px solid #d5d5d5;
                    .img-wrap {
                        display: flex;
                        align-items: center;
                        img {
                            width: 1rem;
                            height: 1rem;
                            margin: .2rem .2rem .2rem 0;
                        }
                        div {
                            flex: 1;
                            font-size: .25rem;
                            overflow: hidden; 
                            h3 {
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden; 
                            }
                            h4 {
                                font-weight: normal;
                                padding-top: .1rem;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }
                        }
                    }
                    span {
                        color: #c33;
                    }
                }
                .btn-wrap {
                    padding: .2rem;
                    a {
                        float: right;    
                        padding: .1rem .2rem;
                        border: 1px solid #999;
                        margin: 0 .1rem;
                        border-radius: .05rem;
                    }
                }
            }
        }
        .empty {
            text-align: center;
            img {
                display: block;
                margin: 2rem auto .2rem;
                width: 3rem;
            }
            span {
                display: inline-block;
                font-size: .3rem;
                color: #999;
            }
        }
    }
}
</style>


<script>
export default {
    data() {
        return {
            pageData: null
        }
    },
    mounted() {
        this.getkuaid();
    },
    methods: {
        getkuaid() {
            console.log({
                code: "getkuaid",
                ordersn: this.$route.query.oid,
                type: this.$route.query.type || 0
            })
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,{
                code: "getkuaid",
                ordersn: this.$route.query.oid,
                type: this.$route.query.type || 0
            }).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    data.data = data.data.reverse();
                    this.pageData = data;
                }else {
                    
                }
            })
        }
    }
}
</script>
