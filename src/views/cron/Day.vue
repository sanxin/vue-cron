<template>
    <div class="day-page">
        <el-radio-group class="day-block" v-model="type" @change="changeDay">
            <!-- 每日 -->
            <div class="day-item">
                <el-radio label="1" border>每日</el-radio>
            </div>
            <!-- 每日 -->
            <!-- 不指定 -->
            <div class="day-item">
                <el-radio label="2" border>不指定</el-radio>
            </div>
            <!-- 不指定 -->
            <!-- 周期 -->
            <div class="day-item">
                <el-radio label="3" border>周期</el-radio>
                <span class="text">从</span>
                <el-input-number
                    v-model="cycle.start"
                    :min="1"
                    :max="31"
                    step-strictly
                    @change="changeCycleDay"
                ></el-input-number>
                <span class="text">至</span>
                <el-input-number
                    v-model="cycle.end"
                    :min="2"
                    :max="31"
                    step-strictly
                    @change="changeCycleDay"
                ></el-input-number>
                <span class="text">日</span>
            </div>
            <!-- 周期 -->
            <!-- 循环 -->
            <div class="day-item">
                <el-radio label="4" border>循环</el-radio>
                <span class="text">从</span>
                <el-input-number
                    v-model="loop.start"
                    :min="1"
                    :max="31"
                    step-strictly
                    @change="changeLoopDay"
                ></el-input-number>
                <span class="text">日开始，每</span>
                <el-input-number
                    v-model="loop.end"
                    :min="1"
                    :max="31"
                    step-strictly
                    @change="changeLoopDay"
                ></el-input-number>
                <span class="text">日执行一次</span>
            </div>
            <!-- 循环 -->
            <!-- 工作日 -->
            <div class="day-item">
                <el-radio label="5" border>工作日</el-radio>
                <span class="text">每月</span>
                <el-input-number
                    v-model="work"
                    :min="1"
                    :max="31"
                    step-strictly
                    @change="changeWeekDay"
                ></el-input-number>
                <span class="text">号，最近的工作日</span>
            </div>
            <!-- 工作日 -->
            <!-- 月最后一天 -->
            <div class="day-item">
                <el-radio label="6" border>月最后一天</el-radio>
            </div>
            <!-- 月最后一天 -->
            <!-- 指定 -->
            <div class="day-item appoint-item">
                <el-radio label="7" border>指定</el-radio>
                <el-checkbox-group v-model="appoint">
                    <el-checkbox
                        v-for="i in 31"
                        :key="i"
                        :label="String(i)"
                        @change="changeAppointTime"
                        >{{ i }}</el-checkbox
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
    name: "DayTemp",
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
            // 工作日
            work: 1,
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
                    this.$emit("changeDay", this.result);
                }
            },
            immediate: true
        }
    },
    methods: {
        parseInputVal() {
            if (this.val.includes("*")) {
                this.type = "1";
            } else if (this.val.includes("?")) {
                this.type = "2";
            } else if (this.val.includes("-")) {
                this.type = "3";
                let _arr = this.val.split("-");
                this.cycle = {
                    start: _arr[0],
                    end: _arr[1]
                };
            } else if (this.val.includes("/")) {
                this.type = "4";
                let _arr = this.val.split("/");
                this.loop = {
                    start: _arr[0],
                    end: _arr[1]
                };
            } else if (this.val.includes("W")) {
                this.type = "5";
                this.work = this.val.slice(0, this.val.length - 1);
            } else if (this.val.includes("L")) {
                this.type = "6";
            } else if (this.val.includes(",")) {
                this.type = "7";
                let _arr = this.val.split(",");
                this.appoint = _.cloneDeep(_arr);
            } else {
                if (Number(this.val)) {
                    this.type = "7";
                    this.appoint = [this.val];
                } else {
                    this.$emit("findError", this.val);
                }
            }
        },
        changeDay(val) {
            this.appoint = [];
            let handle = {
                1: () => {
                    this.result = "*";
                },
                2: () => {
                    this.result = "?";
                },
                3: () => {
                    this.result = this.cycle.start + "-" + this.cycle.end;
                },
                4: () => {
                    this.result = this.loop.start + "/" + this.loop.end;
                },
                5: () => {
                    this.result = this.work + "W";
                },
                6: () => {
                    this.result = "L";
                },
                7: () => {
                    this.appoint = ["1"];
                    this.result = "1";
                }
            };
            handle[val]();
            this.$emit("changeDay", this.result);
        },
        changeCycleDay(val) {
            this.type = "3";
            this.appoint = [];
            this.result = this.cycle.start + "-" + this.cycle.end;
            this.$emit("changeDay", this.result);
        },
        changeLoopDay(val) {
            this.type = "4";
            this.appoint = [];
            this.result = this.loop.start + "/" + this.loop.end;
            this.$emit("changeDay", this.result);
        },
        changeWeekDay(val) {
            this.type = "5";
            this.appoint = [];
            this.result = this.work + "W";
            this.$emit("changeDay", this.result);
        },
        changeAppointTime(val) {
            this.type = "7";
            this.result = this.appoint
                .sort((a, b) => {
                    return a - b;
                })
                .join(",");
            this.$emit("changeDay", this.result);
        }
    }
};
</script>
<style lang="less">
.day-page {
    .day-block {
    }
    .day-item + .day-item {
        margin-top: 10px;
    }
    .day-item {
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