<template>
    <div class="cron-index-page">
        <div class="result">
            <p class="error-text">错误提示：{{ placeholder }}</p>
            输出结果：
            <el-input
                v-model="cronExpression"
                readonly
                placeholder=""
            ></el-input>
        </div>
        <el-tabs type="border-card" v-model="activeTag">
            <el-tab-pane label="秒" name="s">
                <Time
                    label="秒"
                    :val="sVal"
                    @changeTime="changeSFn"
                    @findError="(data) => timeFindErrorFn(data, '秒')"
                ></Time>
            </el-tab-pane>
            <el-tab-pane label="分" name="m">
                <Time
                    label="分"
                    :val="mVal"
                    @changeTime="changeMFn"
                    @findError="(data) => timeFindErrorFn(data, '分')"
                ></Time>
            </el-tab-pane>
            <el-tab-pane label="时" name="h">
                <Time
                    label="时"
                    :val="hVal"
                    @changeTime="changeHFn"
                    @findError="(data) => timeFindErrorFn(data, '时')"
                ></Time>
            </el-tab-pane>
            <el-tab-pane label="日" name="d">
                <Day
                    :val="dVal"
                    @changeDay="changeDFn"
                    @findError="(data) => timeFindErrorFn(data, '日')"
                ></Day>
            </el-tab-pane>
            <el-tab-pane label="月" name="month">
                <Month
                    :val="monthVal"
                    @changeMonth="changeMonthFn"
                    @findError="(data) => timeFindErrorFn(data, '月')"
                ></Month>
            </el-tab-pane>
            <el-tab-pane label="周" name="w">
                <Week
                    :val="wVal"
                    @changeWeek="changeWFn"
                    @findError="(data) => timeFindErrorFn(data, '周')"
                ></Week>
            </el-tab-pane>
            <el-tab-pane label="年" name="y">
                <Year
                    :val="yVal"
                    @changeYear="changeYFn"
                    @findError="(data) => timeFindErrorFn(data, '年')"
                ></Year>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Time from "./Time.vue";
import Day from "./Day.vue";
import Month from "./Month.vue";
import Week from "./Week.vue";
import Year from "./Year.vue";
export default {
    name: "",
    components: {
        Time,
        Day,
        Month,
        Week,
        Year
    },
    props: {
        inputVal: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            placeholder: "",
            // tab active
            activeTag: "s",
            // 秒
            sVal: "",
            // 分
            mVal: "",
            // 时
            hVal: "",
            // 日
            dVal: "",
            // 月
            monthVal: "",
            // 周
            wVal: "",
            // 年
            yVal: "",
            // cron完整表达式
            cronExpression: ""
        };
    },
    created() {
        if (this.inputVal) {
            this.verifyValue(this.inputVal);
        }
    },
    methods: {
        // 初步校验输入的cron表达式是否有错误
        verifyValue(str) {
            // 去掉字符串收尾的无效空格
            let _arr = _.trim(str).split(" ");
            // 基础的规则校验，包括字符串的长度，必须为6或者7，以及日和周的互斥
            if (_arr.length === 6 || _arr.length === 7) {
                if (
                    (_arr[3] === "?" && _arr[5] !== "?") ||
                    (_arr[3] !== "?" && _arr[5] === "?")
                ) {
                    this.cronExpression = this.inputVal;
                    this.parseInputVal();
                } else {
                    this.placeholder = `传入的表达式：${this.inputVal}不正确, 现改为默认值： * * * * * ?`;
                }
            } else {
                this.placeholder = `传入的表达式：${this.inputVal}不正确, 现改为默认值： * * * * * ?`;
            }
        },
        // 分解传入的cron表达式，进行数据的反显
        parseInputVal() {
            let _arr = this.inputVal.split(" ");
            this.sVal = _arr[0];
            this.mVal = _arr[1];
            this.hVal = _arr[2];
            this.dVal = _arr[3];
            this.monthVal = _arr[4];
            this.wVal = _arr[5];
            this.yVal = _arr[6] || "";
        },
        changeSFn(data) {
            this.sVal = data;
            this.createCron();
        },
        changeMFn(data) {
            this.mVal = data;
            this.createCron();
        },
        changeHFn(data) {
            this.hVal = data;
            this.createCron();
        },
        changeDFn(data) {
            this.dVal = data;
            if (data !== "?" && this.wVal) {
                this.wVal = "?";
                this.placeholder = `日和周互斥，不能同时设置值，现将周改为默认值?`;
            }
            this.createCron();
        },
        changeMonthFn(data) {
            this.monthVal = data;
            this.createCron();
        },
        changeWFn(data) {
            this.wVal = data;
            if (data !== "?" && this.dVal) {
                this.dVal = "?";
                this.placeholder = `日和周互斥，不能同时设置值，现将日改为默认值?`;
            }
            this.createCron();
        },
        changeYFn(data) {
            this.yVal = data;
            this.createCron();
        },
        createCron() {
            this.cronExpression = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.wVal} ${this.yVal}`;
            let self = this;
            setTimeout(() => {
                self.placeholder = "";
            }, 3000);
        },
        timeFindErrorFn(data, key) {
            let handle = {
                秒: () => {
                    this.placeholder = `${key}值${data}出现错误，现改为默认值*`;
                    this.sVal = "*";
                },
                分: () => {
                    this.placeholder = `${key}值${data}出现错误，现改为默认值*`;
                    this.mVal = "*";
                },
                时: () => {
                    this.placeholder = `${key}值${data}出现错误，现改为默认值*`;
                    this.hVal = "*";
                },
                日: () => {
                    this.placeholder = `${key}值${data}出现错误，现改为默认值*`;
                    this.dVal = "*";
                },
                月: () => {
                    this.placeholder = `${key}值${data}出现错误，现改为默认值*`;
                    this.monthVal = "*";
                },
                周: () => {
                    this.placeholder = `${key}值${data}出现错误，现改为默认值?`;
                    this.wVal = "?";
                },
                年: () => {
                    this.placeholder = `${key}值${data}出现错误，现改为默认值*`;
                    this.yVal = "";
                }
            };
            handle[key]();
        }
    }
};
</script>
<style lang="less">
.cron-index-page {
    padding: 20px;
    wdith: 100%;
    height: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #ffffff;
    .result {
        margin-bottom: 10px;
    }
    .error-text {
        margin-bottom: 10px;
    }
}
</style>