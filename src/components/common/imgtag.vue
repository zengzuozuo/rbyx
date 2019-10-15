<template>
  <img :src="url" 
onerror="javascript:this.src='static/images/error_img.png'" />
</template>

<script>
export default {
    props: {
        url : {
            default : "static/images/default.jpg"
        }
    }
}
</script>
