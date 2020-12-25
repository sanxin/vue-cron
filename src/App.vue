<template>
    <div id="app">
        <page-head>
            <template v-slot>
                <p class="head-title">Cron表达式</p>
            </template>
        </page-head>
        <div class="container">
            <!-- 给input-val赋值，就可以实现数据反显 -->
            <Cron input-val="10-20 30/40 * 5W 6 ?"></Cron>
        </div>
    </div>
</template>

<script>
import PageHead from "@/components/pageHead.vue";
import Cron from "@/views/cron/index.vue";
export default {
    name: "App",
    components: {
        PageHead,
        Cron
    }
};
</script>

<style>
</style>
