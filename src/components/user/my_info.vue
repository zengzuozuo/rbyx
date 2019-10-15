<template>
    <div class="myinfo-page">
        <ComHeaderbar text="个人信息">
            <a href="javascript:;" class="other" @click="setUserInfo">保存</a>
        </ComHeaderbar>
        <div class="main" v-if="postObj">
            <div class="userlogo">
                <!-- <ImgTag :url="imgUrl + postObj.avatar" />
                <p>点击修改头像</p> -->
                <simple-cropper :initParam="uploadParam" :successCallback="uploadHandle" ref="cropper"> 
                    <!-- <img :src="userImg" >  -->
                    <!--<ImgTag :url="appImgUrl + postObj.avatar" @click.native="upload" />-->
                    <ImgTag :url="appImgUrl + postObj.avatar" />
                </simple-cropper> 
                <p>点击修改头像</p>
            </div>
            <yd-cell-group class="">
                <yd-cell-item type="a" href="javascript:;">
                    <span slot="left">用户ID</span>
                    <span slot="right">{{postObj.uid}}</span>
                </yd-cell-item>
                <yd-cell-item type="a" href="javascript:;">
                    <span slot="left">账号</span>
                    <span slot="right">{{postObj.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
                </yd-cell-item>
                <yd-cell-item type="label">
                    <span slot="left">昵称</span>
                    <input type="text" v-model="postObj.username" slot="right" />
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left">性别</span>
                    <yd-radio-group slot="right" v-model="postObj.sex">
                        <yd-radio val="1">男</yd-radio>
                        <yd-radio val="0">女</yd-radio>
                    </yd-radio-group>
                </yd-cell-item>
                <yd-cell-item arrow>
                    <span slot="left">出生日期</span>
                    <yd-datetime ref="datetime" type="date" start-year="1970" end-year="2017" v-model="postObj.birthday" slot="right"></yd-datetime>
                </yd-cell-item>
            </yd-cell-group>
            <yd-cell-group class="">
                <yd-cell-item arrow @click.native="$router.push('interestclass')">
                    <span slot="left">感兴趣的分类</span>
                    <span slot="right"></span>
                </yd-cell-item>
            </yd-cell-group>
        </div>
    </div>
</template>

<script>
import SimpleCropper from '@/components/common/simpleCropper' 
export default {
    data() {
        return {
            sex: "",
            datetime: "",
            yearArr: "1995年",
            postObj: null,
            uploadParam: { 
                fileType: 'recruit', // 其他上传参数 
                uploadURL: this.apiUrl, // 上传地址 
                scale: 4 // 相对手机屏幕放大的倍数: 4倍 
            }, 
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        setUserInfo() {
            if(this.postObj.username.trim() == "") {
                this.$dialog.toast({
                    mes: "用户名不能为空",
                })
                return;
            }
            this.postObj.code = "updateUserinfo";
            this.$store.commit("openWait");
            this.$http.post(this.apiUrl,this.postObj).then((data) => {
                console.log(data)
                if(data.ztm == 1) {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "success"
                    })
                    localStorage.setItem("userAvatar",this.postObj.avatar);
                }else {
                    this.$dialog.toast({
                        mes: data.msg,
                        icon: "error"
                    })
                }
            })
        },
        getData() {
            this.$http.post(this.apiUrl,{
                code: "getUserinfo"
            }).then((data) => {
                console.log(data);
                if(data.ztm == 1) {
                    this.postObj = data.data;
                    localStorage.setItem("userAvatar",data.data.avatar);
                }
            })
        },
        // 上传头像 
        upload () { 
            this.$refs['cropper'].upload() 
        }, 
        // 上传头像成功回调 
        uploadHandle (data) { 
            this.postObj.avatar = data;
        } 
    },
    components: { 
        SimpleCropper 
    }

}
</script>

<style lang="less">
.myinfo-page {
	display: flex;
	flex-direction: column;
	.com-headerbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
	}
    .main {
    	padding-top: .9rem;
        .userlogo {
            padding: .6rem 0;
            background-color: #fff;
            margin-bottom: .3rem;
            img {
                width: 1.7rem;
                height: 1.7rem;
                border-radius: 50%;
                display: block;
                margin: 0 auto;
            }
            p {
                font-size: .3rem;
                color: #717171;
                text-align: center;
                margin-top: .28rem;
            }
        }
        .yd-cell-box {
            .yd-datetime-input {
                justify-content: inherit;
            }
            input {
                text-align: right;
            }
        }
    }
}
</style>
