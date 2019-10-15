<template>
    <div class="classgoods-component" ref="classgoodscomponent">
        <yd-pullrefresh class="scroll-wrap" :callback="getData" ref="pullrefresh">
            <div class="swiper-container" ref="classgoodsswiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" @click="bannerGo(item)" v-for="item in sizerData.banner">
                        <ImgTag :url="imgUrl + item.pic" />
                    </div>
                </div>
            </div>
            <div class="console-wrap" ref="console">
                <div class="console" v-show="!consoleIsShow">
                    <a href="javascript:;" :class="{'active' : filterNum == 1}" @click="consoleClick('synthesize')"><span>综合</span></a>
                    <a href="javascript:;" class="price" :class="{'active-acd' : filterNum == 2,'active-dcd' : filterNum == 3}" @click="consoleClick('price')"><span>价格</span><i></i></a>
                    <a href="javascript:;" class="new" :class="{'active-acd' : filterNum == 4,'active-dcd' : filterNum == 5}" @click="consoleClick('new')"><span>上新</span><i></i></a>
                    <a href="javascript:;" class="sizer" :class="{'active' : isSizer}" @click="consoleClick('sizer')"><span>筛选</span><i></i></a>
                </div>
            </div>
            <div v-if="goodslist.length == 0">
                <div class="sub-class-list" v-for="item in pageData">
                    <h2 class="class-name">{{item.name}}</h2>
                    <p class="class-phrase">{{item.typedesc}}</p>
                    <GoodsList :goodslist="item.goods" />
                </div>
            </div>
            <div v-if="goodslist.length != 0">
                <div class="sub-class-list">
                    <GoodsList :goodslist="goodslist" />
                </div>
            </div>
            <GoodsList v-if="isEmpty" :goodslist="goodslist" />
        </yd-pullrefresh>
        <div class="console1" v-show="consoleIsShow">
            <a href="javascript:;" :class="{'active' : filterNum == 1}" @click="consoleClick('synthesize')"><span>综合</span></a>
            <a href="javascript:;" class="price" :class="{'active-acd' : filterNum == 2,'active-dcd' : filterNum == 3}" @click="consoleClick('price')"><span>价格</span><i></i></a>
            <a href="javascript:;" class="new" :class="{'active-acd' : filterNum == 4,'active-dcd' : filterNum == 5}" @click="consoleClick('new')"><span>上新</span><i></i></a>
            <a href="javascript:;" class="sizer" :class="{'active' : isSizer}" @click="consoleClick('sizer')"><span>筛选</span><i></i></a>
        </div>
        <yd-popup class="sizerbox" v-model="$store.state.popupIsShow" position="right">
            <div class="popuptop" v-if="sizerData">
                <div class="content price-section">
                    <h3>价格区间</h3>
                    <input type="number" v-model="price1" placeholder="最低价"> --
                    <input type="number" v-model="price2" placeholder="最高价">
                </div>
                <div class="content classify">
                    <h3>分类</h3>
                    <ul>
                        <li :class="{'active': item.active}" v-for="item in sizerData.data" @click="selectClass(item)">{{item.name}}</li>
                    </ul>
                </div>
                <div class="content manufacturer">
                    <h3>制造商</h3>
                    <ul>
                        <li :class="{'active': item.active}" v-for="item in sizerData.brand" @click="selectBrand(item)">{{item.brand}}</li>
                    </ul>
                </div>
            </div>
            <div class="popupbtm">
                <a href="javascript:;" @click="reset">重置</a>
                <a href="javascript:;" @click="getData(filterNum)">确定</a>
            </div>
        </yd-popup>
    </div>
</template>

<script>
/**  筛选
 * 1: 综合 
 * 2: 价格低到高
 * 3：价格高到低
 * 4：上新低到高
 * 5：上新高到低
*/
/** banner跳转类型   type
 *  1: url
 *  2: 商品
 */
