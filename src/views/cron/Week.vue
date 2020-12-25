<template>
    <div class="week-page">
        <el-radio-group class="week-block" v-model="type" @change="changeWeek">
            <!-- 每周 -->
            <div class="week-item">
                <el-radio label="1" border>每周</el-radio>
            </div>
            <!-- 每周 -->
            <!-- 不指定 -->
            <div class="week-item">
                <el-radio label="2" border>不指定</el-radio>
            </div>
            <!-- 不指定 -->
            <!-- 周期 -->
            <div class="week-item">
                <el-radio label="3" border>周期</el-radio>
                <span class="text">从星期({{ weekFormat[cycle.start] }})</span>
                <el-input-number
                    v-model="cycle.start"
                    :min="1"
                    :max="7"
                    step-strictly
                    @change="changeCycleWeek"
                ></el-input-number>
                <span class="text">至 星期({{ weekFormat[cycle.end] }})</span>
                <el-input-number
                    v-model="cycle.end"
                    :min="2"
                    :max="7"
                    step-strictly
                    @change="changeCycleWeek"
                ></el-input-number>
            </div>
            <!-- 周期 -->
            <!-- 循环 -->
            <div class="week-item">
                <el-radio label="4" border>循环</el-radio>
                <span class="text">第</span>
                <el-input-number
                    v-model="loop.start"
                    :min="1"
                    :max="4"
                    step-strictly
                    @change="changeLoopWeek"
                ></el-input-number>
                <span class="text">周 的星期({{ weekFormat[loop.end] }})</span>
                <el-input-number
                    v-model="loop.end"
                    :min="1"
                    :max="7"
                    step-strictly
                    @change="changeLoopWeek"
                ></el-input-number>
                <span class="text">执行一次</span>
            </div>
            <!-- 循环 -->
            <!-- 循环 -->
            <div class="week-item">
                <el-radio label="5" border
                    >本月最后一个星期({{ weekFormat[last] }})</el-radio
                >
                <el-input-number
                    v-model="last"
                    :min="1"
                    :max="7"
                    step-strictly
                    @change="changeLastWeek"
                ></el-input-number>
            </div>
            <!-- 循环 -->
            <!-- 指定 -->
            <div class="week-item appoint-item">
                <el-radio label="6" border>指定</el-radio>
                <el-checkbox-group v-model="appoint">
                    <el-checkbox
                        v-for="i in 7"
                        :key="i"
                        :label="i"
                        @change="changeAppointWeek"
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
    name: "weekTemp",
    props: {
        // 传递的显示value
        val: {
            type: String,
            requied: true
        }
    },
    data() {
        return {
            // 周-转义
            weekFormat: {
                1: "天",
                2: "一",
                3: "二",
                4: "三",
                5: "四",
                6: "五",
                7: "六"
            },
            // 所选类型
            type: "2",
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
            // 月最后一个星期
            last: 1,
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
                    this.result = "?";
                    this.$emit("changeWeek", this.result);
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
            } else if (this.val.includes("#")) {
                this.type = "4";
                let _arr = this.val.split("#");
                this.loop = {
                    start: _arr[0],
                    end: _arr[1]
                };
            } else if (this.val.includes("L")) {
                this.type = "5";
                this.last = this.val.slice(0, this.val.length - 1);
            } else if (this.val.includes(",")) {
                this.type = "6";
                let _arr = this.val.split(",");
                this.appoint = _.cloneDeep(_arr);
            } else {
                if (Number(this.val)) {
                    this.type = "6";
                    this.appoint = [this.val];
                } else {
                    this.$emit("findError", this.val);
                }
            }
        },
        changeWeek(val) {
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
                    this.result = this.loop.start + "#" + this.loop.end;
                },
                5: () => {
                    this.result = this.last + "L";
                },
                6: () => {
                    this.appoint = [1];
                    this.result = this.appoint.join(",");
                }
            };
            handle[val]();
            this.$emit("changeWeek", this.result);
        },
        changeCycleWeek(val) {
            this.type = "3";
            this.appoint = [];
            this.result = this.cycle.start + "-" + this.cycle.end;
            this.$emit("changeWeek", this.result);
        },
        changeLoopWeek(val) {
            this.type = "4";
            this.appoint = [];
            this.result = this.loop.start + "/" + this.loop.end;
            this.$emit("changeWeek", this.result);
        },
        changeLastWeek(val) {
            this.type = "5";
            this.appoint = [];
            this.result = this.last + "L";
            this.$emit("changeWeek", this.result);
        },
        changeAppointWeek(val) {
            this.type = "6";
            this.result = this.appoint
                .sort((a, b) => {
                    return a - b;
                })
                .join(",");
            this.$emit("changeWeek", this.result);
        }
    }
};
</script>
<style lang="less">
.week-page {
    .week-block {
    }
    .week-item + .week-item {
        margin-top: 10px;
    }
    .week-item {
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