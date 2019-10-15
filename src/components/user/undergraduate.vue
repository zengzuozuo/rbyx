<template>
    <div class="undergraduate-page">
        <ComHeaderbar text="在校大学学生认证" />
        <div class="main">
            <p class="tip">在校大学学生认证，通过后可参加大学生专属活动.</p>
            <div class="content">
                <img class="img-btn" src="../../assets/images/select_pic.png" alt="">
                <div class="text">
                    <p>请上传身份证</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='less'>
.undergraduate-page {
    display: flex;
    flex-direction: column;
    .main {
        flex: 1;
        overflow-y: auto;
        .tip {
            padding: .2rem .3rem;
            font-size: .28rem;
            color: #fcc643;
        }
        .content {
            display: flex;
            margin-top: .2rem;
            padding: .3rem;
            background-color: #fff;
            .img-btn {
                width: 2rem;
                height: 2rem;
            }
            .text {
                flex: 1;
                padding-left: .2rem;
            }
        }
    }
}
</style>
