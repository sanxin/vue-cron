<template>
    <div class="head-page">
        <div class="head-icon">
            <i class="el-icon-share"></i>
        </div>
        <div class="head-line"></div>
        <div class="head-name">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "",
    data() {
        return {};
    }
};
</script>
<style lang="less">
.head-page {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #ffffff;
    box-shadow: 0px 0px 25px 0px rgba(117, 141, 170, 0.15);
    font-size: 0;
    cursor: default;
    .head-icon {
        padding: 0 25px;
        width: 66px;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
        span {
            padding: 5px;
            font-size: 16px;
            color: #606266;
        }
    }
    .head-line {
        display: inline-block;
        width: 1px;
        height: 32px;
        background: #606266;
        vertical-align: middle;
    }
    .head-name {
        margin-right: 30px;
        display: inline-block;
        height: 100%;
        font-size: 16px;
        vertical-align: middle;
        .head-title {
            padding-left: 30px;
            color: #606266;
            font-size: 16px;
        }
    }
}
</style>