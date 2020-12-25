<template>
    <div class="time-page">
        <el-radio-group class="time-block" v-model="type" @change="changeTime">
            <!-- 每 -->
            <div class="time-item">
                <el-radio label="1" border>每{{ label }}</el-radio>
            </div>
            <!-- 每 -->
            <!-- 周期 -->
            <div class="time-item">
                <el-radio label="2" border>周期</el-radio>
                <span class="text">从</span>
                <el-input-number
                    v-model="cycle.start"
                    :min="minTime"
                    :max="maxTime - 1"
                    step-strictly
                    @change="changeCycleTime"
                ></el-input-number>
                <span class="text">至</span>
                <el-input-number
                    v-model="cycle.end"
                    :min="minTime + 1"
                    :max="maxTime"
                    step-strictly
                    @change="changeCycleTime"
                ></el-input-number>
                <span class="text">{{ label }}</span>
            </div>
            <!-- 周期 -->
            <!-- 循环 -->
            <div class="time-item">
                <el-radio label="3" border>循环</el-radio>
                <span class="text">从</span>
                <el-input-number
                    v-model="loop.start"
                    :min="0"
                    :max="maxTime"
                    step-strictly
                    @change="changeLoopTime"
                ></el-input-number>
                <span class="text">{{ label }}开始，每</span>
                <el-input-number
                    v-model="loop.end"
                    :min="1"
                    :max="maxTime"
                    step-strictly
                    @change="changeLoopTime"
                ></el-input-number>
                <span class="text">{{ label }}执行一次</span>
            </div>
            <!-- 循环 -->
            <!-- 指定 -->
            <div class="time-item appoint-item">
                <el-radio label="4" border>指定</el-radio>
                <el-checkbox-group v-model="appoint">
                    <el-checkbox
                        v-for="i in appointNumber"
                        :key="i - 1"
                        :label="String(i - 1)"
                        @change="changeAppointTime"
                        >{{ i - 1 }}</el-checkbox
                    >
                </el-checkbox-group>
            </div>
            <!-- 指定 -->
        </el-radio-group>
    </div>
</template>

<script>
import * as _ from "lodash";
export default {
    name: "TimeTemp",
    props: {
        // 传递的label(时，分，秒),用于区分秒和分,必填
        label: {
            type: String,
            requied: true
        },
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
            // input-number最大值
            minTime: this.label === "时" ? 0 : 1,
            // input-number最大值
            maxTime: this.label === "时" ? 23 : 59,
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
            // 指定的最大值，秒分为60,时24
            appointNumber: this.label === "时" ? 24 : 60,
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
                    this.$emit("changeTime", this.result);
                }
            },
            immediate: true
        }
    },
    methods: {
        parseInputVal() {
            if (this.val.includes("*")) {
                this.type = "1";
            } else if (this.val.includes("-")) {
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
        changeTime(val) {
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
                    this.appoint = ["0"];
                    this.result = this.appoint.join(",");
                }
            };
            handle[val]();
            this.$emit("changeTime", this.result);
        },
        changeCycleTime(val) {
            this.type = "2";
            this.appoint = [];
            this.result = this.cycle.start + "-" + this.cycle.end;
            this.$emit("changeTime", this.result);
        },
        changeLoopTime(val) {
            this.type = "3";
            this.appoint = [];
            this.result = this.loop.start + "/" + this.loop.end;
            this.$emit("changeTime", this.result);
        },
        changeAppointTime(val) {
            this.type = "4";
            this.result = this.appoint
                .sort((a, b) => {
                    return a - b;
                })
                .join(",");
            this.$emit("changeTime", this.result);
        }
    }
};
</script>
<style lang="less">
.time-page {
    .time-block {
    }
    .time-item + .time-item {
        margin-top: 10px;
    }
    .time-item {
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