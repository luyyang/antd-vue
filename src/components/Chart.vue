<template>
  <div ref="chartDom"></div>
</template>

<script>
import echarts from "echarts";
import { addListener, removeListener } from "resize-detector";
import debounce from "lodash/debounce";

export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    // option(val) {
    //   this.chart.setOption(val); //1.根据变化创建图表，不检测深层数据
    // }

    // option: {
    //   handler(val){
    //     this.chart.setOption(val); //2.能检测引用地址数据的变化，缺点是太耗性能了
    //   },
    //   deep: true

    // }

    option(val) {
      this.chart.setOption(val); //3.在analysis中手动更新option的值
    }
  },
  created() {
    this.resize = debounce(this.resize, 300); //防抖，改变尺寸太多次了
  },
  mounted() {
    this.renderChart();
    addListener(this.$refs.chartDom, this.resize);
    // 绘制图表
  },
  beforeDestroy() {
    removeListener(this.$refs.chartDom, this.resize);
    this.chart.dispose();
    this.chart = null;
  },

  methods: {
    resize() {
      console.log("resize");
      this.chart.resize();
    },
    renderChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(this.$refs.chartDom);
      this.chart.setOption(this.option);
    }
  }
};
</script>

<style></style>
