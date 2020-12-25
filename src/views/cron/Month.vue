<template>
    <div class="month-page">
        <el-radio-group
            class="month-block"
            v-model="type"
            @change="changeMonth"
        >
            <!-- 每月 -->
            <div class="month-item">
                <el-radio label="1" border>每月</el-radio>
            </div>
            <!-- 每月 -->
            <!-- 周期 -->
            <div class="month-item">
                <el-radio label="2" border>周期</el-radio>
                <span class="text">从</span>
                <el-input-number
                    v-model="cycle.start"
                    :min="1"
                    :max="11"
                    step-strictly
                    @change="changeCycleMonth"
                ></el-input-number>
                <span class="text">至</span>
                <el-input-number
                    v-model="cycle.end"
                    :min="2"
                    :max="12"
                    step-strictly
                    @change="changeCycleMonth"
                ></el-input-number>
                <span class="text">月</span>
            </div>
            <!-- 周期 -->
            <!-- 循环 -->
            <div class="month-item">
                <el-radio label="3" border>循环</el-radio>
                <span class="text">从</span>
                <el-input-number
                    v-model="loop.start"
                    :min="1"
                    :max="12"
                    step-strictly
                    @change="changeLoopMonth"
                ></el-input-number>
                <span class="text">月开始，每</span>
                <el-input-number
                    v-model="loop.end"
                    :min="1"
                    :max="12"
                    step-strictly
                    @change="changeLoopMonth"
                ></el-input-number>
                <span class="text">月执行一次</span>
            </div>
            <!-- 循环 -->
            <!-- 指定 -->
            <div class="month-item appoint-item">
                <el-radio label="4" border>指定</el-radio>
                <el-checkbox-group v-model="appoint">
                    <el-checkbox
                        v-for="i in 12"
                        :key="i"
                        :label="String(i)"
                        @change="changeAppointMonth"
                        >{{ i }}</el-checkbox
                    >
                </el-checkbox-group>
            </div>
            <!-- 指定 -->
        </el-radio-group>
    </div>
</template>

<script>
export default {
    name: "monthTemp",
    props: {
        // 传递的显示value
        val: {
            type: String,
            requied: true
        }
    },
    data() {
        return {
            // 所选类型
            type: "1",
            // 周期
            cycle: {
                start: 0,
                end: 0
            },
            // 循环
            loop: {
                start: 0,
                end: 0
            },
            // 指定
            appoint: [],
            // 结果
            result: ""
        };
    },
    watch: {
        val: {
            handler(n, o) {
                if (this.val) {
                    this.parseInputVal();
                } else {
                    // 传递的label(时，分，秒),用于区分秒和分,必填
                    this.result = "*";
                    this.$emit("changeMonth", this.result);
                }
            },
            immediate: true
        }
    },
    methods: {
        parseInputVal() {
            if (this.val.includes("*")) {
                this.type = "1";
            }
            if (this.val.includes("-")) {
                this.type = "2";
                let _arr = this.val.split("-");
                this.cycle = {
                    start: _arr[0],
                    end: _arr[1]
                };
            } else if (this.val.includes("/")) {
                this.type = "3";
                let _arr = this.val.split("/");
                this.loop = {
                    start: _arr[0],
                    end: _arr[1]
                };
            } else if (this.val.includes(",")) {
                this.type = "4";
                let _arr = this.val.split(",");
                this.appoint = _.cloneDeep(_arr);
            } else {
                if (Number(this.val)) {
                    this.type = "4";
                    this.appoint = [this.val];
                } else {
                    this.$emit("findError", this.val);
                }
            }
        },
        changeMonth(val) {
            this.appoint = [];
            let handle = {
                1: () => {
                    this.result = "*";
                },
                2: () => {
                    this.result = this.cycle.start + "-" + this.cycle.end;
                },
                3: () => {
                    this.result = this.loop.start + "/" + this.loop.end;
                },
                4: () => {
                    this.appoint = [1];
                    this.result = this.appoint.join(",");
                }
            };
            handle[val]();
            this.$emit("changeMonth", this.result);
        },
        changeCycleMonth(val) {
            this.type = "2";
            this.appoint = [];
            this.result = this.cycle.start + "-" + this.cycle.end;
            this.$emit("changeMonth", this.result);
        },
        changeLoopMonth(val) {
            this.type = "3";
            this.appoint = [];
            this.result = this.loop.start + "/" + this.loop.end;
            this.$emit("changeMonth", this.result);
        },
        changeAppointMonth(val) {
            this.type = "4";
            this.result = this.appoint
                .sort((a, b) => {
                    return a - b;
                })
                .join(",");
            this.$emit("changeMonth", this.result);
        }
    }
};
</script>
<style lang="less">
.month-page {
    .month-block {
    }
    .month-item + .month-item {
        margin-top: 10px;
    }
    .month-item {
        height: 32px;
        .el-input-number {
            width: 120px;
        }
        .text {
            padding: 0 5px;
            line-height: 32px;
            font-size: 14px;
            color: #606266;
        }
    }
    .appoint-item {
        height: auto;
        .el-checkbox-group {
            .el-checkbox__label {
                width: 28px;
            }
        }
    }
}
</style>