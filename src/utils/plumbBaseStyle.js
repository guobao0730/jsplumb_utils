let radius = 24
let commonStyle = {
  isSource: true,
  isTarget: true,
  connector: ['Flowchart', {gap: 26}],
  endpoint: [ 'Rectangle', {width: radius, height: radius} ],
  paintStyle: { // 端点参数
    fill: 'transparent',
    outlineStroke: 'transparent',
    strokeWidth: 1,
    stroke: 'red'
  },
  hoverPaintStyle: {
    outlineStroke: 'transparent',
    strokeWidth: 2,
    cursor: 'pointer'
  },
  connectorStyle: { // 连接线的样式
    outlineStroke: '#C0C3C4',
    strokeWidth: 0.1
  },
  connectorHoverStyle: {
    strokeWidth: 3
  }
}

let initParam = {
/*  DragOptions: { cursor: "pointer", zIndex: 2000 }, */
  PaintStyle: { // 端点参数
    lineWidth: 6,
    strokeStyle: '#567567',
    outlineColor: 'black',
    outlineWidth: 1,
    stroke: 'red',
    location: -10
  },
  Connector: ['Flowchart', {gap: 26}],
  Endpoint: [ 'Rectangle', {width: radius, height: radius} ], // 端点的大小
  EndpointStyle: { fillStyle: '#567567' }, // 端点参数
  Anchor: ['top'], // 锚点参数
  overlays: ['Arrow', { width: 12, length: 12, location: 1 }]
}
// 覆盖物, 在端点上显示内容
let overlays = [
  [
    'Label',
    {
      label: '',
      id: 'label',
      location: [-0.5, -0.5]
    }
  ]
]
// 连接器覆盖, 连接线上的箭头
let connectorOverlays = [
  [ 'PlainArrow', {
    width: 12,
    length: 12,
    location: 1,
    paintStyle: {
      fill: '#C0C3C4'
    },
    id: 'PlainArrow'
  }],
  [ 'Label', {
    label: '',
    id: 'LABEL'
  }]
]
// let anchors = [ 'Top','Bottom','Left','Right'];
let anchors = ['Center']
export {
  commonStyle,
  overlays,
  connectorOverlays,
  initParam,
  anchors
}
