<template>
    <div class="error-page">
        <div class="outerDiv" style="display:flex; margin-bottom: -15px">
            <div v-for="(item,index) in timeArr" :class="`timeInner${index} timeInner`" @click="choseTime(item,index)">
                <div style="" class="boxList">
                    <div style="" :class="`blue${index} box`"></div>
                    <div :class="`timeText${index} timeText`" style="">{{item}}:00</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            timeArr: [],
        }
    },
    methods: {
        choseTime(item, index) {
            console.log(item, index)
        }
    },
    created() {
        for (let i = 9; i <= 21; i++) {
            this.timeArr.push(i)
        }
    },
}

</script>
<style lang="less">
.error-page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 80%;
    margin: 0 auto;
    height: 100%;
    background: #f3f3f3;
    box-sizing: border-box;
    .outerDiv {
        width: 100%;
        .timeInner {
            display: flex;
            width: 8%;
            margin-right: 2px;
        }
        .timeInner12 {
            width: 1px;
        }
        .boxList {
            width: 100%;
            padding-right: 1px; // position: absolute;
            .box {
                width: 100%;
                height: 25px;
                background-color: #00a8d7;
                margin-right: 1px;
            }
            .timeText {
                font-size: 12px;
                transform: scale(0.8);
                -webkit-transform: scale(0.8);
                margin-right: 20px;
                position: relative;
                left: -17px;
            }
            .timeText0 {
                position: relative;
                left: -11px;
            }
        }

        .blue0 {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }
    }
}