import GoodsList from "../../common/goodslist_component";
export default {
    props: ["tipid",'selfindex','activeindex'],
    data() {
        return {
            mySwiper: null,
            myScroll: null,
            consoleIsShow: false,
            consoleState: 0,
            pageData: null,
            filterNum: 1,   //筛选
            goodslist: [],  //商品列表
            sizerData: {
                banner: []
            },  
            level2: [],  //二级分类
            brandid: [],  //品牌制造商id
            price1: "",  //最低价格
            price2: "", //最高价格
            isEmpty: true,
            isSizer: false,  //是否有筛选条件
            scrollTop: 0,  //滚动高度
        }
    },
    updated() {
        // 判断是否有筛选条件存在
        if(this.level2.length == 0 && this.brandid.length == 0 && this.price1 == "" && this.price2 == "") {
            this.isSizer = false;
        }else {
            this.isSizer = true;
        }
    },
    watch: {
        activeindex(val,oldval) {
            if(this.selfindex == val && !this.pageData) {
                this.getData(this.filterNum);
                this.getLevel2Data();
            }
        }
    },
    mounted() {
        var that = this;
        var dom = this.$refs.classgoodsswiper;
        this.mySwiper = new Swiper(dom, {
            autoplay: 5000,//可选选项，自动滑动
        }) 

        var ot = this.$refs.console.offsetTop;
        this.$refs.pullrefresh.$el.addEventListener("scroll", function() {
            that.scrollTop = this.scrollTop;
            if(this.scrollTop >= ot) {
                that.consoleIsShow = true;
            }else {
                that.consoleIsShow = false;
            }
        })
        
    },
    methods: {
        consoleClick(type) {
            switch(type) {
                case "sizer":
                    this.$store.state.popupIsShow = true;
                    break;
                case "price":
                    this.filterNum = this.filterNum == 2 ? 3 : 2;
                    this.getData(this.filterNum);
                    break;
                case "new":
                    this.filterNum = this.filterNum == 4 ? 5 : 4;
                    this.getData(this.filterNum);
                    break;
                case "synthesize":
                    this.filterNum = 1;
                    this.getData(this.filterNum);
                    break;
            }
        },
        getData() {
            this.$store.state.popupIsShow = false;
            this.$store.commit("openWait");
            if(this.price1 > this.price2) {  //规范价格搜索
                var p = this.price2;
                this.price2 = this.price1;
                this.price1 = p;
            }
            this.$http.post(this.apiUrl,{
                code: "getcategoryDetail",
                typeid: this.tipid,
                filter: this.filterNum,
                level2: this.level2.join(','),
                brandid: this.brandid.join(','),
                price1: this.price1,
                price2: this.price2
            }).then((data) => {
                this.$refs.pullrefresh.$emit('ydui.pullrefresh.finishLoad');
                if(data.ztm == 1) {
                    this.isEmpty = false;  //商品不为空
                    this.pageData = data.category.level2data || [];
                    this.goodslist = data.goods;
                }else {
                    this.isEmpty = true;  //无任何商品
                    this.pageData = [];
                    this.goodslist = [];
                }
                setTimeout(() => {
                    this.mySwiper.update();
                },300)
            }).catch(() => {
                this.$refs.pullrefresh.$emit('ydui.pullrefresh.finishLoad');
            })
        },
        getLevel2Data() {   //获取筛选条件
            this.$http.post(this.apiUrl,{
                code: "getLevel2Data",
                typeid: this.tipid
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.sizerData = data;
                    setTimeout(() => {
                        this.mySwiper.update();
                    },300)
                }
            })
        },
        selectClass(item) {
            var s = true;
            this.level2.forEach((value,index) => {
                if(value == item.id) {
                    s = false;
                    item.active = !item.active;
                    this.level2.splice(index,1);
                }
            })
            if(s) {
                if(this.level2.length < 5) {
                    this.level2.push(item.id);
                    item.active = !item.active;
                }else {
                    this.$dialog.toast({mes: "最多选择5个"})
                }
            }
        },
        selectBrand(item) {
            var s = true;
            this.brandid.forEach((value,index) => {
                if(value == item.id) {
                    s = false;
                    item.active = !item.active;
                    this.brandid.splice(index,1);
                }
            })
            if(s) {
                if(this.brandid.length < 5) {
                    this.brandid.push(item.id);
                    item.active = !item.active;
                }else {
                    this.$dialog.toast({mes: "最多选择5个"})
                }
            }
        },
        reset() {  //重置
            this.level2 = [];  //二级分类
            this.brandid = [];  //品牌制造商id
            this.price1 = "";  //最低价格
            this.price2 = ""; //最高价格
            this.getLevel2Data();
        },
        bannerGo(item) {  //广告图跳转
            console.log(item)
            switch(item.type) {
                case 1:  //网址型
                    this.$store.commit("openUrl", item.url);
                    break;
                case 2:  //商品型
                    this.$router.push('goodsdetails?id=' + item.goodsid);
                    break;
                default:
            }
        }
    },
    activated() {
        this.$refs.pullrefresh.$el.scrollTop = this.scrollTop;
        setTimeout(() => {
            this.mySwiper.update();
        },300)
        this.$store.commit("showUrl");  //恢复显示webview
    },
    components: {
        GoodsList
    }
}
</script>

