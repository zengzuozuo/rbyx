<template>
    <div class="findmanufacturer-page">
        <ComHeaderbar text="查找制造商"></ComHeaderbar>
        <div class="main">
            <yd-scrolltab>
                <yd-scrolltab-panel :label="index" icon="demo-icons-category1" v-for="item,index in pageData" :key="index">
                    <ul>
                        <li v-for="subItem,index in item" @click="$router.push('mftdetails?id=' + subItem.id)">{{subItem.brand}}</li>
                    </ul>
                </yd-scrolltab-panel>
            </yd-scrolltab>
        </div>
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
            this.$http.post(this.apiUrl,{
                code: "brandTitle"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.pageData = data.data;
                }
            })
        }
    }
}
</script>

<style lang="less">
.findmanufacturer-page {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow: hidden;
        .yd-scrolltab {
            position: relative;
            height: 100%;
            display: block;
            .yd-scrolltab-nav {
                position: absolute;
                right: 0;
                top: 0;
                z-index: 2;
                padding: 1rem 0;
                background-color: transparent;
                .yd-scrolltab-item {
                    height: .4rem;
                    &:after {
                        border: none;
                    }
                }
                .yd-scrolltab-active {
                    background-color: transparent;
                    font-weight: bold;
                }
            }
            .yd-scrolltab-content {
                padding: 0;
                .yd-scrolltab-content-item {
                    position: relative;
                    &:after {
                        border: none;
                    }
                    .yd-scrolltab-content-title {
                        position: -webkit-sticky;
                        position: sticky;
                        top: 0;
                        left: 0;
                        background-color: #f3f3f3;
                        margin: 0;
                        padding: 0 .3rem;
                        line-height: .5rem;
                        font-weight: bold;
                    }
                    ul {
                        li {
                            line-height: 1.06rem;
                            padding: 0 .3rem;
                            border-bottom: 1px solid #f4f4f4;
                            font-size: .3rem;
                        }
                    }
                }
            }
        }
    }
}
</style>

