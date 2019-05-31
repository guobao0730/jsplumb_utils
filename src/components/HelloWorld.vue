<template>
  <div >
    <!--底部面板-->
    <div class="dialog-panel"
         id="dialog-panel">

    </div>
  </div>
</template>

<script>
import JsPlumbUtils from '../utils/jsPlumbUtils'
let config = {
  containerId: 'dialog-panel', // createTransform_graph//drawing-area
  cellClassName: 'dialog-node-item',
  grid: [10, 10],
  createCellFn: function (step) {
    console.log(step, 'step')
    return $(`
    <div
      class='dialog-node-item'
      id='${step.id}'
      style='top:${step.y}px;left:${step.x}px;z-index:200;width: 50px;height: 50px;box-sizing: border-box;border: 1px solid #999DA0;border-radius: 5px;position: absolute;cursor: move;background: url("../../static/server.png") no-repeat center scroll;background-size: 42px 42px'
      data-type='${step.label}'>
      <div  style='position: absolute;bottom: -20px;font-size: 12px;width: 200px;text-align: center;left: -75px;'>${step.label}</div>
    </div>
    `)
  }
}
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created () {
    this.$nextTick(() => {
      this.jsPlumbUtils = new JsPlumbUtils(config)

      for (let i = 0; i < 2; i++) {
        let step = {
          id: '' + i,
          y: 100 * (i + 1),
          x: 300 * (i + 1),
          label: '1' + i + '节点'
        }
        this.jsPlumbUtils.addStep(step)
      }

      let hop = {
        'fromId': '0',
        'toId': '1'
      }

      this.jsPlumbUtils.linkNode(hop)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .dialog-panel {
    border: 1px solid #eee;
    height: 400px;
    background-color: white;

    position: relative;
    /*超出后会出现滚动条*/
    overflow: auto;
  }
</style>