<style lang="less">
.classgoods-component {
    height: 100%;
    overflow: hidden;
    position: relative;
    .console1 {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        width: 100%;
        height: .8rem;
        line-height: .8rem;
        background-color: #fff;
        border-bottom: 1px solid #d9d9d9;
        a {
            flex: 1;
            font-size: .26rem;
            &.price {
                &.active-acd {
                    color: #c33;
                    i {
                        background-image: url("../../../assets/images/icon/ascending_sort_icon.png");
                    }
                }
                &.active-dcd {
                    color: #c33;
                    i {
                        background-image: url("../../../assets/images/icon/descending_sort_icon.png");
                    }
                }
                i {
                    height: .28rem;
                    width: .28rem;
                    display: inline-block;
                    background: url("../../../assets/images/icon/sort_icon.png") no-repeat center;
                    background-size: cover;
                    vertical-align: middle;
                }
            }
            &.new {
                &.active-acd {
                    color: #c33;
                    i {
                        background-image: url("../../../assets/images/icon/ascending_sort_icon.png");
                    }
                }
                &.active-dcd {
                    color: #c33;
                    i {
                        background-image: url("../../../assets/images/icon/descending_sort_icon.png");
                    }
                }
                i {
                    height: .28rem;
                    width: .28rem;
                    display: inline-block;
                    background: url("../../../assets/images/icon/sort_icon.png") no-repeat center;
                    background-size: cover;
                    vertical-align: middle;
                }
            }
            &.active {
                span {
                    color: #c33;
                }
            }
            &.sizer {
                &.active {
                    span {
                        color: #c33;
                    }
                    i {
                        background-image: url("../../../assets/images/icon/sizer_icon_red.png");
                    }
                }
                i {
                    height: .28rem;
                    width: .28rem;
                    display: inline-block;
                    background: url("../../../assets/images/icon/sizer_icon_gray.png") no-repeat center;
                    background-size: cover;
                    vertical-align: middle;
                }
            }
            span {
                vertical-align: middle;
            }
        }
    }
    .scroll-wrap {
        height: 100%;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
    }
    .sizerbox {
        .yd-mask {
            position: absolute;
        }
        .yd-popup {
            position: absolute;
            width: 75% !important;
            .yd-popup-content {
                &>div {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    .popuptop {
                        flex: 1;
                        padding: .2rem;
                        overflow-y: auto;
                    }
                    .popupbtm {
                        display: flex;
                        border-top: 1px solid #d9d9d9;
                        a {
                            flex: 1;
                            line-height: 1rem;
                            font-size: .26rem;
                            font-weight: bold;
                            &:nth-child(2) {
                                background-color: #c33;
                                color: #fff;
                            }
                        }
                    }
                }
            }
            .content {
                h3 {
                    font-size: .26rem;
                    line-height: .6rem;
                    text-align: left;
                }
                ul {
                    overflow: hidden;
                    li {
                        float: left;
                        width: 30%;
                        border: 1px solid #969696;
                        line-height: .54rem;
                        border-radius: 0.1rem;
                        margin-bottom: .2rem;
                        &.active {
                            color: #c33;
                            border-color: #c33;
                        }
                    }
                }
            }
            .price-section {
                input {
                    width: 2.4rem;
                    height: .6rem;
                    border: 1px solid #969696;
                    text-align: center;
                    border-radius: 0.1rem;
                }
            }
            .classify {
                ul {
                    li {
                        width: 30%;
                        margin-left: 3%;
                    }
                }
            }
            .manufacturer {
                ul {
                    li {
                        width: 45%;
                        margin-left: 3%;
                    }
                }
            }
        }
    }
    .swiper-container {
        height: 4.2rem;
        .swiper-wrapper {
            .swiper-slide {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .console-wrap {
        position: relative;
        min-height: .81rem;
        .console {
            position: relative;
            left: 0;
            top: 0;
            display: flex;
            width: 100%;
            height: .8rem;
            line-height: .8rem;
            background-color: #fff;
            border-bottom: 1px solid #d9d9d9;
            a {
                flex: 1;
                font-size: .26rem;
                &.price {
                    &.active-acd {
                        color: #c33;
                        i {
                            background-image: url("../../../assets/images/icon/ascending_sort_icon.png");
                        }
                    }
                    &.active-dcd {
                        color: #c33;
                        i {
                            background-image: url("../../../assets/images/icon/descending_sort_icon.png");
                        }
                    }
                    i {
                        height: .28rem;
                        width: .28rem;
                        display: inline-block;
                        background: url("../../../assets/images/icon/sort_icon.png") no-repeat center;
                        background-size: cover;
                        vertical-align: middle;
                    }
                }
                &.new {
                    &.active-acd {
                        color: #c33;
                        i {
                            background-image: url("../../../assets/images/icon/ascending_sort_icon.png");
                        }
                    }
                    &.active-dcd {
                        color: #c33;
                        i {
                            background-image: url("../../../assets/images/icon/descending_sort_icon.png");
                        }
                    }
                    i {
                        height: .28rem;
                        width: .28rem;
                        display: inline-block;
                        background: url("../../../assets/images/icon/sort_icon.png") no-repeat center;
                        background-size: cover;
                        vertical-align: middle;
                    }
                }
                &.active {
                    span {
                        color: #c33;
                    }
                }
                &.sizer {
                    &.active {
                        i {
                            background-image: url("../../../assets/images/icon/sizer_icon_red.png");
                        }
                    }
                    i {
                        height: .28rem;
                        width: .28rem;
                        display: inline-block;
                        background: url("../../../assets/images/icon/sizer_icon_gray.png") no-repeat center;
                        background-size: cover;
                        vertical-align: middle;
                    }
                }
                span {
                    vertical-align: middle;
                }
            }
        }
    }
    .sub-class-list {
        padding: .3rem 0 0;
        background-color: #fff;
        margin-bottom: .2rem;
        .class-name {
            font-size: .3rem;
            color: #000;
        }
        .class-phrase {
            font-size: .22rem;
            color: #747474;
            padding: .2rem 0 .3rem;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>