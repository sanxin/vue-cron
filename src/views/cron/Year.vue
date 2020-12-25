<template>
    <div class="year-page">
        <el-radio-group class="year-block" v-model="type" @change="changeYear">
            <!-- 每年 -->
            <div class="year-item">
                <el-radio label="1" border>每年</el-radio>
            </div>
            <!-- 每年 -->
            <!-- 不指定 -->
            <div class="year-item">
                <el-radio label="2" border>不指定</el-radio>
            </div>
            <!-- 不指定 -->
            <!-- 周期 -->
            <div class="year-item">
                <el-radio label="3" border>周期</el-radio>
                <span class="text">从</span>
                <el-date-picker
                    v-model="cycle.start"
                    type="year"
                    :clearable="false"
                    placeholder=""
                    @change="changeCycleYear"
                >
                </el-date-picker>
                <span class="text">年 至</span>
                <el-date-picker
                    v-model="cycle.end"
                    type="year"
                    :clearable="false"
                    placeholder=""
                    @change="changeCycleYear"
                >
                </el-date-picker>
                <span class="text">年</span>
            </div>
            <!-- 周期 -->
        </el-radio-group>
    </div>
</template>

<script>
export default {
    name: "yearTemp",
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
            type: "2",
            // 周期
            cycle: {
                start: 0,
                end: 0
            },
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
                    let _y = new Date().getFullYear();
                    this.cycle = {
                        start: String(_y - 1),
                        end: String(_y)
                    };
                    this.result = "";
                    this.$emit("changeYear", this.result);
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
            if (this.val === "") {
                this.type = "2";
            } else if (this.val.includes("-")) {
                this.type = "3";
                let _arr = this.val.split("-");
                this.cycle = {
                    start: _arr[0],
                    end: _arr[1]
                };
            } else {
                this.$emit("findError", this.val);
            }
        },
        changeYear(val) {
            let handle = {
                1: () => {
                    this.result = "*";
                },
                2: () => {
                    this.result = "";
                },
                3: () => {
                    this.result = this.cycle.start + "-" + this.cycle.end;
                }
            };
            handle[val]();
            this.$emit("changeYear", this.result);
        },
        changeCycleYear(val) {
            this.type = "3";
            this.result = this.cycle.start + "-" + this.cycle.end;
            this.$emit("changeYear", this.result);
        }
    }
};
</script>
<style lang="less">
.year-page {
    .year-block {
    }
    .year-item + .year-item {
        margin-top: 10px;
    }
    .year-item {
        height: 32px;
        .el-date-editor {
            width: 80px;
            .el-input__inner {
                padding-right: 0;
            }
        }
        .text {
            padding: 0 5px;
            line-height: 32px;
            font-size: 14px;
            color: #606266;
        }
    }
}
</style>