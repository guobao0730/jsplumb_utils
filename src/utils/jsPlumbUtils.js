/**
 *@project： jsplumb_utils
 *@package：
 *@date：2019/5/30 0030 14:23
 *@author 郭宝
 *@brief: jsPlumb 工具类
 */
import $ from 'jquery'
import {jsPlumb} from 'jsplumb'
import {commonStyle, overlays, connectorOverlays, initParam, anchors} from './plumbBaseStyle'
export default class JsPlumbUtils {
  constructor (config) {
    this.config = config
    this.init()
  }
  init () {
    let config = this.config
    this.$container = $('#' + config.containerId)
    this.jsp = jsPlumb.getInstance({
      initParam
    })
    this.jsp.importDefaults({MaxConnections: 10})
    this.jsp.setContainer(config.containerId)
    this.jsp.bind('beforeDrop', (connInfo) => {
      let {sourceId, targetId} = connInfo.connection
      if (sourceId === targetId) {
        return false
      }
      return this.beforeConnect(
        sourceId,
        targetId,
        this.checkRepeat
      )
    })
  }
  // 连接前的检查, 可以传入一个函数,或者一个数组里多个函数.
  // 这个函数接受3个参数, 分别是当前连接的 sourceId和targetId, oldConnctionItem({sourceId: 'id1', targetId: 'id2'}).
  // oldConnctionItem 是在已有的连接数组上使用every 循环的当前项.
  // 函数内返回一个布尔值, true代表合法连接, false代表非法连接.
  beforeConnect (sourceId, targetId, ...checkFnArr) {
    if (!checkFnArr.length) {
      return true
    }
    let allHop = this.jsp.getConnections().map(item => {
      return {
        sourceId: item.sourceId,
        targetId: item.targetId
      }
    })
    return allHop.every(oldConnctionItem => {
      return checkFnArr.every(checkFn => {
        if (typeof checkFn !== 'function') {
          return true
        }
        return checkFn(sourceId, targetId, oldConnctionItem)
      })
    })
  }
  checkConnecSelf (sourceId, targetId) {
    return sourceId !== targetId
  }
  checkRepeat (sourceId, targetId, oldConnctionItem) {
    return !((oldConnctionItem.sourceId === sourceId && oldConnctionItem.targetId === targetId) || (oldConnctionItem.sourceId === targetId && oldConnctionItem.targetId === sourceId))
  }
  // 批量添加活动元素
  addSteps (stepArr) {
    stepArr.forEach(step => {
      this.addStep(step)
    })
  }
  // 单个添加活动元素
  addStep (step) {
    let $el = this.config.createCellFn(step)
    this.$container.append($el)
    this.addNode(step.id)
  }
  // 批量添加连接线
  addHops (hopArr) {
    hopArr.forEach(hop => {
      this.addHop(hop)
    })
  }
  // 单个添加连接线
  addHop (hop) {
    this.linkNode(hop)
  }
  // 连接两个元素
  linkNode (hop) {
    this.jsp.connect({
      uuids: this.createUuidsArr(hop),
      editable: true
    })
  }
  createUuidsArr (hop) {
    // jsPlumb.connect({uuids:[startPoint, endPoint], editable: false});
    return ['endPoint-' + hop.fromId, 'endPoint-' + hop.toId]
  }

  // 为元素添加endPoint
  addEndpoint (id) {
    this.jsp.addEndpoint(id, {
      anchors,
      overlays,
      connectorOverlays,
      uuid: 'endPoint-' + id
    }, commonStyle)
  }
  // 通过connection 翻转连线. 先删除,再反向连接.
  reverseHopForConnection (connection) {
    let newHop = {
      toId: connection.sourceId,
      fromId: connection.targetId
    }
    this.deleteHopForConnection(connection)
    this.linkNode(newHop)
  }
  // 通过元素删除连接线, 将删除此元素身上的所有连线
  deleteHopForEle (node) {
    // 此处node是指原生的dom元素对象
    this.jsp.deleteConnectionsForElement(node)
  }
  // 删除连线自身
  // jsp.bind('click', function(connection, originalEvent))
  // 在连接线上点击事件的回调函数的第一个参数就是connection
  deleteHopForConnection (connection) {
    this.jsp.deleteConnection(connection)
  }
  removeNode (node) {
    // 此处node指原生的dom节点, rmove后, 会将元素,元素的endpoint, 元素的连线一并删除
    this.jsp.remove(node)
  }
  addNode (id) {
    // 将元素设置为在父容器内科拖拽, 步长设为10,10
    this.jsp.draggable(id, {
      containment: 'parent',
      grid: this.config.grid
    })
    this.addEndpoint(id)
  }
  // 获取所有的连接线的fromId和toId对, [{fromId: 'eabsw1', toId: 'eabsw2'}, {...}]
  getAllHopsArr () {
    return this.jsp.getConnections().map(hop => {
      return {
        fromId: hop.sourceId,
        toId: hop.targetId,
        selfId: hop.id
      }
    })
  }
  // 获取所有的活动节点的id集合
  getAllNodesIdArr () {
    let config = this.config
    let $els = this.$container.find('.' + config.cellClassName)
    let idArr = []
    $els.each(function (index, el) {
      idArr.push($(this).attr('id'))
    })
    return idArr
  }
  repaint () {
    this.jsp.repaintEverything()
  }
}
