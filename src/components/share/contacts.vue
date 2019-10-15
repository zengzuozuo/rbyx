<template>
    <div class="contacts-page">
        <ComHeaderbar text="联系人" />
        <div class="main">
            <div class="tip">
                <span><i></i>可邀请</span>
                <span><i style="background-color: #cac6c6"></i>不可邀</span>
                <span><i style="background-color: #0effcf"></i>已发送</span>
                <span><i style="background-color: #c33"></i>已邀请</span>
            </div>
            <yd-checklist align="right" v-model="checklist" v-if="pageData">
                <yd-checklist-item :disabled="item.sign != 1" :class="{'acquired':item.sign == 3, 'yfs': item.sign == 4, 'yyq': item.sign == 2}" :val="item.mobile" v-for="item,index in pageData.data" :key="index">
                    <span class="name">{{item.displayName}}</span>
                    <span class="phone">{{item.mobile}}</span>
                </yd-checklist-item>
            </yd-checklist>
        </div>
        <footer>
            <a href="javascript:;" @click="invite">批量邀请</a>
        </footer>
    </div>
</template>

<script type="text/babel">
    export default {
        data() {
            return {
                checklist: [],
                contacts: [{
                    id: 1,
                    rawld: null,
                    target: 0,
                    displayName: "YY号/M",
                    name: {givenName: "YY号/M",formatted: "YY号/M"},
                    nickname: null,
                    phoneNumbers: [{id: "2",pref: false,value: "432445534",type: "nobile"}],
                    emails: [],
                    addresses: [],
                    ims: [],
                    organizations: [],
                    birthday: null,
                    note: null,
                    photos: [],
                    categories: null,
                    urls: []
                },
                {
                    id: 2,
                    rawld: null,
                    target: 0,
                    displayName: "YY号/M",
                    name: {givenName: "YY号/M",formatted: "YY号/M"},
                    nickname: null,
                    phoneNumbers: [{id: "2",pref: false,value: "432445534",type: "nobile"}],
                    emails: [],
                    addresses: [],
                    ims: [],
                    organizations: [],
                    birthday: null,
                    note: null,
                    photos: [],
                    categories: null,
                    urls: []
                }],
                pageData: null
            }
        },
        mounted() {
            try {
                this.getContacts();
            } catch (error) {
                
            }
            // console.log(this.contacts)
            // this.getData(this.contacts);
        },
        methods: {
            getContacts() {
                var that = this;
                plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
                    addressbook.find([],function(contacts){
                        that.contacts = contacts;
                        that.getData(contacts);
                    }, function () {
                        alert("error");
                    },{multiple:true});
                },function(e){
                    alert("Get address book failed: " + e.message);
                });
            },
            getData(contacts) {
                this.$store.commit("openWait");
                this.$http.post(this.shareApiUrl,{
                    code: "userMaillist",
                    contacts: JSON.stringify(contacts)
                }).then((data) => {
                    if(data.ztm == 1) {
                        this.pageData = data;
                    }else {
                        this.pageData = [];
                    }
                })
            },
            invite() {
                if(this.checklist.length == 0) {
                    this.$dialog.toast({mes: "请至少选择一个联系人"});
                    return;
                }
                this.$dialog.confirm({
                    title: '是否将以下内容发送给Ta们？',
                    mes: this.pageData.msgformat,
                    opts: () => {
                        this.sendMessageformat();
                    }
                });
            },
            sendMessageformat() {
                this.$store.commit("openWait");
                this.$http.post(this.shareApiUrl,{
                    code: "sendMessageformat",
                    mobile: this.checklist.join(",")
                }).then((data) => {
                    console.log(data);
                    if(data.ztm == 1) {
                        this.$dialog.toast({
                            mes: data.msg,
                            icon: "success",
                            callback: () => {
                                this.getData(this.contacts);
                            }
                        })

                    }else {
                        this.$dialog.toast({
                            mes: data.msg,
                            icon: "error",
                            callback: () => {
                                this.getData(this.contacts);
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="less">
.contacts-page {
    display: flex;
    flex-direction: column;
    .main {
        position: relative;
        flex: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        .yd-checklist {
            padding-top: .8rem;
        }
        .yd-checklist-item {
            padding-left: .2rem;
            margin-left: 0;
            &.acquired {
                background-color: #cac6c6;
                .yd-checklist-content {
                    color: #fff;
                }
            }
            &.yfs {
                background-color: #0effcf;
            }
            &.yyq {
                background-color: #c33;
                .yd-checklist-content {
                    color: #fff;
                }
            }
            .yd-checklist-content {
                span {
                    display: inline-block;
                    line-height: .9rem;
                    font-size: .28rem;
                    &.name {
                        width: 2rem;
                    }
                    &.phone {
                        margin-left: .1rem;
                    }
                }
            }
        }
        .tip {
            position: fixed;
            top: .9rem;
            left: 0;
            z-index: 12;
            width: 100%;
            display: flex;
            justify-content: space-around;
            background-color: #999;
            color: #fff;
            height: .8rem;
            line-height: .8rem;
            padding: 0 .2rem;
            i {
                display: inline-block;
                width: .6rem;
                height: .3rem;
                background-color: #fff;
                vertical-align: middle;
                margin-right: .1rem;
            }
            span {
                display: inline-block;
            }
        }
    }
    footer {
        padding: .2rem;
        background-color: #fafafa;
        a {
            display: block;
            line-height: .9rem;
            text-align: center;
            background-color: #c33;
            color: #fff;
            font-size: .3rem;
            border-radius: .1rem;
        }
    }
}
</style>

