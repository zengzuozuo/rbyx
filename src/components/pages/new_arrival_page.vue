<template>
    <div class="newarrival-page" ref="newarrivalPage">
        <ComHeaderbar text="新品首发"></ComHeaderbar>
        <NewArrival />
    </div>
</template>

<script>
import NewArrival from "./indexcpt/new_arrival";  //新品
export default {
    data() {
        return {
            activeindex: 1
        }
    },
    mounted() {
        
    },
    methods: {
        
    },
    components: {
        NewArrival
    }
}
</script>

<style lang="less">
.newarrival-page {
    display: flex;
    flex-direction: column;
    .newarrival-component {
        flex: 1;
        position: relative;
    }
}
</style>
