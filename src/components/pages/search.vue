<template>
    <div class="search-page">
        <header>
            <a class="back-arrow" href="javascript:;" @click="$router.goBack(-1)"></a>
            <yd-search class="search-box" v-model="value1" :on-submit="submitHandler"></yd-search>
        </header>
        <div class="main">
            <div class="history" v-show="historyArr.length != 0 && goodsList.length == 0" key="1">
                <div class="ctn-top">
                    <span>历史记录</span>
                    <i class="icon" @click="removeHistory"></i>
                </div>
                <ul>
                    <li v-for="item in historyArr" @click="search(item)">{{item}}</li>
                </ul>
            </div>
            <div class="hot-search" v-show="goodsList.length == 0 && hotSearch.length != 0">
                <div class="ctn-top">
                    <span>热门搜索</span>
                </div>
                <ul>
                    <li v-for="item in hotSearch" @click="search(item.title)">{{item.title}}</li>
                </ul>
            </div>
            <div class="filtrate" v-show="goodsList.length != 0">
                <a href="javascript:;" :class="{'active' : active == 'dcd'}" @click="bubbleSort('dcd')">价格由高到低</a>
                <a href="javascript:;" :class="{'active' : active == 'acd'}" @click="bubbleSort('acd')">价格由低到高</a>
            </div>
            <GoodsList :goodslist="goodsList" />
        </div>
    </div>
</template>

<script type="text/babel">
import GoodsList from "../common/goodslist_component";
export default {
    data() {
        return {
            value1: '',
            historyArr: JSON.parse(localStorage.getItem("historySearchData")) || [],  //历史搜索数据
            goodsList: [],
            active: "",
            hotSearch: []
        }
    },
    mounted() {
    },
    methods: {
        submitHandler(text) {
            if(text.trim() == "") {
                return;
            }
            this.search(text);
            var s = true;
            this.historyArr.forEach(function(value,index) {
                if(text == value) {
                    s = false;
                }
            }, this);
            if(s) {
                this.historyArr.push(text);
                localStorage.setItem("historySearchData",JSON.stringify(this.historyArr));
            }
        },
        removeHistory() {
            this.historyArr = [];
            localStorage.setItem("historySearchData",JSON.stringify(this.historyArr));
        },
        search(text) {
            if(text.trim() == "") {
                return;
            }
            this.$store.commit('openWait');
            this.$http.post(this.apiUrl,{
                code: "search",
                title: text
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.goodsList = data.goods;
                }else {
                    this.goodsList = [];
                }
            })
        },
        bubbleSort(type) {
            var len = this.goodsList.length;
            var data = this.goodsList;
            for(var i = 0; i < len; i++) {
                for(var j = 0; j < len - i - 1; j++) {
                    if(data[j].minprice > data[j + 1].minprice) {
                        var cache = data[j + 1];
                        data.splice(j + 1, 1, data[j]);
                        data.splice(j, 1, cache);
                    }
                }
            }
            if(type == "dcd") {
                data.reverse();
                this.active = "dcd";
            }else {
                this.active = "acd";
            }
            this.goodsList = data;
        },
        getData() {
            this.$http.post(this.apiUrl,{
                code: "hotSearch"
            }).then((data) => {
                if(data.ztm == 1) {
                    this.hotSearch = data.data;
                }
            }) 
        }
    },
    activated() {
        if(sessionStorage.getItem('frompath') != "/goodsdetails") {
            this.goodsList = [];
            this.getData();
        }
    },
    components: {
        GoodsList
    }
}
</script>

<style lang="less">
.search-page {
    display: flex;
    flex-direction: column;
    header {
        display: flex;
        background-color: #fafafa;
        padding: .1rem 0;
        border-bottom: 1px solid #e5e5e5;
        .search-box {
            flex: 1;
            .yd-search-input {
                background-color: #fafafa;
                padding: 0;
                &:after {
                    border: none;
                }
                &:before {
                    border: none;
                }
                .search-input {
                    background-color: #ededed;
                    height: .66rem;
                    
                }
            }
        }
        .back-arrow {
            padding: 0 .3rem;
            line-height: .66rem;
            font-size: .3rem;
            background: url("../../assets/images/icon/arrow_back_black.png") no-repeat center;
            background-size: 70%;
            margin: 0 .1rem;
        }
    }
    .main {
        position: relative;
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        background-color: #fff;
        .history {
            padding: .2rem .3rem;
            background-color: #fff;
            .ctn-top {
                display: flex;
                padding: .2rem 0;
                span {
                    flex: 1;
                    font-size: .26rem;
                }
                i {
                    width: .35rem;
                    height: .35rem;
                    background: url("../../assets/images/icon/delete_icon.png") no-repeat center;
                    background-size: cover;
                }
            }
            ul {
                overflow: hidden;
                li {
                    float: left;
                    border: 1px solid #666;
                    padding: .08rem .15rem;
                    margin-right: .22rem;
                    margin-top: .12rem;
                    border-radius: .05rem;
                }
            }
        }
        .hot-search {
            padding: .2rem .3rem;
            background-color: #fff;
            margin-top: .2rem;
            .ctn-top {
                display: flex;
                padding: .2rem 0;
                span {
                    flex: 1;
                    font-size: .26rem;
                }
            }
            ul {
                overflow: hidden;
                li {
                    float: left;
                    border: 1px solid #666;
                    padding: .08rem .15rem;
                    margin-right: .22rem;
                    margin-top: .12rem;
                    border-radius: .05rem;
                }
            }
        }
        .filtrate {
            position: sticky;
            left: 0;
            top: 0;
            display: flex;
            line-height: .8rem;
            background-color: #fff;
            text-align: center;
            border-bottom: 1px solid #f5f5f5;
            font-size: .26rem;
            a {
                flex: 1;
                &:first-child {
                    border-right: 1px solid #f5f5f5;
                }
                &.active {
                    color: #c33;
                }
            }
        }
    }
}
</style>